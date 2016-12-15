"use strict";

var assert = {
    arrHasContent: function(arr, message){
        if(typeof arr === 'undefined' || arr.length === 0){
            throw message;
        }
    },
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