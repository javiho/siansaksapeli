var ui = new function(){
    var actionSelection = $('#actionSelection');
    var targetSelection = $('#targetSelection');
    var instructionArea = $('#instructionArea');
    var timerArea = $('#timerArea');
    var actionExecutionButton = $('#actionExecutionButton');
    
    actionExecutionButton.onclick = onActionExecutionButton;
    
    this.initializeView = function(actions, targets){
        addImages(actionSelection, actions);
        addImages(targetSelection, targets);
    };
    
    this.changeInstructions = function(instructions){
        instructionArea.murderChildren();
        var instText = document.createTextNode(instructions);
        instructionArea.appendChild(instText);
    };
    
    //PERFORMANTIMMAKSI VOISI MUUTTAA
    this.changeTimerTime = function(newTimeSeconds){
        instructionArea.murderChildren();
        var instText = document.createTextNode(instructions);
        instructionArea.appendChild(instText);
    };
    
    var addImages = function(element, objects){
        var img;
        for(var o in objects){
            img = document.createElement("img");
            img.setAttribute('src', o.imageSource);
            element.appendChild();
        }
    };
    
    var onActionExecutionButton = function(){
        //muodostetaan action
        //executoidaan se
        //world....
    };
    
    var murderChildren = function(el){
        while(el.childNodes.length > 0){
            el.removeChild(el.childNodes[0]);
        }
    };  
};