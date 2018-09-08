function Bullet(x,y,color,xspeed,yspeed, life=90){
    this.x = x;
    this.y = y;
    this.width = 4;
    this.height = 4;
    this.xspeed = xspeed;
    this.yspeed = yspeed;
    this.life = life;

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
        let sx = this.x - viewX, sy = this.y-viewY;
        fillCircle(sx+this.width/2, sy+this.width/2, this.width*2, 22, 22);
        for(let i = 0; i < 20; i++){
            particles.push(new Particle(this.x,this.y, 22, random()-.5, random()*.5,20));
          }
        bullets.splice( bullets.indexOf(this), 1 );
    }
}

function Particle(x,y,color,xspeed,yspeed, life = 40){
    this.x = x;
    this.y = y;
    this.width = 1;
    this.height = 1;
    this.xspeed = xspeed;
    this.yspeed = yspeed;
    this.life = life;

    this.draw = function(){
        this.oldX = this.x;
        this.oldY = this.y;
        let sx = this.x - viewX;
        let sy = this.y - viewY;
        if(inView(sx,sy,24)){
            //pat = dither[random()*15|0]
            setColors(7, 4);
            pset(sx,sy);
            //pat = dither[8];
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
        
        particles.splice( particles.indexOf(this), 1 );
    }
}

function Battery(x,y){
    this.x = x;
    this.y = y;
    this.width = 4;
    this.height = 4;

    this.update = function(){
        let sx = this.x-viewX, sy=this.y-viewY;
        if(inView(sx,sy)){
            if(rectCollision(this,player)){
                this.kill();
                player.batteries++;
            }
        }
    }

    this.draw = function(){
        let sx = this.x-viewX, sy = this.y-viewY
        if(inView(sx,sy)){
            fillCircle(sx+2,sy+2,2,9);
        }
    }

    this.kill = function(){
        batteries.splice(batteries.indexOf(this),1);
    }
}

