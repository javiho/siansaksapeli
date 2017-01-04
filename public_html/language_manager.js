"use strict";

/*
 * Yhden aakkosen korvaaminen: korvataan yksi aakkonen toisella. Pienet
 * kirjaimet korvataan pienillä kirjaimilla ja isot isoilla.
 * Aakkossarjan korvaaminen: korvataan yksi sarja (esim. "ku") toisella (esim.
 * "sa"). Korvattaessa korvataan suuret aakkoset suurilla ja pienet pienillä. Esim.
 * "Kukkapenkki" -> "Sakkapenkki".
 * 
 * Yleinen sarjan korvaaminen: korvataan 1-2:n mittainen sarja 1-2:n mittaisella
 * sarjalla. Esim. "k" -> "af", minkä seurauksena "Kukkapenkki" -> "Afuafafapenafafi"
 * 
 * Sääntöjä sovelletaan kumulatiivisesti. Esim. jos ensin korvataan k a:lla ja sitten
 * a x:llä, niin "Kukkapenkki" -> "Auaaapenaai" -> "Xaxxxpenxxi".
 * 
 * Pitäisikö ottaa huomioon se, että jotkut sarjat ovat yleisempiä kuin toiset?
 * Esim. xq tai jj eivät ole yleisiä.
 * 
 * Entä jos evoluution seurauksena kaksi sanaa kehittyy samoiksi? Pitäisikö tällainen
 * estää?
 */

var languageManager = new function(){
    var maxReplLength = 2;
    
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
    
    //JAETTAVA OSIIN
    var generateNewRule2 = function(){
        var allChars = "abcdefghijklmnopqrstuvwxyz";
        var replacerLength = utility.getRandomIntInclusive(1, maxReplLength);
        var replacedLength = utility.getRandomIntInclusive(1, maxReplLength);
        var replacerChars = [];
        var replacedChars = [];
        var charIndex;
        var i;
        for(i = 0; i < replacerLength; i++){
            charIndex = Math.floor(Math.random() * allChars.length);
            replacerChars.push(allChars[charIndex]);
        }
        for(i = 0; i < replacedLength; i++){
            charIndex = Math.floor(Math.random() * allChars.length);
            replacedChars.push(allChars[charIndex]);
        }
        var replacerString = replacerChars.join();
        var replacedString = replacedChars.join();
        //g: all matches, i: ignore case
        var replacedRegExp = new RegExp(replacedString, "g", "i");
        var rule = function(text){
            //console.log("replaced: " + replacedRegExp + ", replacer: " + replacer);
            //var newText = text.replace(replacedRegExp, replacerString); VANHA
            //TÄYTYY KORJATA TAKAISIN CASET
            var newText = text.replace(replacedRegExp, function(match){
                //MITÄ MATCH TARKOITTAA? ON TARKOITUS OLLA SE, MIKÄ ON LÖYDETTY ALKUPERÄISESTÄ STRINGISTÄ CASEINEEN
                var originalChars = match.split('');
                var isLowerCase = originalChars.map(function(c){
                    return utility.isLowerCase(c);
                });
                //It is assumed that replacedString is entirely lower case.
                var rawReplacerText = replacedString;
                var newChars = rawReplacerText.split('');
                for(var j = 0; j < isLowerCase.length; j++){
                    if(isLowerCase[j] === false){
                        newChars[j] = newChars[j].toUpperCase();
                    }
                }
                var finalReplacerText = newChars.join();
                return finalReplacerText;
            });
            return newText;
        };
        return rule;
    };
};