var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.cookies.username){
    res.render('index', { 
      username: req.cookies.username,
      nickname: req.cookies.nickname,
      isAdmin: parseInt(req.cookies.isAdmin) ? '(管理员)': ''
     });
  }else{
    res.redirect('/login.html');
  }
});
//注册页面
router.get('/register.html',function(req,res,next){
  res.render('register');
});
router.get('/login.html', function (req, res, next) {
  res.render('login');
});

module.exports = router;
