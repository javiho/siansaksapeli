"use strict";

//Assumes that world things are identified by their names.
var ui = new function(){
    var actionSelectionId = "actionSelection";
    var targetSelectionId = "targetSelection";
    
    var actionSelection;
    var targetSelection;
    var instructionArea;
    var timerArea;
    var selectedInfoArea;
    var selectedTargetInfo;
    var selectedActionInfo;
    var messageLogArea;
    var removeActionButton;
    var removeWoButton;
    var addActionButton;
    var addObjectButton;
    var languageRulesArea;
    var actionsNextTurnInfo;
    var objectsNextTurnInfo;
    var reduceActionsToAddButton;
    var reduceTargetsToAddButton;
    //The above are jQuery objects
    var actionExecutionButton;
    
    //var _objects; POISTETTU HILJATTAIN
    //var _actions;
    var wtsToAddCount = {actions:0, targets:0};
    
    //jQuery
//    var selectedTargetImage;//TARVITAANKO?
//    var selectedActionImage;//TARVITAANKO?
//    
    var selectedActionName;
    var selectedTargetName;
    //var objectCount;
    //var actionCount;
    
    var messageColors = {
        green:"green",
        yellow:"yellow",
        red:"red",
        defaultColor:"white"
    };
    
    //EIKÖ TARGETIN PITÄISI OLLA WORLD OBJECT?
    //PITÄISI MÄÄRITELLÄ SELLAISESSA PAIKASSA, ETTÄ KAIKKI MODUULIT PÄÄSEVÄT KÄSIKSI
    var wtTypes = {
        action:"action",
        target:"target"
    };
    //KAHTEEN KERTAAN MÄÄRITELTY action JA target.
    /*var wtSelectionAres = {
        action:actionSelection,
        target:targetSelection
    };*/
    
    this.initializeView = function(actions, targets, initialTask){
        assert.areDef(actions, targets, initialTask);
        actionSelection = $('#' + actionSelectionId);
        targetSelection = $('#' + targetSelectionId);
        instructionArea = $('#instructionArea');
        timerArea = $('#timerArea');
        selectedInfoArea = $('#selectedInfoArea');
        selectedTargetInfo = $('#selectedTargetInfo');
        selectedActionInfo = $('#selectedActionInfo');
        actionExecutionButton = $('#actionExecutionButton');
        removeActionButton = $('#removeActionButton');
        removeWoButton = $('#removeWoButton');
        addActionButton = $('#addActionButton');
        addObjectButton = $('#addObjectButton');
        reduceTargetsToAddButton = $('#reduceTargetsToAddButton');
        reduceActionsToAddButton = $('#reduceActionsToAddButton');
        messageLogArea = $('#messageLogArea');
        languageRulesArea = $('#languageRulesArea');
        actionsNextTurnInfo = $('#actionsNextTurnInfo');
        objectsNextTurnInfo = $('#objectsNextTurnInfo');
        actionExecutionButton.click(onActionExecutionButton);
        removeActionButton.click({wtType: wtTypes.action}, onRemoveWtButton);
        removeWoButton.click({wtType: wtTypes.target}, onRemoveWtButton);
        addActionButton.click({wtType: wtTypes.action, count:1}, onAlterWtCountButton);
        addObjectButton.click({wtType: wtTypes.target, count:1}, onAlterWtCountButton);
        reduceActionsToAddButton.click({wtType: wtTypes.action, count:-1}, onAlterWtCountButton);
        reduceTargetsToAddButton.click({wtType: wtTypes.target, count:-1}, onAlterWtCountButton);
        
        //_objects = targets;
        //_actions = actions;
        
        document.addEventListener('taskCreated', function(e){
            console.log("taskCreated listened");
            var task = e.detail;
            reactToTaskCreated(task);
        });
        document.addEventListener('secondPassed', function(e){
            //console.log("secondPassed has been heard");
            assert.isDef(e);
            assert.isDef(e.detail);
            ui.changeTimerTime(e.detail);//TOIMIIKO?
        });
        document.addEventListener('invalidDeed', function(e){
            assert.isDef(e);
            var d = e.detail;
            assert.isDef(d);
            assert.isDef(d.action);
            assert.isDef(d.target);
            //alert("You can't " + d.action.name + " " + d.target.name + "!");
            appendProcessedToML("You can't ", d, "!", messageColors.yellow);
        });
        document.addEventListener('taskCompleted', function(e){
            var d = e.detail;
            //alert("Task '" + d.action.name + " " + d.target.name + "' completed");
            appendProcessedToML("Task '", d, "' completed", messageColors.green);
            addPlannedWts();
            wtsToAddCount.actions = 0;
            wtsToAddCount.targets = 0;
            updateOtherStateInfo();
            //A new text transform rule is added, so world thing names in selected
            //info area must be updated according to the new rule. (EI PIDÄ PAIKKAANSA)
            //updateSelectedInfoArea();
        });
        document.addEventListener('deedDoneButNotTaskCompleted', function(e){
            var d = e.detail;
            //alert("You did: '" + d.action.name + " " + d.target.name + "', but " +
            //        "that wasn't your task.");
            appendProcessedToML("You did: '", d, "', but " +
                    "that wasn't your task.", messageColors.yellow);
        });
        document.addEventListener('gameOver', function(){
            //console.log('game over listened');
            appendToMessageLog("Game over!", messageColors.red);
        });
        document.addEventListener('timeUp', function(e){
            var d = e.detail;
            appendProcessedToML("The time for the task ", d, " is up!", messageColors.red);
        });
        document.addEventListener('languageRuleAdded', function(){
            fillLanguageRulesArea();
        });
        document.addEventListener('availableWtsAdded', function(e){
            var d = e.detail;
            assert.notNull(d);
            reactToAddedAvailableWts(d);
        });
//        document.addEventListener('availableWtsChanged', function(){
//            ET TARVITA, JOS PIIRRETÄÄN ITSE BOKSI INPUTIN SEURATTUA
//        });
        
        //EHKÄ OTETAAN MYÖHEMMIN KÄYTTÖÖN:
        //addImages(actionSelection, actions, "action");
        //addImages(targetSelection, targets, "object");
        addWtBlocks(actionSelection, actions, taskManager.actionCount);
        addWtBlocks(targetSelection, targets, taskManager.objectCount);
        
        messageLogArea.empty();
        
        reactToTaskCreated(initialTask);
    };
    
    var changeInstructions = function(instructions){
        instructionArea.empty();
        instructionArea.append("Your task: " + instructions);
    };
    
    this.changeTimerTime = function(newTimeSeconds){
        assert.isDef(newTimeSeconds)
        //murderChildren(instructionArea);
        timerArea.empty();
        //var timeText = document.createTextNode("Seconds left: " + newTimeSeconds);
        //console.log("timeText: " + timeText);
        //timerArea.append(timeText);
        timerArea.append("Seconds left: " + newTimeSeconds);
    };
    
    /*
     * element is actionSelection or targetSelection.
     * MIKÄ IHME ON COUNT? EI PITÄISI TARVITA.
     */
    var addWtBlocks = function(element, wts, count){
        console.assert(wts.length >= count, "Error: count " + count + ", wts length " + wts.length);
        var wtType;
        console.log(element.prop("id"));
        if(element.prop("id") === actionSelectionId){
            wtType = wtTypes.action;
        }else if(element.prop("id") === targetSelectionId){
            wtType = wtTypes.target;
        }else{
            throw "Erroneous wt type.";
        }
        var wt;
        for(var i = 0; i < count; i++){
            wt = wts[i];
            var wtBlock = createWtBlock(wt.name, wtType);
            element.append(wtBlock);
        }
    };
    
    /*
     * Pre-condition: wtName is unique.
     */
    var createWtBlock = function(wtName, wtType){
        assert.areDef(wtName, wtType);
        var newSelInfo = {};
        newSelInfo[wtType] = wtName;
        //Id can't contain spaces.
        var id = "wtBlock" + nameToIdPart(wtName);
        var div = $('<div/>', {
            id: id,
            on: {
                click: function(){
                    //console.log(id + " clicked!");
                    updateSelectedInfoArea(newSelInfo);
                }
            }
        });
        div.append(wtName);
        div.addClass("wtBlock");
        div.addClass(wtType + "Block");
        return div;
    };
    
    /*
     * Creates and processes text and appends it to message log.
     */
    var appendProcessedToML = function(beforeText, task, afterText, messageColor){
        assert.areDef(beforeText, task, afterText, messageColor);
        var t = beforeText + taskToPresentableText(task);
        if(utility.isDef(afterText)){
            t = t + afterText;
        }
        appendToMessageLog(t, messageColor);
    };
    
    var onActionExecutionButton = function(){
        //alert("action execution");
        //console.log("attempting to exectue with action " + selectedActionName +
        //        " and target " + selectedTargetName);
        var selAc = getWtByName(selectedActionName);
        var selTarg = getWtByName(selectedTargetName);
        assert.areDef(selAc, selTarg);
        var deed = world.createDeed(selAc, selTarg);
        assert.isDeedDef(deed);
        //world.isValidDeed()
        world.attemptDeed(deed);
    };
    
    var onRemoveWtButton = function(event){
        var wtType = event.data.wtType;
        var removedName;
        console.log(wtType);
        if(wtType === wtTypes.action){
            //assert.isDef(selectedActionName);
            if(!utility.isDef(selectedActionName)){
                alert("You haven't selected any actions!");
                return;
            }
            removedName = selectedActionName;
        }else if(wtType === wtTypes.target){
            //assert.isDef(selectedTargetName);
            if(!utility.isDef(selectedTargetName)){
                alert("You haven't selected any objects!");
                return;
            }
            removedName = selectedTargetName;
        }//else throw "Error: erroneous wtType.";
        var removed = getWtByName(removedName);
        taskManager.removeAvailableWts(removed);
        removeWtBlock(removed);
    };
    
    var onAlterWtCountButton = function(event){
        console.log("onAddWtButton");
        var wtType = event.data.wtType;
        var count = event.data.count;
        if(wtType === wtTypes.action){
            wtsToAddCount.actions += count;
        }else if(wtType === wtTypes.target){
            wtsToAddCount.targets += count;
        }
        if(wtsToAddCount.actions < 0) wtsToAddCount.actions = 0;
        if(wtsToAddCount.targets < 0) wtsToAddCount.targets = 0;
        updateOtherStateInfo();
    };
    
    /*
     * Adds the amount of wts which has been specified.
     */
    var addPlannedWts = function(){
        assert.areDef(wtsToAddCount.targets, wtsToAddCount.actions);
        taskManager.addAvailableWts(wtsToAddCount.actions, wtTypes.action);
        taskManager.addAvailableWts(wtsToAddCount.targets, wtTypes.target);
        //taskManager.addAvailableWts(1, wtTypes.action);
        //taskManager.addAvailableWts(1, wtTypes.target);
        //...
    };
    
    var updateOtherStateInfo = function(){
        actionsNextTurnInfo.text(wtsToAddCount.actions);
        objectsNextTurnInfo.text(wtsToAddCount.targets);
    };
    
    /*
     * Parameter: {wtType.action: new action name, wtType.target: new target name}
     * Parameter is optional.
     * Also updates class member variables in addition to updating the ui area.
     * 
     * REFAKTOROINTIA? KAKTSOISTEHTÄVÄ JA DUPLIKOINTIA
     */
    var updateSelectedInfoArea = function(newSelectedNames){
        var newSelAcName;
        var newSelTargName;
        if(utility.isDef(newSelectedNames)){
            newSelAcName = newSelectedNames.action;
            newSelTargName = newSelectedNames.target;
        }
        selectedActionInfo.empty();
        selectedTargetInfo.empty();
        if(utility.isDef(newSelAcName)){
            selectedActionInfo.text(newSelAcName);
            selectedActionName = newSelAcName;
        }else{
            selectedActionInfo.text(selectedActionName);
        }
        if(utility.isDef(newSelTargName)){
            selectedTargetInfo.text(newSelTargName);
            selectedTargetName = newSelTargName;
        }else{
            selectedTargetInfo.text(selectedTargetName);
        }
        //console.log("selectedInfoArea updated. Now also selectedActionName is " +
        //        selectedActionName + " and selectedTargetName is " + selectedTargetName);
    };
    
    /*
     * Return value: is desc a descentant of parent.
     * Pre-condition: desc and parent are jQuery objects.
     * desc is it's own descendant.
     * EI KÄYTÖSSÄ
     */
    var isDescOf = function(desc, parent){
        return desc.closest(parent).length > 0;
    };
    
    /*
     * Return value: a world thing object wt, where wt.name == wtName.
     */
    var getWtByName = function(wtName){
        var wt = world.getWtByName(wtName);
        assert.isDef(wt);
        return wt;
    };
    
    var appendToMessageLog = function(newMessage, color){
        messageLogArea.append('<p>' + newMessage + '</p>');
        //console.log(messageLogArea.prop('scrollHeight'));
        messageLogArea.scrollTop(messageLogArea.prop('scrollHeight'));
        //animateTextFlash(messageLogArea, "yellow", 4000);
        animateMessageFlash(messageLogArea, color);
        
    };
    
    var animateMessageFlash = function(jQueryObject, color){
        //EI OLE HYVÄ, ETTÄ ANIMAATION KESTO MÄÄRITELLÄÄN ERIKSEEN SEKÄ
        //JAVASCRIPTISSA ETTÄ CSS:SSÄ.
        var originalBgColor = messageColors.defaultColor;//jQueryObject.css('background-color');
        jQueryObject.animate({
            backgroundColor: color
        }, 0, void 0, function(){
            //console.log("called!");
            jQueryObject.animate({
                backgroundColor: originalBgColor
            }, 1000);
        });
    };
    
    var taskToPresentableText = function(task){
        var asText = task.action.name + " " + task.target.name;
        var gibberished = languageManager.transformText(asText);
        return gibberished;
    };
    
    var fillLanguageRulesArea = function(){
        languageRulesArea.empty();
        var ruleDescs = languageManager.ruleDescriptions;
        ruleDescs.forEach(function(r){
            languageRulesArea.append("<p>Rule: " + r + "</p>");
        });
        languageRulesArea.scrollTop(languageRulesArea.prop('scrollHeight'));
    };
    
    var reactToTaskCreated = function(task){
        //var ti = task.instructionText;
        //console.log("ti: " + ti);
        //var gibberishedInst = languageManager.transformText(ti);
        //changeInstructions(gibberishedInst);//TOIMIIKO?
        assert.isDef(task);
        changeInstructions(taskToInstructionText(task));
    };
    
    var taskToInstructionText = function(task){
        assert.isDef(task);
        assert.areDef(task.action, task.target, task.action.name);
        var inst = "Your next task is to " + task.action.name + " " + task.target.name;
        return inst;
    };
    
    var removeWtBlock = function(wt){
        assert.isDef(wt);
        var wtBlock = $('#wtBlock' + nameToIdPart(wt.name));
        //console.log("wt.name: " + wt.name);
        assert.isDef(wtBlock);
        //console.log(wtBlock);
        if(selectedActionName === wt.name){
            //PITÄISIKÖ MUUTTAA NULLIKSI?
            selectedActionName = void 0;
        }
        if(selectedTargetName === wt.name){
            selectedTargetName = void 0;
        }
        updateSelectedInfoArea();
        wtBlock.remove();
        //TARKISTETTAVA, ONKO NYKYINEN BLOKKISETTI KONSISTENNTTI TASK MANAGERIN AVAILABLEJEN KANSSA
    };
    
    var reactToAddedAvailableWts = function(newWts){
        assert.isDef(newWts);
        var newAcs = newWts.filter(function(wt){
            //console.log("ac" + wt);
            return world.isAction(wt);
        });
        var newObjs = newWts.filter(function(wt){
            return world.isWorldObject(wt);
        });
        if(utility.isDef(newAcs)) addWtBlocks(actionSelection, newAcs, newAcs.length);
        if(utility.isDef(newObjs)) addWtBlocks(targetSelection, newObjs, newObjs.length);
    };
    
    var nameToIdPart = function(name){
        return nameToSpaceless(name);
    };
    
    //ONGELMA ON SE, ETTÄ ID:ISSÖ IE SAA OLLA VÄLILYÖNTEJÄ
    var nameToSpaceless = function(name){
        var withoutSpaces = name.replace(new RegExp(" ", "g"), '');
        return withoutSpaces;
    };
    
//    var murderChildren = function(el){
//        while(el.childNodes.length > 0){
//            el.removeChild(el.childNodes[0]);
//        }
//    };  
/*
 * $("<style>")
    .prop("type", "text/css")
    .html("\
    #my-window {\
        position: fixed;\
        z-index: 102;\
        display:none;\
        top:50%;\
        left:50%;\
    }")
    .appendTo("head");
 */
};