var ui = new function(){
    var actionSelection;
    var targetSelection;
    var instructionArea;
    var timerArea;
    var actionExecutionButton;
    
    this.initializeView = function(actions, targets){
        actionSelection = $("#actionSelection");
        targetSelection = $("#targetSelection");
        instructionArea = $('#instructionArea');
        timerArea = $('#timerArea');
        actionExecutionButton = $('#actionExecutionButton');
        actionExecutionButton.onclick = onActionExecutionButton;
        
        document.addEventListener('taskCreate', function(e){
            var ti = e.detail.instructionText;
            var gibberishedInst = languageManager.transformText(ti);
            this.changeInstructions(gibberishedInst);//TOIMIIKO?
        });

        document.addEventListener('secondPassed', function(e){
            ui.changeTimerTime(e.detail.secondsLeft);//TOIMIIKO?
        });
        
        addImages(actionSelection, actions);
        addImages(targetSelection, targets);
    };
    
    this.changeInstructions = function(instructions){
        instructionArea.murderChildren();
        var instText = document.createTextNode(instructions);
        instructionArea.append(instText);
    };
    
    //PERFORMANTIMMAKSI VOISI MUUTTAA
    this.changeTimerTime = function(newTimeSeconds){
        //murderChildren(instructionArea);
        timerArea.empty();
        var timeText = document.createTextNode("Seconds left: " + newTimeSeconds);
        timerArea.append(timeText);
    };
    
    var addImages = function(element, objects){
        var img;
        var o;
        console.log(objects);
        for(var i = 0; i < objects.length; i++){
            o = objects[i];
            img = $('<img>');
            img.attr('src', o.imageSource);
//            img.attr('width', 300);
//            img.attr('height', 300);
            img.attr('alt', o.name + " image");
            element.append(img);
        }
    };
    
    var onActionExecutionButton = function(){
        alert("action execution");
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