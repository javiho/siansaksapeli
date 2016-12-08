"use strict";

var languageManager = new function(){
    var rules = [];
    this.transformText = function(text){
        var t = text;
        rules.forEach(function(rule){
            t = rule(t);
        });
        return t;
    };
    this.addNewRule = function(){
        rules.push(generateNewRule());
    };
    var generateNewRule = function(){
        var possible = "abcdefghijklmnopqrstuvwxyz";
        var replacedIndex = Math.floor(Math.random() * possible.length);
        var replacerIndex = Math.floor(Math.random() * possible.length);
        var replaced = possible.charAt(replacedIndex);
        var replacer = possible.charAt(replacerIndex);
        var rule = function(text){
            var newText = text.replace(replaced, replacer);
            return newText;
        };
        return rule;
    };
};

