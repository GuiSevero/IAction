  <div class="row-fluid">
            <div class="span12">
             
              <div id="canvasarea">
                    <h2>Desenho</h2>                                 
                    <div class="canvas-border">
                      <div id="current-color" style="background: green;" > <i class="icon-pencil icon-white"></i></div>
                      <canvas id="canvas" width="500" height="300" >NO CANVAS FOR YOU</canvas><br>                      
                    </div>

              </div> <!-- /canvasarea -->
            </div>
          </div> <!-- /row -->        

   <script  type="text/javascript">
        

        //Carrega biblioteca de desenho
          console.log('Carregando Canvas');
          PixelCanvas.init(document.getElementById("canvas"), socket, false);  



        //Seta eventos de desenho
        socket.on('drawPixel', function(data){         
          PixelCanvas.redrawPixel(data.x, data.y);

          });

        socket.on('changeColor', function(data){
          PixelCanvas.rechangeColor(data.c);
        });

        socket.on('changeBrush', function(data){
          PixelCanvas.rechangeBrush(data.s);
        });

        socket.on('clearCanvas', function(data){
          PixelCanvas.clearCanvas();
        });

      //evento que redesenha um desenho ja iniciado - para usuarios que se conectaram apos o jogo comecar
      // note que este desenho sera propositalmente desenhado em preto e branco  
      socket.on('repaint', function(paint){
      console.log('redesenhando');
        for(i in paint){          
          PixelCanvas.redrawPixel(paint[i].x, paint[i].y);          
        }

      })

    </script>