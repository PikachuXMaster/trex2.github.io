var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var startButton, gameoverButton;
var startImage, gameoverImage;
var score;

var jumpSound , checkPointSound, dieSound


function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  startImage = loadImage("restart.png");
  gameoverImage = loadImage("gameOver.png");
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  trex = createSprite(50,height-90,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" ,trex_collided);
  trex.scale = 0.5;
  
  ground = createSprite(200,height-83,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;

  startButton = createSprite(width*0.5,height*0.5);
  startButton.addImage(startImage);
  startButton.scale = 0.6;

  gameoverButton = createSprite(width*0.5,height*0.4);
  gameoverButton.addImage(gameoverImage);
  gameoverButton.scale = 0.6;
  
  invisibleGround = createSprite(200,height-77,400,10);
  invisibleGround.visible = false;
  
  //criar grupos de obstáculos e nuvens
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  
  console.log("Olá" + 5);
  
  trex.setCollider("circle",0,0,40);
  trex.debug = false
  
  score = 0;
  
}

function draw() {
  
  background(180);
  //exibir pontuação
  text("Pontuação: "+ score, width*0.1,height*0.5);
  
  console.log("isto é ",gameState)
  
  
  if(gameState === PLAY){
    trex.changeAnimation("running", trex_running);
    //mover o solo
    ground.velocityX = -(4+2*score/1000);
    //pontuação
    score = score + Math.round(getFrameRate()/60);
    startButton.visible = false;
    gameoverButton.visible = false;
    if(score > 0 && frameCount % 200 === 0){
      checkPointSound.play();
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //pular quando a tecla de espaço for pressionada
    if(keyDown("space")&& trex.y >= height-115|| touches.lenght>0 ) {
        trex.velocityY = -14;
        jumpSound.play();
    }
    
    //adicione gravidade
    trex.velocityY = trex.velocityY + 0.8
  
    //gerar as nuvens
    spawnClouds();
  
    //gerar obstáculos no solo
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
        dieSound.play();
        //trex.velocityY = -14;
        //jumpSound.play();
    }
  }
   else if (gameState === END) {
    if(mousePressedOver(startButton)){
      reset();
    }
     console.log("hey")
     startButton.visible = true;
     gameoverButton.visible = true;
     
      ground.velocityX = 0;
      trex.velocityY = 0
     
      //mudar a animação do trex
      trex.changeAnimation("collided", trex_collided);
    
      //definir a vida útil dos objetos do jogo para que nunca sejam destruídos
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);
   }
  
 
  //impedir que o trex caia
  trex.collide(invisibleGround);
  
  
  
  drawSprites();
}

function reset (){
  gameState = PLAY;
  startButton.visible = false;
  gameoverButton.visible = false;
  trex.changeAnimation("running",trex_running); 
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  score = 0;
  }

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(400,height-83,10,40);
   obstacle.velocityX = -(4+2*score/1000);
   obstacle.setCollider("rectangle",0,0,40,20);
   obstacle.debug = false
    //gerar obstáculos aleatórios
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //atribuir escala e vida útil ao obstáculo           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //adicione cada obstáculo ao grupo
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //escreva o código aqui para gerar as nuvens
  if (frameCount % 60 === 0) {
     cloud = createSprite(width,height-100,40,10);
    cloud.y = Math.round(random(height*0.25,height*0.5));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //atribuir tempo de vida à variável
    cloud.lifetime = 1000;
    
    //ajustar a profundidade
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adicionando nuvem ao grupo
   cloudsGroup.add(cloud);
    }
}

