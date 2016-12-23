"use strict";

var utility = {
    isDef: function(o){
        return !(typeof o === 'undefined');
    }
};

var assert = {
    arrHasContent: function(arr, message){
        if(typeof arr === 'undefined' || arr.length === 0){
            throw message;
        }
    },
    //MAHDOLLISTETTAVA MIELIVALTAINEN MÄÄRÄ PARAMETREJA
    isDef: function(obj, message){
        var mess = message;
        if(typeof message === 'undefined'){
            mess = "Error: undefined";
        }
        if(typeof obj === 'undefined'){
            throw mess;
        }
    },
    areDef: function(){
        var a;
        //console.log("arlen: " + arguments.length);
        for(var i = 0; i < arguments.length; i++){
            a = arguments[i];
            if(!utility.isDef(a)){
                throw "Error: argument #" + (i + 1) + " is undefined. asdasd";
            }
        }
    },
    isDeedDef: function(deed){
        if(!utility.isDef(deed.action)){
            throw "action undefined";
        }
        if(!utility.isDef(deed.target)){
            throw "target undefined";
        }
    }
};