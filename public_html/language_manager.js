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
 * Pitäisikö mieluummin tehdä niin, että kirjainsarjat vaihtaisivat paikkaa. Täten
 * informaatiota ei häviäisi (vai häviäisikö?).
 * 
 * Entä jos evoluution seurauksena kaksi sanaa kehittyy samoiksi? Pitäisikö tällainen
 * estää?
 * 
 * TOIMIVATKO SÄÄNNÖT VARMASTI?
 */

var languageManager = new function(){
    var maxReplLength = 2;
    
    var rules = [];
    this.ruleDescriptions = [];
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
        document.dispatchEvent(new CustomEvent('languageRuleAdded'));
    };
    /*var generateNewRule = function(){
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
    };*/
    
    var generateNewRule = function(){
        var replacerString = createReplString();
        var replacedString = createReplString();
        //g: all matches, i: ignore case
        var replacedRegExp = new RegExp(replacedString, "g", "i");
        var rule = createReplRule(replacedRegExp, replacerString);
        return rule;
    };
    
    /*
     * Makes a string according to the rules.
     */
    var createReplString = function(){
        var allChars = "abcdefghijklmnopqrstuvwxyz";
        var strLength = utility.getRandomIntInclusive(1, maxReplLength);
        var strChars = [];
        var charIndex;
        for(var i = 0; i < strLength; i++){
            charIndex = Math.floor(Math.random() * allChars.length);
            strChars.push(allChars[charIndex]);
        }
        var finalString = strChars.join('');
        //console.log("repl string created: " + finalString);
        return finalString;
    };
    
    /*
     * Return value: function(string: text).
     */
    var createReplRule = function(replacedRegExp, rawReplacerString){
        var rule = function(text){
            var newText = text.replace(replacedRegExp, function(match){
                //MITÄ MATCH TARKOITTAA? ON TARKOITUS OLLA SE, MIKÄ ON LÖYDETTY ALKUPERÄISESTÄ STRINGISTÄ CASEINEEN
                var originalChars = match.split('');
                var isLowerCase = originalChars.map(function(c){
                    return utility.isLowerCase(c);
                });
                //It is assumed that replacedString is entirely lower case.
                var newChars = rawReplacerString.split('');
                for(var j = 0; j < isLowerCase.length; j++){
                    if(isLowerCase[j] === false){
                        newChars[j] = newChars[j].toUpperCase();
                    }
                }
                var finalReplacerText = newChars.join('');
                //console.log("final replacer: " + finalReplacerText + ", replaced text: " + match);
                return finalReplacerText;
            });
            return newText;
        };
        //TÄMÄ ON SIIRRETTÄVÄ MUUALLE
        languageManager.ruleDescriptions.push("" + replacedRegExp.toString() + " -> " + rawReplacerString);
        return rule;
    };
};