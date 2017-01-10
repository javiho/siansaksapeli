"use strict";

//$(document).ready(function(){
//    world.initialize();
//    taskManager.initialize();
//    ui.initializeView(world.actions, world.worldObjects);
//});
//
//MIELIVALTAINEN TIMEOUT???
//jQuery.ready aiheuttaa sen, että jos siellä sattuu virhe, se häviää jonnekin.
//Sitten heitetään virhe rivin 3853 funktiosta readyException, ja se on ainoa joka näkyy
//selaimen konsolissa. Miten jQuery.ready-funktiota voi käyttää niin, että oikea
//virheen lähde tulostetaan, pitää selvittää.
//
//assert.isCompletelyDefined({
//    asd:"BAsd",
//    lol:{lel:"Lel", lul:"Lul"}
//});
//console.log("initialization alkaa");
window.onload = function(){
    console.log("loaded");
    world.initialize();
    taskManager.initialize();
    var initialTask = taskManager.getCurrentTask();
    assert.isDef(initialTask);
    ui.initializeView(taskManager.getAvailableActions(), taskManager.getAvailableObjects(), initialTask);
    
    //UI EI OLE KUUNTELEMASSA TASK MANAGERIN ALKUEVENTTIA
};
