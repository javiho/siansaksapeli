"use strict";

//D:\projekteja\NetBeans-projekteja\SiansaksaPeli

/*
 * BUGIT:
 * Jos klikkaa monta kertaa peräkkäin uusia viestejä lokiin, väri vaihtuu
 * suurella viiveellä.
 * Lisättävät wt:t vaikuttavat edellisen vuoron pisteisiin.
 * Pelaaja voi suorittaa poistettavia actioneja ja objekteja, jos hän klikkaa
 * niitä kun ne poistuvat animoidessa. Haittaako tämä?
 */
/*
 * REFAKTOROINTI:
 * Jaettava ui useaan tiedostoon.
 * On ongelmallista, että ui käskee taskManagerin poistaa availableja ja sitten
 * poistaa boksit. Ja toisessa tapauksessa taskManager poistaa itse ja lähettää
 * viestin ui:lle. Vai onko?
 */

/*
 * Renewing wts means removing x random wts and replacing them with other random
 * (possibly same) wts of same type.
 */
var taskManager = new function(){
    
    var defaultTaskTime = 10;//seconds
    var defaultAbsoluteTaskTime = 20;//seconds
    var defaultChangeInterval = 3; //turns, minimum 1
    var defaultRenewedAmount = 2; //how many available wts of each type is renewed.
    var gameOverThreshold = -20000;
    var secondsLeft = defaultTaskTime;//of default task time
    var secondsToAbsolute = defaultAbsoluteTaskTime;
    var currentTask;
    var taskRunningLate = false;
    var points = 0;
    var availableObjects = [];
    var availableActions = [];
    var tasksPassed = 0;
    var turnsUntilChange = defaultChangeInterval;
    this.objectCount = 10;//ILMEISESTI VAIN ALUSSA
    this.actionCount = 5;//ILMEISESTI VAIN ALUSSA
    
    var oncePerS;//interval
    
    //MÄÄRITELTY MYÖS UI:SSA
    var wtTypes = {
        action:"action",
        target:"target"
    };
    
    this.initialize = function(){
        console.assert(taskManager.objectCount > 0 &&
                taskManager.objectCount <= world.worldObjects.length &&
                taskManager.actionCount <= world.actions.length &&
                taskManager.actionCount > 0);
        availableObjects = pickAvailableWts(world.worldObjects, taskManager.objectCount);
        availableActions = pickAvailableWts(world.actions, taskManager.actionCount);
        assert.arrHasContent(availableObjects);
        assert.arrHasContent(availableActions);
        //console.log(availableObjects);
        currentTask = generateNewTask();
        //No dispatching event, because no one is listening yet.
        //dispatchTaskCreated(currentTask);
        //console.log("intervalli asetetaan");
        oncePerS = window.setInterval(secondPassed, 1000);
        document.addEventListener('newDeedDone', function(e){
            var d = e.detail;
            if(areDeedsEqual(currentTask, d)){
                reactToFinishedTask(true);
            }else{
                //EI OLE HYVÄ, ETTÄ TÄLLAINEN EVENTTI ON
                //JOKO KÄYTTÖLIITTYMÄN PITÄSI KYSYÄ TASKMANAGERILTA VALMISTUMISESTA
                //TAI VALMISTUMINEN PITÄISI SISÄLLYTTÄÄ EVENNTIN DETAILIIN
                document.dispatchEvent(
                        new CustomEvent('deedDoneButNotTaskCompleted', {'detail':d})
                );
            }
        });
        //console.log("intervalli asetettu");
    };
    
    /*
     * TÄYTYY OLLA NIIN, ETTÄ JÄÄ JOTAIN JÄLJELLE. TARKISTETTAVA.
     * REFAKTOROITAVA MUUTENKIN.
     * Pre-condition: all elements in wts are of same wt type.
     * wts is not empty.
     */
    this.removeAvailableWts = function(wts){
//        console.log("wts is:");
//        console.log(wts.map(function(a){return a.name;}));
//        console.log("available objects was:");
//        console.log(availableObjects.map(function(a){return a.name;}));
//        console.log("available actions was:");
//        console.log(availableActions.map(function(a){return a.name;}));
        assert.isDef(wts);
        //console.log(wts);
        if(!Array.isArray(wts)){
            wts = [wts];
//            availableActions = availableActions.filter(function(el){
//                return !(wts.name === el.name);
//            });
//            availableObjects = availableObjects.filter(function(el){
//                return !(wts.name === el.name);
//            });
//            return;
        }
        assert.arrHasContent(wts);
        if(world.isAction(wts[0])){
            //console.log("is action");
            availableActions = availableActions.filter(function(el){
                var preserved = wts.some(function(wt){
                    //console.log(wt.name + ", " + el.name + " are same: " + ())
                    return wt.name === el.name;
                }) === false;
                //console.log(preserved);
                return preserved;
            });
        }
        if(world.isWorldObject(wts[0])){
            //console.log("is object");
            availableObjects = availableObjects.filter(function(el){
                var preserved = wts.some(function(wt){
                    return wt.name === el.name;
                }) === false;
                //console.log(preserved);
                return preserved;
            });
        }
//        console.log("available objects is:");
//        console.log(availableObjects.map(function(a){return a.name;}));
//        console.log("available actions is:");
//        console.log(availableActions.map(function(a){return a.name;}));
        //document.dispatchEvent(new CustomEvent('availableWtsChanged'));
    };
    
    /*
     * Adds random available wts of wtType.
     * MUTTA OLIKO NIIDEN TOSIAAN TARKOITUS OLLA RANDOMEITA?
     * Fires an event.
     * @param {type} count
     * @param {type} wtType
     */
    this.addAvailableWts = function(count, wtType){
        //console.log("about to add");
        var unused;
        var newWts;
        if(wtType === wtTypes.action){
            unused = getUnusedWts(world.actions);
            //console.log(unused);
            newWts = pickAvailableWts(unused, count);
            //console.log(newWts);
            availableActions = availableActions.concat(newWts);
            assert.notNull(newWts);
        } else if(wtType === wtTypes.target){
            unused = getUnusedWts(world.worldObjects);
            //console.log(unused);
            newWts = pickAvailableWts(unused, count);
            //console.log(newWts);
            availableObjects = availableObjects.concat(newWts);
            assert.notNull(newWts);
        } else throw "Erroneous wtType.";
        document.dispatchEvent(new CustomEvent('availableWtsAdded', {detail:newWts}));
    };
    
    this.getAvailableObjects = function(){
        return availableObjects;
    };
    
    this.getAvailableActions = function(){
        return availableActions;
    };
    
    this.getCurrentTask = function(){
        return currentTask;
    };
    
    this.getTasksPassed = function(){
        return tasksPassed;
    };
    
    this.getTurnsUntilChange = function(){
        return turnsUntilChange;
    };
    
    var secondPassed = function(){
        secondsLeft += -1;
        secondsToAbsolute += -1;
        //console.log("seconds left: " + secondsLeft);
        //ui.changeTimerTime(secondsLeft);
        var spEvent = new CustomEvent('secondPassed', {'detail': secondsLeft});
        document.dispatchEvent(spEvent);
        if(secondsLeft <= 0 && !taskRunningLate){
            //window.clearInterval(oncePerS);
            taskTimeUp();
            taskRunningLate = true;
        }
        if(secondsToAbsolute <= 0){
            //window.clearInterval(oncePerS);
            reactToFinishedTask(false);
        }
    };
    
    var taskTimeUp = function(){
        //alert("The time is up!");
        document.dispatchEvent(new CustomEvent('timeUp', {detail: currentTask}));
        if(isTaskDone(currentTask)){
            reactToFinishedTask(true);
        }else{
            //Nothing, for now at least
            //world.makePreviousDeedsObsolete();
            //document.dispatchEvent(new CustomEvent('gameOver'));
            //alert("Game over!");
        }
    };
    
    //TARVITAANKO TÄTÄ?
    var isTaskDone = function(task){
        assert.isDef(task);
        return world.wasDone(task);
    };
    
    //PITÄISI TOIMIA MYÖS LOPETETUILLE, MUTTA EI VALMISTUNEILLE
    var reactToFinishedTask = function(succeeded){
        //HUOM! Pelin alun displayTask on eri kuin että task olisi tehty valmiiksi.
        if(succeeded){
            console.log("Task succeeded");
        }else{
            console.log("Task failed");
        }
        tasksPassed += 1;
        turnsUntilChange -= 1;
        addPoints(succeeded);
        document.dispatchEvent(new CustomEvent('taskFinished', {detail:{currentTask:currentTask, succeeded:succeeded}}));
        if(isGameOver()){
            handleGameOver();
            window.clearInterval(oncePerS);
            return;
        }
        if(turnsUntilChange <= 0){
            turnsUntilChange = defaultChangeInterval;
            renewAvailableWts();
        }
        languageManager.addNewRule();
        world.makePreviousDeedsObsolete();
        var newTask = generateNewTask();
        currentTask = newTask;
        dispatchTaskCreated(newTask);
        taskRunningLate = false;
        assert.isDef(currentTask);
        //displayTask(currentTask);
        window.clearInterval(oncePerS);
        secondsLeft = defaultTaskTime;
        secondsToAbsolute = defaultAbsoluteTaskTime;
        oncePerS = window.setInterval(secondPassed, 1000);//PITÄISI OLLA SETTIMEOUT -MIKSI?
    };
    
    var generateNewTask = function(){
        //console.log("task generated");
        var actions = world.actions;
        //console.log("actions: " + JSON.stringify(actions));
        assert.isCompletelyDefined(actions);
        assert.arrHasContent(actions);
        var newAction = utility.randomFromArray(availableActions);
        var newTarget = utility.randomFromArray(availableObjects);
        //console.log("new action is " + newAction.name);
        var newTask = createTask(newAction, newTarget);
        assert.areDef(newAction, newTarget, newTask);
        assert.areDef(newTask.action, newTask.target);
        return newTask;
    };
    
    //VOISI MIETTIÄ SELITYSTÄ ETTÄ TARVITSEEKO SITÄ VAI VOISIKO OLLA VAIN STRINGI
    var addPoints = function(taskSucceeded){
        var originalPoints = points;
        var additionalPoints;
        var availableWtsMultiplier = availableActions.length * availableObjects.length;
        var failureMultiplier = 10;
        if(taskSucceeded){
            additionalPoints = secondsLeft * availableWtsMultiplier;
        }else{
            additionalPoints = failureMultiplier * secondsLeft * availableWtsMultiplier;
            console.assert(additionalPoints < 0, "Error: bug.");
        }
        var newPoints = originalPoints + additionalPoints;
        points = newPoints;
        var secondsLeftAtTheTime = secondsLeft;
        document.dispatchEvent(new CustomEvent('pointsChanged',
        {
            detail:
            {
                newPoints:newPoints,
                additionalPoints:additionalPoints,
                explanation:
                {
                    secondsLeft:secondsLeftAtTheTime,
                    availableActionsCount:availableActions.length,
                    availableTargetsCount:availableObjects.length,
                    failureMultiplier:failureMultiplier,
                    succeeded:taskSucceeded
                }
            }
        }));
    };
    
    /*
     * Replaces x available world objects and y available actions.
     * Fires messages about removing and adding.
     * POISTAMISESTA LÄHETETÄÄN ERIKSEEN VIESTIT, MUTTA LISÄÄMISESSÄ NE
     * LÄHETTÄÄ LISÄÄVÄ FUKTIO, MIKÄ ON HÄMMENTÄVÄÄ.
     */
    var renewAvailableWts = function(){
        var renewedActionsCount = defaultRenewedAmount <= availableActions.length ? defaultRenewedAmount : availableActions.length;
        var renewedObjectsCount = defaultRenewedAmount <= availableObjects.length ? defaultRenewedAmount : availableObjects.length;
        var removedActions = pickAvailableWts(availableActions, renewedActionsCount);
        var removedObjects = pickAvailableWts(availableObjects, renewedObjectsCount);
        taskManager.removeAvailableWts(removedActions);
        taskManager.removeAvailableWts(removedObjects);
        document.dispatchEvent(new CustomEvent('availableWtsRemoved', {detail:removedActions}));
        document.dispatchEvent(new CustomEvent('availableWtsRemoved', {detail:removedObjects}));
        taskManager.addAvailableWts(renewedActionsCount, wtTypes.action);
        taskManager.addAvailableWts(renewedObjectsCount, wtTypes.target);
    };
    
    var isGameOver = function(){
        return points <= gameOverThreshold;
    };
    
    var handleGameOver = function(){
        document.dispatchEvent(new CustomEvent('gameOver'));
    };
    
    /*
     * EI TARVITTANE, UI VOI HOITAA HOMMAN EVENTIN PERUSTEELLA
    var displayTask = function(task){
        console.log("about to display task");
        assert.isDef(task);
        var inst = taskToInstruction(task);
        task.instructionText = inst; // TARVITAANKO INSTRUCTION TEXTIÄ? UI VOISI ITSE TEKSTITTÄÄ
        assert.areDef(inst, task, task.action, task.target, task.action.name, task.target.name);
        //ui.changeInstructions(inst);
        var tgEvent = new CustomEvent('taskCreated', { 'detail': task}); //OIKEA PAIKKA?
        document.dispatchEvent(tgEvent);
    };*/
    
    //TARVITAANKO EXECUTOINTIA TASKISSA?
    var createTask = function(action, targetWo){
        assert.areDef(action, targetWo, targetWo.name);
        var t = {
            action:action,
            target:targetWo
//            execute:function(){
//                world.taskHistory.push({action:action.name, target:targetWo.name});
//                alert("Action " + action.name + " with target " + targetWo.name + "has been acted!");
//            }
        };
        return t;
    };
    
    /*
     * allPossible is array of all wts of one type.
     * PITÄÄKÖ TÄMÄN TOSIAAN OLLA OMA FUNKTIONSA?
     */
    var pickAvailableWts = function(allPossible, count){
        return utility.pickWithoutReplacement(allPossible, count);
    };
    
    var dispatchTaskCreated = function(newTask){
        assert.isDef(newTask);
        document.dispatchEvent(new CustomEvent('taskCreated', { 'detail': newTask}));
    };
    
    /*
     * wts is an array which is a subset of all wts.
     * Return value: those of  which are not available.
     */
    var getUnusedWts = function(wts){
        var allAvWts = getAllAvailableWts();
        //console.log("all avaulable");
        //utility.prpr(allAvWts.map(function(wt){return wt.name;}));
        var unused = wts.filter(function(wt){
            var isAv = allAvWts.some(function(wt2){
                //console.log(wt2.name + ", " + wt.name);
                return wt2.name === wt.name;
            });
            //console.log("availables contain " + wt.name + ": " + isAv);
            return !isAv;
        });
        //console.log("unused");
        //utility.prpr(unused.map(function(wt){return wt.name;}));
        //console.log(JSON.stringify(unused, null, 2));
        return unused;
    };
    
    var getAllAvailableWts = function(){
        return availableActions.concat(availableObjects);
    };
};