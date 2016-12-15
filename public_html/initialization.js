"use strict";

$(document).ready(function(){
    world.initialize();
    taskManager.initialize();
    ui.initializeView(world.actions, world.worldObjects);
});
