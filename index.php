<!DOCTYPE html>
<html lang="pt">
  <head>
    <meta charset="utf-8">
    <title>iAction</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="" >
    <meta name="author" content="Guilherme Severo, Cláudio Busatto" >

    <!-- Le styles -->
    <link href="css/bootstrap.css" rel="stylesheet" />
    <link rel="stylesheet/less" type="text/css" href="css/main.less">

    <style type="text/css">
      body {
        padding-top: 60px;
        padding-bottom: 40px;
      }
      .sidebar-nav {
        padding: 9px 0;
      }
    </style>
    <link href="css/bootstrap-responsive.css" rel="stylesheet" />

    <!-- HTML5 shim, for IE6-8 support of HTML5 elements -->
    <!--[if lt IE 9]>
      <script src="http://html5shim.googlecode.com/svn/tru'nk/'html5.js"></script>
    <![endif]-->
    </head>

  <body>
<?php echo $_SERVER["SERVER_NAME"] ?>
    <div class="navbar navbar-inverse navbar-fixed-top">
      <div class="navbar-inner">
        <div class="container-fluid">
          <a class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </a>
          <a class="brand" href="#">iAction</a>
          <div class="nav-collapse collapse">
            <p class="navbar-text pull-right">
              <a href="#" class="navbar-link" id="lblUserName"></a>
            </p>           
          </div><!--/.nav-collapse -->
        </div>
      </div>
    </div>

    <div class="container-fluid">
      <div class="row-fluid">
        <div class="span2">
          <div class="well sidebar-nav menu"  >
            <ul class="nav nav-list" id="teamA">
              <li class="nav-header">Team A</li>                                    
            </ul>
            <ul class="nav nav-list" id="teamB">
              <li class="nav-header">Team B</li>                            
            </ul>
            <div id="userObjective"></div>
            
          </div><!--/.well -->
        </div><!--/span-->
        <div class="span10 bgdraw">  
          <div id="main-content"></div>
        </div>
      </div><!--/row-->

      <hr>

      <footer>
        <p align="center">&copy; UFRGS - UNIVERSIDADE FEDERAL DO RIO GRANDE DO SUL</p>
      </footer>

    </div><!--/.fluid-container-->

    <!-- Le javascript
    ================================================== -->
    <!-- Placed at the end of the document so the pages load faster -->

    <!-- Scripts -->
    <script type="text/javascript" src="js/jquery.js"></script>
    <script type="text/javascript" src="js/less.js"></script>
    <script type="text/javascript" src="js/bootstrap.js"></script>    
    <script type="text/javascript" src="js/pixel_canvas.js"></script>
    <script type="text/javascript" src="js/pixel_toolbar.js"></script>
    <script type="text/javascript" src="js/mouse.js"></script>
    <script type="text/javascript" src="js/socket.io.min.js"></script>

   <script  type="text/javascript">
            var server = "http://<?php echo $_SERVER['SERVER_NAME'] ?>:8000";
            var socket; 

            $('#main-content').load('login.php');

            console.log(server);

          </script> <script  type="text/javascript">
            var server = "http://<?php echo $_SERVER['SERVER_NAME'] ?>:8000";
            var socket = io && io.connect(server);


            socket.on('endgame', function(winner){
                $('#main-content').html('<h1>' + winner + ' GANHOU O JOGO</h1>');
              })

            $('#main-content').load('login.php');

            console.log(server);

    </script>
    
  </body>
</html>
