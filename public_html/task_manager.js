"use strict";

var taskManager = new function(){
    
    var secondPassed = function(){
        secondsLeft += -1;
        ui.changeTimerTime(secondsLeft);
        if(secondsLeft <= 0){
            window.clearInterval(oncePerS);
            taskTimeUp();
        }
    };
    
    var taskTimeUp = function(){
        alert("The time is up!");
        if(isTaskDone()){
            var newTask = generateNewTask();
            var inst = taskToInstruction(newTask);
            ui.changeInstructions(inst);
            oncePerS = window.setInterval(secondPassed, defaultTaskTime);
        }else{
            alert("Game over, motherfucker!");
        }
    };
    
    var isTaskDone = function(task){  
        world.isDone(task);
    };
    
    //TÄLLÄ HETKELLÄ TASK ON SAMA KUIN ACTION, MUTTA TÄMÄ MUUTTUU KUN TASKIT VOIVAT HYVÄKSYÄ USEITA KOHTEITA
    var generateNewTask = function(){
        var actions = world.actions;
        var newTask = randomFromArray(actions);
        return newTask;
    };
    
    var taskToInstruction = function(task){
        var action = task;
        var inst = "Your next task is to " + action.name + " " + action.target.name;
        return inst;
    };
    
    var randomFromArray = function(arr){
        return arr[Math.floor(Math.random()*arr.length)];
    };
    
    var defaultTaskTime = 10;
    var secondsLeft = defaultTaskTime;
    var currentTask = generateNewTask();
    
    var oncePerS = window.setInterval(secondPassed, defaultTaskTime);
    
};