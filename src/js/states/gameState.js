 states.game = {

    step: function(dt){
        player.update(dt);
        updateObjects();

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

        enemies.forEach(function(o){o.update();});
        bullets.forEach(function(o){o.update();});
        particles.forEach(function(o){o.update();});
        batteries.forEach(battery =>{ battery.update()})

        updateCollisions();

        

    },
  
    draw: function(dt){
        terrainColors = [
            [60,62,63,64,16,32],
            [25,26,27,28,29,30],
            [9,11,12,13,15,53],
            [21,20,19,18,17,16],
            [8,7,6,5,3,2],
        ]

        pat = dither[8];
        fillRect(0,0,WIDTH,HEIGHT, 2);
        renderTarget = SCREEN; clear(0);
        let tilepad = 3,
            rx0 = viewX/tileWidth - tilepad | 0,
            rx1 = (viewX + WIDTH)/tileWidth + tilepad | 0,
            ry0 = viewY/tileHeight - tilepad| 0,
            ry1 = (viewY + HEIGHT)/tileHeight + tilepad | 0;


        for(let i = rx0; i <rx1; i++){
            for(let j = ry0; j < ry1; j++){
                let tile = ram[COLLISION+j * mapWidth + i];
                let x, y;
                let tc = terrainColors[pget(i,j,MIDGROUND)];
                switch(tile){
                case 1:
                        setColors(tc[1],tc[2]);
                        x = i * tileWidth - viewX,
                        y = j * tileHeight - viewY;
                        let cw = tileWidth/2;
                        pat = dither[ram[BACKGROUND+j*mapWidth+i]];
                        fillRect(x,y, x+cw, y+cw);

                        pat = dither[ram[BACKGROUND+j*mapWidth+i-1]];
                        fillRect(x+cw,y, x+tileWidth, y+cw);

                        pat = dither[ram[BACKGROUND+j*mapWidth+i-2]];
                        fillRect(x+cw,y+cw, x+tileWidth, y+tileHeight);

                        pat = dither[ram[BACKGROUND+j*mapWidth+i-3]];
                        fillRect(x,y+cw, x+tileWidth, y+tileHeight);

                        if(getGID(i*tileWidth,(j+1)*tileHeight)==0){
                            pat = dither[8];
                            setColors(tc[3],tc[4]);
                            fillRect(x,y+cw,x+tileWidth,y+tileWidth);
                            line(x,y+cw,x+tileWidth,y+cw,tc[0],tc[0]);
                            line(x,y+tileHeight-1,x+tileHeight, y+tileHeight-1, 1,1);
                        }
                        if(getGID(i*tileWidth,(j-1)*tileHeight)==0){
                            line(x,y,x+tileWidth,y,tc[0],tc[0]);
                        }
                        if(getGID((i+1)*tileWidth,(j)*tileHeight)==0){
                            if(getGID(i*tileWidth,(j+1)*tileHeight)==0){
                                line(x+tileWidth-1,y,x+tileWidth-1,y+cw,tc[0],tc[0]);
                                line(x+tileWidth-1,y+cw,x+tileWidth-1,y+tileHeight-1,1,1);
                            }
                            else {
                                line(x+tileWidth-1,y,x+tileWidth-1,y+tileHeight-1,tc[0],tc[0]);
                            }
                        }
                        if(getGID((i-1)*tileWidth,(j)*tileHeight)==0){
                            if(getGID(i*tileWidth,(j+1)*tileHeight)==0){
                                line(x,y,x,y+cw,tc[0],tc[0]);
                                line(x,y+cw,x,y+tileHeight-1,1,1);
                            }
                            else {
                                line(x,y,x,y+tileHeight-1,tc[0],tc[0]);
                            }
                        }
                break;

                case 2: //switches
                //drawSwitch({x: i, y: j});
                break;

                default:
                    x = i * tileWidth - viewX,
                    y = j * tileHeight - viewY;
                    //tileng.seed = i*j;
                    pat = dither[ram[BACKGROUND+j*mapWidth+i]];
                    fillRect(x,y, x+tileWidth, y+tileHeight, tc[4],tc[5]);
                    //rect(x,y,x+tileWidth, y+tileHeight, 2,3);
                }
            }
        } //end map draw loop
        //drawObjects();
        drawSwitches();
        enemies.forEach(function(o){o.draw()});
        bullets.forEach(function(o){o.draw()});
        particles.forEach(function(o){o.draw()});
        batteries.forEach(function(o){o.draw()});

        

        player.draw();
        
        //minimap---------------------------------------
        // fillRect(WIDTH-60,HEIGHT-60,WIDTH-5,HEIGHT-5,0,0);
        // rect(WIDTH-60,HEIGHT-60,WIDTH-5,HEIGHT-5,22,22);
        // renderSource = COLLISION;
        // mapPal = [1,7];
        // spr(rx0-18,ry0-18,54,54,WIDTH-59,HEIGHT-59,0,0,mapPal);
        // setColors(22,22);
        // pset((player.x-viewX)/tileWidth+WIDTH-56+18, (player.y-viewY)/tileHeight+HEIGHT-56+18)
        //enemies.forEach()

        //healthbar---------------------
        setColors(22,22);
        text([
                'HEALTH', 5, 5, 1, 1,
                'left',
                'top',
                1,
                22,
                player.hit?2:0,
                4
              ]);
        pat = dither[8];
        fillRect(42,5,42+player.health/2,10, 64,11);
        //score---------------------------
        setColors(22,22);
        text([
            'SCORE ' + ''+multiplier.pad(3) + 'X ' + score.pad(11), WIDTH-5, 5, 1, 1,
            'right',
            'top',
            1,
            22,
            player.score?2:0,
            4
          ]);

          text([
            'CELLS ' + player.batteries.pad(4), 160, 5, 1, 1,
            'right',
            'top',
            1,
            22,
            player.score?2:0,
            4
          ]);

        //mousecursor-----------
        circle(mouse.x, mouse.y, 3, 22);      
    }

}
