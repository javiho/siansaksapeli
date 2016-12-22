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
    }
};