
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index',  { server: 'http://sisop2.herokuapp.com/', port: '80' });
};


exports.login = function(req, res){
  res.render('login', { title: 'Express' });
};


exports.opiner = function(req, res){
  res.render('opiner', { title: 'Express' });
};

exports.watcher = function(req, res){
  res.render('watcher', { title: 'Express' });
};

exports.drawer = function(req, res){
  res.render('drawer', { title: 'Express' });
};
