states.menu = {

    step: function(dt){
        if(Key.justReleased(Key.SPACE)){
           // console.log('space pressed');
           playSound(sounds.titleSong, 1, 0, 0.5, true);
           state = "game";
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
        //   text([
        //     'PRESS SPACE TO PLAY', WIDTH/2, 190, 3, 9,
        //     'center',
        //     'top',
        //     2,
        //     21,
        //     0
        //   ]);
    }



};
