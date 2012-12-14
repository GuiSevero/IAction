  <div class="row-fluid">
            <div class="span12">
             
              <div id="canvasarea">
                    <h2>Desenho</h2>
                                    
              
                    <div class="canvas-border">
                      <div id="current-color" style="background: green;" > <i class="icon-pencil icon-white"></i></div>
                      <canvas id="canvas" width="500" height="300" >NO CANVAS FOR YOU</canvas><br>
                      <input id="opinion" name="opinion" class="element text large" type="text" maxlength="255" value="" placeholder="Write here"/ required><br> 
                      <input id="btnOpinion" class="btn btn-small btn-primary" type="button" name="btnOpinion" value="Send" required />
                    </div>

              </div> <!-- /canvasarea -->
            </div>
          </div> <!-- /row -->        

   <script  type="text/javascript">
   //variavel que indica se esta em cooldown ou nao
   var canOpine = true;
  
    //Envia a opiniao do usuario
   $('#btnOpinion').click(function(){
    //Se pode opinar envia a resposta.
        if(canOpine){
            socket.emit('opinion', $('#opinion').val(), function(result){
              if(result){          
                r = confirm('Voce Ganhou! Deseja nova partida?');
                if(r){
                  socket.emit('newgame');
                }
              }else{
                alert($('#opinion').val() + ' não é a resposta');
              }

        })
        }else{ // Não pode opinar. deve estar em cooldown
            alert('Você ainda não pode opinar')
        }
        
   })

          //Carrega biblioteca de desenho
          console.log('Carregando Canvas');
          PixelCanvas.init(document.getElementById("canvas"), socket);  


          //Seta cooldown de oito segundos 
         socket.on('cooldown', function(){
            canOpine = false;

            setTimeout(function(){
              //Depois de 8 segundos pode opinar
              canOpine = true;
            }, 8000)

         }) 


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
        
    </script>