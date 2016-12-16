"use strict";

//Action is the type of action which is allowed.
//World object is a type of object.

var world = new function(){
    this.worldObjects = [];
    this.lol = "lel";
    this.actions = [];
    this.actionHistory = [];
    var wosInfo = [
        {name:"apple", imageSource:"???"},
        {name:"cookie", imageSource:"???"},
        {name:"tumor", imageSource:"???"}
    ];
//    var actionsInfo = [
//        {name:"eat", target:"apple", imageSoucre:"???"},
//        {name:"eat", target:"cookie", imageSoucre:"???"},
//        {name:"request", target:"tumor", imageSoucre:"???"}
//    ];
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
        return world.actionHistory.some(function(histAct){
            return histAct.name === action.name && histAct.targetWo.name ===
                    action.targetWo.name;
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
            assert.isDef(ai.target);
            assert.isDef(ai.imageSource);
            world.actions.push(
                createAction(ai.name, ai.imageSource, ai.target, world)
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

function createAction(name, imageSrc, targetWo, world){
    var ac = {
        name:name,
        imageSource:imageSrc,
        target:targetWo,
        execute:function(){
            world.actionHistory.push(ac);
            alert("Action " + name + "has been acted!");
        }
    };
    return ac;
}