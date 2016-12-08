"use strict";

//Action is the type of action which is allowed.
//World object is a type of object.

var world = new function(){
    this.worldObjects = [];
    this.actios = [];
    this.actionHistory = [];
    var wosInfo = [
        {name:"apple", imageSource:"???"},
        {name:"cookie", imageSource:"???"},
        {name:"tumor", imageSource:"???"}
    ]; //KUVAT LISÄTTÄVÄ
    var actionsInfo = [
        {name:"eat", target:"apple", imageSoucre:"???"},
        {name:"eat", target:"cookie", imageSoucre:"???"},
        {name:"request", target:"tumor", imageSoucre:"???"}
    ];
    this.initialize = function(){
        setImageSources(actionsInfo, "action");
        setImageSources(wosInfo, "object");
        addWorldObjects();
        addActions();
    };
    this.wasDone = function(action){
        return actionHistory.some(function(histAct){
            return histAct.name === action.name && histAct.targetWo.name ===
                    action.targetWo.name;
        });
    };
    var addWorldObjects = function(){
        for(var woInfo in wosInfo){
            this.worldObjects.push(createWorldObject(woInfo.name, woInfo.imageSource));
        }
    };
    var addActions = function(){
        for(var ai in actionsInfo){
            this.actions.push(
                createAction(ai.name, ai.imageSource, ai.target, world)
            );
        }
    };
};

function setImageSources(worldThings, wtTypeString){
    for(var wt in worldThings){
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

function createAction(name, imageSrc, targetWo, world){
    var ac = {
        name:name,
        image:imageSrc,
        target:targetWo,
        execute:function(){
            world.actionHistory.push(ac);
            alert("Action " + name + "has been acted!");
        }
    };
    return ac;
}