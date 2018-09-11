function Enemy(x,y, health, size=8, color=0) {
    this.colors=[58,59,38,39];
    this.color = colors[color];
    this.x = x;
    this.y = y;
    this.oldX = 0;
    this.oldY = 0;
    this.width = size;
    this.height = size;
    this.startHealth = health;
    this.health = health;
    this.hit = false;
    this.facingLeft = true;
    this.following = false;
    this.biting = false;
    this.draw = function(){
        this.oldX = this.x;
        this.oldY = this.y;
        let sx = this.x - viewX;
        let sy = this.y - viewY;
        let ymod = t%30 > 15;
        if(inView(sx,sy,24)){
            // fillCircle(sx+8,sy,8,22,22);
            // circle(sx,sy,8,17,17);
            // circle(sx,sy,2,0,0);
            pat=dither[8];
            fillRect(sx,sy-ymod,sx+this.width,sy+this.height,0,64);
            rect(sx,sy-ymod,sx+this.width,sy+this.height,this.color,this.color-1);
            //eyes
            let inc = this.width/5|0;
            setColors(22,22);
            fillRect(sx+inc,sy+inc,sx+inc+inc,sy+inc+inc,22,22);
            fillRect(sx+inc*3,sy+inc,sx+inc*4,sy+inc*2,22,22);
            
            
            if(this.biting){
                //rect(sx,sy-ymod,sx+this.width,sy+this.height,5,5);
            }
            if(this.health < this.startHealth ){
                //draw a health bar, but only after initial damage
                setColors(12,12);
                rect(sx, sy-3, sx+this.health, sy-2)
            }
            if(this.health < 0){
                this.kill();
            }
        }
    }
    this.update = function(){
        let sx = this.x - viewX,
            sy = this.y - viewY;
        this.following = false;
        this.biting = false;
        let tick = t%30 < 10;
        if(inView(sx, sy,24)){
            this.x += random() > .5 ? tick:-tick;
            this.y += random() > .5 ? tick:-tick;
            let xdelta = player.x-this.x, ydelta = player.y-this.y,
                distance = sqrt((ydelta*ydelta+xdelta*xdelta)),
                angle = atan2(ydelta, xdelta);
            if(distance < 100){
                this.following = true;
                this.x += cos(angle)*10/this.width;
                this.y += sin(angle)*10/this.width;;
            }
            if(rectCollision(this, player)){
                player.hit = true;
                player.health-=.1;
                this.biting = true;
            }
            if(this.hit){
                this.health-=3; 
                score += 5*multiplier;
                this.hit = false;
            }
            if(getGID(this.x,this.y) == 1 ||
               getGID(this.x+this.width, this.y) == 1 ||
               getGID(this.x+this.width, this.y+this.height) == 1 ||
               getGID(this.x, this.y+this.height) == 1
            ){
                this.x = this.oldX;
                this.y = this.oldY;
            } 
        }   
    } //end update

    this.kill = function(){
        //splode play
        let sx = this.x - viewX, sy = this.y - viewY,
        sndMod = this.width.map(0,32,1.7,0);
        playSound(sounds.sndSplode1, 1+sndMod, 0, 0.7, false);
        fillCircle(sx+this.width/2, sy+this.width/2, this.width*2, 22, 22);
        let emod1 = random(), emod2 = random(), emod3 = random(), emod4 = random();
        for(let i = 0; i < 40; i++){
            particles.push(new Particle(this.x,this.y, 7, random()*3-1.5, random()*3-1.5));
          }
          for(let i = 0; i < 50; i++){
            particles.push(new Particle(this.x,this.y, 19, cos(360/i)*(emod1), sin(360/i)*(1+emod2),15));
          }
          for(let i = 0; i < 50; i++){
            particles.push(new Particle(this.x,this.y, 19, cos(360/i)*(1+emod3), sin(360/i)*(emod4),15));
          }
        if(random()>.5){
            batteries.push(new Battery(this.x+1, this.y+1));
        }
        score += 100*this.width*multiplier;
        enemies.splice( enemies.indexOf(this), 1 );

    }
}  //end enemy