"use strict";

//$(document).ready(function(){
//    world.initialize();
//    taskManager.initialize();
//    ui.initializeView(world.actions, world.worldObjects);
//});
//
//MIELIVALTAINEN TIMEOUT???
//jQuery.ready aiheuttaa sen, että jos siellä sattuu virhe, se häviää jonnekin.
//Sitten heitetään virhe 3853 funktionsta readyException, ja se on ainoa joka näkyy
//selaimen konsolissa. Miten jQuery.ready-funktiota voi käyttää niin, että oikea
//virheen lähde tulostetaan, pitää selvittää.
console.log("initialization alkaa");
window.onload = function(){
    console.log("loaded");
    world.initialize();
    ui.initializeView(world.actions, world.worldObjects);
    taskManager.initialize();
};
