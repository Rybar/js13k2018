states.gameover = {

    step: function(dt){
        if(Key.justReleased(Key.SPACE)){
           // console.log('space pressed');
            player.health = 100;
            player.x = 180*tileWidth;
            player.y = 100*tileWidth;
            state = "game";
        }

    },
    
    draw: function(dt){
       
        // fillRect(0,0,20,20,4);,
        clear(0);
        setColors(0,4);
        text([
            'GAME\nOVER', WIDTH/2, 30, 3, 9,
            'center',
            'top',
            10,
            4,
            16,10,3
          ]);
          text([
            'PRESS SPACE TO PLAY AGAIN', WIDTH/2, 160, 2, 9,
            'center',
            'top',
            1,
            7,
            0
          ]);
    }



};
