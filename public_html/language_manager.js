"use strict";

var languageManager = new function(){
    var rules = [];
    this.transformText = function(text){
        var t = text;
        //console.log("original text: " + text);
        rules.forEach(function(rule){
            t = rule(t);
            //console.log("new t: " + t);
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
        var replacedRegExp = new RegExp(replaced, "g");
        var rule = function(text){
            //console.log("replaced: " + replacedRegExp + ", replacer: " + replacer);
            var newText = text.replace(replacedRegExp, replacer);
            return newText;
        };
        return rule;
    };
};