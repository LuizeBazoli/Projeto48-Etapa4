var bgImage, cityBg;
var balloon, balloonImage, balloonImage_end;
var obsTop1Image, obsTop2Image;
var obstaclesGroup;
var gameOverImage, restartImage, gameOver, restart;
var dieSoung;
var bottonGround, topGround;
var PLAY=1;
var END=0;
var gameState= PLAY;
var score= 0;

function preload(){
    bgImage= loadImage("assets/cityImage.png");
    balloonImage= loadAnimation("assets/balloon1.png", "assets/balloon2.png", "assets/balloon3.png");
    balloonImage_end= loadAnimation("assets/balloon1.png");
    obsTop1Image= loadImage("assets/obsTop1.png");
    obsTop2Image= loadImage("assets/obsTop2.png");
    gameOverImage= loadImage("assets/fimdejogo.png");
    restartImage= loadImage("assets/restart.png");
    dieSoung= loadSound("assets/die.mp3");
}

function setup(){
    createCanvas(700,560);

    //imagem de fundo
    cityBg= createSprite(350,280);
    cityBg.addImage(bgImage);
    cityBg.scale= 0.4;

    //personagem principal
    balloon= createSprite(100,200,20,50);
    balloon.addAnimation("balloon", balloonImage);
    balloon.addAnimation("collided", balloonImage_end);
    balloon.scale= 0.35;
    balloon.setCollider("rectangle",0,0,260,480);
    //balloon.debug= true;

    //criando as bordas superiores e inferiores
    bottonGround= createSprite(350,560,700,10);
    bottonGround.visible= true;

    topGround= createSprite(350,0,700,10);
    topGround.visible= true;

    //grupo dos obstaculos
    obstaclesGroup= new Group();

    //game Over e restart
    gameOver= createSprite(350,180);
    gameOver.addImage(gameOverImage);
    gameOver.scale= 0.6;
    restart= createSprite(350,220);
    restart.addImage(restartImage);
    restart.scale= 0.6;

    rectMode(CENTER);
}

function draw() {
    background("black");

    if(gameState==PLAY){
        //colocando gameOver e restart invisiveis
        gameOver.visible= false;
        restart.visible= false;

        //calculo da pontuação
        score+= Math.round(frameCount/120);

        //movendo o fundo
        cityBg.velocityX= -2;
        if(cityBg.x<200){
            cityBg.x=cityBg.width/2-750;
        }

        //movendo o personagem principal
        if(keyDown(UP_ARROW)){
            balloon.velocityY= -4;
        }
        //gravidade
        balloon.velocityY+= 0.4;

        //chamada da função dos obstaculos
        spawObstacles();

        //função para mudar de estado
        if(obstaclesGroup.isTouching(balloon) || balloon.isTouching(bottonGround) || balloon.isTouching(topGround)){
            gameState=END;
            dieSoung.play();
        }
    }

    if(gameState==END){
        //tornando gameOver e restart visiveis
        gameOver.visible= true;
        restart.visible= true;

        //parando o personagem principal
        balloon.velocityX= 0;
        balloon.velocityY= 0;
        
        //parando o fundo
        cityBg.velocityX= 0;

        //alterando a animação
        balloon.changeAnimation("collided", balloonImage_end);

        //parando os obstaculos
        obstaclesGroup.setVelocityXEach(0);

        //tempo de vida para que subtraindo 1 nunca chegue em zero
        obstaclesGroup.setLifetimeEach(-1);

        //voltando a jogar
        if(mousePressedOver(restart)){
            reset();
        }
    }
 
    drawSprites();

    //configuração do texto: pois o texto tem que ficar em cima da imagem
    push();
    fill("black");
    textSize(20);
    textFont("algerian");
    //todas as estilizações vem antes do texto
    text("Distância percorrida: "+score, 400,75);
    pop();
}

//função para gerar os obstáculos
function spawObstacles(){
    if(frameCount%60==0){//%: analisa o resto da divisão, ou seja, o multiplo
        var obstacle= createSprite(650,50,40,50);
        obstacle.velocityX= -4;
        obstacle.y= Math.round(random(20,550));

        //gerando os obstaculos aleatorios
        var rand= Math.round(random(1,2));
        switch(rand){
            case 1: obstacle.addImage(obsTop1Image);
            obstacle.scale= 0.2;
            obstacle.setCollider("rectangle",0,0,450,800);
            //obstacle.debug= true;
            break;

            case 2: obstacle.addImage(obsTop2Image);
            obstacle.scale= 0.1;
            break;

            default: break;
        }

        //lifetime: distância percorrida/velocidade
        obstacle.lifetime= 200;

        //profundidade
        obstacle.depth= gameOver.depth;
        obstacle.depth= restart.depth;
        gameOver.depth= restart.depth;
        restart.depth= restart.depth+1;

        //adiconando no grupo
        obstaclesGroup.add(obstacle);
    }
}

function reset(){
    gameState=PLAY;
    gameOver.visible= false;
    restart.visible= false;
    obstaclesGroup.destroyEach();//destruindo os elementos do grupo
    balloon.changeAnimation("balloon", balloonImage); 
    balloon.y= 200;
    score= 0;
}
