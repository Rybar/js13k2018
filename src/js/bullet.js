function Bullet(x,y,color,xspeed,yspeed, life=15){
    this.x = x;
    this.y = y;
    this.width = 4;
    this.height = 4;
    this.xspeed = xspeed;
    this.yspeed = yspeed;
    this.life = life;
    this.color = color;

    this.draw = function(){
        this.oldX = this.x;
        this.oldY = this.y;
        let sx = this.x - viewX;
        let sy = this.y - viewY;
        if(inView(sx,sy,24)){
            pat = dither[random()*15|0]
            setColors(this.color, this.color-1);
            fillCircle(sx,sy,2);
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
    this.color = color;

    this.draw = function(){
        this.oldX = this.x;
        this.oldY = this.y;
        let sx = this.x - viewX;
        let sy = this.y - viewY;
        if(inView(sx,sy,24)){
            //pat = dither[random()*15|0]
            renderTarget = SCREEN;
            setColors(this.color, this.color-1);
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
                multiplier++;
            }
            for(let i = 0; i < 3; i++){
                particles.push(new Particle(this.x+random()*4|0,this.y, random()*63|0, random()*.2-.1, random()*-2,5));
            }
        }
    }

    this.draw = function(){
        let sx = this.x-viewX, sy = this.y-viewY
        if(inView(sx,sy)){
            setColors(random()*63|0,random()*63|0)
            fillCircle(sx+2,sy+2,2);
        }
    }

    this.kill = function(){
        for(let i = 0; i < 40; i++){
            particles.push(new Particle(this.x,this.y, 22, random()*3-1.5, random()*3-1.5));
          }
          for(let i = 0; i < 50; i++){
            particles.push(new Particle(this.x,this.y, 12, cos(360/i)*3, sin(360/i)*3,20));
          }
        playSound(sounds.batteryPickup,1,0,.6,0);
        batteries.splice(batteries.indexOf(this),1);
    }
}

