player = {
    x:100,
    y:100, 
    index:{x:0,y:0},
    oldX: 0,
    oldY: 0,
    vx: 2,
    vy: 2,
    width: 6,
    height: 10,
    color: 12,
    gravity = 4,
    tx: 0,
    ty: 0,
    gid: 0,

    draw: function(dt) {
        let sx = this.x-viewX;
        let sy = this.y-viewY;
        let vlegmod = this.y%28 > 14 ? 0 : 1;
        let hlegmod = this.x%20 > 10 ? 0 : 1;

        let vheadmod = this.y%40 > 20 ? 0: 1;
        
      //rect(sx, sy, sx+this.width, sy+this.height, this.color, this.color-1);
      fillRect(sx+1, sy+vheadmod, sx+5, sy+4+vheadmod, 22, 22); //head height
      fillRect(sx, sy+1+vheadmod, sx+this.width, sy+3+vheadmod); //head width
      fillRect(sx+2,sy+2, sx+4, sy+10)
      pset(sx,sy+7) //left hand
      pset(sx+6,sy+7) //right hand
      line(sx+1,sy+6,sx+5,sy+6) //upper arms
      line(sx+1, sy+10, sx+1, sy+11+vlegmod)  
      line(sx+5, sy+10, sx+5, sy+11+!vlegmod)  

    },

    update: function() {
        player.oldX = player.x;
        player.oldY = player.y;

        if(Key.isDown(Key.d)|| Key.isDown(Key.RIGHT)){
            player.x += player.vx;
        }

        else if(Key.isDown(Key.a)|| Key.isDown(Key.LEFT) || Key.isDown(Key.q)){
            player.x -= player.vx;
        }
        
        if(Key.isDown(Key.w)|| Key.isDown(Key.UP) || Key.isDown(Key.z)){
            player.y -= player.vy;
        }

        else if(Key.isDown(Key.s)|| Key.isDown(Key.DOWN)){
            player.y += player.vy;
        }

        //--collision response--
        if(getGID(player.x, player.y) == 1 ||
           getGID(player.x+player.width-1, player.y) ==1 ||
           getGID(player.x+player.width-1, player.y+player.height-1) ==1 ||
           getGID(player.x, player.y+player.height-1) == 1 
           ){
            player.xVel = 0;
            player.x = player.oldX;
            player.y = player.oldY;
        }

        if(Key.justReleased(Key.x)){
                let tile = getGID(player.x+player.width/2, player.y+player.height/2);
                //console.log(getIndex(player.x, player.y) + ', '+ tile )
                if(tile == 2){
                    foundSwitch = switches.find(function(e){return e.index == getIndex(player.x, player.y)});
                    //console.log(switches.find(function(e){return e.index == getIndex(player.x, player.y)}));
                    //console.log(getIndex(player.x, player.y))
                    //switches.find(function(element){
                    //return element.index == getIndex(player.x+2, player.y+2)
                    //}).state = 1;
                    if(foundSwitch){
                        foundSwitch.state = 1;
                    }
                }
        }
        
    },

    // updatePosition: function() {
    //   this.tx = this.x / tileWidth | 0;
    //   this.ty = this.y / tileHeight | 0;
    //   this.gid = COLLISION + this.tx + this.ty * WIDTH;
    // }

  }