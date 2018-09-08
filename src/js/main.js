//-----main.js---------------
const tileWidth = 32;
const tileHeight = 32;
const mapWidth = 320;
const mapHeight = 200;

switches = [];
enemies = []; 
objects = [];
bullets = [];
particles = [];
states = {};
gp = false;
mouse = {x:0, y:0, pressed:false}

lcg = new LCG(1019);
tileng = new LCG(42);

init = () => {
  stats = new Stats();
  stats.showPanel( 1 ); // 0: fps, 1: ms, 2: mb, 3+: custom
  document.body.appendChild( stats.dom );
  canvas.addEventListener("mousemove", getMousePos);
  canvas.addEventListener("mousedown", getMousePos);
  

  drawMap();
  createSwitches();
  spawnEnemies();

  state = "menu";
  last = 0;
  t = 0;

  audioCtx = new AudioContext;
  audioMaster = audioCtx.createGain();
  audioMaster.connect(audioCtx.destination);

  deadzoneX = 70;
  deadzoneY = 70;

  viewX = player.x-WIDTH/2;
  
  viewY = player.y-HEIGHT/2;
  
  sounds = {};
  sndData = [
    {name:'song', data: song},
    {name:'sndGun', data: sndGun},
    {name:'sndSplode1', data: sndSplode1}
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
            //playSound(sounds.song, 1, 0, 0.5, true);
          })
        }
      },0)
  })
  // genSong = new CPlayer();
  // genSong.init(song);
  // done = false;
  // setInterval(function () {
  //   if (done) {
  //     return;
  //   }
  //   done = genSong.generate() == 1;
  //   if(done){
  //     let wave = genSong.createWave().buffer;
  //     audioCtx.decodeAudioData(wave, function(buffer) {
  //       sounds.song = buffer;
  //       playSound(sounds.song, 1, 0, 0.5, true);
  //     })
  //   }
  // },0)
  // genGun = new CPlayer();playSound(sounds.gun, 1, 0, 0.5, true);
  // genGun.init(sndGun);
  // done2 = false;
  // setInterval(function () {
  //   if (done2) {
  //     return;
  //   }
  //   done2 = genGun.generate() == 1;
  //   if(done2){
  //     let wave = genGun.createWave().buffer;
  //     audioCtx.decodeAudioData(wave, function(buffer) {
  //       sounds.gun = buffer;
  //       //playSound(sounds.gun, 1, 0, 0.5, true);
  //     })
  //   }
  // },0)


    paused = false;
  
   loop();

}

//initialize  event listeners--------------------------
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
window.addEventListener("gamepadconnected", function(e) {
  //console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
    e.gamepad.index, e.gamepad.id,
    e.gamepad.buttons.length, e.gamepad.axes.length;
});




loop = e => {
  stats.begin();
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

 stats.end();
  requestAnimationFrame(loop);
}

drawMap = e => {
  renderTarget = COLLISION;
  setColors(1,1);
  fillRect(0,0,WIDTH,HEIGHT, 1,1);
  //fillRect(4,4, WIDTH-4, HEIGHT-4, 0,0);
  for(let i = 0; i < 900; i++){
    let x = lcg.nextIntRange(5, WIDTH-5),
        y = lcg.nextIntRange(5, HEIGHT-5);
        w = lcg.nextIntRange(3,12);
        h = lcg.nextIntRange(3,12);
    fillRect(x, y, x+w, y+h,0,0);
  }
  for(let i = 0; i < 10; i++){
    let x = 10//i * (WIDTH-10)/20;
        y = i * (HEIGHT-10)/10 + 5;       
        
    fillRect(x, y, x+WIDTH-30, y+1,0,0);
  }
  fillRect(0,0,WIDTH,5,1,1);
  fillRect(0,0,5,HEIGHT,1,1);
  fillRect(WIDTH-5,0,WIDTH,HEIGHT,1,1);
  fillRect(0,HEIGHT-5,WIDTH,HEIGHT,1);
  renderTarget = SCREEN;
}

createSwitches = e => {

   for(let i = 0; i < 100; i++){
   var x = lcg.nextIntRange(6, 20);
   var y = lcg.nextIntRange(13, 16);
   var colors = [7,7,28,18];
   renderTarget = COLLISION;
   setColors(2,2);
   pset(x,y);
   renderTarget = SCREEN;
   switches.push( {
     x: x, y: y,
     index: getIndex(x*tileWidth,y*tileHeight),
     color: colors[lcg.nextIntRange(0,3)],
     state: 0 //lcg.nextIntRange(0,2)
   })
  }
}

drawSwitches = e => {
  switches.forEach(function(s){
    //ram[s.index] = 2;
    var y = s.y * tileHeight - viewY;
    var x = s.x * tileWidth - viewX;
    if(inView(x, y, tileWidth)){
      renderTarget = SCREEN;
      switch(s.state){
        case 2: //overloaded/broken
        break;
        case 1: //on
          y = s.y * tileHeight - viewY;
          x = s.x * tileWidth - viewX;
          fillRect(x+2,y+2, x+tileWidth-2, y+tileHeight-2, s.color, 0);
        break;
        default: //off
          
          //
          y = s.y * tileHeight - viewY;
          x = s.x * tileWidth - viewX;
          fillRect(x+2,y+2, x+tileWidth-2, y+tileHeight-2, 0, 2);    
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
  for(let i = 0; i < 6000;i++){
    let x = lcg.nextIntRange(0,WIDTH);
    let y = lcg.nextIntRange(0,HEIGHT);
    if(getGID(x*tileWidth,y*tileHeight) == 0){
      enemies.push(new Enemy(x*tileWidth,y*tileHeight,10,lcg.nextIntRange(6,30),lcg.nextIntRange(0,3)));
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



//----- END main.js---------------
