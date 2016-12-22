"use strict";

//D:\projekteja\NetBeans-projekteja\SiansaksaPeli

//Action is the type of action which is allowed.
//World object is a type of object.
//Deed is a structure with action and specific type of world object.
//Task is a deed.

//MIKSI OSA FUNKTIOISTA ON MAAILMAN SISÄLLÄ JA OSA ULKONA?
//TODO: DEED TO STRING

var world = new function(){
    this.worldObjects = [];
    this.lol = "lel";
    this.actions = [];
    this.deedHistory = [];//element: {action:action, target:wo}
    var wosInfo = [
        {name:"apple", imageSource:"???"},
        {name:"cookie", imageSource:"???"},
        {name:"tumor", imageSource:"???"}
    ];
    var actionsInfo = [
        {name:"eat", targets:["apple", "cookie"], imageSoucre:"???"},
        {name:"request", targets:["tumor"], imageSoucre:"???"}
    ];
    this.initialize = function(){
        setImageSources(actionsInfo, "action");
        setImageSources(wosInfo, "object");
        addWorldObjects();
        addActions();
    };
    //MUUTETTAVA TASK-KOHTAISEKSI
//    this.wasDone = function(action){
//        return world.taskHistory.some(function(histAct){
//            return histAct.name === action.name && histAct.targetWo.name ===
//                    action.targetWo.name;
//        });
//    };
    //UUSI VERSIO, KESKEN (??)
    this.wasDone = function(task){
        return world.deedHistory.some(function(histTask){
            return histTask.name === task.name && histTask.targetWos.some(function(aTargetWo){
                return aTargetWo.name === task.name;
            });
        });
    };
    this.createDeed = function(action, target){
        return {
            action:action,
            target:target
        };
    };
    this.isValidDeed = function(deed){
        return world.actions.some(function(ac){
            return ac.name === deed.name && ac.targetWos.some(function(targ){
                return targ.name === deed.target.name;
            });
        });
    };
    this.attemptDeed = function(deed){
        assert.isDef(deed);
        var isValid = world.isValidDeed(deed);
        if(!isValid){
            var ev = new CustomEvent('invalidDeed', {detail:deed});
            document.dispatchEvent(ev);
        }else{
            executeDeed(deed);
        }
    };
    var addWorldObjects = function(){
        var woInfo;
        for(var i = 0; i < wosInfo.length; i++){
            woInfo = wosInfo[i];
            //this.worldObjects.push(createWorldObject(woInfo.name, woInfo.imageSource));
            assert.isDef(woInfo);
            assert.isDef(woInfo.name);
            assert.isDef(woInfo.imageSource);
            //console.log(woInfo.imageSource);
            world.worldObjects.push(createWorldObject(woInfo.name, woInfo.imageSource));
        }
    };
    var addActions = function(){
        var ai;
        for(var i = 0; i < actionsInfo.length; i++){
            ai = actionsInfo[i];
            //this.actions.push(
            //console.log("ai name " + ai.name);
            assert.isDef(actionsInfo);
            assert.isDef(ai);
            assert.isDef(ai.targets);
            assert.isDef(ai.imageSource);
            world.actions.push(
                createAction(ai.name, ai.imageSource, ai.targets, world)
            );
        }
        //console.log(world.actions);
    };
    var executeDeed = function(deed){
        world.deedHistory.push({action:deed.action, target:deed.targetWo});
        //alert("Action " + action.name + " with target " + targetWo.name + "has been acted!");
        document.dispatchEvent(new CustomEvent('newDeedDone', {detail: deed}));
    };
};

function setImageSources(worldThings, wtTypeString){
    var wt;
    for(var i = 0; i < worldThings.length; i++){
        wt = worldThings[i];
        wt.imageSource = "images/" + wt.name + "_" + wtTypeString + ".png";
    }
}

function createWorldObject(name, imageSource){
    var wo = {
        name:name,
        imageSource:imageSource
    };
    return wo;
}

//EI PITÄISI OLLA EXECUTIONIA? KOSKA SE ON VAI TASKISSA
function createAction(name, imageSrc, targetWos, world){
    var ac = {
        name:name,
        imageSource:imageSrc,
        targets:targetWos
    };
    return ac;
}

function areDeedsEqual(d1, d2){
    return d1.action.name === d2.action.name && d1.target.name === d1.target.name;
}