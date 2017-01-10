"use strict";

//D:\projekteja\NetBeans-projekteja\SiansaksaPeli

/*
 * BUGIT:
 * Jos klikkaa monta kertaa peräkkäin uusia viestejä lokiin, väri vaihtuu
 * suurella viiveellä.
 * The time for the task (is up puuttuu).
 * Jos jompi kumpi wtCount on suurempi kuin wt:iden määrä, ei toimi. Pitäisi
 * käsitellä virhe hienostuneemmin.
 */

var taskManager = new function(){
    
    var defaultTaskTime = 10;//seconds
    var secondsLeft = defaultTaskTime;
    var currentTask;
    var availableObjects = [];
    var availableActions = [];
    this.objectCount = 1;
    this.actionCount = 100;
    
    var oncePerS;//interval
    
    this.initialize = function(){
        console.assert(taskManager.objectCount.length > 0 &&
                taskManager.objectCount.length <= world.worldObjects.length &&
                taskManager.actionCount.length <= world.actions.length &&
                taskManager.actionCount.length > 0);
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
                reactToCompletedTask();
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
    
    this.getAvailableObjects = function(){
        return availableObjects;
    };
    
    this.getAvailableActions = function(){
        return availableActions;
    };
    
    this.getCurrentTask = function(){
        return currentTask;
    };
    
    var secondPassed = function(){
        secondsLeft += -1;
        //console.log("seconds left: " + secondsLeft);
        //ui.changeTimerTime(secondsLeft);
        var spEvent = new CustomEvent('secondPassed', {'detail': secondsLeft});
        document.dispatchEvent(spEvent);
        if(secondsLeft <= 0){
            window.clearInterval(oncePerS);
            taskTimeUp();
        }
    };
    
    var taskTimeUp = function(){
        //alert("The time is up!");
        document.dispatchEvent(new CustomEvent('timeUp', {detail: currentTask}));
        if(isTaskDone(currentTask)){
            reactToCompletedTask();
        }else{
            world.makePreviousDeedsObsolete();
            document.dispatchEvent(new CustomEvent('gameOver'));
            //alert("Game over!");
        }
    };
    
    //TARVITAANKO TÄTÄ?
    var isTaskDone = function(task){
        assert.isDef(task);
        return world.wasDone(task);
    };
    
    var reactToCompletedTask = function(){
        //HUOM! Pelin alun displayTask on eri kuin että task olisi tehty valmiiksi.
        document.dispatchEvent(new CustomEvent('taskCompleted', {detail:currentTask}));
        languageManager.addNewRule();
        world.makePreviousDeedsObsolete();
        var newTask = generateNewTask();
        currentTask = newTask;
        dispatchTaskCreated(newTask);
        assert.isDef(currentTask);
        //displayTask(currentTask);
        window.clearInterval(oncePerS);
        secondsLeft = defaultTaskTime;
        oncePerS = window.setInterval(secondPassed, 1000);//PITÄISI OLLA SETTIMEOUT
    };
    
    var generateNewTask = function(){
        //console.log("task generated");
        var actions = world.actions;
        //console.log("actions: " + JSON.stringify(actions));
        assert.isCompletelyDefined(actions);
        assert.arrHasContent(actions);
        var newAction = utility.randomFromArray(availableActions);
        var newTarget = utility.randomFromArray(availableObjects);
        console.log("new action is " + newAction.name);
        var newTask = createTask(newAction, newTarget);
        assert.areDef(newAction, newTarget, newTask);
        assert.areDef(newTask.action, newTask.target);
        return newTask;
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
     */
    var pickAvailableWts = function(allPossible, count){
        return utility.pickWithoutReplacement(allPossible, count);
    };
    
    var dispatchTaskCreated = function(newTask){
        assert.isDef(newTask);
        document.dispatchEvent(new CustomEvent('taskCreated', { 'detail': newTask}));
    };
};