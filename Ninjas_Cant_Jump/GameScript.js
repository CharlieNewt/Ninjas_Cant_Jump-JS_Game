window.onload = function () {
    window.addEventListener('keydown', whatKey, true); // key press listener

    //FROM --->> http://jsfiddle.net/loktar/dMYvG/
    var canvas = document.getElementById("myCanvas"),
    context = canvas.getContext("2d");

    //canvas.width = canvas.height = 300;

    //ADAPTED FROM ~~~~>> https://www.youtube.com/watch?v=W0e9Z5pmt-I
    //The position the frame will be drawn
    var charX = 60;
    var charY = 204;

    //The position of the frame on the spritesheet
    var srcX = 0;
    var srcY = 0;

    //The Dimensions of the spritesheet
    var sheetWidth = 128;
    var sheetHeight = 26;

    //Number of frames the spritesheet
    var frameCountColumns = 4; //The number of columns of frames
    var frameCountRows = 1; //The number of rows of frames

    //Dimension of each frame
    var charWidth = sheetWidth / frameCountColumns;
    var charHeight = sheetHeight / frameCountRows;

    //This variable will keep track of which frame to show
    var currentFrameTick = 0;
    var currentFrame = 0;
    //Variable 'character' holds the spritesheet itself;
    var character = new Image();
    character.src = "assets/idle-Right-Sheet.png";

    //Script setup
    var canvas = document.getElementById("myCanvas");
    var context = canvas.getContext("2d");
    //End of script setup

    function updateFrame() {
        currentFrameTick = (++currentFrameTick);
        if (currentFrameTick % 5 == 0) {
            currentFrame = (++currentFrame) % frameCountColumns;
        }
        srcX = currentFrame * charWidth;
        srcY = 0;

    }
    function animateImage() {
        //context.clearRect(0, 0, canvas.width, canvas.height);
        updateFrame();
        var charAnim = context.drawImage(character, srcX, srcY, charWidth, charHeight, charX, charY, charWidth * 1.5, charHeight * 1.5);
    }

    //CHARACTER LIVES
    var lives = 3;
    var life = new Image();
    life.src = "assets/ninja-life.png";
    function charLives()
    {
        
        if (lives == 3)
        {
            var life1 = context.drawImage(life, 700, 20);
            var life2 = context.drawImage(life, 730, 20);
            var life3 = context.drawImage(life, 760, 20);
        }
        if (lives == 2)
        {
            var life1 = context.drawImage(life, 700, 20);
            var life2 = context.drawImage(life, 730, 20);
        }
        if (lives == 1)
        {
            var life1 = context.drawImage(life, 700, 20);
        }
    }
    //========================================================================================
    //==================================END CHARACTER SETUP===================================
    //========================================================================================

    //GAME LOOP
    
    var velY = 0,
        velX = 0,
        speed = 2,
        friction = 0.89,
        keys = [];
    var whichLevel = 1;
    //GAME LOOP FUNCTION
    function update() {
        requestAnimationFrame(update);
        isCollidingWithNpt();
        isCollidingWithInteraction();
        isCollidingWithLvlEnd();
        isCollidingWithKillBox();
        if (!isFalling && !gameOver) {
            if (keys[39]) { //RIGHT KEY PRESSED
                if (velX < speed) {
                    velX++;
                }
            }

            if (keys[37]) { //LEFT KEY PRESSED
                if (velX > -speed) {
                    velX--;
                }
            }

            velY *= friction;
            charY += velY;
            velX *= friction;
            charX += velX;

            if (charX >= canvas.width - 35) {
                charX = canvas.width - 35;
            } else if (charX <= -10) {
                charX = -10;
            }

            if (charY > canvas.height - 5) {
                charY = canvas.height - 5;
            } else if (charY <= 5) {
                charY = 5;
            }
        }


        //LEVEL SETUP
        if (whichLevel == 1) {
            level1Setup();

        }
        if (whichLevel == 2) {
            level2Setup();
        }
        if (whichLevel == 3) {
            level3Setup();
        }
        if (whichLevel == 4) {
            
        }

        context.clearRect(0, 0, canvas.width, canvas.height);
        drawBackground();
        charLives();
        displayEToolTip();
        animationCheck(); //See what animation should be used
        animateImage(); //Draw the character
        trainLevel();
        
        
        if (drawBridge) {
            animateBridge();
        }    
        
        lvl3Spikes();
        lvl3Bullets();
        drawForeground();

        if (gameOver)
        {
            context.beginPath();
            context.font = "90px Verdana";
            context.fillText("GAME OVER", 100, 150);
        }
        if (gameWon)
        {
            context.beginPath();
            context.font = "90px Verdana";
            context.fillText("YOU WIN!", 100, 150);
        }

            
    }



    document.body.addEventListener("keydown", function (e) {
        keys[e.keyCode] = true;
    });
    document.body.addEventListener("keyup", function (e) {
        keys[e.keyCode] = false;
    });


    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //++++++++++++++++++++END OF INPUT PROCCESSING++++++++++++++++++++++
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //                    CHARACTER ANIMATION START
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    function animationCheck() {
        if (velX >= 0.5) {
            character.src = "assets/sneaky-walk-Right-Sheet.png"; //Changes the animation sprite sheet
            sheetWidth = 192; //Sets sheetWidth to new sprite sheet width
            sheetHeight = 26; //Sets sheetHeight to new sprite sheet height
            frameCountColumns = 6; //Sets frameCountColumns to number of frame columns in the new sprite sheet
            frameCountRows = 1; //Sets the frameCountRows to number of frame rows in the new sprite sheet   
            //frameCounterTick = 0;         
        }
        if (velX < 0.5 && velX > 0) {
            character.src = "assets/idle-Right-Sheet.png"; //Changes the animation sprite sheet
            sheetWidth = 128; //Sets sheetWidth to new sprite sheet width
            sheetHeight = 26; //Sets sheetHeight to new sprite sheet height
            frameCountColumns = 4; //Sets frameCountColumns to number of frame columns in the new sprite sheet
            frameCountRows = 1; //Sets the frameCountRows to number of frame rows in the new sprite sheet 
            //frameCounterTick = 0;
        }
        if (velX <= -0.5) {

            character.src = "assets/sneaky-walk-Left-Sheet.png"; //Changes the animation sprite sheet
            sheetWidth = 192; //Sets sheetWidth to new sprite sheet width
            sheetHeight = 26; //Sets sheetHeight to new sprite sheet height
            frameCountColumns = 6; //Sets frameCountColumns to number of frame columns in the new sprite sheet
            frameCountRows = 1; //Sets the frameCountRows to number of frame rows in the new sprite sheet
            //currentFrameTick = 0; //Sets the animation to start at the first frame
        }
        if (velX <= 0 && velX > -0.5) {
            character.src = "assets/idle-Left-Sheet.png"; //Changes the animation sprite sheet
            sheetWidth = 128; //Sets sheetWidth to new sprite sheet width
            sheetHeight = 26; //Sets sheetHeight to new sprite sheet height
            frameCountColumns = 4; //Sets frameCountColumns to number of frame columns in the new sprite sheet
            frameCountRows = 1; //Sets the frameCountRows to number of frame rows in the new sprite sheet
            //currentFrameTick = 0; //Sets the animation to start at the first frame
        }
    }
    function trainLevel()
    {
        if ((whichLevel == 1) || (whichLevel == 2))
        {
            animateTrainImage();
        }
        if (whichLevel >= 3) {
            trainX = 50;
            trainY = -10;
            animateTrainImage();
        }
    }
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //                    CHARACTER ANIMATION END
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //                    TRAIN ANIMATION START
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    //The position the frame will be drawn
    var trainX = 100;
    var trainY = 150;

    //The position of the frame on the spritesheet
    var trainSrcX = 0;
    var trainSrcY = 0;

    //The Dimensions of the spritesheet
    var trainSheetWidth = 20736;
    var trainSheetHeight = 216;

    //Number of frames the spritesheet
    var frameCountTrainColumns = 54; //The number of columns of frames
    var frameCountTrainRows = 1; //The number of rows of frames

    //Dimension of each frame
    var trainWidth = trainSheetWidth / frameCountTrainColumns;
    var trainHeight = trainSheetHeight / frameCountTrainRows;

    //This variable will keep track of which frame to show
    var currentTrainFrame = 0;
    var currentTrainFrameTick = 0;

    //Variable 'character' holds the spritesheet itself;
    var train = new Image();
    train.src = "assets/train-green-sprite.png";


    function updateTrainFrame() {
        currentTrainFrameTick = (++currentTrainFrameTick) % frameCountTrainColumns;
        if (currentTrainFrameTick % 3 == 0) {
            currentTrainFrame = (++currentTrainFrame) % frameCountTrainColumns;
        }
        trainSrcX = currentTrainFrame * trainWidth;
        trainSrcY = 0;

    }
    function animateTrainImage() {
        //context.clearRect(0, 0, canvas.width, canvas.height);
        updateTrainFrame();
        var trainAnim = context.drawImage(train, trainSrcX, trainSrcY, trainWidth, trainHeight, trainX, trainY, trainWidth * 1.75, trainHeight * 1.75);
    }

    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //                    TRAIN ANIMATION END
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    //========================================================================================
    //====================================COLLISION BOX SETUP=================================
    //========================================================================================

    var name; //Assigns the name of the collision box
    var collisionBoxType; //Assigns the collisionBoxType of collision box, npt = 1, projecile = 2, intercations = 3;

    var collisionBoxX; //collision box x coord
    var collisionBoxY; //collision box y coord
    var collisionBoxHeight; //collision box height
    var collisionBoxWidth; //collision box width

    var nptBoxes = []; //An array of all the non-passable terrain (npt) in the level.
    var killBoxes = []; //An array of all the kill boxes
    var interactionBoxes = []; //An array of all the interction boxes
    var lvlEndBoxes = []; //An array of all the boxes which when the player enters the level changes

    //The Collsisions class is used to define the collision spaces and what they do when interracted with.
    class Collisions {
        //Collisions takes the parameters of (String: name, String: collisionBoxType, Int: collisionBoxX, Int: collisionBoxY, Int: hright, Int: collisionBoxWidth)
        constructor(name, collisionBoxType, collisionBoxX, collisionBoxY, collisionBoxHeight, collisionBoxWidth) {
            this.name = name;    //assigns name variable
            this.collisionBoxType = collisionBoxType;    //assigns collisionBoxType variable
            this.collisionBoxX = collisionBoxX;     //assigns collisionBoxX variable
            this.collisionBoxY = collisionBoxY;     //assigns collisionBoxY variable
            this.collisionBoxHeight = collisionBoxHeight;   //assigns collisionBoxHeight variable
            this.collisionBoxWidth = collisionBoxWidth; //assigns collisionBoxWidth variable
            //The draw function uses the parameters to create a Rect() on the canvas
            this.draw = function () {
                context.beginPath();
                context.rect(collisionBoxX, collisionBoxY, collisionBoxWidth, collisionBoxHeight);
            }

            //Functions used to return the the set parameters
            this.typeReturn = function () {
                return collisionBoxType;
            }
            this.xReturn = function () {
                return collisionBoxX;
            }
            this.yReturn = function () {
                return collisionBoxY;
            }
            this.widthReturn = function () {
                return collisionBoxWidth;
            }
            this.heightReturn = function () {
                return collisionBoxHeight;
            }
            //The stroke function uses the defined parameters to create a Rect() and then stroke its outline
            this.stroke = function () {
                context.beginPath();
                context.lineWidth = "2";
                context.strokeStyle = "black";
                context.rect(collisionBoxX, collisionBoxY, collisionBoxWidth, collisionBoxHeight);
                context.stroke();
            }
            
            //
            //Using the defined "collisionBoxType" variable, we assign the created collision to an array that matches its collisionBoxType.

            //If collision is collisionBoxType "npt", then it is added to the nptBoxes array
            if (collisionBoxType == 1) {
                if (nptBoxes.length > 0) {   //Check if ther are other objects in the array
                    var id = nptBoxes.length; //set collision an id in the array
                }
                else { id = 0; } //If there are no objects in the arrray this sets the collision's id to 0
                this.id = id;
                nptBoxes[id] = this;
            }
            //If collision is collisionBoxType "kill", then it is added to the killBoxes array
            if (collisionBoxType === 2) {
                if (killBoxes.length > 0) {   //Check if ther are other objects in the array
                    var id = killBoxes.length; //set collision an id in the array
                }
                else { id = 0; } //If there are no objects in the arrray this sets the collision's id to 0
                this.id = id;
                killBoxes[id] = this;
            }
            //If collision is collisionBoxType "interaction", then it is added to the intercationBoxes array
            if (collisionBoxType === 3) {
                if (interactionBoxes.length > 0) {   //Check if ther are other objects in the array
                    var id = interactionBoxes.length; //set collision an id in the array
                }
                else { id = 0; } //If there are no objects in the arrray this sets the collision's id to 0
                this.id = id;
                interactionBoxes[id] = this;
            }
            //If collision is collisionBoxType "lvlEnd", then it is added to the intercationBoxes array
            if (collisionBoxType === 4) {
                if (lvlEndBoxes.length > 0) {   //Check if ther are other objects in the array
                    var id = lvlEndBoxes.length; //set collision an id in the array
                }
                else { id = 0; } //If there are no objects in the arrray this sets the collision's id to 0
                this.id = id;
                lvlEndBoxes[id] = this;
            }

        }
    }

    //####################################Collision Detection START############################
    //++++++++++++++++++++++++++++++++++++NON PASSABLE TERRAIN (NPT)+++++++++++++++++++++++++++
    var floorContact = false;
    /*
        This function is to see if the character is colliding with a non passable terrain (npt).
    */
    function playerNptCollision(nptCollisionX, nptCollisionY, nptCollisionWidth, nptCollisionHeight) {
        var charRelativeWidth = charX + charWidth; //coordinate for the top right limit of the character
        var charRelativeHeight = charY + charHeight; //coordinate for the bottom left limit of the character
        var nptCollisionRelativeWidth = nptCollisionX + nptCollisionWidth; //coord for the top right limit of the collision box
        var nptCollisionRelativeHeight = nptCollisionY + nptCollisionHeight; //coord for the bottom left limit of the collision box
        //This check is to see if the player is touching the floor, if they are the floorContact variable is set to true. otherwise its set to false
        //FLOOR
        if ((charRelativeHeight == nptCollisionY - nptCollisionHeight) && charWidth < nptCollisionWidth) //If the players (y + height) is the same as the collision boxes y coord and the collision box has a larger width that the player
        {
            if ((charX >= nptCollisionX) && (charRelativeWidth <= nptCollisionRelativeWidth)) {//Check to see if the character is within the x axis coordinates of the collision box
                floorContact = true; //if the character IS within the x-axis coordinates of the collision box, then the the floorContact varialbe is used to tell the game this
            }
        }

    }
    var isFalling = false;  //This variable is used to stop directional movement when the character is falling
    var onFloor = false;
    var nptBoxesCounter = 1; //Used to keep track of full list iterations
    /*
        This function iterates through all the elements in the nptBoxes array and acts accordingly depending on the directi     on of the interaction
    */
    function isCollidingWithNpt() {
        floorContact = false; //Initial state of the floorContact variable is false
        onFloor = false; //Initial state of the onFloor variable is false

        nptBoxes.forEach(function (Collisions) {
            playerNptCollision(Collisions.collisionBoxX, Collisions.collisionBoxY, Collisions.collisionBoxWidth, Collisions.collisionBoxHeight);
            nptBoxesCounter++; //Each collision box will increase this value
            if (floorContact) {
                onFloor = floorContact;
                isFalling = false;
            }
            //If the iterator has gotten to the last nptBox
            if (nptBoxesCounter == nptBoxes.length) {
                if (floorContact != true) //If there hasn't been a collision
                { onFloor = false; } //Let the game know that the player is not on a floor and should therefore fall
                nptBoxesCounter = 1; //Reset the variable ready to start another iteration of the array.
            }
        });
        if (onFloor != true) //If the character is not on the floor
        {
            charY = charY + 6; //The character will fall
            isFalling = true; //The character will not move left/right whilst it is falling

        }
    }

    //+++++++++++++++++++++++++KILL BOX COLLISION+++++++++++++++++++++++++++++++++++++
    var insideKillBox = false;
    /*
        This function is to see ifd the player is touching a kill box
    */
   function playerKillBoxCollision(killBoxCollisionX, killBoxCollisionY, killBoxCollisionWidth, killBoxCollisionHeight) {
        insideKillBox = false;
        var charRelativeWidth = charX + charWidth; //coordinate for the top right limit of the character
        var charRelativeHeight = charY + charHeight; //coordinate for the bottom left limit of the character
        var killBoxCollisionRelativeWidth = killBoxCollisionX + killBoxCollisionWidth; //coord for the top right limit of the collision box
        var killBoxCollisionRelativeHeight = killBoxCollisionY + killBoxCollisionHeight; //coord for the bottom left limit of the collision box
        //This check is to see if the player is touching the floor, if they are the floorContact variable is set to true. otherwise its set to false
        //IS THE  PLAYER IN THE BOX
        if ((charRelativeWidth >= killBoxCollisionX) && (charX <= killBoxCollisionRelativeWidth) && (charRelativeHeight >= killBoxCollisionY) && (charY <= killBoxCollisionRelativeHeight))
        //if ((charRelativeWidth <= killBoxCollisionRelativeWidth) && (charX >= killBoxCollisionX))
        {
            insideKillBox = true;
        }
    }
    var isInsideKillBox;
    /*
    This function will cylce through all the kill boxes in the killBoxes array and see if any of them 
    in contact with the player.
    */
   function isCollidingWithKillBox()
   {
        insideKillBox = false;
        isInsideKillBox = false;
        killBoxes.forEach(function (Collisions) {
            playerKillBoxCollision(Collisions.collisionBoxX, Collisions.collisionBoxY, Collisions.collisionBoxWidth, Collisions.collisionBoxHeight);
            if (insideKillBox)
            {
                isInsideKillBox = insideKillBox;
            }
        });
        if (isInsideKillBox)
        {
            //lives--;
            lifeLost();
            isInsideKillBox = false;
        }
   }

   var gameOver; //If the player runs out of lives, this boolean is set to true
   var gameWon; //If the player reaches the end of the game, this boolean is set to true
   /*
    This decides what to do if the character.
    If the character has lives then a life is removes and the player starts back at the start of the level.
    If the player doesnt have lives then the game is over
   */
    function lifeLost()
    {
        lives--;
        if (lives == 3)
        {
            //lives = 2;
            playerPositionReset();           
        }
        if (lives == 2)
        {
            //lives = 1;
            playerPositionReset();           
        }
        if (lives == 1)
        {
            //lives = 1;
            playerPositionReset();           
        }
        if (lives == 0)
        {
            gameOver = true;
            playerPositionReset();
        }
    }

    /*
        This function resets the players position to the level's starting position
    */
   function playerPositionReset()
   {
    if (whichLevel == 1)
    {
        charX = 60;
        charY = 204;
    }
    if (whichLevel == 2)
    {
        charX = 10;
        charY = 318;
    }
    if (whichLevel == 3)
    {
        charX = 189;
        charY = -11;
    }
    if (gameOver)
    {
        charX = -50;
        charY = 204;
    }
   }
    //+++++++++++++++++++++++++INTERACTION COLLISION+++++++++++++++++++++++++++++++++++++
    var insideInteract = false; //This boolean is changed to true if a player is inside an interaction collision box

    /*
        This function is to see if the character is colliding with an interaction box
    */
    function playerInteractionCollision(interactionCollisionX, interactionCollisionY, interactionCollisionWidth, interactionCollisionHeight) {
        var charRelativeWidth = charX + charWidth; //coordinate for the top right limit of the character
        var charRelativeHeight = charY + charHeight; //coordinate for the bottom left limit of the character
        var interactionCollisionRelativeWidth = interactionCollisionX + interactionCollisionWidth; //coord for the top right limit of the collision box
        var interactionCollisionRelativeHeight = interactionCollisionY + interactionCollisionHeight; //coord for the bottom left limit of the collision box
        //This check is to see if the player is touching the floor, if they are the floorContact variable is set to true. otherwise its set to false
        //IS THE  PLAYER IN THE BOX
        if ((charRelativeWidth <= interactionCollisionRelativeWidth) && (charX >= interactionCollisionX)) //If the players coords are inside the interacion box's coords then an interacion can happen
        {
            insideInteract = true;
        }
    }
    var canInteract = false;    //This variable is used to tell if the player can interact with something, i.e if pressing e will do anything
    var isInsideInteract;

    function isCollidingWithInteraction() {
        insideInteract = false;
        isInsideInteract = false;
        canInteract = false;

        interactionBoxes.forEach(function (Collisions) {
            playerInteractionCollision(Collisions.collisionBoxX, Collisions.collisionBoxY, Collisions.collisionBoxWidth, Collisions.collisionBoxHeight);
            if (insideInteract) {
                isInsideInteract = insideInteract;
            }
        });
        if (isInsideInteract != true) {
            canInteract = false;
        }
        else {
            canInteract = true;
        }
    }

    //LEVEL 1 TOOLTIP
    function displayEToolTip() {
        if (canInteract && (whichLevel == 1)) {
            var eToolTip = new Image();
            eToolTip.src = "assets/press_e.png"
            var eToolTipImg = context.drawImage(eToolTip, 580, 300, 66 * 1.75, 24 * 1.75);
        }
    }

    //+++++++++++++++++++++++++++++++++++++LEVEL END COLLISION++++++++++++++++++++++++++++++++++
    var insideLvlEnd = false; //This boolean is changed to true if a player is inside an interaction collision box

    /*
        This function is to see if the character is colliding with an interaction box
    */
    function playerLvlEndCollision(lvlEndCollisionX, lvlEndCollisionY, lvlEndCollisionWidth, lvlEndCollisionHeight) {
        var charRelativeWidth = charX + charWidth; //coordinate for the top right limit of the character
        var charRelativeHeight = charY + charHeight; //coordinate for the bottom left limit of the character
        var lvlEndCollisionRelativeWidth = lvlEndCollisionX + lvlEndCollisionWidth; //coord for the top right limit of the collision box
        var lvlEndCollisionRelativeHeight = lvlEndCollisionY + lvlEndCollisionHeight; //coord for the bottom left limit of the collision box
        //This check is to see if the player is touching the floor, if they are the floorContact variable is set to true. otherwise its set to false
        //IS THE  PLAYER IN THE BOX
        if ((charRelativeWidth <= lvlEndCollisionRelativeWidth) && (charX >= lvlEndCollisionX) && (charRelativeHeight <= lvlEndCollisionRelativeHeight) && (charY >= lvlEndCollisionY)) //If the players coords are inside the interacion box's coords then an interacion can happen
        {
            insideLvlEnd = true;
        }
    }
    //This variable is used to tell if the player can interact with something, i.e if pressing e will do anything
    var isInsideLvlEnd;

    function isCollidingWithLvlEnd() {
        insideLvlEnd = false;
        isInsideLvlEnd = false;


        lvlEndBoxes.forEach(function (Collisions) {
            playerLvlEndCollision(Collisions.collisionBoxX, Collisions.collisionBoxY, Collisions.collisionBoxWidth, Collisions.collisionBoxHeight);
            if (insideLvlEnd) {
                whichLevel++;
                isInsideLvlEnd = insideLvlEnd;
                if (whichLevel == 4)
                {
                    gameWon = true;
                }
                else if (whichLevel == 3) {


                    nptBoxes.splice(0, nptBoxes.length);
                    interactionBoxes.length = 0;
                    lvlEndBoxes.length = 0;
                    killBoxes.length = 0;
                    lvlBackground.src = "assets/level3-background.png";
                    lvlForeground.src = "assets/level3-foreground.png";
                    charX = 189;
                    charY = -11;


                }

                else {
                    if (whichLevel == 2) {


                        nptBoxes.splice(0, nptBoxes.length);
                        interactionBoxes.length = 0;
                        lvlEndBoxes.length = 0;
                        killBoxes.length = 0;
                        lvlBackground.src = "assets/level2-background.png";
                        lvlForeground.src = "assets/level2-foreground.png";
                        charX = 10;
                        charY = 318;



                    }
                }

            }
        });
    }

    function level1Setup() {
        var roofTopFloor = new Collisions("rooftop", 1, 40, 276, 10, 77);

        var groundLevelFloor = new Collisions("groundlevel", 1, -75, 354, 10, 705);
        var ground2LevelFloor = new Collisions("ground2level", 1, 650, 354, 10, 160);

        //var bridgeFloor = new Collisions("bridge", 1, 600, 354, 10, 80);

        var eToolTipBox = new Collisions("e_tooltip", 3, 530, 310, 70, 70);

        var levelOneEnd = new Collisions("lvl1end", 4, 750, 300, 80, 80);

        var levelOneFloorGap = new Collisions("lvl1gap", 2, 617, 370, 47, 63);
    }
    //var levelOneEnd = new Collisions("lvl1end", 4, 750, 300, 80 ,80);

    function level2Setup() {
        var groundLevel2Floor = new Collisions("groundlevel2", 1, -75, 354, 10, 270);

        var levelTwoEnd = new Collisions("lvl2end", 4, 130, 390, 100, 100);

        //THIS SERIES OF IF/ELSE STATEMENTS CHECKS IF THE TRAIN IS CURRENTLY IN THE GAP
        if (((currentTrainFrame % 54) > 3) && ((currentTrainFrame % 54) < 9))
        {
            //if (killBoxes.length == 0)
            //{
                var trainGapKillBox = new Collisions("lvl2traingap", 2, 175, 370, 47, 63);
            //}
        }
        //else {killBoxes.length = 0;}
        else if (killBoxes.length != 0)
        {
            killBoxes.forEach(function (trainGapKillBox) {
                index = killBoxes.indexOf(trainGapKillBox);
                if (index > -1) {
                    killBoxes.splice(index, 1);
                }
            });
        }
        
        
    }
    

    function level3Setup() {
        var topTierFloor = new Collisions("topTierFloor", 1, -10, 115, 10, 350);
        var topTierFloorBackup = new Collisions("topTierFloorBackup", 1, -10, 119, 10, 350);
        var middleTierFloor = new Collisions("middleTierFloor", 1, 205, 181, 10, 580);
        var middleTierFloorBackup = new Collisions("middleTierFloor", 1, 205, 185, 10, 580);
        var groundLevel3Floor = new Collisions("groundLevel2Floor", 1, -10, 349, 10, 900);
        var groundLevel3FloorBackup = new Collisions("groundLevel2Floor", 1, -10, 353, 10, 900);
        var lvl3Button = new Collisions("lvl3button", 3, 360, 140, 42, 54);
        var lvl3EXIT = new Collisions("lvl3EXIT", 4, 735, 312, 88, 43);
        var lvl3Darts = new Collisions("lvl3Darts", 2, (bulletX - 15), 156, 30, 30);

        if (((currentTrainFrame % 54) > 3) && ((currentTrainFrame % 54) < 9))
        {
            //if (killBoxes.length == 0)
            //{
                var trainGapKillBox = new Collisions("lvl3traingap", 2, 161, 183, 57, 74);
            //}
        }
        //else {killBoxes.length = 0;}
        else if (killBoxes.length != 0)
        {
            killBoxes.forEach(function (trainGapKillBox) {
                var index = killBoxes.indexOf(trainGapKillBox);
                if (index > -1) {
                    killBoxes.splice(index, 1);
                }
            });
        }

        if (!deactivateSpikes)
        {
            var spikesKillBox = new Collisions("spikes", 2, 172, (spikesY - 5), 49, 58);
        }
        else if (killBoxes.length != 0)
        {
            killBoxes.forEach(function (spikesKillBox){
                var index = killBoxes.indexOf(spikesKillBox);
                if (index > -1) {
                    killBoxes.splice(index, 1);
                }
            });
        }
    }

    //SETTING UP THE SPIKES FOR THE 3RD LVL
    var spikesY = 344;
    var spikes = new Image();
    spikes.src = "assets/spikes.png";

    var deactivateSpikes = false; //Boolean that is changes when the button to move the spikes has been pressed
    function lvl3Spikes()
    {
        if (deactivateSpikes && (spikesY < 364))
        {
            spikesY++;
        }
        if (whichLevel == 3)
        {
            var retractableSpikes = context.drawImage(spikes, 175, spikesY);
        }
        
    }

    var bulletX = 785;
    var bullet = new Image();
    bullet.src = "assets/bullet.png";
    function lvl3Bullets()
    {
        if (whichLevel == 3)
        {
            if (bulletX > -5)
            {
                bulletX = bulletX - 6;
                var levelBullets = context.drawImage(bullet, bulletX, 170);
            }
            else {
                bulletX = 785;
            }
        }  
    }
    


    //========================================================================================
    //====================================START WORLD SETUP===================================
    //========================================================================================

    //Setting up the level one background
    var lvlBackground = new Image(); //Background image for lvl1
    lvlBackground.src = "assets/level1-background.png";
    /*
        This function holds the draw function of lvl1 background. It is called in the game loop. 
    */
    function drawBackground() {
        var bgDraw = context.drawImage(lvlBackground, 0, 0);
    }
    //Setting up the level one foreground
    var lvlForeground = new Image(); //Foreground image for lvl1
    lvlForeground.src = "assets/level1-forground.png";
    /*
        This function holds the draw function of lvl1 foreground. It is called in the game loop. 
    */
    function drawForeground() {
        var bgDraw = context.drawImage(lvlForeground, 0, 0);
    }
    var bridgeX = 550;
    var bridgeY = 353;
    var drawBridge = false;
    function animateBridge() {
        if (bridgeX < 615) {
            //isMoving = true;
            bridgeX = bridgeX + 1;
        }
        if (bridgeX >= 615) {
            var bridgeFloor = new Collisions("bridge", 1, 580, 354, 10, 150);

        }
        var bridge = new Image();
        bridge.src = "assets/bridge.png";
        context.drawImage(bridge, bridgeX, bridgeY);

    }
    //========================================================================================
    //====================================END WORLD SETUP=====================================
    //========================================================================================

    function whatKey(evt) {
        if (evt.keyCode == 69) {
            switch (evt.keyCode) {
                case 69:
                    if (canInteract) {
                        if (whichLevel == 1) {
                            drawBridge = true;
                        }
                        if (whichLevel == 3) {
                            deactivateSpikes = true;
                        }
                    }
                break;
            }
        }
    }

    //##############################################################################
    //                              START GAME LOOP
    //##############################################################################
    update();
}
