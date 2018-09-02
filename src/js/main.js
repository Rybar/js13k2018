//-----main.js---------------
const tileWidth = 16;
const tileHeight = 16;
const mapWidth = 256;
const mapHeight = 256;

switches = []; 
objects = [];
states = {};

init = () => {
  stats = new Stats();
  stats.showPanel( 1 ); // 0: fps, 1: ms, 2: mb, 3+: custom
  document.body.appendChild( stats.dom );

  lcg = new LCG(1019);

  drawMap();
  createSwitches();

  state = "menu";
  last = 0;
  t = 0;

  audioCtx = new AudioContext;
  audioMaster = audioCtx.createGain();
  //audioMaster.connect(audioCtx.destination);

  deadzoneX = 50;
  deadzoneY = 50;

  viewX = player.x-WIDTH/2;
  
  viewY = player.y-HEIGHT/2;
  
  sounds = {};
  //music stuff-----------------------------------------------------
  music = new CPlayer();
  music.init(song);
  done = false;
  setInterval(function () {
    if (done) {
      return;
    }
    done = music.generate() == 1;
    if(done){
      wave = music.createWave().buffer;
      audioCtx.decodeAudioData(wave, function(buffer) {
        sounds.song = buffer;
        playSound(sounds.song, 1, 0, 0.5, true);
      })
    }
  },0)
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



loop = e => {
  stats.begin();

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
  rect(1,1,WIDTH,HEIGHT, 1);
  for(let i = 0; i < 1000; i++){
    let x = lcg.nextIntRange(1, WIDTH),
        y = lcg.nextIntRange(1, HEIGHT);
    fillRect(x, y, x+2, y+2);
  }
  renderTarget = SCREEN;
}

createSwitches = e => {

   for(let i = 0; i < 1000; i++){
   var x = lcg.nextIntRange(2, 255);
   var y = lcg.nextIntRange(2, 255);
   renderTarget = COLLISION;
   setColors(2,2);
   pset(x,y);
   renderTarget = SCREEN;
   switches.push( {
     x: x, y: y,
     index: getIndex(x*tileWidth,y*tileHeight),
     color: lcg.nextIntRange(1,10),
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

//----- END main.js---------------
