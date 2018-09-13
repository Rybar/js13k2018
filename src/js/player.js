player = {
    x:24*160,
    y:24*100, 
    oldX: 0,
    oldY: 0,
    vx: 1.8,
    vy: 1.8,
    width: 6,
    height: 10,
    color: 12,
    gravity = 4,
    health: 100,
    tx: 0,
    ty: 0,
    steps: 0,
    index: 0,
    hit: false,
    xm: 0,
    ym: 0,
    batteries: 100,
    color: 22,

    draw: function(dt) {
        let sx = this.x-viewX;
        let sy = this.y-viewY;
        //let vlegmod = this.y%28 > 14 || this.x%28 >14 ? 0 : 1;
        //let hlegmod = this.x%20 > 10 ? 0 : 1; 
        let vlegmod = this.steps%20 > 10 ? 0:1;
        let vheadmod = this.steps%30 > 15 ? 0: 1;
      setColors(this.color,this.color);  
      //rect(sx, sy, sx+this.width, sy+this.height, this.color, this.color-1);
      fillRect(sx+1, sy+vheadmod, sx+5, sy+4+vheadmod); //head height
      fillRect(sx, sy+1+vheadmod, sx+this.width, sy+3+vheadmod); //head width
      fillRect(sx+2,sy+2, sx+4, sy+8)
      pset(sx,sy+7) //left hand
      pset(sx+6,sy+7) //right hand
      line(sx+1,sy+6,sx+5,sy+6) //upper arms
      line(sx+1, sy+9, sx+1, sy+10+vlegmod)  
      line(sx+5, sy+9, sx+5, sy+10+!vlegmod)  

    },

    fire: function(control){
        var areaType = pget(this.x/tileWidth|0, this.y/tileHeight|0, MIDGROUND);
        var xspeed, yspeed, scalar
        
        if(control == 1){ //gamepad
            scalar = hypot(gp.axes[2], gp.axes[3]);
            xspeed = gp.axes[2] / scalar * 6, yspeed = gp.axes[3] / scalar * 6;
            
        }
        else if(control==0){ //mouse
            var sx = this.x - viewX;
            var sy = this.y - viewY;
            var dx = mouse.x - sx;
            var dy = mouse.y - sy;
            scalar = hypot(dx,dy);
            xspeed = dx/scalar * 6, yspeed = dy/scalar * 6
        }

        switch(areaType){
            case 1:
            if(t%7<1){
                bullets.push(new Bullet(this.x+3,this.y+5, 27, xspeed, yspeed, 100, 1))
                playSound(sounds.sndGun, 1, 0, 0.5, 0);
            }
            break;
            case 2:
            if(t%14<1){
                bullets.push(new Bullet(this.x+3,this.y+5, 11, xspeed+sin1(.1), yspeed+cos1(.1)))
                bullets.push(new Bullet(this.x+3,this.y+5, 11, xspeed, yspeed))
                bullets.push(new Bullet(this.x+3,this.y+5, 11, xspeed-sin1(.2), yspeed-cos1(.2)))
                bullets.push(new Bullet(this.x+3,this.y+5, 11, xspeed-sin1(.3), yspeed-cos1(.3)))
                bullets.push(new Bullet(this.x+3,this.y+5, 11, xspeed-sin1(.4), yspeed-cos1(.4)))
                bullets.push(new Bullet(this.x+3,this.y+5, 11, xspeed-sin1(.5), yspeed-cos1(.5)))
                playSound(sounds.sndGun, 1, 0, 0.5, 0);
            }
            break;
            case 3:
            if(t%2<1){
                bullets.push(new Bullet(this.x+3,this.y+5, 20, xspeed*cos(t), yspeed*sin(t),90))
                playSound(sounds.sndGun, 1, 0, 0.5, 0);
            }
            break;
            case 4:
            if(t%2<1){
                bullets.push(new Bullet(this.x+3,this.y+5, 7+round(random()*3-1.5), xspeed/3.5+random()*.4-.8, yspeed/3.5+random()*.4-.8,40))
                playSound(sounds.sndGun, .7, 0, 0.5, 0);
            }
            break;
            default:
            if(t%7<1){
                bullets.push(new Bullet(this.x+3,this.y+5, 9, xspeed, yspeed))
                playSound(sounds.sndGun, 1, 0, 0.5, 0);
            }
            break;
        }
    },

    mouseFire: function(){
        if(t%5<1){
            let sx = this.x - viewX;
            let sy = this.y - viewY;
            let dx = mouse.x - sx;
            let dy = mouse.y - sy;
            let scalar = hypot(dx,dy);
            let xspeed = dx/scalar * 6, yspeed = dy/scalar * 6
            bullets.push(new Bullet(this.x+3,this.y+5, 9, xspeed, yspeed))
            playSound(sounds.sndGun, 0.7, 0, 0.3, 0);
        }
    },

    update: function() {
        this.color = 22;
        this.oldX = player.x;
        this.oldY = player.y;
        let sx = player.x - viewX;
        let sy = player.y - viewY;
        this.xm = 1;
        //t/his.ym = 0;

        if(this.hit){
           // console.log("i'm hit!")
            player.health-=.3;
            this.hit = false;
            this.color = 6;
            multiplier = 1;
        }

        if(player.health < 0){
            this.kill();
            state = "gameover";
        }

        if(Key.isDown(Key.d)|| Key.isDown(Key.RIGHT)){
            this.x += this.vx; this.steps++; 
        }

        else if(Key.isDown(Key.a)|| Key.isDown(Key.LEFT) || Key.isDown(Key.q)){
            this.x -= this.vx; this.steps++; 
        }
        
        if(Key.isDown(Key.w)|| Key.isDown(Key.UP) || Key.isDown(Key.z)){
            this.y -= this.vy; this.steps++; 
        }

        else if(Key.isDown(Key.s)|| Key.isDown(Key.DOWN)){
            this.y += this.vy; this.steps++; 
        }
    
        if(gp){  //gamepad

            // if(buttonPressed(gp.buttons[3]) ) this.x+=this.vx;
            // else if(buttonPressed(gp.buttons[2]) ) this.x-=this.vx;
            // if(buttonPressed(gp.buttons[0]) ) this.y-=this.vy;
            // else if(buttonPressed(gp.buttons[1]) ) this.y+=this.vy;
      
            if( (abs(gp.axes[0]) ) > .1){this.x+= this.vx * gp.axes[0]; this.steps++; }//allow for deadzone
            if( (abs(gp.axes[1]) ) > .1){ this.y+= this.vy * gp.axes[1]; this.steps++; }

            if( (abs(gp.axes[2]) ) > .1){ this.fire(1); }
            if( (abs(gp.axes[3]) ) > .1){ this.fire(1); }
            
           
          }

          if(mouse.pressed == 1){ this.fire(0);}

        //--collision response--
        // if(getGID(this.x, this.y) == 1 ||
        //    getGID(this.x+this.width, this.y) ==1 ||
        //    getGID(this.x+this.width, this.y+this.height) ==1 ||
        //    getGID(this.x, this.y+this.height) == 1 
        //    ){
        //     //this.xVel = 0;
        //     this.x = this.oldX;
        //     this.y = this.oldY;
        // }
        if(getGID(this.x, this.oldY) == 1 ||
           getGID(this.x+this.width, this.oldY) ==1 ||
           getGID(this.x+this.width, this.oldY+this.height) ==1 ||
           getGID(this.x, this.oldY+this.height) == 1 
           ){
                this.x = this.oldX;
            }

        if(getGID(this.oldX, this.y) == 1 ||
           getGID(this.oldX+this.width, this.y) ==1 ||
           getGID(this.oldX+this.width, this.y+this.height) ==1 ||
           getGID(this.oldX, this.y+this.height) == 1 
           ){
            //this.xVel = 0;
            this.y = this.oldY;
            }
        
        let onSwitch = (getGID(this.x, this.y) == 2 ||
        getGID(this.x+this.width-1, this.y) ==2 ||
        getGID(this.x+this.width-1, this.y+this.height-1) ==2 ||
        getGID(this.x, this.y+this.height-1) == 2 
        )
        if(onSwitch){
            foundSwitch = switches.find(function(e){
                return e.index == getIndex(player.x, player.y)});
            if(foundSwitch && foundSwitch.state < 4){
                if(foundSwitch.state <= 3){
                    if(player.batteries > 0){
                        if(foundSwitch.state == 3){
                            playSound(sounds.cellComplete,1,0,0.7,0);
                            score += 20000*multiplier;
                            player.health +=2;
                            renderTarget = MIDGROUND;
                            fillCircle(player.x/tileWidth,player.y/tileWidth, 4, foundSwitch.color, foundSwitch.color);
                            renderTarget = SCREEN;
                        }
                        playSound(sounds.powerLevel,1,0,0.7,0);
                        foundSwitch.state++;
                        player.batteries--
                        score += 2500*multiplier;
                    }
                    
                }
                
                
            }
        }
        
        // if(Key.isDown(Key.c)){
        //     //console.log('bullet spawned');
        //     if(t%10<1){
        //         let xspeed = this.xm * 5;
        //         let yspeed = this.ym * 5;
        //         bullets.push(new Bullet(this.x+3,this.y+5, 5, xspeed, yspeed))
        //     }
            
        // }

        
        
        
    },

    kill: function() {
        counts.enemiesKilled = counts.totalEnemies - enemies.length;
        counts.switchesActivated = switches.filter(s =>{return s.state == 4}).length;
        counts.scores.push(score);
    }


  }