// Game objects
let backgroundImg;
let guideArrow = {
    x: 600,
    y: 520,
    targetX: 600,
    targetY: 520,
    alpha: 255,
    fadeIn: true,
    active: false,
    angle: 0,
    forBall2: false  // Flag to track which ball the arrow is for
};
let ball1 = {
    x: 600,
    y: 520,
    radius: 20,  // Reduced from 30 to 20
    image: null
};
let ball2 = {
    x: 700,
    y: 520,
    radius: 30,
    image: null
};
let ball1Selected = false;
let ball2Selected = false;
let ball1InitialPosition = { x: 600, y: 520 };
let ball2InitialPosition = { x: 700, y: 520 };
let measureButtonVisible = false;
let newMeasureButtonVisible = false; // New variable for the Measure button
let highlightAlpha = 0;
let isHighlighting = false;
let stepTitle = "Step 1: Click the Blue Ball to select and place it";
// Show initial step popup
if (typeof showStepModal === 'function') {
    showStepModal(stepTitle);
}
let distAValue = "";
let distBValue = "";

let ballReturning = false; // To track if the ball is returning to its initial position

// Ruler animation variables
let rulerAnimating = false;
let rulerReturning = false;
let rulerAnimationProgress = 0;
let rulerStartPos = { x: 0, y: 0 };
let rulerTargetPos = { x: 0, y: 0 };
let rulerStartAngle = 0;
let rulerTargetAngle = 0;
let rulerInitialPos = { x: 0, y: 0 };
let rulerInitialAngle = 0;
let rulerPauseTime = 0;
let isRulerPaused = false;
let showMeasured1Label = false;

function preload() {
    console.log('Preload started');
    
    // Load images
    backgroundImg = loadImage('./assets/background.png', 
        () => console.log('Background loaded successfully'),
        () => console.error('Error loading background')
    );
    
    // Load ball1 image
    loadImage('./assets/ball1.png',
        (img) => {
            console.log('Ball1 loaded successfully');
            ball1.image = img;
        },
        () => console.error('Error loading ball1')
    );

    // Load ball2 image
    loadImage('./assets/ball2.png',
        (img) => {
            console.log('Ball2 loaded successfully');
            ball2.image = img;
        },
        () => console.error('Error loading ball2')
    );

    funnel = new Funnel(350, 200, 100, 200);
    funnel.loadImage('./assets/female_taper.png');
    
    ruler = new Ruler(50, 400, 300, 90);
    ruler.loadImage('./assets/ruler.png');
}

function setup() {
    console.log('Setup started');
    createCanvas(900, 600);
    console.log('Canvas created successfully');

    // Place ruler
    ruler.x = 50; // Placed inside the screen
    ruler.y = height - ruler.height - 30; // Adjusted position to fit vertically
    rulerInitialPos = { x: ruler.x, y: ruler.y };
    rulerInitialAngle = ruler.angle;

    // Initialize guide arrow for ball1
    guideArrow.x = ball1.x - 50;
    guideArrow.y = ball1.y - 50;
    guideArrow.targetX = ball1.x;
    guideArrow.targetY = ball1.y;
    guideArrow.active = true;
    guideArrow.forBall2 = false;
}

function drawArrow(x, y, targetX, targetY, alpha) {
    push();
    stroke(255, 165, 0, alpha); // Orange color with alpha
    strokeWeight(3);
    fill(255, 165, 0, alpha);
    
    // Calculate angle for the arrow
    let angle = atan2(targetY - y, targetX - x);
    
    // Draw the line
    line(x, y, targetX, targetY);
    
    // Draw the arrowhead
    push();
    translate(targetX, targetY);
    rotate(angle);
    triangle(0, 0, -15, -5, -15, 5);
    pop();
    
    pop();
}

function updateArrow() {
    if (guideArrow.active) {
        // Update arrow alpha for pulsing effect
        if (guideArrow.fadeIn) {
            guideArrow.alpha += 10;
            if (guideArrow.alpha >= 255) {
                guideArrow.fadeIn = false;
            }
        } else {
            guideArrow.alpha -= 10;
            if (guideArrow.alpha <= 100) {
                guideArrow.fadeIn = true;
            }
        }
    }
}

function draw() {
    // Clear the canvas first
    clear();
    
    // Draw background
    if (backgroundImg) {
        image(backgroundImg, 0, height - backgroundImg.height, width, backgroundImg.height);
    } else {
        background(255);
    }
    
    // Show the second arrow when either ball is being highlighted
    if (isHighlighting && !animating) {
        if (ball1Selected) {
            // Update guide arrow to point to the target position for ball1
            guideArrow.x = 400 - 50;  // Offset the arrow position slightly
            guideArrow.y = 480 - 50;
            guideArrow.targetX = 400;
            guideArrow.targetY = 480;
            guideArrow.active = true;
            guideArrow.forBall2 = false;
        } else if (ball2Selected) {
            // Update guide arrow to point to the target position for ball2
            guideArrow.x = 400 - 50;  // Offset the arrow position slightly
            guideArrow.y = 424 - 50;  // Updated Y coordinate for ball2
            guideArrow.targetX = 400;
            guideArrow.targetY = 424;  // Updated Y coordinate for ball2
            guideArrow.active = true;
            guideArrow.forBall2 = true;
        }
    } else if (!isHighlighting && !animating) {
        if (!ball1Selected && !ball2Selected) {
            // Show arrow for next ball to be selected
            if (!guideArrow.forBall2 && distAValue) {
                // Switch to pointing at ball2 after ball1 is done
                guideArrow.x = ball2.x - 50;
                guideArrow.y = ball2.y - 50;
                guideArrow.targetX = ball2.x;
                guideArrow.targetY = ball2.y;
                guideArrow.active = true;
                guideArrow.forBall2 = true;
            }
        } else {
            guideArrow.active = false;
        }
    }

    // Draw title and step label with decorative elements
    // Draw glow effect
    push();
    textSize(24);
    textAlign(CENTER, TOP);
    drawingContext.shadowBlur = 10;
    drawingContext.shadowColor = 'rgba(255, 255, 255, 0.5)';
    
    // Draw title with gradient
    fill(255);
    text('Virtual Lab', width / 2, 10);
    
    // Draw decorative underline
    stroke(255, 255, 255, 150);
    strokeWeight(2);
    line(width/2 - 60, 35, width/2 + 60, 35);
    
    // Draw step text with background
    textSize(18);
    noStroke();
    
    // Draw semi-transparent background for step text
    fill(255, 255, 255, 0.1);
    rect(width/2 - 200, 38, 400, 30, 15);
    
    // Draw step text
    fill(255);
    drawingContext.shadowBlur = 5;
    text(stepTitle, width / 2, 40);
    pop();

    // Draw side texts in a decorated box
    push();
    let boxWidth = 180;
    let boxHeight = 100;
    let boxX = width - boxWidth - 20;
    let boxY = (height / 2) - (boxHeight / 2);

    // Draw the box
    fill(240, 240, 240, 220); // semi-transparent light grey
    stroke(150);
    strokeWeight(2);
    rect(boxX, boxY, boxWidth, boxHeight, 10); // rounded corners

    // Draw the text inside the box
    fill(0);
    noStroke();
    textSize(16);
    textAlign(LEFT, TOP);
    
    let distAValNum = distAValue ? parseFloat(distAValue) : 0;
    let distBValNum = distBValue ? parseFloat(distBValue) : 0;
    let diff = (distAValNum > 0 && distBValNum > 0) ? (distAValNum - distBValNum).toFixed(2) + 'mm' : '';

    text(`Dist A: ${distAValue}`, boxX + 15, boxY + 20);
    text(`Dist B: ${distBValue}`, boxX + 15, boxY + 45);
    text(`DistA - DistB: ${diff}`, boxX + 15, boxY + 70);
    pop();


    // Adjust funnel position to be at the bottom
    funnel.y = height - funnel.height - 40;

    // Draw funnel
    funnel.display();

    // Draw ruler
    ruler.display();

    if (showMeasured1Label) {
        textSize(16);
        textAlign(CENTER, CENTER);
        fill(0);
        text("measured1", ruler.x, ruler.y - 20);
    }

    // Handle ball animation
    if (animating) {
        animationProgress += 0.05;
        if (animationProgress >= 1) {
            animating = false;
            if (ball1Selected) {
                ball1.x = targetPos.x;
                ball1.y = targetPos.y;
            } else if (ball2Selected) {
                ball2.x = targetPos.x;
                ball2.y = targetPos.y;
            }

            if (!ballReturning) {
                // Show measure button after animation completes
                measureButtonVisible = true;
                if (ball1Selected) {
                    stepTitle = "Step 2: Press Place Ruler button to place ruler for measurement";
                    if (typeof showStepModal === 'function') {
                        showStepModal(stepTitle);
                    }
                } else if (ball2Selected) {
                    stepTitle = "Step 4: Measure height for second ball";
                    if (typeof showStepModal === 'function') {
                        showStepModal(stepTitle);
                    }
                }
            } else {
                ballReturning = false; // Reset the flag
                if (ball1Selected) {
                    ball1Selected = false; // Deselect after returning
                } else if (ball2Selected) {
                    ball2Selected = false; // Deselect after returning
                }
            }

            isHighlighting = false;
            waitingForSecondClick = false;
        } else {
            // Easing function for smooth motion
            let easeProgress = 1 - Math.pow(1 - animationProgress, 4);
            if (ball1Selected) {
                ball1.x = lerp(startPos.x, targetPos.x, easeProgress);
                ball1.y = lerp(startPos.y, targetPos.y, easeProgress);
            } else if (ball2Selected) {
                ball2.x = lerp(startPos.x, targetPos.x, easeProgress);
                ball2.y = lerp(startPos.y, targetPos.y, easeProgress);
            }
        }
    }

    // Handle ruler animation
    if (rulerAnimating || rulerReturning) {
        rulerAnimationProgress += 0.05;
        if (rulerAnimationProgress >= 1) {
            rulerAnimationProgress = 0;
            if (rulerAnimating) {
                rulerAnimating = false;
                ruler.x = rulerTargetPos.x;
                ruler.y = rulerTargetPos.y;
                ruler.angle = rulerTargetAngle;
                
                // Stop the animation here, don't return automatically
                measureButtonVisible = false;
                newMeasureButtonVisible = true;

            } else if (rulerReturning) {
                rulerReturning = false;
                ruler.x = rulerInitialPos.x;
                ruler.y = rulerInitialPos.y;
                ruler.angle = rulerInitialAngle;
                
                newMeasureButtonVisible = false; // Hide measure button after return

                if (ball1Selected) {
                    stepTitle = "Step 3: Place the second ball by clicking it";
                    if (typeof showStepModal === 'function') {
                        showStepModal(stepTitle);
                    }
                    ball1Selected = false; // Deselect
                } else if (ball2Selected) {
                    stepTitle = "Experiment Complete!";
                    if (typeof showExperimentComplete === 'function') {
                        showExperimentComplete();
                    }
                    ball2Selected = false; // Deselect
                }
            }
        } else {
            let easeProgress = 1 - Math.pow(1 - rulerAnimationProgress, 4);
            ruler.x = lerp(rulerStartPos.x, rulerTargetPos.x, easeProgress);
            ruler.y = lerp(rulerStartPos.y, rulerTargetPos.y, easeProgress);
            ruler.angle = lerp(rulerStartAngle, rulerTargetAngle, easeProgress);
        }
    }

    // Draw ball1 with highlight effect if selected
    if (ball1.image) {
        push();
        imageMode(CENTER);
        
        if (isHighlighting) {
            // Draw highlight effect with pulsing animation
            highlightAlpha = sin(frameCount * 0.1) * 127 + 127;
            push();
            noFill();
            stroke(255, 255, 0, highlightAlpha);
            strokeWeight(3);
            let selectedBall = ball1Selected ? ball1 : ball2;
            circle(selectedBall.x, selectedBall.y, selectedBall.radius * 2.2);
            
            // Add a text hint if waiting for second click
            if (waitingForSecondClick && !animating) {
                textSize(14);
                textAlign(CENTER);
                fill(0);
                text("Click where to place the ball", selectedBall.x, selectedBall.y - selectedBall.radius - 20);
            }
            pop();
        }
        
        // Draw the ball only once
        image(ball1.image, ball1.x, ball1.y, ball1.radius * 2, ball1.radius * 2);
        pop();
    }

    // Draw ball2
    if (ball2.image) {
        push();
        imageMode(CENTER);
        image(ball2.image, ball2.x, ball2.y, ball2.radius * 2, ball2.radius * 2);
        pop();
    } else {
        circle(ball2.x, ball2.y, ball2.radius * 2);
    }

    // Show measure button if animation is complete
    if (measureButtonVisible && !animating) {
        // Draw button with a nice style
        push();
        rectMode(CENTER);
        // Button background
        fill(220);
        stroke(180);
        strokeWeight(2);
        rect(width / 2, height - 35, 100, 30, 5);
        // Button text
        fill(0);
        noStroke();
        textSize(16);
        textAlign(CENTER, CENTER);
        text('Place Ruler', width / 2, height - 35);
        pop();
    }

    // Show the new Measure button if the ruler is in position
    if (newMeasureButtonVisible) {
        push();
        rectMode(CENTER);
        fill(220);
        stroke(180);
        strokeWeight(2);
        rect(width / 2, height - 35, 100, 30, 5);
        fill(0);
        noStroke();
        textSize(16);
        textAlign(CENTER, CENTER);
        text('Measure', width / 2, height - 35);
        pop();
    }
    
    // Draw the guide arrow last so it appears on top of everything
    updateArrow();
    if (guideArrow.active) {
        drawArrow(guideArrow.x, guideArrow.y, guideArrow.targetX, guideArrow.targetY, guideArrow.alpha);
    }
}

let waitingForSecondClick = false;

// Animation variables
let animating = false;
let animationProgress = 0;
let startPos = { x: 0, y: 0 };
let targetPos = { x: 0, y: 0 };

function mousePressed() {
    // Don't allow new clicks while animation is running
    if (animating || rulerAnimating || rulerReturning) return;

    // Handle arrow behavior for both balls
    if (guideArrow.active) {
        if (!guideArrow.forBall2 && !ball1Selected) {
            // Check for ball1 click
            let d = dist(mouseX, mouseY, ball1.x, ball1.y);
            if (d < ball1.radius) {
                guideArrow.active = false;
            }
        } else if (guideArrow.forBall2 && !ball2Selected) {
            // Check for ball2 click
            let d = dist(mouseX, mouseY, ball2.x, ball2.y);
            if (d < ball2.radius) {
                guideArrow.active = false;
            }
        }
    }

    // Check if the new Measure button is clicked
    if (newMeasureButtonVisible) {
        let buttonX = width / 2;
        let buttonY = height - 35;
        if (mouseX > buttonX - 50 && mouseX < buttonX + 50 && mouseY > buttonY - 15 && mouseY < buttonY + 15) {
            // Set measurement value based on which ball was selected
            if (ball1Selected) {
                distAValue = "15mm";
            } else if (ball2Selected) {
                distBValue = "10mm";
            }
            
            newMeasureButtonVisible = false; // Hide the measure button
            
            // Now, make the ruler return
            rulerReturning = true;
            rulerAnimationProgress = 0;
            rulerStartPos = { x: ruler.x, y: ruler.y };
            rulerStartAngle = ruler.angle;
            rulerTargetPos = { x: rulerInitialPos.x, y: rulerInitialPos.y };
            rulerTargetAngle = rulerInitialAngle;
            return;
        }
    }

    // Check if the Place Ruler button is clicked
    if (measureButtonVisible && !rulerAnimating) {
        let buttonX = width / 2;
        let buttonY = height - 35;
        if (mouseX > buttonX - 50 && mouseX < buttonX + 50 && mouseY > buttonY - 15 && mouseY < buttonY + 15) {
            // Start ruler animation
            rulerAnimating = true;
            rulerAnimationProgress = 0;
            rulerStartPos = { x: ruler.x, y: ruler.y };
            rulerStartAngle = ruler.angle;
            
            let currentBall = ball1Selected ? ball1 : ball2;
            rulerTargetPos = { 
                x: currentBall.x - 149,
                y: currentBall.y - 203
            };
            rulerTargetAngle = ruler.angle - HALF_PI; // Rotate 90 degrees CCW

            // Hide the Place Ruler button
            measureButtonVisible = false;
            return;
        }
    }

    // First click - check if clicked on a ball
    if (!waitingForSecondClick) {
        let d1 = dist(mouseX, mouseY, ball1.x, ball1.y);
        if (d1 < ball1.radius && stepTitle.includes("Step 1")) {
            ball1Selected = true;
            ball2Selected = false;
            isHighlighting = true;
            waitingForSecondClick = true;
            console.log('Ball1 selected, waiting for destination click');
            return;
        }

        let d2 = dist(mouseX, mouseY, ball2.x, ball2.y);
        if (d2 < ball2.radius && stepTitle.includes("Step 3")) {
            ball1Selected = false;
            ball2Selected = true;
            isHighlighting = true;
            waitingForSecondClick = true;
            console.log('Ball2 selected, waiting for destination click');
            return;
        }
    }
    // Second click - check if it's in the valid range
    else {
        let funnelCenterX = funnel.x + funnel.width / 2;
        if (
            mouseX > funnelCenterX - 20 &&
            mouseX < funnelCenterX + 20 &&
            mouseY > funnel.y &&
            mouseY < funnel.y + funnel.height
        ) {
            // Set up the animation to place ball exactly at funnel center X
            let currentBall = ball1Selected ? ball1 : ball2;
            startPos = { x: currentBall.x, y: currentBall.y };
            targetPos = { x: funnelCenterX, y: mouseY }; // Use exact center X
            animating = true;
            animationProgress = 0;
            console.log('Ball placed correctly');
            console.log(`New position for ${ball1Selected ? 'ball1' : 'ball2'}: (${targetPos.x}, ${targetPos.y})`);
        } else {
            // Return ball to its initial position if placed incorrectly
            if (ball1Selected) {
                ball1.x = ball1InitialPosition.x;
                ball1.y = ball1InitialPosition.y;
            } else if (ball2Selected) {
                ball2.x = ball2InitialPosition.x;
                ball2.y = ball2InitialPosition.y;
            }
            console.log('Invalid position, ball returned');
        }
        
        // Reset states
        isHighlighting = false;
        waitingForSecondClick = false;
    }
}

function mouseReleased() {
    // No need for mouseReleased functionality anymore
}
