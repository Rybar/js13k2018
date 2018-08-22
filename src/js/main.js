//-----main.js---------------
const tileWidth = 16;
  const tileHeight = 16;
  const mapWidth = 14;
  const mapHeight = 11;
  const gravity = 4;

states = {};

init = () => {
  //drawThings();
  stats = new Stats();
  stats.showPanel( 1 ); // 0: fps, 1: ms, 2: mb, 3+: custom
  document.body.appendChild( stats.dom );

  lcg = new LCG(1019);
  drawMap();
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
    
  //FLAGS--------------------------------------------------------------
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

  render(e);

 stats.end();
  requestAnimationFrame(loop);
}

drawThings = e => { //hit all the api once to check true size with no dead functions
   renderTarget = UI;
   clear(0);
   pat=dither[0];
   moveTo(0,0);
   fillCircle(0,0,4,1,1);
   fillRect(0,0,16,16,22,22);
   rect(0,0,1,1,1,1);
   pset(2,2);
   line(0,0,1,1,1,1);
   cRect(0,0,1,1,1,1,1);
   checker(2,2,2,2,2,2,2,2);
   circle(1,1,2,1,1);
   triangle(0,1,0,1,0,1,1,1);
   ellipse(1,1,2,2,1,1);
   floodFill(2,2,UI);
   spr(0,0,0,0,0,0,0,1);
   rspr(0,0,0,0,0,0,0,0);
   sspr(0,0,0,0,0,0,0,0);
   outline(UI,UI,1,2,3,4);
   setColors(22,0);
   clear(0);
   renderTarget = SCREEN;
  

}

drawMap = e => {
  renderTarget = COLLISION;
  setColors(1,1);
  rect(1,1,WIDTH,HEIGHT, 1);
  for(let i = 0; i < 6000; i++){
    pset(lcg.nextIntRange(1, WIDTH), lcg.nextIntRange(1, HEIGHT));
  }
  renderTarget = SCREEN;
}

getGID = (x,y) => {
  let tx = x / tileWidth | 0;
  let ty = y / tileHeight | 0;              
  return COLLISION + tx + ty * WIDTH;
}

getTile = (x,y) => {
  return ram[getGID(x,y)];
}
 
//----- END main.js---------------
