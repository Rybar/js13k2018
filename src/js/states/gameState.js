 states.game = {

    step: function(dt){
        player.update(dt);

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
        let tilepad = 3,
            rx0 = viewX/tileWidth - tilepad | 0,
            rx1 = (viewX + WIDTH)/tileWidth + tilepad | 0,
            ry0 = viewY/tileHeight - tilepad| 0,
            ry1 = (viewY + HEIGHT)/tileHeight + tilepad | 0;

        for(let i = rx0; i < rx1; i++){
            for(let j = ry0; j < ry1; j++){
                let tile = ram[COLLISION+j * mapWidth + i];
                //console.log(cell)
                let x, y;
                switch(tile){
                case 1:
                        x = i * tileWidth - viewX,
                        y = j * tileHeight - viewY;
                        fillRect(x+1,y+1, x+tileWidth-1, y+tileHeight-1, 8,7);
                        rect(x,y,x+tileWidth+1, y+tileHeight+1, 6,7); 
                break;

                case 2: //switches
               // drawSwitch({x: i, y: j});
                break;

                default:
                    x = i * tileWidth - viewX,
                    y = j * tileHeight - viewY;
                    fillRect(x,y, x+tileWidth, y+tileHeight, 2,1);
                    rect(x,y,x+tileWidth, y+tileHeight, 2,3);
                }
            }
        } //end map draw loop
        drawSwitches();
        player.draw();

    }

};
