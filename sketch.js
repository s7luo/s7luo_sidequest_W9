let levelData;      
let currentLevel = 0; 
let tileSize = 50;  
let player = { r: 1, c: 1, vr: 1, vc: 1 }; 
let particles = []; 
let currentGrid = []; 

let gameState = "START"; 
let isDebugMode = false;
let noClip = false; 

function preload() {
  levelData = loadJSON('levels.json');
}

function setup() {
  createCanvas(400, 300);
  noStroke();
  loadLevel(); 
  resetPlayer();
}

function draw() {
  // --- UPDATED: Added the WIN state check ---
  if (gameState === "START") {
    drawStartScreen();
  } else if (gameState === "PLAYING") {
    drawGame();
  } else if (gameState === "GAMEOVER") {
    drawGameOverScreen(); 
  } else if (gameState === "WIN") {
    drawWinScreen(); 
  }
}

function drawStartScreen() {
  background(40, 44, 52); 
  textAlign(CENTER, CENTER);
  
  fill(255, 215, 0); 
  textSize(36);
  text("JSON Maze Escape", width / 2, height / 2 - 30);
  
  fill(255);
  textSize(16);
  text("Press ENTER to Start", width / 2, height / 2 + 20);
  
  fill(100, 255, 100); 
  textSize(12);
  text("Use Arrow Keys to Move", width / 2, height / 2 + 60);
}

function loadLevel() {
  let blueprint = levelData.levels[currentLevel].grid;
  currentGrid = []; 
  
  for (let r = 0; r < blueprint.length; r++) {
    let newRow = [];
    for (let c = 0; c < blueprint[r].length; c++) {
      let type = blueprint[r][c];
      
      if (type === 0 && random(1) < 0.20) {
        newRow.push(1); 
      } else {
        newRow.push(type); 
      }
    }
    currentGrid.push(newRow);
  }
}

function drawGame() {
  background(220);

  for (let r = 0; r < currentGrid.length; r++) {
    for (let c = 0; c < currentGrid[r].length; c++) {
      let type = currentGrid[r][c];
      let x = c * tileSize;
      let y = r * tileSize;

      if (type === 1) fill(50);             
      else if (type === 2) fill(100, 255, 100); 
      else if (type === 3) fill(255, 215, 0);   
      else fill(255);                       

      rect(x, y, tileSize, tileSize);
    }
  }

  player.vr = lerp(player.vr, player.r, 0.3);
  player.vc = lerp(player.vc, player.c, 0.3);

  fill(0);
  rect(player.vc * tileSize + 10, player.vr * tileSize + 10, tileSize - 20, tileSize - 20);

  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.x += p.vx; 
    p.y += p.vy; 
    p.alpha -= 10; 

    fill(p.color[0], p.color[1], p.color[2], p.alpha);
    rect(p.x, p.y, p.size, p.size);

    if (p.alpha <= 0) particles.splice(i, 1);
  }

  fill(50);
  textSize(14); 
  textAlign(CENTER, CENTER);
  text("Use Arrow Keys to Move. Reach Gold to Win!", width / 2, height - 35);
  
  textSize(12); 
  fill(100); 
  text("Press 'D' to toggle Developer Debug Menu", width / 2, height - 15);

  if (isDebugMode) {
    drawDebugScreen();
  }
}

function drawGameOverScreen() {
  background(150, 50, 50); 
  textAlign(CENTER, CENTER);
  
  fill(255); 
  textSize(32);
  text("STATE FORCED: GAMEOVER", width / 2, height / 2 - 20);
  
  textSize(16);
  text("Press ENTER to Restart", width / 2, height / 2 + 30);
}

// --- NEW: The Victory Screen ---
function drawWinScreen() {
  background(46, 204, 113); // A nice victory green color
  textAlign(CENTER, CENTER);
  
  fill(255); 
  textSize(36);
  text("YOU ESCAPED!", width / 2, height / 2 - 20);
  
  textSize(16);
  text("All 5 Stages Cleared.", width / 2, height / 2 + 20);

  fill(255, 215, 0); // Gold text
  textSize(14);
  text("Press ENTER to Play Again", width / 2, height / 2 + 60);
}

function keyPressed() {
  if (gameState === "START") {
    if (keyCode === ENTER) {
      gameState = "PLAYING";
    }
    return; 
  }

  if (gameState === "GAMEOVER") {
    if (keyCode === ENTER) {
      currentLevel = 0; 
      loadLevel();
      resetPlayer();
      gameState = "START";
    }
    return;
  }

  // --- NEW: Handle the Win screen input ---
  if (gameState === "WIN") {
    if (keyCode === ENTER) {
      currentLevel = 0; // Reset back to stage 1
      loadLevel();
      resetPlayer();
      gameState = "START"; // Send them back to the title screen
    }
    return;
  }

  let nextR = player.r;
  let nextC = player.c;

  if (key === 'd' || key === 'D') {
    isDebugMode = !isDebugMode;
  }
  
  if (isDebugMode) {
    if (key === 'n' || key === 'N') noClip = !noClip; 
    if (key === 'l' || key === 'L') {
      gameState = "GAMEOVER"; 
      isDebugMode = false; 
    }      
  }

  if (keyCode === LEFT_ARROW)  nextC--;
  if (keyCode === RIGHT_ARROW) nextC++;
  if (keyCode === UP_ARROW)    nextR--;
  if (keyCode === DOWN_ARROW)  nextR++;

  if (nextR >= 0 && nextR < currentGrid.length && nextC >= 0 && nextC < currentGrid[0].length) {
    if (currentGrid[nextR][nextC] !== 1 || noClip) {
      player.r = nextR;
      player.c = nextC;

      if (currentGrid[nextR][nextC] === 3) {
        spawnParticles(player.c * tileSize + 25, player.r * tileSize + 25, [255, 215, 0]); 
        setTimeout(nextLevel, 400); 
      } 
    } else {
      let hitX = ((player.c + nextC) / 2) * tileSize + 25;
      let hitY = ((player.r + nextR) / 2) * tileSize + 25;
      spawnParticles(hitX, hitY, [100, 100, 100]); 
    }
  }
}

function drawDebugScreen() {
  push(); 
  fill(0, 0, 0, 180); 
  rect(10, 10, 160, 150, 8); 

  fill(0, 255, 0); 
  textSize(12); 
  textAlign(LEFT, TOP);
  
  let debugText = "--- DEBUG MODE ---\n\n";
  debugText += "[D] Close Menu\n";
  debugText += "[N] No-Clip: " + (noClip ? "ON" : "OFF") + "\n";
  debugText += "[L] Force Game Over\n\n";
  debugText += "Pos: Row " + player.r + ", Col " + player.c + "\n";
  debugText += "FPS: " + Math.floor(frameRate());

  text(debugText, 20, 20);
  pop();
}

function spawnParticles(x, y, colorArr) {
  for (let i = 0; i < 15; i++) {
    particles.push({
      x: x,
      y: y,
      vx: random(-3, 3), 
      vy: random(-3, 3), 
      alpha: 255,        
      size: random(4, 8),
      color: colorArr
    });
  }
}

function nextLevel() {
  currentLevel++;
  if (currentLevel >= levelData.levels.length) {
    currentLevel = 0;
    // --- UPDATED: Trigger the WIN screen instead of going straight to START ---
    gameState = "WIN"; 
  }
  loadLevel(); 
  resetPlayer();
}

function resetPlayer() {
  for (let r = 0; r < currentGrid.length; r++) {
    for (let c = 0; c < currentGrid[r].length; c++) {
      if (currentGrid[r][c] === 2) {
        player.r = r;
        player.c = c;
        player.vr = r;
        player.vc = c; 
        return;
      }
    }
  }
}