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

//Define o nivel de log do aplicativo
io.set('log level', 1);


app.configure(function () {
    app.use(express.static(__dirname))
})


server.listen(8000)

io.sockets.on('connection', function (socket) {


    socket.emit('refreshUsers', game)




    /**
    * Eventos de conexão
    */
    socket.on('disconnect', function () {

        //Remove o jogador do time
        if(socket.username != undefined){
              
               game[socket.team].splice(findUser(game[socket.team], socket.username), 1)

              //Sai da sala multicast do time
              socket.leave(socket.team)
              console.log(socket.username + ' HAS BEEN  DISCONNECTED')
               //Atualiza lista de usuários 
              socket.broadcast.emit('refreshUsers', game)
        }       
      
       
    })



    socket.on('connectUser', function(p) {
      
      if(socket.username != undefined){
        //Remove o jogador do time
        game[socket.team].splice(findUser(game[socket.team], socket.username), 1)

        //Sai da sala multicast do time
        socket.leave(socket.team)
      }


      //Registra informações no socket
      socket.username = p.username
      socket.team = p.team

      var user = {
        'team': p.team,
        'username': p.username,
        'socket_id': socket.id
      }

      //game[p.team].push(p.username)
      game[p.team].push(user)
            
      //Coloca o usuário no seu time
      socket.join(p.team)

      console.log('\n' + p.username + ' entrou na sala ' + p.team)
      console.log('\nUsuários na sala ' + p.team  + ':' + io.sockets.manager.rooms['/' + p.team].length)

      if(game.started){
          socket.emit('startGameWatcher', game)
          socket.emit('repaint', paint)          
      }
      
      
      //Atualiza usuários de todos os clientes conectados      
      io.sockets.emit('refreshUsers', game)

      
      
     // io.sockets.sockets[socket.id].emit('startGameOpiner')
  })

   


     /**
     * Eventos do jogo
     */

     socket.on('repaint', function(){
      socket.emit('repaint', paint)
     })

     socket.on('canStart', function(callback){

        var teamA = 0;  
        var teamB = 0;

        if(io.sockets.manager.rooms['/teamA'] != undefined){
          teamA = io.sockets.manager.rooms['/teamA'].length    
        }

        if(io.sockets.manager.rooms['/teamB'] != undefined){
          teamB = io.sockets.manager.rooms['/teamB'].length    
        }
       

       console.log("TIME A " + teamA + " x TIME B" + teamB)

       if(teamB >= 2 && teamA >=2)
          callback(true) // o jogo pode começar
        else
          callback(false) // falta mais gente para começar
 

     })


     socket.on('startGame', function(){
      
        //Faz circular o array.
        currentObjective = objectives.shift();
        objectives.push(currentObjective)

        //O primeiro a dar o "startGame" será o primeiro a jogar

        game.player_turn = socket.username
        game.team_turn = socket.team
        game.started = true
        game.objective = currentObjective;
      
        //Evento para quem criou o jogo
        socket.emit('startGameDrawer', game)


        //Dispara Game Watcher para membros do outro time
        if(socket.team == 'teamA'){
           socket.broadcast.to('teamB').emit('startGameWatcher', game)            
        }else{
          io.sockets.in('teamA').emit('startGameWatcher', game)
        }
                

          //Evento para os membros da equipe
        game.objective = ''
        socket.broadcast.to(socket.team).emit('startGameOpiner', game)             
              
       })


       socket.on('newgame', function(data){

        //Faz circular o array.
        currentObjective = objectives.shift();
        objectives.push(currentObjective)

        //faz circular o antigo time
        old_player = game[socket.team].shift()
        game[socket.team].push(old_player)

        //O primeiro a dar o "startGame" será o primeiro a jogar

        if(socket.team == 'teamA'){
          game.team_turn = 'teamB'
        }else{
          game.team_turn = 'teamA'
        }

        player = game[game.team_turn].shift()
        game[game.team_turn].push(player)

        game.player_turn = player.username
        
     

        game.objective = currentObjective;

       

        //Eventos para todo mundo
        io.sockets.in(socket.team).emit('startGameWatcher', game)
        

          //Evento para os membros da equipe
        
        //socket.broadcast.to(game.team_turn).emit('startGameOpiner', game)
        io.sockets.sockets[player.socket_id].broadcast.to(player.team).emit('startGameOpiner', game)

         //Evento para quem criou o jogo
          
        io.sockets.sockets[player.socket_id].emit('startGameDrawer', game)
        
     })

     socket.on('opinion', function(opinion, result){
      if(opinion == currentObjective){
        result(true);
        socket.broadcast.emit('endgame', socket.username)
      }else{
        result(false);
      }
     })


    /**
    * Eventos de desenho
    */ 
    socket.on('changeColor', function (data) {
        socket.broadcast.emit('changeColor', data)
    })


    socket.on('changeBrush', function (data) {
        socket.broadcast.emit('changeBrush', data)
    })

    socket.on('drawPixel', function (data) {
        socket.broadcast.emit('drawPixel', data)
        paint.push(data)
    })

    socket.on('clearCanvas', function (data) {
        paint = []
        socket.broadcast.emit('clearCanvas', data)
    })


    /**
    * Eventos auxiliares
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
