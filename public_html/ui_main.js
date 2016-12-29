//Assumes that world things are identified by their names.
var ui = new function(){
    var actionSelectionId = "#actionSelection";
    var targetSelectionId = "#targetSelection";
    
    var actionSelection;
    var targetSelection;
    var instructionArea;
    var timerArea;
    var selectedInfoArea;
    var selectedTargetInfo;
    var selectedActionInfo;
    var messageLogArea;
    //The above are jQuery objects
    var actionExecutionButton;
    
    var _objects;
    var _actions;
    
    //jQuery
//    var selectedTargetImage;//TARVITAANKO?
//    var selectedActionImage;//TARVITAANKO?
//    
//    var selectedActionName;
//    var selectedTargetName;
    
    this.initializeView = function(actions, targets){
        actionSelection = $(actionSelectionId);
        targetSelection = $(targetSelectionId);
        instructionArea = $('#instructionArea');
        timerArea = $('#timerArea');
        selectedInfoArea = $('#selectedInfoArea');
        selectedTargetInfo = $('#selectedTargetInfo');
        selectedActionInfo = $('#selectedActionInfo');
        actionExecutionButton = $('#actionExecutionButton');
        messageLogArea = $('#messageLogArea');
        actionExecutionButton.click(onActionExecutionButton);
        
        _objects = targets;
        _actions = actions;
        
        document.addEventListener('taskCreated', function(e){
            //console.log("taskCreated listened");
            var ti = e.detail.instructionText;
            console.log("ti: " + ti);
            var gibberishedInst = languageManager.transformText(ti);
            ui.changeInstructions(gibberishedInst);//TOIMIIKO?
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
            appendToMessageLog("You can't " + d.action.name + " " + d.target.name + "!");
        });
        document.addEventListener('taskCompleted', function(e){
            var d = e.detail;
            //alert("Task '" + d.action.name + " " + d.target.name + "' completed");
            appendToMessageLog("Task '" + d.action.name + " " + d.target.name + "' completed");
        });
        document.addEventListener('deedDoneButNotTaskCompleted', function(e){
            var d = e.detail;
            //alert("You did: '" + d.action.name + " " + d.target.name + "', but " +
            //        "that wasn't your task.");
            appendToMessageLog("You did: '" + d.action.name + " " + d.target.name + "', but " +
                    "that wasn't your task.");
        });
        
        addImages(actionSelection, actions, "action");
        addImages(targetSelection, targets, "object");
        
        messageLogArea.empty();
    };
    
    this.changeInstructions = function(instructions){
        instructionArea.empty();
        instructionArea.append("Your task: " + instructions);
    };
    
    //PERFORMANTIMMAKSI VOISI MUUTTAA
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
     * Pre-condition: objects are world things.
     */
    var addImages = function(element, objects){
        var img;
        var o;
        //console.log(objects);
        for(var i = 0; i < objects.length; i++){
            o = objects[i];
            img = $('<img>');
            img.attr('src', o.imageSource);
//            img.attr('width', 300);
//            img.attr('height', 300);
            img.attr('alt', o.name + " image");
            img.attr('class', "world-thing-image");//TARVITAANKO TÄTÄ?
            img.attr('data-wt-name', o.name);
            element.append(img);
        }
        $('.world-thing-image').on('click', function(){
            assert.isDef($(this));
            var self = $(this);
            assert.isDef(self.attr('data-wt-name'));
            assert.isDef(self.attr('alt'));
            var wtName = self.attr('data-wt-name');
            //assert.isDef(self.attr('data-image-type'));
            //var wtiContainer; //world thing image container
            if(isDescOf(self, actionSelection)){
                selectedActionName = wtName;
            }else if(isDescOf(self, targetSelection)){
                selectedTargetName = wtName;
            }else{
                throw "wtiContainer not found.";
            }
            //var ancestorDiv = $(this).closest(actionSelectionId, targetSelectionId);
            //var ancestorDiv = $(this).closest(targetSelectionId, actionSelectionId);
            //console.log();
            //console.log("anc div: " + ancestorDiv.attr('id'));
            //console.log($(this).attr('alt'));
            updateSelectedInfoArea();
        });
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
        /*
         * onko targetti actionille sopiva?
         * jos on, onko se se, mitä haluttiin?
         * molemmista erilainen palauta
         * 
         * lähetetään vain yritys maailmalle, ja se sitten eventoi, että mitä näytetään kyyttäjälle
         */
        
        
        //muodostetaan action
        //executoidaan se
        //world....
    };
    
    var updateSelectedInfoArea = function(){
        selectedActionInfo.empty();
        selectedActionInfo.text(selectedActionName);
        selectedTargetInfo.empty();
        selectedTargetInfo.text(selectedTargetName);
    };
    
    /*
     * Pre-condition: desc and parent are jQuery objects.
     * desc is it's own descendant.
     */
    var isDescOf = function(desc, parent){
        return desc.closest(parent).length > 0;
    };
    
    var getWtByName = function(wtName){
        assert.isDef(wtName);
        assert.isDef(_objects);
        var wt = _objects.find(isCorrect);
        if(!utility.isDef(wt)){
            wt = _actions.find(isCorrect);
        }
        assert.isDef(wt);
        return wt;
        function isCorrect(tempWt){
            return tempWt.name === wtName;
        }
    };
    
    var appendToMessageLog = function(newMessage){
        messageLogArea.append('<p>' + newMessage + '</p>');
    };
//    var displayAlertMessage = function(message) {
//        var timeOut = 5;
//        var messageBox = $('#messageBox');
//        messageBox.text(message).fadeIn();
//        messageBox.css("display", "block");
//        setTimeout(function(){
//            messageBox.fadeOut();
//            messageBox.css("display", "none");
//        }, timeOut * 1000);
//    };
    
//    var murderChildren = function(el){
//        while(el.childNodes.length > 0){
//            el.removeChild(el.childNodes[0]);
//        }
//    };  
};