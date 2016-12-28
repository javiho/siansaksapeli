"use strict";

//D:\projekteja\NetBeans-projekteja\SiansaksaPeli

//Action is the type of action which is allowed.
//World object is a type of object.
//Deed is a structure with action and specific type of world object.
//Task is a deed.

//MIKSI OSA FUNKTIOISTA ON MAAILMAN SISÄLLÄ JA OSA ULKONA?
//TODO: DEED TO STRING
//MIKÄ ON TASKIN/DEEDIN JA ACTIONIN RAKENNE? ELI: OVARTKO TARGETIT NIIDEN NIMIÄ
//VAI OBJEKTEJA ITSESSÄÄN?
//PARAS OLISI, ETTÄ OLISIVAT OBJEKTEJA, KOSKA LUONNOLLISEMPAA
//TOISAALTA VOI VAIN OLLA FUNKTIO, JOLLA VOI HAKEA NIMEN PERUSTEELLA OBJEKTIN.

var world = new function(){
    this.worldObjects = [];
    this.lol = "lel";
    this.actions = [];//element: {name:string, targets:(worldObjects)}
    this.deedHistory = [];//element: {action:action, target:wo}
    var wosInfo = [
        {name:"apple", imageSource:"???"},
        {name:"cookie", imageSource:"???"},
        {name:"tumor", imageSource:"???"}
    ];
    var actionsInfo = [
        {name:"eat", targetNames:["apple", "cookie"], imageSoucre:"???"},
        {name:"request", targetNames:["tumor"], imageSoucre:"???"}
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
        assert.areDef(action, target);
        var newDeed = {
            action:action,
            target:target
        };
        assert.areDef(newDeed.action, newDeed.target);
        return newDeed;
    };
    var isValidDeed = function(deed){
        assert.isDef(deed);
        assert.areDef(deed.action.name, deed.target.name);
        var isValid = world.actions.some(function(ac){
            assert.areDef(ac, ac.targets);
            //console.log("ac.name: " + ac.name + ", deed.action.name: " + deed.action.name);
            return ac.name === deed.action.name && ac.targets.some(function(targ){
                assert.areDef(targ.name, deed.target.name);
                //console.log("targ.name: " + targ.name + " deed.target.name: " + deed.target.name);
                return targ.name === deed.target.name;
            });
        });
        //console.log("deed " + JSON.stringify(deed, null, 2) + " validity: " + isValid);
        return isValid;
    };
    this.attemptDeed = function(deed){
        assert.isDef(deed);
        assert.isDef(deed.action);
        assert.isDef(deed.target);
        var isValid = isValidDeed(deed);
        if(!isValid){
            //console.log("invalid");
            var ev = new CustomEvent('invalidDeed', {detail:deed});
            document.dispatchEvent(ev);
        }else{
            //console.log("valid");
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
            assert.isDef(ai.targetNames);
            assert.isDef(ai.imageSource);
            var targetWos = ai.targetNames.map(function(n){
                return woNameToWo(n);
            });
            assert.isDef(targetWos);
            world.actions.push(
                createAction(ai.name, ai.imageSource, targetWos, world)
            );
        }
        //console.log(world.actions);
    };
    var executeDeed = function(deed){
        world.deedHistory.push({action:deed.action, target:deed.targetWo});
        //alert("Action " + action.name + " with target " + targetWo.name + "has been acted!");
        document.dispatchEvent(new CustomEvent('newDeedDone', {detail: deed}));
    };
    //EI PITÄISI OLLA EXECUTIONIA? KOSKA SE ON VAIN TASKISSA
    var createAction = function(name, imageSrc, targetWos){
        assert.isDef(targetWos);
        var ac = {
            name:name,
            imageSource:imageSrc,
            targets:targetWos
        };
        assert.areDef(ac.name, ac.imageSource, ac.targets);
        return ac;
    };
    var woNameToWo = function(woName){
        assert.areDef(woName);
        assert.arrHasContent(world.worldObjects);
        var wo = world.worldObjects.find(function(tempWo){
            return tempWo.name === woName;
        });
        assert.isDef(wo);
        return wo;
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

function areDeedsEqual(d1, d2){
    return d1.action.name === d2.action.name && d1.target.name === d2.target.name;
}