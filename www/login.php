<div class="well well-small">
			<div class="hiddeble">
				<h2>Login</h2>
				<p>Choose your username.</p>				
				<label class="description" for="userName">Username</label>
				<input id="userName" name="userName" class="element text large" type="text" maxlength="255" value="" placeholder="Mario Bros"/ required><br> 

				<select id="team">
				  <option value="teamA">Team A</option>
				  <option value="teamB">Team B</option>				  
				</select>
				<br/>
			</div>

				<input id="btnConnect" class="btn btn-small btn-primary hiddeble" type="button" name="btnConnect" value="Connect" required />
				<input id="btnStartGame" class="btn btn-small btn-danger" type="button" name="btnStartGame" value="Start Game" required />
				<input id="serverIp" readonly name="serverIp" class="element text large" type="hidden" maxlength="255" value="http://<?php echo $_SERVER['SERVER_ADDR']; ?>"/> 					
				<input type="hidden" id="myIp" size="30" value="<?php echo $_SERVER['REMOTE_ADDR']; ?>"/><br>
				
</div>
<script>

var team, username;

//Connecta no socket
socket = io && io.connect(server);

//Conecta um usuario no servidor
$('#btnConnect').click(function(){

	if($('#userName').val() == ''){
		alert('Preencha o Login');
		return;
	}

	 username = $('#userName').val();
	 team = $("#team").val();

	//Coloa o nome do usuario no canto superior direito
	$('#lblUserName').html(username);

	socket.emit('connectUser', {username: username, team: team});

	$('.hiddeble').hide();
	//$('#main-content').load('drawer.php');

	
});



//Inicia o jogo
$('#btnStartGame').click(function(){

		
	//Verifica se o jogo pode começar
	socket.emit('canStart', function(canStart){

		if(canStart){

			r = confirm("DESEJA COMEÇAR O JOGO?")
			if(r)
				socket.emit('startGame');			
		}else{
			alert('PRECIAMOS DE PELO MENOS 2 JOGADORES DE CADA LADO');
		}
	});


	//$('#main-content').load('drawer.php');

	
});


//Atualiza lista de usuarios
//Objeto game contem as listas de usuarios de cada grupo
socket.on('refreshUsers', function(game){

	//remove todos os jogadores da tela de status
	$('.player').remove();	

	//recoloca os jogadores atualizados

	//recoloca o primeiro time
	for(i in game.teamA){
		if(game.teamA[i].username == username)
				$('#teamA').append('<li class="player active"><a>' + game.teamA[i].username + '</a></li>');
			else
				$('#teamA').append('<li class="player"><a>' + game.teamA[i].username + '</a></li>');
	}

	//recoloca o primeiro time
	for(i in game.teamB){
		if(game.teamB[i].username == username)
				$('#teamB').append('<li class="player active"><a>' + game.teamB[i].username + '</a></li>');
			else
				$('#teamB').append('<li class="player"><a>' + game.teamB[i].username + '</a></li>');
	}
	
})



//carrega pagina do jogador opinante
socket.on('startGameOpiner', function(game){
	$('#userObjective').html('');
	$('#main-content').load('opiner.php', function(){
		$('#userObjective').html('<ul class="nav nav-list"><li class="nav-header">Objetivo</li> ' + '<li><b>' + game.objective + '</b></li>'  + '</ul>');

	});
})


//carrega pagina de um jogador desenhista
socket.on('startGameDrawer', function(game){
	$('#main-content').load('drawer.php', function(){
		$('#userObjective').html('<ul class="nav nav-list"><li class="nav-header">Objetivo</li> ' + '<li><b>' + game.objective + '</b></li>'  + '</ul>');	
		
	});
	
})


//carrega pagina de um jogador observador
socket.on('startGameWatcher', function(game){
	$('#main-content').load('watcher.php', function(){
		$('#userObjective').html('<ul class="nav nav-list"><li class="nav-header">Objetivo</li> ' + '<li><b>' + game.objective + '</b></li>' + '</ul>');	

		if(game.started){
			socket.emit('repaint');
		}

	});
	
})

//OBS: Estas paginas serao carregadas conforme o servidor enviar o evento

</script>