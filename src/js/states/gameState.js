 states.game = {

    step: function(dt){
        player.update(dt);
        player.updatePosition();
        
        //follow player
        if(player.x - viewX + deadzoneX > viewW){
            viewX = player.x - (viewW - deadzoneX)
        }
        else if(player.x - deadzoneX < viewX){
            viewX = player.x - deadzoneX
        }
        if(player.y - viewY + deadzoneY > viewH){
            viewY = player.y -(viewH - deadzoneY)
        }
        else if(player.y - deadzoneY < viewY){
            viewY = player.y - deadzoneY
        }

        //player vs map
        

    },
  
    draw: function(dt){

        pat = dither[8];
        renderTarget = EFFECTS; clear(0);
        fillRect(0,0,WIDTH,HEIGHT, 2);
        renderTarget = SCREEN; clear(0);        
        for(let i = 0; i < WIDTH; i++){
            for(let j = 0; j < HEIGHT; j++){
                let cell = ram[COLLISION+j * WIDTH + i];
                //console.log(cell)
                if(cell == 1){
                    let x = i * tileWidth - viewX,
                        y = j * tileHeight - viewY;
                    if(inView(x,y, tileWidth)){
                        fillRect(x+1,y+1, x+tileWidth-1, y+tileHeight-1, 8,7);
                        rect(x,y,x+tileWidth+1, y+tileHeight+1, 6,7);
                        renderTarget = EFFECTS;
                        //pat = dither[0];
                        fillCircle(x+tileWidth/2, y+tileWidth/2, 32,5,5);
                        renderTarget = SCREEN;
                    }        
                }
                else {
                    let x = i * tileWidth - viewX,
                        y = j * tileHeight - viewY;
                        if(inView(x,y, tileWidth)){
                            
                                fillRect(x,y, x+tileWidth, y+tileHeight, 2,1);
                                rect(x,y,x+tileWidth, y+tileHeight, 2,3);

                        }
                    
                }
            }
        } //end map draw loop

        player.draw();
        // renderTarget = EFFECTS;
        // clear(0);
        // fillRect(0,0,WIDTH,HEIGHT,1,3);
        // pat = dither[8];
        // fillCircle(128,128,128,3,4);
        // fillCircle(128,128,100,4,5);
        // fillCircle(128,128,64,5,6);
        // renderTarget = SCREEN;
    }

};
