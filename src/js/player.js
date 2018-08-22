player = {
    x:500,
    y:500,
    xVel: 0,
    yVel: 0,
    xVelMax: 400,
    yVelMax: 400,

    oldX: 0,
    oldY: 0,
    speedX: 50,
    speedY: 50,
    width: 6,
    height: 8,
    color: 25,

    tx: 0,
    ty: 0,
    gid: 0,

    draw: function() {
      fillRect(this.x-viewX, this.y-viewY, this.x-viewX+this.width, this.y-viewY+this.height, this.color, this.color-1);
    },

    update: function() {
        player.oldX = player.x;
        player.oldY = player.y;
        player.yVel += gravity;

        if(Key.isDown(Key.d)|| Key.isDown(Key.RIGHT)){
            player.xVel = player.speedX;
        }

        else if(Key.isDown(Key.a)|| Key.isDown(Key.LEFT)){
            player.xVel = -player.speedY;
        }
        
        if(Key.isDown(Key.w)|| Key.isDown(Key.UP)){
            player.yVel -= 20;
        }

        else if(Key.isDown(Key.s)|| Key.isDown(Key.DOWN)){
            //player.yVel ;
        }
        //integrate motion--
        player.x += player.xVel * 1/60;
        player.y += player.yVel * 1/60;

        //--collision response--
        if(getTile(player.x, player.y) == 1){
            player.xVel = 0;
            player.yVel = 0;
            player.x = player.oldX;
            player.y = player.oldY;
        }
        if(Key.isDown(Key.SPACE)){
            console.log(getGID(player.x,player.y) + ', ' + getTile(player.x,player.y));
        }
    },

    updatePosition: function() {
      this.tx = this.x / tileWidth | 0;
      this.ty = this.y / tileHeight | 0;
      this.gid = COLLISION + this.tx + this.ty * WIDTH;
    }

  }