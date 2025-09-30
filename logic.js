var blockImg;
var foodImg;
var powerImg;
var angrypacmanImg;
var enemy1Img;
var enemy2Img;
var enemy3Img;
var enemy1ImgWeak;
var enemy2ImgWeak;
var enemy3ImgWeak;
var block2Img;
var angrypacman = {instance: null, frame: 0, direction: 0};
var blocks = [];
var foods = [];
var powers = [];
var enemies = [];
var activeEnemies = [];
var maze;
var p5 = new p5();
var standarSize = 40;

// Variabili per il movimento continuo
var keys = {};
var lastMoveTime = 0;
var moveInterval = 150; // intervallo in millisecondi tra i movimenti

// Variabili per il sistema di vite
var lives = 3;
var pacmanStartX = 0;
var pacmanStartY = 0;
var isRespawning = false;
var respawnTime = 0;
var respawnDelay = 2000; // 2 secondi di invincibilità dopo respawn

// Variabili per il controllo dell'orientamento mobile
var isMobile = false;
var showOrientationInstructions = true;

function preload() {
  blockImg = loadImage('block.png');
  block2Img = loadImage('block2.JPG');
  foodImg = loadImage('food.png');
  powerImg = loadImage('power.png');
  angrypacmanImg = loadImage('pacman_tile.png');
  enemy1Img = loadImage('ghost1.png');
  enemy2Img = loadImage('ghost2.png');
  enemy3Img = loadImage('ghost3.png');
  enemy1ImgWeak = loadImage('ghost1fear.png');
  enemy2ImgWeak = loadImage('ghost2fear.png');
  enemy3ImgWeak = loadImage('ghost3fear.png');
}

function setup() {
  createCanvas(882, 562);
  maze = new Maze();
  for(var i = 0; i < maze.rows; i++) {
    for(var j = 0; j < maze.cols; j++) {
      if(maze.maze[i][j] === '*') {
        blocks.push(new Element(j * standarSize,i * standarSize, blockImg, angrypacman));
      }
      else if(maze.maze[i][j] === '+') {
        blocks.push(new Element(j * standarSize,i * standarSize, block2Img, angrypacman));
      }
      else if(maze.maze[i][j] === '-') {
        foods.push(new Element(j * (standarSize + 1),i * (standarSize + 1), foodImg, angrypacman));
      }
      else if(maze.maze[i][j] === 'x') {
        powers.push(new Element(j * standarSize,i * standarSize, powerImg, angrypacman));
      }
      else if(maze.maze[i][j] === 'p') {
        angrypacman.instance = new Element(j * standarSize,i * standarSize, angrypacmanImg, angrypacman);
        pacmanStartX = j * standarSize;
        pacmanStartY = i * standarSize;
      }
      else if(maze.maze[i][j] === 'e1') {
        enemies.push(new Element(j * standarSize,i * standarSize, enemy1Img, angrypacman));
      }
      else if(maze.maze[i][j] === 'e2') {
        enemies.push(new Element(j * standarSize,i * standarSize, enemy2Img, angrypacman));
      }
      else if(maze.maze[i][j] === 'e3') {
        enemies.push(new Element(j * standarSize,i * standarSize, enemy3Img, angrypacman));
      }
    }
  }
  enemyOutInterval(5000);
  
  // Inizializza il display delle vite
  updateLivesDisplay();
}

function draw() {
  background(0,0,0);
  enemy1ImgWeak.filter("gray");
  enemy2ImgWeak.filter("gray");
  enemy3ImgWeak.filter("gray");
  
  // Gestione movimento continuo
  handleContinuousMovement();
  
  // Gestione respawn e invincibilità
  if (isRespawning && millis() - respawnTime > respawnDelay) {
    isRespawning = false;
  }
  for(var i = 0; i < blocks.length; i++) {
    blocks[i].show();
  }
  for(var i = 0; i < foods.length; i++) {
    foods[i].show();
  }
  for(var i = 0; i < powers.length; i++) {
    powers[i].show();
  }
  for(var i = 0; i < enemies.length; i++) {
    enemies[i].show();
  }
  for(var i = 0; i < activeEnemies.length; i++) {
    frameRate(8);
    activeEnemies[i].moveEnemy(blocks);
    activeEnemies[i].show();

    if(angrypacman.instance.enemyPackmanColission(activeEnemies[i])) {
      if(activeEnemies[i].isWeak === true) {
        var activeInitX = activeEnemies[i].initx;
        var activeInitY = activeEnemies[i].inity;
        activeEnemies.splice(i, 1);
        enemies.push(new Element(activeInitX, activeInitY, eval("enemy"+(i+1)+"Img"), angrypacman));
        document.getElementById("score").innerHTML = parseInt(document.getElementById("score").innerHTML) + 100;
      } else if (!isRespawning) {
        loseLife();
      }
    }
  }
  angrypacman.instance.showPac();
  for(var i = 0; i < foods.length; i++) {
    if(angrypacman.instance.eatPac(foods[i])) {
      foods.splice(i, 1);
    }
  }
  for(var i = 0; i < powers.length; i++) {
    if(angrypacman.instance.eatPower(powers[i])) {
      powers.splice(i, 1);
      makeWeak();
    }
  }

  if(foods.length <= 0) {
    alert("*** WIN!!! ***");
    window.location.reload();
  }
}

function makeWeak() {
  for(var i = 0; i < activeEnemies.length; i++) {
    activeEnemies[i].image = eval("enemy"+(i+1)+"ImgWeak");
    activeEnemies[i].isWeak = true;
  }
}

function loseLife() {
  lives--;
  updateLivesDisplay();
  
  if (lives <= 0) {
    showGameOverScreen();
  } else {
    respawnPacman();
  }
}

function respawnPacman() {
  isRespawning = true;
  respawnTime = millis();
  
  // Riporta Pac-Man alla posizione iniziale
  angrypacman.instance.x = pacmanStartX;
  angrypacman.instance.y = pacmanStartY;
  
  // Riporta tutti i fantasmi attivi alla base
  for(var i = 0; i < activeEnemies.length; i++) {
    var activeInitX = activeEnemies[i].initx;
    var activeInitY = activeEnemies[i].inity;
    enemies.push(new Element(activeInitX, activeInitY, eval("enemy"+(i+1)+"Img"), angrypacman));
  }
  activeEnemies = [];
}

function updateLivesDisplay() {
  var livesDisplay = document.getElementById("lives");
  if (livesDisplay) {
    var hearts = "";
    for(var i = 0; i < lives; i++) {
      hearts += "❤️ ";
    }
    livesDisplay.innerHTML = hearts;
  }
}

function showGameOverScreen() {
  // Ferma il gioco
  noLoop();
  
  // Mostra il punteggio finale
  var finalScore = document.getElementById("score").innerHTML;
  document.getElementById("finalScore").innerHTML = finalScore;
  
  // Mostra il game over screen
  document.getElementById("gameOverOverlay").style.display = "flex";
}

function restartGame() {
  // Nasconde il game over screen
  document.getElementById("gameOverOverlay").style.display = "none";
  
  // Ricarica la pagina per riavviare il gioco
  window.location.reload();
}


function exitGame() {
  // Prova a chiudere la finestra solo se è stata aperta da JavaScript
  if (window.opener) {
    window.close();
  } else {
    // Se non può chiudere la finestra, mostra un messaggio e riavvia il gioco
    if (confirm("Vuoi davvero uscire dal gioco?")) {
      // Prova diversi metodi per uscire
      try {
        // Metodo 1: Chiudi la finestra
        window.close();
        
        // Metodo 2: Se non funziona, vai alla pagina precedente
        setTimeout(function() {
          if (!window.closed) {
            window.history.back();
          }
        }, 100);
        
        // Metodo 3: Se nemmeno questo funziona, ricarica la pagina
        setTimeout(function() {
          if (!window.closed && document.visibilityState === 'visible') {
            window.location.href = 'about:blank';
          }
        }, 500);
        
      } catch (e) {
        // Se tutto fallisce, ricarica la pagina
        window.location.reload();
      }
    }
  }
}

// Funzione per controllare se una posizione è valida (non è un blocco)
function isValidPosition(x, y) {
  // Applica wrap-around per le coordinate
  var wrappedX = ((x / standarSize) % maze.cols + maze.cols) % maze.cols;
  var wrappedY = ((y / standarSize) % maze.rows + maze.rows) % maze.rows;
  
  // Controlla se la posizione è un blocco
  return maze.maze[wrappedY][wrappedX] !== '*';
}

// Funzione per gestire il movimento continuo
function handleContinuousMovement() {
  var currentTime = millis();
  if (currentTime - lastMoveTime >= moveInterval) {
    if (keys[RIGHT_ARROW]) {
      var nextX = angrypacman.instance.x + standarSize;
      if(isValidPosition(nextX, angrypacman.instance.y)) {
        angrypacman.instance.movePac(0);
        lastMoveTime = currentTime;
      }
    }
    else if (keys[DOWN_ARROW]) {
      var nextY = angrypacman.instance.y + standarSize;
      if(isValidPosition(angrypacman.instance.x, nextY)) {
        angrypacman.instance.movePac(1);
        lastMoveTime = currentTime;
      }
    }
    else if (keys[LEFT_ARROW]) {
      var nextX = angrypacman.instance.x - standarSize;
      if(isValidPosition(nextX, angrypacman.instance.y)) {
        angrypacman.instance.movePac(2);
        lastMoveTime = currentTime;
      }
    }
    else if (keys[UP_ARROW]) {
      var nextY = angrypacman.instance.y - standarSize;
      if(isValidPosition(angrypacman.instance.x, nextY)) {
        angrypacman.instance.movePac(3);
        lastMoveTime = currentTime;
      }
    }
  }
}

function keyPressed() {
  keys[keyCode] = true;
  
  // Movimento immediato al primo press
  if(keyCode === RIGHT_ARROW) {
    var nextX = angrypacman.instance.x + standarSize;
    if(isValidPosition(nextX, angrypacman.instance.y)) {
      angrypacman.instance.movePac(0);
      lastMoveTime = millis();
    }
  }
  else if(keyCode === DOWN_ARROW) {
    var nextY = angrypacman.instance.y + standarSize;
    if(isValidPosition(angrypacman.instance.x, nextY)) {
      angrypacman.instance.movePac(1);
      lastMoveTime = millis();
    }
  }
  else if(keyCode === LEFT_ARROW) {
    var nextX = angrypacman.instance.x - standarSize;
    if(isValidPosition(nextX, angrypacman.instance.y)) {
      angrypacman.instance.movePac(2);
      lastMoveTime = millis();
    }
  }
  else if(keyCode === UP_ARROW) {
    var nextY = angrypacman.instance.y - standarSize;
    if(isValidPosition(angrypacman.instance.x, nextY)) {
      angrypacman.instance.movePac(3);
      lastMoveTime = millis();
    }
  }
}

function keyReleased() {
  keys[keyCode] = false;
}

function enemyOutInterval(interval) {
  setInterval(function() {
    if(enemies.length > 0) {
      var eout = enemies.pop();
      eout.isWeak = false;
      eout.enemyOut(maze);
      activeEnemies.push(eout);
    }
  }, interval);
}

// ----------------------------ELEMENT: BLOCK, FOOD, POWER, PACMAN, ENEMY----------------------------
function Element(x, y, image, character) {
  this.x = x;
  this.y = y;
  this.initx = this.x;
  this.inity = this.y;
  this.image = image;
  this.imageWeak = image;
  this.frame = character.frame
  this.direction = character.direction;
  this.pacRadius = 16;
  this.foodRadius = 9;
  this.powerRadius = 6;
  this.enemyRadius = 18;
  this.blockRadius = 6;
  this.enemyMovement = true;
  this.isWeak = false;

  this.show = function() {
      p5.image(this.image, this.x, this.y);    
  }

  this.showPac = function() {
    // Effetto lampeggiante durante l'invincibilità
    if (isRespawning) {
      var flashRate = 200; // millisecondi
      if (Math.floor(millis() / flashRate) % 2 === 0) {
        p5.image(this.image.get(standarSize * this.frame++,this.direction * standarSize,standarSize,standarSize), this.x, this.y);
      }
    } else {
      p5.image(this.image.get(standarSize * this.frame++,this.direction * standarSize,standarSize,standarSize), this.x, this.y);
    }
    this.frame = this.frame === 8 ? 0 : this.frame;
  }

  this.movePac = function(d) {
    this.direction = d;
    if (this.direction === 0) {
      this.x += standarSize;
    }
    else if (this.direction === 1) {
      this.y += standarSize;
    }
    else if (this.direction === 2) {
      this.x -= standarSize;
    }
    else if (this.direction === 3) {
      this.y -= standarSize;
    }
    
    // Wrap-around effect: se esce dai bordi, riappare dal lato opposto
    var mazeWidth = maze.cols * standarSize;
    var mazeHeight = maze.rows * standarSize;
    
    // Wrap-around orizzontale (sinistra-destra)
    if (this.x < 0) {
      this.x = mazeWidth - standarSize;
    } else if (this.x >= mazeWidth) {
      this.x = 0;
    }
    
    // Wrap-around verticale (sopra-sotto)
    if (this.y < 0) {
      this.y = mazeHeight - standarSize;
    } else if (this.y >= mazeHeight) {
      this.y = 0;
    }
  }

  this.moveEnemy = function(blocks) {
    if(this.enemyMovement === false) {
      var d = Math.floor((Math.random() * 4));
      this.direction = d;
    }
    var lastx = this.x;
    var lasty = this.y
    if (this.direction === 0) {
      this.x += standarSize;
    }
    else if (this.direction === 1) {
      this.y += standarSize;
    }
    else if (this.direction === 2) {
      this.x -= standarSize;
    }
    else if (this.direction === 3) {
      this.y -= standarSize;
    }
    
    // Wrap-around effect per i fantasmi: se escono dai bordi, riappaiono dal lato opposto
    var mazeWidth = maze.cols * standarSize;
    var mazeHeight = maze.rows * standarSize;
    
    // Wrap-around orizzontale (sinistra-destra)
    if (this.x < 0) {
      this.x = mazeWidth - standarSize;
    } else if (this.x >= mazeWidth) {
      this.x = 0;
    }
    
    // Wrap-around verticale (sopra-sotto)
    if (this.y < 0) {
      this.y = mazeHeight - standarSize;
    } else if (this.y >= mazeHeight) {
      this.y = 0;
    }
    
    // Controlla collisioni con i blocchi
    var hasCollision = false;
    for(var i = 0; i < blocks.length; i++) {
      if(this.enemyBlockColission(blocks[i])){
        hasCollision = true;
        break;
      }
    }
    
    if(hasCollision) {
      this.x = lastx;
      this.y = lasty;
      this.enemyMovement = false;
      // Non chiamare ricorsivamente, lascia che il prossimo frame gestisca il movimento
    } else {
      this.enemyMovement = true;
    }
  }

  this.enemyBlockColission = function(b) {
    var dis = dist(this.x, this.y, b.x, b.y);
    // Rimuoviamo i controlli dei bordi del labirinto perché ora abbiamo il wrap-around
    if((dis) < (this.enemyRadius + b.blockRadius)) {
      return true;
    } else {
      return false;
    }
  }

  this.enemyPackmanColission = function(e) {
    var dis = dist(this.x, this.y, e.x, e.y);
    if((dis) < (this.pacRadius + e.enemyRadius)) {
      return true;
    } else {
      return false;
    }
  }

  this.enemyOut = function(m) {
    for(var i = 0; i < m.rows; i++) {
      for(var j = 0; j < m.cols; j++) {
        if(m.maze[i][j] === 'eout') {
          this.y -= 80;
          break;
        }
      }
    }
  }

  this.eatPac = function (f) {
    var dis = dist(this.x, this.y, f.x, f.y);
    if(dis < this.pacRadius + f.foodRadius) {
      document.getElementById("score").innerHTML = parseInt(document.getElementById("score").innerHTML) + 10;
      return true;
    } else {
      return false;
    }
  }

  this.eatPower = function (p) {
    var dis = dist(this.x, this.y, p.x, p.y);
    if(dis < this.pacRadius + p.powerRadius) {
      return true;
    } else {
      return false;
    }
  }
}

// ----------------------------MAZE----------------------------
function Maze() {
  var levels = [];
  levels.push(
    [
      ['*','*','*','*','-','-','-','-','*','*','*','*','*','*','*','*','*','*','*','-','-','*'],
      ['*','-','-','-','-','-','-','-','-','-','-','*','*','x','-','-','-','-','-','-','-','-'],
      ['*','-','*','*','-','*','-','*','*','-','-','*','*','-','-','*','*','-','-','*','-','*'],
      ['*','-','*','*','-','-','-','*','*','-','p','-','-','-','-','*','*','-','-','-','-','*'],
      ['-','-','x','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-'],
      ['-','-','*','*','-','-','-','*','-','-','*','*','*','*','-','-','*','-','-','-','-','*'],
      ['-','-','-','-','-','*','-','*','-','-','-','*','*','-','-','-','*','-','-','*','-','-'],
      ['-','-','-','-','-','-','-','*','*','*','-','*','*','-','*','*','*','-','-','-','-','-'],
      ['-','*','*','*','-','-','-','*','x','-','eout','eout','eout','-','-','-','*','-','-','-','-','*'],
      ['*','*','','*','-','-','-','*','-','*','*','-','-','*','*','-','*','-','-','-','-','*'],
      ['*','*','','*','x','*','-','-','-','*','e1','e2','e3','','*','-','-','-','-','*','-','*'],
      ['-','*','*','*','-','-','-','-','-','*','','','','','*','-','x','-','-','-','-','*'],
      ['-','-','-','-','-','-','-','*','-','*','*','*','*','*','*','-','*','-','-','-','-','-'],
      ['-','*','*','*','-','*','-','*','-','-','-','-','-','-','-','-','*','-','-','*','-','-']
    ]
  );
  levels.push(
    [
      ['-','*','*','*','-','*','-','*','-','-','-','-','-','-','-','-','*','-','-','*','-','-'],
      ['-','-','-','*','-','-','-','*','-','-','eout','eout','eout','-','-','-','*','-','-','-','-','*'],
      ['-','-','-','*','-','*','x','*','-','*','*','*','*','*','-','-','-','-','*','*','-','*'],
      ['-','*','*','*','-','*','-','*','-','*','e1','e2','e3','*','-','-','*','x','-','-','-','*'],
      ['-','-','-','-','-','*','-','*','-','*','*','*','*','*','-','-','*','-','-','-','-','-'],
      ['*','-','-','-','-','*','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-'],
      ['*','-','*','*','-','*','-','*','*','-','-','*','*','-','-','*','*','-','-','*','-','*'],
      ['*','-','*','*','-','-','-','*','*','p','-','-','-','-','-','*','*','-','-','-','-','*'],
      ['-','-','x','-','-','-','-','-','-','-','-','-','-','-','-','-','-','*','*','*','*','*'],
      ['-','-','*','*','-','-','-','*','-','-','*','*','*','*','-','-','*','-','-','-','-','*'],
      ['-','-','-','-','-','*','-','*','-','-','*','','','*','-','-','*','-','-','*','-','*'],
      ['-','-','-','-','-','-','-','*','*','*','*','*','*','*','*','*','*','-','-','-','-','*'],
      ['-','*','*','*','-','-','-','-','-','-','-','x','-','-','-','-','-','-','-','-','-','*'],
      ['-','*','*','*','-','*','-','*','-','-','-','-','-','-','-','-','*','x','-','*','-','*']
      
    ]
  );
  this.rows = 14;
  this.cols = 22;

  //-------------------------------------------------SELECT LEVEL HERE-------------------------------------------------
  this.maze = levels[0];
  //---------------------------------------------JUST CHANGE LEVEL'S INDEX---------------------------------------------

  this.show = function() {
    p5.image(this.image, this.x, this.y);
  }
}

// ----------------------------MOBILE ORIENTATION FUNCTIONS----------------------------

// Funzione per rilevare se il dispositivo è mobile
function detectMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
         (window.innerWidth <= 768 && window.innerHeight <= 1024);
}

// Funzione per controllare l'orientamento
function checkOrientation() {
  return window.innerWidth > window.innerHeight;
}

// Funzione per mostrare le istruzioni di orientamento
function showOrientationInstructions() {
  if (isMobile && !checkOrientation() && showOrientationInstructions) {
    document.getElementById('orientationOverlay').style.display = 'flex';
  }
}

// Funzione per nascondere le istruzioni di orientamento
function hideOrientationInstructions() {
  document.getElementById('orientationOverlay').style.display = 'none';
  
  // Salva la preferenza dell'utente
  var dontShowAgain = document.getElementById('dontShowAgain').checked;
  if (dontShowAgain) {
    localStorage.setItem('pacman_orientation_instructions', 'false');
    showOrientationInstructions = false;
  }
}

// Funzione per continuare in modalità portrait
function continueInPortrait() {
  hideOrientationInstructions();
}

// Funzione per inizializzare il controllo dell'orientamento
function initOrientationControl() {
  isMobile = detectMobile();
  
  // Carica la preferenza dell'utente
  var savedPreference = localStorage.getItem('pacman_orientation_instructions');
  if (savedPreference === 'false') {
    showOrientationInstructions = false;
  }
  
  // Controlla l'orientamento al caricamento
  if (isMobile) {
    showOrientationInstructions();
  }
  
  // Ascolta i cambiamenti di orientamento
  window.addEventListener('orientationchange', function() {
    setTimeout(function() {
      if (isMobile && !checkOrientation() && showOrientationInstructions) {
        showOrientationInstructions();
      } else {
        hideOrientationInstructions();
      }
    }, 100);
  });
  
  // Ascolta i cambiamenti di dimensione della finestra
  window.addEventListener('resize', function() {
    setTimeout(function() {
      if (isMobile && !checkOrientation() && showOrientationInstructions) {
        showOrientationInstructions();
      } else {
        hideOrientationInstructions();
      }
    }, 100);
  });
}

// Inizializza il controllo dell'orientamento quando la pagina è caricata
window.addEventListener('load', initOrientationControl);