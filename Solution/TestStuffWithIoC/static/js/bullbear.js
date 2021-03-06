﻿var BullBearGame = function (canvasId, gameInfoId) {
    //Private jQuery objects
    var $canvas = $("#" + canvasId)[0];
    var $gameInfo = $('#' + gameInfoId);

    window.requestAnimFrame = (function () {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();

    // Private constants and initial variable values
    var CONST_UP = "up";
    var CONST_DOWN = "down";
    var canvasInitiated = false;
    var gameLoop;
    var ctx; // context
    var drawPositionX = 0;
    var drawPositionY = 0;
    var allowedKeyStrokesList = [38, 40]; //Up/down arrows
    var canvasWidth = 800;
    var canvasHeight = 480;
    var blackImageForPlayer = new Image(); // A piece of black image when erasing player
    var blackImageForMarker = new Image(); // A piece of black image when erasing marker
    var initialBackground = new Image(); // storage for new background piece
    var oldBack = new Image(); // storage for old background piece
    var player = new Image(); // player
    var playerCopy = new Image();
    var playerWidthHeight = 30;
    var playerX = 0; // current player position X
    var playerY = 0; // current player position Y
    var oldPlayerX = 0; // old player position Y
    var oldPlayerY = 0; // old player position Y
    var amountOfTotalMarkers = 10; //Use even value, not an odd value
    var markersArray = [];
    var markerWidthHeight = 20;
    var bullHits = 0;
    var initialLives = 3; //Start with 3 lives
    var livesLeft = initialLives;

    //Index curve
    var indexPoints = [];
    var currentIndexPoint = 1;
    var indexSpeed = 2;
    var indexTargetX = 0;
    var indexTargetY = 0;
    var indexX = 0;
    var indexY = 0;

    //Custom objects
	var Marker = function(x, y, type, fillStyle) {
		this.x = x;
		this.y = y;
		this.prevX = -1;
		this.prevY = -1;
		this.fillStyle = fillStyle;
		this.type = type;
	};

    //Public properties
    var self = this;
    this.movingMarkerStepValue = 3; //How much pixels the markers should move to the left each time

    //Private methods
    var initGame = function () {
        if (canvasInitiated) {
            ctx.clearRect(0, 0, canvasWidth, canvasHeight); //Clear text and paint black again
            ctx.fillStyle = "black";
            ctx.rect(0, 0, canvasWidth, canvasHeight);
            ctx.fill();

            //Make one marker of each type
            addOneMarker(CONST_UP);
            addOneMarker(CONST_DOWN);
            initIndexCurve();

            drawMarkers();
            drawPlayer();
            drawIndexCurve();

            gameLoop = setInterval(doGameLoop, 16);

            // Add keyboard listener.
            window.addEventListener('keydown', whatKey, true);
        }
    };

    var initIndexCurve = function () {
        // Add some indexpoints
        for (var i = 0; i < 50; i++) {
            indexPoints.push({
                x: i * (canvasWidth / 50),
                y: (canvasHeight / 2) + Math.sin(i) * 10
            });
        }
        // Set the initial target and starting point
        indexTargetX = indexPoints[1].x;
        indexTargetY = indexPoints[1].y;
        indexX = indexPoints[0].x;
        indexY = indexPoints[0].y;
    };

    var getRandomValue = function (limit) {
        return Math.floor((Math.random() * limit) + 1);
    };

    var addOneMarker = function (markerType) {
        if (markerType != CONST_UP) markerType = CONST_DOWN; //Make sure to use the constant values
        var fillStyle = markerType == CONST_UP ? "rgb(51, 190, 0)" : "rgb(255, 0, 0)";
        var decreasePositionValue = 0; //To spread markers a bit in to the left of the game board
        decreasePositionValue = getRandomValue(canvasWidth);
        markersArray.push(new Marker(canvasWidth - decreasePositionValue, getRandomValue(canvasHeight), markerType, fillStyle));
    };

    // Paint a random starfield.
    var drawMarkers = function () {
        // Draw 25 markers.
        $.each(markersArray, function (index, markerObject) {
            //Make previous position of marker black again
            if (markerObject.prevX != -1 && markerObject.prevY != -1) {
                ctx.putImageData(blackImageForMarker, markerObject.prevX, markerObject.prevY);
            }

            // Set the markers color
            ctx.fillStyle = markerObject.fillStyle;

            // Draw an individual marker.
            ctx.beginPath();
            var halfMarkerRatio = markerWidthHeight / 2;
            if (markerObject.type == CONST_UP) {
                //Body of the arrow
                ctx.rect(markerObject.x + halfMarkerRatio / 2, markerObject.y + halfMarkerRatio, halfMarkerRatio, halfMarkerRatio);
                //Top of the arrow
                drawPositionX = markerObject.x + halfMarkerRatio;
                drawPositionY = markerObject.y;
                ctx.moveTo(drawPositionX, drawPositionY);
                drawPositionX = drawPositionX - halfMarkerRatio;
                drawPositionY = drawPositionY + halfMarkerRatio;
                ctx.lineTo(drawPositionX, drawPositionY);
                drawPositionX = drawPositionX + markerWidthHeight;
                ctx.lineTo(drawPositionX, drawPositionY);
            } else {
                //Body of the arrow
                ctx.rect(markerObject.x + halfMarkerRatio / 2, markerObject.y, halfMarkerRatio, halfMarkerRatio);
                //Bottom of the arrow
                drawPositionX = markerObject.x;
                drawPositionY = markerObject.y + halfMarkerRatio;
                ctx.moveTo(drawPositionX, drawPositionY);
                drawPositionX = drawPositionX + halfMarkerRatio;
                drawPositionY = drawPositionY + halfMarkerRatio;
                ctx.lineTo(drawPositionX, drawPositionY);
                drawPositionX = drawPositionX + halfMarkerRatio;
                drawPositionY = drawPositionY - halfMarkerRatio;
                ctx.lineTo(drawPositionX, drawPositionY);
            }
            ctx.closePath();
            ctx.fill();
        });
    };

    var moveMarkers = function () {
        //Move all markers one step to the left on the game board
        $.each(markersArray, function (index, markerObject) {
            markersArray[index].prevX = markerObject.x;
            markersArray[index].prevY = markerObject.y;
            markersArray[index].x = markersArray[index].x - self.movingMarkerStepValue;
            //If moving out of game board, RE-USE marker and start it from right side again with new y value
            if (markersArray[index].x <= 0) {
                markersArray[index].x = canvasWidth;
                markersArray[index].y = getRandomValue(canvasHeight); //Set a new random y value on it
            }
        });

        if (markersArray.length < amountOfTotalMarkers) {
            //Make one marker of each type
            addOneMarker(CONST_UP);
            addOneMarker(CONST_DOWN);
        }
        drawMarkers();
    };

    var updateLives = function()
    {
        ctx.font = "12px Verdana";
        ctx.fillStyle = "#FFD6D6";
        ctx.fillText("LIVES LEFT:", canvasWidth - 80 - initialLives * playerWidthHeight, canvasHeight - 8);
        
        //Clear lives info
        for (var z = 1; z <= initialLives; z++) {
            ctx.putImageData(blackImageForPlayer, canvasWidth - z * playerWidthHeight, canvasHeight - playerWidthHeight);
        }

        //Update lives info
        if (livesLeft > 0) {
            for (z = 1; z <= livesLeft; z++) {
                ctx.putImageData(playerCopy, canvasWidth - z * playerWidthHeight, canvasHeight - playerWidthHeight);
            }
        } else {
            clearInterval(gameLoop);
            $gameInfo.append('<br /><span class="strong-message">GAME OVER!</span>');
        }
    };

    var drawPlayer = function () {

        //Draw Bull
        //ctx.beginPath();
        //ctx.rect(0, 0, 30, 30);
        //ctx.closePath();
        //ctx.fillStyle = "grey";
        //ctx.fill();

        ctx.beginPath();
        ctx.moveTo(0, 15);
        ctx.bezierCurveTo(0, 0, 30, 0, 30, 15);
        ctx.moveTo(0, 15);
        ctx.bezierCurveTo(0, 30, 30, 30, 30, 15);
        ctx.closePath();
        ctx.fillStyle = "rgb(222, 103, 0)";
        ctx.fill();

        //First horn
        ctx.beginPath();
        ctx.strokeStyle = "#734B06";
        ctx.lineWidth = 2;
        var hornStartX = playerWidthHeight / 2 + (playerWidthHeight / 4);
        var hornStartY = playerWidthHeight / 2 + 3;
        var hornCurveX = hornStartX;
        var hornCurveY = hornStartY + 3;
        var hornEndX = hornStartX + 6;
        var hornEndY = hornStartY + 6;
        ctx.moveTo(hornStartX, hornStartY);
        ctx.quadraticCurveTo(hornCurveX, hornCurveY, hornEndX, hornEndY);
        ctx.stroke();

        //Second horn
        ctx.beginPath();
        hornStartX = playerWidthHeight / 2 + (playerWidthHeight / 4);
        hornStartY = playerWidthHeight / 2 - 3;
        hornCurveX = hornStartX;
        hornCurveY = hornStartY - 3;
        hornEndX = hornStartX + 6;
        hornEndY = hornStartY - 6;
        ctx.moveTo(hornStartX, hornStartY);
        ctx.quadraticCurveTo(hornCurveX, hornCurveY, hornEndX, hornEndY);
        ctx.stroke();

        //Eye 1
        ctx.beginPath();
        ctx.strokeStyle = "#FF0019";
        ctx.lineWidth = 1;
        var eyeCenterX = playerWidthHeight - 7;
        var eyeCenterY = 11;
        ctx.arc(eyeCenterX, eyeCenterY, 1, 0, 2 * Math.PI);
        ctx.stroke();

        //Eye 2
        ctx.beginPath();
        eyeCenterX = playerWidthHeight - 7;
        eyeCenterY = 18;
        ctx.arc(eyeCenterX, eyeCenterY, 1, 0, 2 * Math.PI);
        ctx.stroke();

        // Save player data.
        player = ctx.getImageData(0, 0, playerWidthHeight, playerWidthHeight);
        playerCopy = ctx.getImageData(0, 0, playerWidthHeight, playerWidthHeight);

        // Erase it for now.
        ctx.putImageData(blackImageForPlayer, 0, 0); //oldBack

    };

    var doGameLoop = function () {
        moveMarkers();

        // Put old background down to erase player.
        ctx.putImageData(blackImageForPlayer, oldPlayerX, oldPlayerY);

        // Put player in new position.
        ctx.putImageData(player, playerX, playerY);
        var bullMarkerHits = $.grep(markersArray, function (obj, markersArrayIndex) {
            var returnValue = obj.type == CONST_UP && isHit(obj, playerX, playerY);
            if (returnValue) {
                markersArray.splice(markersArrayIndex, 1); //Remove this marker completely from markersArray as it have been "eaten"
                addOneMarker(obj.type); //Add a new one of same type
                ctx.putImageData(blackImageForMarker, obj.x, obj.y); //Make position black of where the marker was
                flashHit(obj.type);
            }
            return returnValue;
        });

        var bullMarkerLoss = $.grep(markersArray, function (obj, markersArrayIndex) {
            var returnValue = obj.type == CONST_DOWN && isHit(obj, playerX, playerY);
            if (returnValue) {
                livesLeft--; //Decrease amount of lives left!
                markersArray.splice(markersArrayIndex, 1); //Remove this marker completely from markersArray as it have been "eaten"
                addOneMarker(obj.type); //Add a new one of same type
                ctx.putImageData(blackImageForMarker, obj.x, obj.y); //Make position black of where the marker was
                flashHit(obj.type);
            }
            return returnValue;
        });
        bullHits += bullMarkerHits.length - bullMarkerLoss.length;
        $gameInfo.html('<span class="strong-message">Total hits: ' + bullHits + '!</span>');

        updateLives();
    };

    var isHit = function (markerObj, playerXpos, playerYpos) {
        var topLeftMarkerHit = markerObj.x >= playerXpos && markerObj.x <= playerXpos + playerWidthHeight && markerObj.y >= playerYpos && markerObj.y <= playerYpos + playerWidthHeight;
        var bottomLeftMarkerHit = markerObj.x >= playerXpos && markerObj.x <= playerXpos + playerWidthHeight && markerObj.y + markerWidthHeight >= playerYpos && markerObj.y + markerWidthHeight <= playerYpos + playerWidthHeight;
        return topLeftMarkerHit || bottomLeftMarkerHit;
    };

    var flashHit = function (markerType) {
        var cssClass = markerType == CONST_UP ? 'bull-flash' : 'bear-flash';
        $('#main-body').addClass(cssClass).delay(200).queue(function (next) {
            $(this).removeClass(cssClass);
            next();
        });
    };

    // Get key press.
    var whatKey = function (evt) {
        if (allowedKeyStrokesList.indexOf(evt.keyCode) >= 0) {
            // Flag to put variables initialBackground if we hit an edge of the board.
            var flag = 0;

            // Get where the player was before key process.
            oldPlayerX = playerX;
            oldPlayerY = playerY;
            oldBack = initialBackground;

            switch (evt.keyCode) {
                //Down arrow
                case 40:
                    playerY = playerY + playerWidthHeight;
                    if (playerY > canvasHeight - playerWidthHeight) {
                        // If at edge, reset player position and set flag.
                        playerY = canvasHeight - playerWidthHeight;
                        flag = 1;
                    }
                    break;

                    //Up arrow 
                case 38:
                    playerY = playerY - playerWidthHeight;
                    if (playerY < 0) {
                        // If at edge, reset player position and set flag.
                        playerY = 0;
                        flag = 1;
                    }
                    break;

            }

            // If flag is set, the player did not move.
            // Put everything back the way it was.
            if (flag) {
                playerX = oldPlayerX;
                playerY = oldPlayerY;
                initialBackground = oldBack;
            } else {
                // Otherwise, get background where the player will go
                // So you can redraw background when the player
                // moves again.
                initialBackground = ctx.getImageData(playerX, playerY, playerWidthHeight, playerWidthHeight);
            }
        }
    };

    var drawIndexCurve = function () {
        var tx = indexTargetX - indexX,
            ty = indexTargetY - indexY,
            dist = Math.sqrt(tx * tx + ty * ty),
            velX = (tx / dist) * indexSpeed,
            velY = (ty / dist) * indexSpeed;

        indexX += velX;
        indexY += velY;

        if (dist < 1) {
            currentIndexPoint++;

            if (currentIndexPoint >= indexPoints.length) {
                currentIndexPoint = 1;
                indexX = indexPoints[0].x;
                indexY = indexPoints[0].y;
            }

            indexTargetX = indexPoints[currentIndexPoint].x;
            indexTargetY = indexPoints[currentIndexPoint].y;
        }

        //ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx.beginPath();
        ctx.moveTo(indexPoints[0].x, indexPoints[0].y);
        ctx.lineWidth = 0.1;
        ctx.strokeStyle = '#FFEA00';
        //ctx.fillStyle = '#2068A8';

        for (var p = 0; p < currentIndexPoint - 1; p++) {
            ctx.lineTo(indexPoints[p].x, indexPoints[p].y);
        }
        ctx.lineTo(indexX, indexY);
        ctx.stroke();
        //requestAnimFrame(drawIndexCurve);
    };

    //To be used as BullBearGame.onSpeedChange = delegate();
    this.onSpeedChange = function () {
    };

    //Public methods
    this.initCanvas = function () {
        $canvas.width = canvasWidth;
        $canvas.height = canvasHeight;
        if ($canvas.getContext) {
            canvasInitiated = true;
            // Specify 2d canvas type.
            ctx = $canvas.getContext("2d");

            // Paint it black.
            ctx.fillStyle = "black";
            ctx.rect(0, 0, canvasWidth, canvasHeight);
            ctx.fill();

            // Save the initial background.
            blackImageForPlayer = ctx.getImageData(0, 0, playerWidthHeight, playerWidthHeight);
            blackImageForMarker = ctx.getImageData(0, 0, markerWidthHeight, markerWidthHeight);
            oldBack = blackImageForPlayer;
            initialBackground = blackImageForPlayer;

            //
            ctx.font = "40px Arial";
            ctx.fillStyle = "#a7100c";
            ctx.fillText("BULL & BEAR", (canvasWidth / 2) - (canvasWidth / 4), (canvasHeight / 2) - (canvasHeight / 5));
            ctx.font = "20px Arial";
            ctx.fillStyle = "#cccccc";
            ctx.fillText("by", (canvasWidth / 2) - (canvasWidth / 9), (canvasHeight / 2) - (canvasHeight / 10));
            ctx.fillText("Per Lundkvist ©", (canvasWidth / 2) - (canvasWidth / 6) - 10, (canvasHeight / 2) - (canvasHeight / 20));

            setTimeout(initGame, 5000);
            //Increase game speed gradually
            setInterval(function () {
                self.movingMarkerStepValue++;
                self.onSpeedChange();
            }, 30000);
        }
    };

};