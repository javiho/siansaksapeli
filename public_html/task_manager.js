"use strict";

var taskManager = new function(){
    
    var defaultTaskTime = 1000;//seconds
    var secondsLeft = defaultTaskTime;
    var currentTask;
    
    var oncePerS;//interval
    
    this.initialize = function(){
        currentTask = generateNewTask();
        displayTask(currentTask);
        //console.log("intervalli asetetaan");
        oncePerS = window.setInterval(secondPassed, 1000);//PITÄISI OLLA SETTIMEOUT
        document.addEventListener('newDeedDone', function(e){
            var d = e.detail;
            if(areDeedsEqual(currentTask, d)){
                reactToCompletedTask();
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
            window.clearInterval(oncePerS);//PITÄISI OLLA SETTIMEOUT
            taskTimeUp();
        }
    };
    
    var taskTimeUp = function(){
        alert("The time is up!");
        if(isTaskDone()){
            reactToCompletedTask();
        }else{
            alert("Game over!");
        }
    };
    
    //TARVITAANKO TÄTÄ?
    var isTaskDone = function(task){  
        return world.wasDone(task);
    };
    
    var reactToCompletedTask = function(){
        //HUOM! Pelin alun displayTask on eri kuin että task olisi tehty valmiiksi.
        document.dispatchEvent(new CustomEvent('taskCompleted', {detail:currentTask}));
        languageManager.addNewRule();
        var newTask = generateNewTask();
        currentTask = newTask;
        displayTask(currentTask);
        oncePerS = window.setInterval(secondPassed, defaultTaskTime);//PITÄISI OLLA SETTIMEOUT
    };
    
    var generateNewTask = function(){
        console.log("task generated");
        var actions = world.actions;
        assert.arrHasContent(actions);
        var newAction = randomFromArray(actions);
        var newTarget = randomFromArray(newAction.targetNames);
        var newTask = createTask(newAction, newTarget);
        assert.areDef(newAction, newTarget, newTask);
        assert.areDef(newTask.action, newTask.target);
        return newTask;
    };
    
    var displayTask = function(task){
        console.log("about to display task");
        var inst = taskToInstruction(task);
        task.instructionText = inst;
        assert.areDef(inst, task, task.action, task.target, task.action.name, task.target.name);
        //ui.changeInstructions(inst);
        var tgEvent = new CustomEvent('taskCreated', { 'detail': task}); //OIKEA PAIKKA?
        document.dispatchEvent(tgEvent);
    };
    
    var taskToInstruction = function(task){
        var action = task;
        assert.isDef(action, "Is undefined");
        assert.isDef(action.target, "Is undefined");
        var inst = "Your next task is to " + action.name + " " + action.target.name;
        return inst;
    };
    
    var randomFromArray = function(arr){
        return arr[Math.floor(Math.random()*arr.length)];
    };
    
    //TARVITAANKO EXECUTOINTIA TASKISSA?
    var createTask = function(action, targetWo){
        assert.areDef(action, targetWo);
        var t = {
            action:action,
            target:targetWo,
//            execute:function(){
//                world.taskHistory.push({action:action.name, target:targetWo.name});
//                alert("Action " + action.name + " with target " + targetWo.name + "has been acted!");
//            }
        };
        return t;
    };
};