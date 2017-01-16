"use strict";

//D:\projekteja\NetBeans-projekteja\SiansaksaPeli

/*
 * BUGIT:
 * Jos klikkaa monta kertaa peräkkäin uusia viestejä lokiin, väri vaihtuu
 * suurella viiveellä.
 */
/*
 * REFAKTOROINTI:
 * Jaettava ui useaan tiedostoon.
 */

var taskManager = new function(){
    
    var defaultTaskTime = 10;//seconds
    var defaultAbsoluteTaskTime = 20;//seconds
    var secondsLeft = defaultTaskTime;//of default task time
    var secondsToAbsolute = defaultAbsoluteTaskTime;
    var currentTask;
    var taskRunningLate = false;
    var availableObjects = [];
    var availableActions = [];
    this.objectCount = 10;
    this.actionCount = 5;
    
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
        assert.isDef(wts);
        //console.log(wts);
        if(!Array.isArray(wts)){
            availableActions = availableActions.filter(function(el){
                return !(wts.name === el.name);
            });
            availableObjects = availableObjects.filter(function(el){
                return !(wts.name === el.name);
            });
            return;
        }
        assert.arrHasContent(wts);
        if(world.isAction(wts[0])){
            availableActions = availableActions.filter(function(el){
                return wts.some(function(wt){
                    wt.name === el.name;
                }) === false;
            });
        }
        if(world.isWorldObject(wts[0])){
            availableObjects = availableObjects.filter(function(el){
                return wts.some(function(wt){
                    wt.name === el.name;
                }) === false;
            });
        }
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
        document.dispatchEvent(new CustomEvent('taskFinished', {detail:{currentTask:currentTask, succeeded:succeeded}}));
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