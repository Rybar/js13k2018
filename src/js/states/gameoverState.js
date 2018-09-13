states.gameover = {

    step: function(dt){
        if(Key.justReleased(Key.SPACE)){
           // console.log('space pressed');
            //reset();
            player.health = 100;
            score = 0;
            player.batteries = 20;
            player.x = 160*24;
            player.y = 100*24;
            player.score = 0;
            enemies = [];
            batteries = [];
            spawnEnemies(12000);
            counts.switchesActivated = 0;
            counts.enemiesKilled = 0;
            counts.totalEnemies = enemies.length;
            switches.forEach(s=>{s.state = 0});
            //createSwitches();
            
            renderTarget = MIDGROUND;
            fillRect(0,0,mapWidth,mapHeight,0,0);
            renderTarget = SCREEN;
            state = 'game';
        }
    },
    
    draw: function(dt){
        renderTarget = SCREEN;
        clear(0);
        renderSource = COLLISION;
        mapPal = [1,31];
        spr(0,0,WIDTH,HEIGHT,0,0,0,0,mapPal);
        switches.forEach(s => {
            if(s.state ==4){
                setColors(22,22);
                pset(s.x,s.y);
            }
        })
        
       
        // fillRect(0,0,20,20,4);,
        setColors(7,7)
        text([
            'THIS GAME MADE POSSIBLE BY\nTHE AMAZING TRAVIS GERLECZ\nWHO LENT ME HIS LAPTOP\nFOR THE MONTH OF JS13K', WIDTH/2, 10, 2, 3,
            'center',
            'top',
            1,
            7,
            0
          ]);
        setColors(0,5);
        text([
            'GAME OVER', WIDTH/2, 80, 3, 9,
            'center',
            'top',
            4,
            4,
            16,10,3
          ]);
          setColors(7,7);
          text([
            counts.enemiesKilled + " ACHROMATS VANQUISHED\n" + counts.switchesActivated + " CHROMA NODES RESTORED" , WIDTH/2, 150, 2, 7,
            'center',
            'top',
            1,
            7,
            0
          ]);
          setColors(22,22);
          text([
            'PRESS SPACE TO PLAY AGAIN', WIDTH/2, 175, 2, 9,
            'center',
            'top',
            1,
            7,
            0
          ]);
    }



};
