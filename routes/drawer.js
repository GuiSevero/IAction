
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('drawer', { title: 'Express' });
};