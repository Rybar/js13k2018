states.menu = {
    ready: false,
    musicPlaying: false,
    titleSong: {},
    step: function(dt){
        this.ready = soundsReady == sndData.length;
        if(!this.musicPlaying && this.ready){
            this.titleSong = playSound(sounds.titleSong, 1, 0, 0.4, true);
            this.musicPlaying = true;
        }
        if(Key.justReleased(Key.SPACE)){
           // console.log('space pressed');
           //playSound(sounds.titleSong, 1, 0, 0.5, true);
           state = "game";
          // this.titleSong.sound.stop();
        }

    },
    
    draw: function(dt){
        renderTarget = SCREEN;
        clear(0);
        renderSource = COLLISION;
        mapPal = [1,31];
        spr(0,0,WIDTH,HEIGHT,0,0,0,0,mapPal);

        // fillRect(0,0,20,20,4);
        // text([
        //     'OFFLINE\nGAME', WIDTH/2, 100, 3, 9,
        //     'center',
        //     'top',
        //     5,
        //     21,
        //     0
        //   ]);
        let inc = WIDTH/sndData.length;
        fillRect(0,0,soundsReady*inc,10,21,21);
        setColors(22,22);
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
            this.ready?"PRESS SPACE TO PLAY":"ASSETS OFFLINE. PLEASE WAIT..", WIDTH/2, 190, 1, 9,
            'center',
            'top',
            1,
            22,
            0
          ]);
    }



};
