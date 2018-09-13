//-----main.js---------------
const tileWidth = 20;
const tileHeight = 20;
const mapWidth = 320;
const mapHeight = 200;

score=0;
multiplier=1;
rooms = [];
switches = [];
enemies = []; 
objects = [];
bullets = [];
particles = [];
batteries = [];
states = {};
gp = false;
mouse = {x:0, y:0, pressed:false}
counts = {};

titleMusic = {};
gameMusic = {};

lcg = new LCG(1019);
tileng = new LCG(42);


init = () => {
  window.addEventListener('keyup', function (event) {
    Key.onKeyup(event);
  }, false);
  window.addEventListener('keydown', function (event) {
    Key.onKeydown(event);
  }, false);
  window.addEventListener('blur', function (event) {
    paused = true;
  }, false);
  window.addEventListener('focus', function (event) {
    paused = false;
  }, false);
  window.addEventListener('click', getMousePos);

  window.addEventListener("gamepadconnected", function(e) {
    //console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
      e.gamepad.index, e.gamepad.id,
      e.gamepad.buttons.length, e.gamepad.axes.length;
  });

  //stats = new Stats();
  //stats.showPanel( 1 ); // 0: fps, 1: ms, 2: mb, 3+: custom
  //document.body.appendChild( stats.dom );
  c.addEventListener("mousemove", getMousePos);
  c.addEventListener("mousedown", getMousePos);
  //w.addEventListener("click", getMousePos);
  
  drawMap();
  createSwitches();
  spawnEnemies(12000);
  counts.totalSwitches = switches.length;
  counts.totalEnemies = enemies.length;
  counts.scores = [];

  state = "menu";
  last = 0;
  t = 0;

  audioCtx = new AudioContext;
  audioMaster = audioCtx.createGain();
  audioMaster.connect(audioCtx.destination);

  deadzoneX = 100;
  deadzoneY = 80;

  viewX = player.x-WIDTH/2;
  
  viewY = player.y-HEIGHT/2;
  
  sounds = {};
  soundsReady = 0;
  sndData = [
    {name:'song', data: song},
    {name:'sndGun', data: sndGun},
    {name:'sndSplode1', data: sndSplode1},
    {name:'titleSong', data: titleSong},
    {name:'batteryPickup', data: batteryPickup},
    {name:'cellComplete', data: cellComplete},
    {name:'gameSong', data: gameSong},
    {name:'powerLevel',data:powerLevel},
    ]
  //music stuff-----------------------------------------------------
  sndData.forEach(function(o){
      var sndGenerator = new CPlayer();
      sndGenerator.init(o.data);
      var done = false;
      setInterval(function () {
        if (done) {
          return;
        }
        done = sndGenerator.generate() == 1;
        if(done){
          let wave = sndGenerator.createWave().buffer;
          audioCtx.decodeAudioData(wave, function(buffer) {
            sounds[o.name] = buffer;
            soundsReady++;
            //playSound(sounds.song, 1, 0, 0.5, true);
          })
        }
      },0)
  })
 
    paused = false;
   loop();

}

loop = e => {
  //stats.begin();
  var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
gp = gamepads[0];
//mouse = getMousePos(e);

  if(paused){
    setColors(22,22);
    renderTarget = SCREEN;
    text([
      'PAUSED',
      WIDTH/2,
      128,
      3,
      1,
      'center',
      'top',
      3,
      21,
      0
    ])
    audioMaster.gain.value = 0

  }else{
    
    dt = 1;
    t += 1;
    audioMaster.gain.value = 1;

    states[state].step(dt);
    states[state].draw();

  }
  Key.update();
  render(e);

 //stats.end();
  requestAnimationFrame(loop);
}

drawMap = e => {
  rooms.push({
    x: 156,
    y: 96,
    width: 10,
    height: 10,
  })
  renderTarget = COLLISION;
  fillRect(0,0,mapWidth,mapHeight,1,1);
  for(let i = 0; i < 100000; i++){
    roomCandidate = {
      x: lcg.nextIntRange(5, WIDTH-15),
      y: lcg.nextIntRange(5, HEIGHT-15),
      width: lcg.nextIntRange(7,16),
      height: lcg.nextIntRange(7,16)
    }
    collides = rooms.some(roomInArray =>{return rectCollision(roomCandidate, roomInArray)})
    if(!collides){rooms.push(roomCandidate)}; 
  }
    rooms.forEach(drawRoom);
    drawCorridor(400);

  //---------for visual variation, data filled here is used to se dither per sub-tile
  for(var i = BACKGROUND; i <= BACKGROUND+PAGESIZE; i++){
    ram[i] = tileng.nextIntRange(0,15);
  }
  renderTarget = SCREEN;
}


drawRoom = r => {
  //renderTarget = COLLISION;
  setColors(0,0);
  fillRect(r.x,r.y,r.x+r.width,r.y+r.height,0,0);
  rect(r.x, r.y, r.x+r.width+1, r.y+r.height+1,1,1);
  setColors(0,0);
  line(r.x-3,r.y+r.height/2, r.x+r.width+3, r.y+r.height/2);
  line(r.x+r.width/2,r.y-3, r.x+r.width/2, r.y+r.height+3);
}
drawCorridor = e => {
  var x = 0, y = 0
  for(let i = 0; i < e; i++){
    for(let i = 0; i < 50000;i++){
      x = lcg.nextIntRange(0,mapWidth);
      y = lcg.nextIntRange(0,mapHeight);
      if(pget(x,y,COLLISION)==1)break;
    }
    renderTarget = COLLISION;
    setColors(0,0);
    pset(x,y);
    for(let i = 0; i < 100;i++){
      let possibleDirections = "";
      if(x+3 < mapWidth-5 && pget(x+3,y)==1)possibleDirections += "E";
      if(x-3 > 5 && pget(x-3,y)==1)possibleDirections += "W";
      if(y-3 > 5 && pget(x,y-3)==1)possibleDirections += "N";
      if(y+3 < mapHeight-5 && pget(x,y+3)==1)possibleDirections += "S";
      if(possibleDirections){
        var move = lcg.nextIntRange(0,possibleDirections.length)
        switch(possibleDirections[move]){
          case "N":
          pset(x,y-1);
          pset(x,y-2);
          y-=2;
          break;
          case "S":
          pset(x,y+1);
          pset(x,y+2);
          y+=2;
          break;
          case "E":
          pset(x+1,y);
          pset(x+2,y);
          x+=2;
          break;
          case "W":
          pset(x-1,y);
          pset(x-2,y);
          x-=2;
          break;
        }
      }
    }
  }
  
}
createSwitches = e => {
  rooms.forEach(room=>{
    let locs = [
      {x: room.x+1, y:room.y+1},
      {x: room.x+room.width-1, y:room.y+1},
      {x: room.x+1, y:room.y+room.height},
      {x: room.x+room.width-1, y:room.y+room.height},
      {x: lcg.nextIntRange(room.x, room.x+room.width), y:lcg.nextIntRange(room.y, room.x+room.height)},
      {x: lcg.nextIntRange(room.x, room.x+room.width), y:lcg.nextIntRange(room.y, room.x+room.height)},
      {x: lcg.nextIntRange(room.x, room.x+room.width), y:lcg.nextIntRange(room.y, room.x+room.height)},
    ]
    locs.forEach(l=>{
      renderTarget = COLLISION;
      setColors(2,2);
      pset(l.x,l.y);
      switches.push( {
        x: l.x, y: l.y,
        index: COLLISION + l.y*mapWidth + l.x,
        color: lcg.nextIntRange(1,5),
        state: 0 //lcg.nextIntRange(0,2
      })
    })  
  })
}

drawSwitches = e => {
  switches.forEach(function(s){
    //ram[s.index] = 2;
    var y = s.y * tileHeight - viewY;
    var x = s.x * tileWidth - viewX;
    var cw = 8;
    if(inView(x, y, tileWidth)){
      renderTarget = SCREEN;
      switch(s.state){
        case 4: //on
          pat = dither[8];
          y = s.y * tileHeight - viewY;
          x = s.x * tileWidth - viewX;
          pat = dither[random()*16|0];
          fillRect(x+4,y+4, x+tileWidth-4, y+tileHeight-4, s.color, 22);
          // for(let i = 0; i < 40; i++){
          //   particles.push(new Particle(s.x*tileWidth,y*tileHeight, 22, random()*3-1.5, random()*3-1.5));
          // }
        break;
        case 3: //on
          pat = dither[8];
          y = s.y * tileHeight - viewY;
          x = s.x * tileWidth - viewX;
          fillRect(x+4,y+4, x+tileWidth-4, y+tileHeight-4, s.color, 22);
          fillRect(x+4,y+16, x+tileWidth-4, y+tileHeight-4, s.color, 0);
          
        break;
        case 2: //on
          pat = dither[8];
          y = s.y * tileHeight - viewY;
          x = s.x * tileWidth - viewX;
          fillRect(x+4,y+4, x+tileWidth-4, y+tileHeight-4, s.color, 22);
          fillRect(x+4,y+12, x+tileWidth-4, y+tileHeight-4, s.color, 0);
        break;
        case 1: //on
          pat = dither[8];
          y = s.y * tileHeight - viewY;
          x = s.x * tileWidth - viewX;
          fillRect(x+4,y+4, x+tileWidth-4, y+tileHeight-4, s.color, 22);
          fillRect(x+4,y+8, x+tileWidth-4, y+tileHeight-4, s.color, 0);
        break;
        default: //off
          pat = dither[8];
          y = s.y * tileHeight - viewY;
          x = s.x * tileWidth - viewX;
          fillRect(x+4,y+4, x+tileWidth-4, y+tileHeight-4, s.color, 0);    
      }
    }
      
  })
}

getIndex = (x,y) => {
  let tx = x / tileWidth | 0;
  let ty = y / tileHeight | 0;              
  return COLLISION + tx + ty * mapWidth;
}

getGID = (x,y) => {
  return ram[getIndex(x,y)];
}

drawObjects = e => {
 objects.forEach(function(o){
   o.draw();
 })
}
updateObjects = e => {
  objects.forEach(function(o){
    o.update();
  })
}
updateCollisions = e => {
  enemiesOnScreen = enemies.filter(function(enemy){
    return inView(enemy.x - viewX, enemy.y - viewY);
  })
  enemiesOnScreen.forEach(function(enemy){
      bullets.forEach(function(bullet){
        if(rectCollision(enemy, bullet)){
          bullet.kill();
          enemy.hit = true;
        }
      })
  })
}
///----------------------game stuffs-------------------
spawnEnemies = e => {
  for(let i = 0; i < e ;i++){
    let x = lcg.nextIntRange(0,WIDTH);
    let y = lcg.nextIntRange(0,HEIGHT);
    let size = lcg.nextIntRange(5,19);
    if(getGID(x*tileWidth,y*tileHeight) == 0){
      if( (x*tileWidth > player.x+100 || x*tileWidth < player.x-100) &&
        (y*tileHeight > player.y+100 || y*tileHeight < player.x-100) ){
          enemies.push(new Enemy(x*tileWidth,y*tileHeight,size,size,lcg.nextIntRange(0,3)));
        }
      
    }
    
  }
}

rectCollision = (a, b) => {
  let aleft = a.x,
      aright = a.x+a.width,
      atop = a.y,
      abottom = a.y+a.height,
      bleft = b.x,
      bright = b.x+b.width,
      btop = b.y,
      bbottom = b.y+b.height;
      
  return !(bleft > aright || 
    bright < aleft || 
    btop > abottom ||
    bbottom < atop);
}

buttonPressed=(b)=>{
  if (typeof(b) == "object") {
    return b.pressed;
  }
  return b == 1.0;
}

getMousePos = (evt) =>  {
  var rect = c.getBoundingClientRect(), // abs. size of element
      scaleX = c.width / rect.width,    // relationship bitmap vs. element for X
      scaleY = c.height / rect.height;  // relationship bitmap vs. element for Y
  //console.log(evt.clientX, evt.clientY, evt.buttons);
  
  mouse = {
    x: ( (evt.clientX - rect.left) * scaleX)|0,   // scale mouse coordinates after they have
    y: ( (evt.clientY - rect.top) * scaleY)|0,     // been adjusted to be relative to element
    pressed: evt.buttons
  }
  //console.log(mouse);   
}

// objects.push({
//   x: 120,
//   y: 120,
//   complete: false,
//   Off1: "TUTORIAL......OFFLINE",
//   On1:  "TUTORIAL......ONLINE",
//   Off2: "FLIP SWITCHES TO\nBRING SYSTEMS ONLINE",
//   On2: "GOOD LITTLE HELPER.\nPROCEED TO NEXT ROOM",
//   Off3: "",
//   On3: "DOOMSDAY AI....OFFLINE",
  
//   update: function(){
//     this.complete = switches.filter(btn => btn.color == 7).every(btn => btn.state == 1);
//   },

//   draw: function(){
//     let sx = this.x - viewX;
//     let sy = this.y - viewY;
//     if(inView(sx,sy,WIDTH)){
//       fillRect(sx-10,sy-10,sx+140,sy+80, 1,1);
//       setColors(22,22);
//       text([
//         this.On1 + "\n" + (this.complete?this.On2:this.Off2) + "\n" + (random()<.8?this.Off3:this.On3),
//         sx, sy, 1, 9,
//         'left',
//         'top',
//         1,
//         22,
//         0
//       ]);
//     }  
//   }

// })

isOnScreen = o => {
  return inView(o.x - viewX, o.y-viewY);
}

getNeighbors = (tx,ty) => {
  return {
    N: getGID(tx,ty-1)
  }
}

reset = e => {
  lcg.seed = 1019;
  tileng.seed = 42;
  player.health = 100;
  player.x = 160*tileWidth;
  player.y = 100*tileHeight;
  score = 0;
  switches = [];
enemies = []; 
objects = [];
bullets = [];
particles = [];
batteries = [];
//renderTarget = MIDGROUND;
//fillRect(0,0,mapWidth,mapHeight,0,0);
//renderTarget = SCREEN;
player.batteries = 20;
createSwitches();
spawnEnemies();

state = 'game';

}

//----- END main.js---------------
