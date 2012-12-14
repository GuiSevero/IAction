/**
* Servidor criado para o NodeJS com os frameworks Socket.IO e ExpressJS
* @authors - Guilherme Severo e Claudio Busatto
* 
* 
* UNIVERSIDADE FEDERAL DO RIO GRANDE DO SUL - Dezembro / 2012
* INF01151 - Sistemas Operacionais II (Claudio Geyer, Pedro de Botelho Marcos)
* Frameworks, APIs e Bibliotecas:
*
* NodeJS - http://nodejs.org/ - usado para javascript server-side. roda o motor V8 do google 
*
* Socket.IO - https://github.com/learnboost/socket.io - Usado para conexao dos usuarios via websockets
*
* ExpressJS - http://expressjs.com/ - Usado em complemento do socket.io para fazer o servidor http
*
* Twitter Bootstrap - twitter.github.com/bootstrap/ - Usado para gerar a pagina em HTML5
*
*
*  Manual: 
* - Coloque os arquivos da pasta 'www' no seu servidor web com php (ex: ApachePHP, XAMPP, WAMPP)
* - Instalo o NodeJS e rode o script server.js contido na pasta 'server'. Certifique-se que a porta 8000 esteja livre
* ou atualize a porta no arquivo server.js e index.php
* - Feito isso eh soh voce conectar os jogadores no endereco do seu servidor apache. Ex: serivdor.com
*  
*/

var express = require('express')
  , app = express()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server)
  , gameStarted = false 
  , objectives = ['dog', 'horse', 'house', 'car', 'ball', 'cat', 'batman', 'man', 'heart', 'mask']
  , paint = Array()
  , currentObjective = ''
  , game = {	
    //Objeto do jogo
    'teamA': Array(),
    'teamB': Array(),
    'team_turn': '',
    'player_turn': '',
    'starded': false
  }

//Define o nivel de log do aplicativo.
//Para debug utilize o valor 3
io.set('log level', 1);

//Configura o servidor do express
app.configure(function () {
    app.use(express.static(__dirname))
})

//Coloca o servidor ouvindo na porta 8000
server.listen(8000)

/**
 * Evento principal do servidor - Quando um cliente se conecta a ele
 * OBS: Podemos comparar o m�todo 'on' a um receive e o m�todo 'emit' a um send
 * Vale notar que temos sends ponto-a-ponto, multicast e broadcast.
 * Para os multicast temos 2 grupos: teamA e teamB no qual � alocado
 * os jogadores de cada time. 
 */

io.sockets.on('connection', function (socket) {
	
	//Ao se conectar o servidor envia evento de atualizacao dos usuarios online
	socket.emit('refreshUsers', game)
	

    /**
    * *************************************************************************
    * Eventos de conex�o
    * *************************************************************************
    */
	
	/**
	 * Remove um jogador do seu time e do seu grupo multicast
	 */
    socket.on('disconnect', function () {

        if(socket.username != undefined){ 
              
        		//Remove o jogador do time 
               game[socket.team].splice(findUser(game[socket.team], socket.username), 1)

              //Sai da sala multicast do time
              socket.leave(socket.team)
              console.log(socket.username + ' HAS BEEN  DISCONNECTED')
               //Atualiza lista de usuarios 
              socket.broadcast.emit('refreshUsers', game)
        }       
      
       
    })

    
    /**
     * Evento que conecta um usuario 
     * @param Object p - p.team: Time do usuario; p.username: Nome escolhido para o jogo
     */
    socket.on('connectUser', function(p) {
      
    	
      //Verifica se o cliente ja estava conectado com outro username	
      if(socket.username != undefined){
        //Remove o jogador do time
        game[socket.team].splice(findUser(game[socket.team], socket.username), 1)

        //Sai da sala multicast do time
        socket.leave(socket.team)
      }


      //Registra informa��es no socket
      socket.username = p.username
      socket.team = p.team

      //Cria um objeto User para guardar no objeto do jogo em seu devido time
      var user = {
        'team': p.team,
        'username': p.username,
        'socket_id': socket.id
      }

      //Coloca o usuario no seu time
      //Os times sao um hash no objeto game.
      //Cada time eh um array de objetos User
      game[p.team].push(user)
            
      //Conecta o socket no seu grupo
      socket.join(p.team)

      //Logs para debug
      console.log('\n' + p.username + ' entrou na sala ' + p.team)
      console.log('\nUsuários na sala ' + p.team  + ':' + io.sockets.manager.rooms['/' + p.team].length)

      //Verifica se o jogo ja havia comecado
      if(game.started){
          socket.emit('startGameWatcher', game)
          socket.emit('repaint', paint)          
      }
      
      
      //Atualiza clientes conectados      
      io.sockets.emit('refreshUsers', game)
  })

   


     /**
    * *************************************************************************
    * Eventos do Jogo
    * *************************************************************************
    */

  	/**
  	 * Redesenha para um novo usuario o desenho corrente 
  	 */
     socket.on('repaint', function(){
      socket.emit('repaint', paint)
     })

     /**
      * Verifica se ha jogadores suficientes (2 em cada time)
      * Retorna um ACK (callback) com a confirmarao se pode ou nao comecar o jogo
      */
     socket.on('canStart', function(callback){

        var teamA = 0;  
        var teamB = 0;
        
        //Calcula jogadores do time A
        if(io.sockets.manager.rooms['/teamA'] != undefined){
          teamA = io.sockets.manager.rooms['/teamA'].length    
        }

        //Calcula jogadores do time B
        if(io.sockets.manager.rooms['/teamB'] != undefined){
          teamB = io.sockets.manager.rooms['/teamB'].length    
        }
       
        //Log para debug
       console.log("TIME A " + teamA + " x TIME B" + teamB)

       
       //Verifica e envia o ACK de callback com true ou false.
       if(teamB >= 2 && teamA >=2)
          callback(true) // o jogo pode começar
        else
          callback(false) // falta mais gente para começar
 

     })


     /**
      * Um usuario dispara este evento e sera o primeiro a desenhar.
      * Este evento emite via multicast para os 2 grupos
      *  - Um para assistir o desenho (Grupo Oposto ao cliente)
      *  - Outro para adivinhar o desenho (membros do grupo deste cliente)
      */
     socket.on('startGame', function(){
      
        //'Gira' o array de objetivos
        currentObjective = objectives.shift();
        objectives.push(currentObjective)

        //Pega informacoes do usuario que comecou o jogo e seta variaveis
        game.player_turn = socket.username
        game.team_turn = socket.team
        game.started = true
        game.objective = currentObjective
        paint = []
      
        //Evento para quem criou o jogo a pagina de desenhar
        socket.emit('startGameDrawer', game)


        //Dispara para o time oposto a pagina para assistir ao desenho.
        if(socket.team == 'teamA'){
           socket.broadcast.to('teamB').emit('startGameWatcher', game)            
        }else{
          io.sockets.in('teamA').emit('startGameWatcher', game)
        }
                

        //Evento para os membros da sua equipe a pagina de adivinhar o desenho
        game.objective = ''
        socket.broadcast.to(socket.team).emit('startGameOpiner', game)             
              
       })


       /**
        * Altera os objetivos e inicia um novo jogo
        */
       socket.on('newgame', function(data){

    	// 'Gira' o array de objetivos
        currentObjective = objectives.shift();
        objectives.push(currentObjective)

        //Limpa o desenho atual
        paint = []

        //Coloca o player atual no fim da fila do seu grupo
        old_player = game[socket.team].shift()
        game[socket.team].push(old_player)

        //Troca o time que pertence a vez.
        if(socket.team == 'teamA'){
          game.team_turn = 'teamB'
        }else{
          game.team_turn = 'teamA'
        }

        //Pega o primeiro player da fila do time a jogar e o coloca no fim da fila
        player = game[game.team_turn].shift()
        game[game.team_turn].push(player)

        //Atualiza o jogador atual e seu objetivo corrente
        game.player_turn = player.username
        game.objective = currentObjective;

        //Envia evento para os clientes observadores
        io.sockets.in(socket.team).emit('startGameWatcher', game)
        
        //Dispara evento para seus companheiro opinarem
        io.sockets.sockets[player.socket_id].broadcast.to(player.team).emit('startGameOpiner', game)

        //Envia o evento para quem vai desenhar - ou seja - para o player selecionado
        //Player.socket_id identifica sua conexao
        io.sockets.sockets[player.socket_id].emit('startGameDrawer', game)
        
     })

     /**
      * Recebe a tentativa de acerto de um cliente
      * Se este cliente errar, os membros de sua equipe ter�o um cooldown de 8 segundos 
      * em que n�o podem opinar
      */
     socket.on('opinion', function(opinion, result){
      if(opinion == currentObjective){
        result(true); //Usuario acertou - envia evento de final de jogo
        socket.broadcast.emit('endgame', socket.username)
      }else{

        //Retorna falso para quem enviou a resposta
        result(false);

        //Ativa cooldown para os seus companheiros
        socket.broadcast.to(socket.team).emit('cooldown')

      }
     })


    /**
    * *************************************************************************
    * Eventos de desenho
    * *************************************************************************
    */
     
    //Troca a cor do desenho 
    socket.on('changeColor', function (data) {
        socket.broadcast.emit('changeColor', data)
    })

    //Troca o tamanho do pincel
    socket.on('changeBrush', function (data) {
        socket.broadcast.emit('changeBrush', data)
    })

    //desenha um pixel
    socket.on('drawPixel', function (data) {
        socket.broadcast.emit('drawPixel', data)
        paint.push(data)
    })

    //limpa o desenho atual
    socket.on('clearCanvas', function (data) {
        paint = []
        socket.broadcast.emit('clearCanvas', data)
    })


     /**
    * *************************************************************************
    * Eventos auxiliares
    * *************************************************************************
    */
    
    /**
     * tem a funcao de 'printf' - Usado para debug.
     */
    socket.on('alert', function(data) {
      console.log(data.text)
    })

    
}) 

/**
* Funcao auxiliar para procurar num time (array) o usuario com o nome user
*/
function findUser(team, user){

  for(i=0; i<team.length;i++){
    if(team[i].username == user)
      return i;
  }

  return -1;
}
