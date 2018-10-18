var express = require('express');
var router = express.Router();
const usersModel = require('../mongo/usersModel');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.post('/register',function (req,res) {
  // console.log(req.body); 
  //1.用户名必须5-10位 [A-Za-z0-9_]
  if (!/^\w{5,10}$/.test(req.body.username)){
    // res.send('请输入正确的用户名,用户名必须是5到10位');
    res.render('verror',{code:-1,msg:'请输入正确的用户名,用户名必须是5到10位'});
  }
  //2.密码验证 /^[a-z0-9_]{6,10}$/
  if (!/^[A-Za-z0-9_]{6,18}$/.test(req.body.password)){
    res.render('verror',{code:0,msg:'密码为6到10位,由字母数字下划线组成'});
  }
  //3.密码一致验证
  if( req.body.password != req.body.repassword ){
    res.render('verror', { code: 1, msg: '密码必须一致' });
  }
  //4.nickname验证 /^[a-zA-Z0-9_\u4e00-\u9fa5]{2,8}$/
  if (!/^[a-zA-Z0-9_\u4e00-\u9fa5]{2,8}$/.test(req.body.nickname)){
    res.render('verror', { code: 2, msg: '请输入正确昵称2到8位' });
  }
  //5.手机号验证 /^1[34578]\d{9}$/
  if (!/^1[34578]\d{9}$/.test(req.body.phone)){
    res.render('verror',{code:-2,msg:'请输入正确的手机号'});
  }
//操作数据库写入信息
try{
  usersModel.add(req.body,function (err) {
    if(err) throw err;
    console.log("成功添加")
    res.render('login');
  })
}catch(error){
  console.log('失败' + error);
  res.render('verror', { code: 3, msg:'error'})
}
});
module.exports = router;
