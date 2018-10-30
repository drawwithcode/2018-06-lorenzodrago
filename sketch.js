var tilemap, tileset1, tileset2, tileset3;
var tileSize = 50;
var tileOrig = 15;
var player = {};
var newPlayer, player, sprite2, collisionGroup, playerImg;
function preload(){
  tileset1 = loadImage('./assets/tileset-b.png');
  tileset2 = loadImage('./assets/tileset-c.png');
  tileset3 = loadImage('./assets/tileset-d.png');
  tilemap = loadJSON('./assets/tilemap.json');
  playerImg = loadImage('./assets/player.png')
}
var setWidth = 6;
var mapWidth;
function setup() {
  pixelDensity(1);
  createCanvas(windowWidth,windowHeight)
  mapWidth = tilemap.layers[0].width;
  mapHeight = tilemap.height;
  tileSize = height/tilemap.height;
  noSmooth(0);
  player=createSprite(100,500,tileSize/2,tileSize/2);
  player.addImage(playerImg)
  player.scale=tileSize/tileOrig;
  collisionGroup = new Group();
  drawCollisionMap();


  //image(tileset,0,0,100,100,15,15,15,15);
}
var offset = 0;
var scrollSpeed = 10;
var GRAVITY = 0.3;
var tutActive = true;
function draw() {
  /*if (keyIsDown(RIGHT_ARROW)) {
    offset+=5;
  } else if (keyIsDown(LEFT_ARROW)) {
    offset+=-5;
  }*/
  offset=player.position.x-width/3;
  if (offset<0) {
    offset=0;
  } else if(offset>mapWidth*tileSize-width) {
    offset= mapWidth*tileSize-width;
  }
  push();
  translate(-offset,0);

  var gravity = createVector(0, 0.1);
  background(0);
  drawTileMap();


  if (player.collide(collisionGroup)) {
    player.velocity.y=0;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    player.velocity.x=(5)
  } else if (keyIsDown(LEFT_ARROW)) {
    player.velocity.x=(-5)
  } else {
    player.velocity.x = 0;
  }
  if (keyWentDown(UP_ARROW)) {
    player.velocity.y=(-10)
  }
  player.velocity.y+=GRAVITY;


  player.collide(collisionGroup);

  drawSprite(player);
  if(keyIsDown(DELETE)) {
    player.position.x = 100;
    player.position.y = 500;
  }
  pop();
  if(tutActive) {
    fill(0,150);
    noStroke();
    rect(width-20-300,20,300,255,5);
    fill(255);
    textSize(23);
    textStyle(BOLD)
    text('IMPORTING TILEMAPS', width-290, 60);
    textSize(15);
    textStyle(NORMAL);
    var textY = 80;
    text('Compatible with Tiled Map Editor', width-290, textY);
    textY+=30; text('Now with buggy collision', width-290, textY);
    textY+=20; text('You can double jump, triple jump etc.', width-290, textY);
    textY+=30; text('Navigate with ARROW KEYS', width-290, textY);
    textY+=20; text('Press ENTER to cycle tilesets', width-290, textY);
    textY+=20; text('Press X to hide', width-290, textY);
    textSize(12);
    textY+=30; text("I know there's a library that does exactly this", width-290, textY);
    textY+=20; text("but better. It's just for practice.", width-290, textY);
  }

}
var currentTileSet = 0;
function keyPressed() {
  if (keyCode==ENTER) {
    if (currentTileSet<2) {
      currentTileSet+=1;
    } else if (currentTileSet=2) {
      currentTileSet=0;
    }
  }
  if (keyCode=='88') {
    if (tutActive==true) {
      tutActive=false;
    } else if (tutActive==false) {
      tutActive=true;
    }
  }
}
function Tile(POSX,POSY,TILE) {
  this.x = tileSize*POSX;
  this.y = tileSize*POSY;
  this.tilex = (TILE-1)%setWidth*tileOrig;
  this.tiley = Math.floor((TILE-1)/setWidth)*tileOrig;
  var tilesetArray = [tileset1, tileset2, tileset3];
  this.tileSet = tilesetArray[currentTileSet];
  //OCCLUSION CULLING
  if(this.x<width+offset&&this.x>-tileSize+offset) {
    image(this.tileSet,this.x,this.y,tileSize,tileSize,this.tilex,this.tiley,tileOrig,tileOrig);
  }
}
var hit = false;
function drawTileMap() {
  for(layer=0; layer<tilemap.layers.length; layer++) {
    for(row=0;row<mapWidth; row++) {
      for (col=0;col<=mapHeight;col++) {
        var tile = tilemap.layers[layer].data[col*mapWidth+row]
        newTile = new Tile(row,col,tile);
      }
    }
  }
}
function drawCollisionMap() {
  for(layer=0; layer<tilemap.layers.length; layer++) {
    for(row=0;row<mapWidth; row++) {
      for (col=0;col<=mapHeight;col++) {
        var tile = tilemap.layers[layer].data[col*mapWidth+row]
        var tilePos = createVector(row*tileSize,col*tileSize);
        if(tile!=6&&tile!=1) {
          tileCollide = createSprite(tilePos.x+tileSize/2, tilePos.y+tileSize/2, tileSize,tileSize);
          collisionGroup.add(tileCollide);
        }
      }
    }
  }
}
