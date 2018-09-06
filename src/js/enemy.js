function Enemy(x,y,health) {
    this.x = x;
    this.y = y;
    this.oldX = 0;
    this.oldY = 0;
    this.width = 16;
    this.height = 16;
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
            fillRect(sx,sy-ymod,sx+this.width,sy+this.height,0,0);
            rect(sx,sy-ymod,sx+this.width,sy+this.height,17,17);
            fillRect(sx+3,sy+3,sx+6,sy+4,22,22);
            if(this.following){
                fillRect(sx+4,sy+7,sx+11,sy+11,22,22);
                setColors(17,17);
                pset(sx+6,sy+7);pset(sx+12,sy+7);
            }
            if(this.biting){
                rect(sx,sy-ymod,sx+this.width,sy+this.height,5,5);
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
                this.x += cos(angle)*random()*.5;
                this.y += sin(angle)*random()*.5;
            }
            if(rectCollision(this, player)){
                player.hit = true;
                this.biting = true;
            }
            if(this.hit){
                this.health-=1;
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
        enemies.splice( enemies.indexOf(this), 1 );
    }
}  //end enemy