  <div class="row-fluid">
            <div class="span12">
             
              <div id="canvasarea">
                    <h2>Desenho</h2>
                    
                    <div class="toolbar well">
                      <div class="color" style="background: red; color: white;">Red</div>
                      <div class="color" style="background: green; color: white;" >Green</div>
                      <div class="color" style="background: blue; color: white;" >Blue</div>
                      <div class="color" style="background: black; color: white;" >Black</div>
                      <div class="color" style="background: white; color: black;" >White</div>
                      <div class="color" style="background: yellow; color: black;" >Yellow</div>
                      <div class="color" style="background: lightblue; color: black;" >L. Blue</div>
                      <div class="color" style="background: purple; color: white;" >Purple</div>
                      <hr>
                      <div class="brush" size="20" style="padding: 8px;" >20px</div>
                      <div class="brush"  size="10" style="padding: 3px;" >10px</div>
                      <div class="brush" size="5" style="padding: 1px;" >5px</div>
        
                    </div>
              
                    <div class="canvas-border">
                      <div id="current-color" style="background: green;" > <i class="icon-pencil icon-white"></i></div>
                      <canvas id="canvas" width="500" height="300" >NO CANVAS FOR YOU</canvas><br>
                      <input id='reset-btn' type="button" name="" value="Reset" class="btn btn-info btn">
                    </div>

              </div> <!-- /canvasarea -->
            </div>
          </div> <!-- /row -->        

   <script  type="text/javascript">
        

          //Inicia os objetos de desenho
          console.log('Carregando Canvas');
          PixelCanvas.init(document.getElementById("canvas"), socket, true);  

          var canvastool = document.getElementById("canvasarea").getElementsByClassName("toolbar")[0];
          activatePixelToolbar(canvastool, PixelCanvas);



        //Eventos de desenho
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


        //Ao clicar em "reset" - limpa o desenho atual
         $('#reset-btn').click(function(){
            PixelCanvas.clearCanvas();
            socket.emit('clearCanvas');
      });
        
    </script>