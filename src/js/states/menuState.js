states.menu = {
    ready: false,
    musicPlaying: false,
    titleSong: {},
    step: function(dt){
      
      for(let i = 0; i < 10; i++){
        particles.push(new Particle(100,100, 5, random()*3, random()*3));
      }
        this.ready = soundsReady == sndData.length;
        if(!this.musicPlaying && this.ready){
            this.titleSong = playSound(sounds.titleSong, 1, 0, 0.4, true);
            this.musicPlaying = true;
        }
        if(Key.justReleased(Key.SPACE) || Key.justReleased(Key.w) || mouse.pressed){
           // console.log('space pressed');
           //playSound(sounds.titleSong, 1, 0, 0.5, true);
           state = "game";
          // this.titleSong.sound.stop();
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
        fillRect(0,0,soundsReady*inc,10,21,21);
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
            this.ready?"PRESS OR CLICK TO PLAY":"ASSETS OFFLINE. LOADING...", WIDTH/2, 190, 1, 9,
            'center',
            'top',
            1,
            22,
            0
          ]);
    }



};
