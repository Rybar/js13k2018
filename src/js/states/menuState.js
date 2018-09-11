states.menu = {
    ready: false,
    musicPlaying: false,
    titleSong: {},
    step: function(dt){
      
      for(let i = 0; i < 10; i++){
        particles.push(new Particle(100-viewX,100-viewY, 22, random()*3, random()*3));
      }
        this.ready = soundsReady == sndData.length;
        if(!this.musicPlaying && this.ready){
            this.titleSong = playSound(sounds.titleSong, 1, 0, 0.4, true);
            this.musicPlaying = true;
        }
        if(this.ready){
          if(Key.justReleased(Key.SPACE) || Key.justReleased(Key.w) || mouse.pressed){
            state = "game";
           // this.titleSong.sound.stop();
          }
          if(gp){
            if( (abs(gp.axes[0]) > .1 ) || (abs(gp.axes[1]) > .1 ) || (abs(gp.axes[2]) > .1 ) || (abs(gp.axes[3]) > .1 ) ){
              state = "game";
            }
          }
        }
        
        particles.forEach(function(o){o.update();});

    },
    
    draw: function(dt){
        renderTarget = SCREEN;
        clear(0);
        renderSource = COLLISION;
        mapPal = [1,31];
        spr(0,0,WIDTH,HEIGHT,0,0,0,0,mapPal);
        
        let inc = WIDTH/sndData.length;
        pat = dither[8];
        fillRect(0,188,soundsReady*inc,200,13,14);
        particles.forEach(function(o){o.draw()});
        setColors(22,22);
        text([
          "THE", 50, 54, 3, 9,
          'left',
          'top',
          2,
          22,
          0
        ]);
        text([
          "INCIDENT", 270, 106, 3, 9,
          'right',
          'top',
          2,
          22,
          0
        ]);
        text([
          "CHROMA", WIDTH/2, 70, 8, 9,
          'center',
          'top',
          6,
          22,
          0
        ]);
        //setColors(4,5);floodFill(50,71);
        text([
            gp?"GAMEPAD DETECTED":"GAMEPADS SUPPORTED-PRESS A BUTTON", WIDTH/2, 170, 1, 9,
            'center',
            'top',
            1,
            22,
            0
          ]);
          text([
            "WASD/ZQSD TO MOVE   MOUSE TO AIM/SHOOT", WIDTH/2, 180, 1, 9,
            'center',
            'top',
            1,
            22,
            0
          ]);
        setColors(22,22);
          text([
            this.ready?"PRESS OR CLICK TO PLAY":"ASSETS OFFLINE. LOADING...", WIDTH/2, 191, 1, 9,
            'center',
            'top',
            1,
            22,
            0
          ]);
    }



};
