function Bullet(x,y,color,xspeed,yspeed){
    this.x = x;
    this.y = y;
    this.width = 2;
    this.height = 2;
    this.xspeed = xspeed;
    this.yspeed = yspeed;

    this.draw = function(){
        this.oldX = this.x;
        this.oldY = this.y;
        let sx = this.x - viewX;
        let sy = this.y - viewY;
        if(inView(sx,sy,24)){
            fillRect(sx,sy,sx+2,sy+2,this.color,22)
        }
    }
    this.update = function(){
        this.oldX = this.x;
        this.oldY = this.y;
        this.x += this.xspeed;
        this.y += this.yspeed;
        let sx = this.x - viewX;
        let sy = this.y - viewY;

        if(getGID(this.x,this.y) == 1){
            this.kill();
        }
        
    }

    this.kill = function(){
        //splode play
        bullets.splice( bullets.indexOf(this), 1 );
    }
}