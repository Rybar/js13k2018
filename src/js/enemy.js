function Enemy(x,y,health) {
    this.x = x+2;
    this.y = y+2;
    this.width = 16;
    this.height = 16;
    this.health = health;
    this.facingLeft = true;
    this.following = false;
    this.draw = function(){
        let sx = this.x - viewX;
        let sy = this.y - viewY;
        let ymod = t%30 > 15;
        if(inView(sx,sy,24)){
            fillRect(sx,sy-ymod,sx+this.width,sy+this.height,0,0);
            rect(sx,sy-ymod,sx+this.width,sy+this.height,17,17);
            fillRect(sx+3,sy+3,sx+6,sy+4,22,22);
            if(this.following){
                fillRect(sx,sy,sx+this.width,sy+this.height,7,0);
            }
        }
    }
    this.update = function(){
        let sx = this.x - viewX,
            sy = this.y - viewY;
        this.following = false;
        let tick = t%30 > 0;
        if(inView(sx, sy,24)){
            this.x += random() > .5 ? tick:-tick;
            this.y += random() > .5 ? tick:-tick;
            let xdelta = player.x-this.x, ydelta = player.y-this.y,
                distance = sqrt((ydelta*ydelta+xdelta*xdelta)),
                angle = atan2(ydelta, xdelta);
            if(distance < 100){
                this.following = true;
                this.x += cos(angle);
                this.y += sin(angle);
            } 
            
        }   
    }
}