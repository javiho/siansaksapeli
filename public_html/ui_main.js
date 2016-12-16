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
            //console.log("secondPassed has been heard");
            assert.isDef(e);
            assert.isDef(e.detail);
            ui.changeTimerTime(e.detail);//TOIMIIKO?
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
        assert.isDef(newTimeSeconds)
        //murderChildren(instructionArea);
        timerArea.empty();
        //var timeText = document.createTextNode("Seconds left: " + newTimeSeconds);
        //console.log("timeText: " + timeText);
        //timerArea.append(timeText);
        timerArea.append("Seconds left: " + newTimeSeconds);
    };
    
    var addImages = function(element, objects){
        var img;
        var o;
        //console.log(objects);
        for(var i = 0; i < objects.length; i++){
            o = objects[i];
            img = $('<img>');
            img.attr('src', o.imageSource);
//            img.attr('width', 300);
//            img.attr('height', 300);
            img.attr('alt', o.name + " image");
            img.attr('class', "world-thing-image");
            element.append(img);
        }
        $('.world-thing-image').on('click', function(){
            assert.isDef($(this));
            console.log($(this));
            assert.isDef($(this).attr('alt'));
            console.log($(this).attr('alt'));
        });
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