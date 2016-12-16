"use strict";

//Action is the type of action which is allowed.
//World object is a type of object.
//Task is a structure with action and specific type of world object

var world = new function(){
    this.worldObjects = [];
    this.lol = "lel";
    this.actions = [];
    this.taskHistory = [];//element: {action:(name), target:(name)}
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
    //UUSI VERSIO, KESKEN
    this.wasDone = function(task){
        return world.taskHistory.some(function(histTask){
            return histTask.name === task.name && histTask.targetWos.some(function(aTargetWo){
                return aTargetWo.name === task.name;
            });
        });
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