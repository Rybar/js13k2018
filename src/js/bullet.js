function Bullet(x,y,color,xspeed,yspeed){
    this.x = x;
    this.y = y;
    this.width = 4;
    this.height = 4;
    this.xspeed = xspeed;
    this.yspeed = yspeed;
    this.life = 90;

    this.draw = function(){
        this.oldX = this.x;
        this.oldY = this.y;
        let sx = this.x - viewX;
        let sy = this.y - viewY;
        if(inView(sx,sy,24)){
            pat = dither[random()*15|0]
            setColors(this.color, 22);
            fillRect(sx,sy,sx+4, sy+4,this.color,22)
            pat = dither[8];
        }
    }
    this.update = function(){
        this.life--
        this.oldX = this.x;
        this.oldY = this.y;
        this.x += this.xspeed;
        this.y += this.yspeed;
        let sx = this.x - viewX;
        let sy = this.y - viewY;

        if(getGID(this.x,this.y) == 1)this.kill();
        
        if(this.life < 0)this.kill();
        
    }

    this.kill = function(){
        //splode play
        bullets.splice( bullets.indexOf(this), 1 );
    }
}