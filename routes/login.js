
/*
 * GET home page.
 */

exports.login = function(req, res){
  res.render('login', { server: 'localhost', port: '3000' });
};