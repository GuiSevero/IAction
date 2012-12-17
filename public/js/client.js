	  	    var server = '<?php echo $_SERVER["SERVER_NAME"] ?>'
  		   	var socket = io && io.connect(server)	     
	     	,username = 'gorder'

				
	    	

	    	 socket.on('connection', function(){
		        	//Envia o username
		            socket.emit('username', username)
		     })

		     socket.on('newactivity', function(activity){

		      fillPage(options)
		      console.log('Chegou Atividade')
		    })

	    	