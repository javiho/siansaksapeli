"use strict";

var utility = {
    isDef: function(o){
        return !(typeof o === 'undefined');
    },
    //min is inclusive and max is exclusive.
    getRandomInt: function(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    },
    // Returns a random integer between min (included) and max (included)
    getRandomIntInclusive: function(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    //MITENKÄS MUUT KUIN KIRJAIMET? OLETETAAN, ETTÄ PALAUTETAAN TRUE NIIDEN KOHDALLA.
    isLowerCase: function(character){
        return character === character.toLowerCase();
    },
    //PERFORMANSSI? JA MUUTENKIN EI OIKEIN OLE JÄRKEVÄ
    pickWithoutReplacement: function(arr, sampleSize){
        console.assert(arr.length >= sampleSize, "Error: sample size too large.");
        var remainingIndices = [];
        for(var i = 0; i < arr.length; i++){
            remainingIndices.push(i);
        }
        var pickedIndices = [];
        var pickedIndex;
        for(var sampleNo = 0; sampleNo < sampleSize; sampleNo++){
            pickedIndex = utility.getRandomIntInclusive(0, remainingIndices.length - 1);
            pickedIndices.push(pickedIndex);
            remainingIndices = utility.removeFromArray(remainingIndices, pickedIndex);
        }
        var finalSamples = pickedIndices.map(function(pi){
            return arr[pi];
        });
        return finalSamples;
    },
    randomFromArray: function(arr){
        assert.arrHasContent(arr);
        return arr[Math.floor(Math.random()*arr.length)];
    },
    removeFromArray: function(arr, index){
        return arr.splice(index, 1);
    }
};

var assert = {
    arrHasContent: function(arr, message){
        utility.isDef(arr);
        var m = message;
        if(typeof message === 'undefined'){
            m = "Error: array doesn't hava content.";
        }
        if(typeof arr === 'undefined'){
            throw "Error: array is undefined";
        }
        if(arr.length === 0){
            throw m;
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
    },
    /*
     * Is meant to be called with arbitrary number of parameters which need to be
     * checked for undefined.
     */ 
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
    },
    isCompletelyDefined: function(obj, historyString, recursionLevel){
        //TOIMIIKO?
        if(!utility.isDef(obj)){
            throw "Error: " + historyString + "(possibly), " + " is undefined";
        }
        var propNames = Object.keys(obj);
        if(!utility.isDef(recursionLevel)){
            recursionLevel = 0;
        }else if(recursionLevel > 100){
            throw "Error: something is wrong.";
        }
        //TOIMIIKO TÄMÄ KAIKISSA TAPAUKSISSA? TUSKIN.
        if(!(typeof obj === 'object')){
            //console.log("not an object");
            return;
        }
        var pName;
        var pVal;
        for(var i = 0; i < propNames.length; i++){
            pName = propNames[i];
            pVal = obj[pName];
            //console.log("pName: " + pName + ", value: " + pVal);
            if(!utility.isDef(pVal)){
                throw "Error: in " + historyString + ", " + pName + " is undefined";
            }
            assert.isCompletelyDefined(pVal, historyString + ".pName", recursionLevel + 1);
        }
    }
};

//TESTAUS
//var rand = utility.pickWithoutReplacement(["a", "b", "c", "d", "e", "f", "g"], 1);
//console.log(rand);