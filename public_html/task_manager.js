"use strict";

//D:\projekteja\NetBeans-projekteja\SiansaksaPeli

/*
 * BUGIT:
 * Jos klikkaa monta kertaa peräkkäin uusia viestejä lokiin, väri vaihtuu
 * suurella viiveellä.
 * The time for the task (is up puuttuu).
 */

var taskManager = new function(){
    
    var defaultTaskTime = 10;//seconds
    var secondsLeft = defaultTaskTime;
    var currentTask;
    this.objectCount = 8;
    this.actionCount = 8;
    var availableObjects = [];
    var availableActions = [];
    
    var oncePerS;//interval
    
    this.initialize = function(){
        availableObjects = pickAvailableWts(world.worldObjects, taskManager.objectCount);
        availableActions = pickAvailableWts(world.actions, taskManager.actionCount);
        currentTask = generateNewTask();
        displayTask(currentTask);
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
        assert.isDef(currentTask);
        displayTask(currentTask);
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
        /*
         * 
         * poimitaan targeteista sellainen, joka on pöydällä. Mutta entä jos
         * mikään sopiva targetti ei ole?
         */
        var newTarget = utility.randomFromArray(newAction.availableObjects);
        var newTask = createTask(newAction, newTarget);
        assert.areDef(newAction, newTarget, newTask);
        assert.areDef(newTask.action, newTask.target);
        return newTask;
    };
    
    var displayTask = function(task){
        //console.log("about to display task");
        assert.isDef(task);
        var inst = taskToInstruction(task);
        task.instructionText = inst;
        assert.areDef(inst, task, task.action, task.target, task.action.name, task.target.name);
        //ui.changeInstructions(inst);
        var tgEvent = new CustomEvent('taskCreated', { 'detail': task}); //OIKEA PAIKKA?
        document.dispatchEvent(tgEvent);
    };
    
    //EPÄSELVÄ FUNKTION NIMI, KOSKA VOISI KUVITELLA OLEVAN LANGUAGE MANAGERILLA
    //JOTAIN TEKEMISTÄ TAI ETTÄ OLISI PELKKÄ TASK-OBJEKTIN SISÄLTÖ TEKSTINÄ.
    var taskToInstruction = function(task){
        assert.isDef(task.action, "Is undefined");
        assert.isDef(task.target, "Is undefined");
        assert.isDef(task.action.name);
        var inst = "Your next task is to " + task.action.name + " " + task.target.name;
        return inst;
    };
    
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
};