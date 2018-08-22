states.menu = {

    step: function(dt){
        if(Key.justReleased(Key.SPACE)){
           // console.log('space pressed');
            state = "game";
        }

    },
    
    draw: function(dt){
        renderTarget = SCREEN;
        clear(0);
        fillRect(0,0,20,20,4);
        text([
            'OFFLINE\nGAME', WIDTH/2, 100, 3, 9,
            'center',
            'top',
            5,
            21,
            0
          ]);
          text([
            'PRESS SPACE TO PLAY', WIDTH/2, 190, 3, 9,
            'center',
            'top',
            2,
            21,
            0
          ]);
    }



};
