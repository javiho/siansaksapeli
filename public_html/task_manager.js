"use strict";

var taskManager = new function(){
    
    var defaultTaskTime = 10;//seconds
    var secondsLeft = defaultTaskTime;
    var currentTask;
    
    var oncePerS;//ONKO TÄMÄ SIIS JOKU INTERVALLI VAI MIKÄ?
    
    this.initialize = function(){
        currentTask = generateNewTask();
        displayTask(currentTask);
        //console.log("intervalli asetetaan");
        oncePerS = window.setInterval(secondPassed, 1000);//PITÄISI OLLA SETTIMEOUT
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
            languageManager.addNewRule();
            var newTask = generateNewTask();
            displayTask(newTask);
            oncePerS = window.setInterval(secondPassed, defaultTaskTime);//PITÄISI OLLA SETTIMEOUT
        }else{
            alert("Game over!");
        }
    };
    
    var isTaskDone = function(task){  
        return world.wasDone(task);
    };
    
    //TÄLLÄ HETKELLÄ TASK ON SAMA KUIN ACTION, MUTTA TÄMÄ MUUTTUU KUN TASKIT VOIVAT HYVÄKSYÄ USEITA KOHTEITA
    var generateNewTask = function(){
        var actions = world.actions;
        assert.arrHasContent(actions);
        var newTask = randomFromArray(actions);
        return newTask;
    };
    
    var displayTask = function(task){
        var inst = taskToInstruction(task);
        task.instructionText = inst;
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
    
};