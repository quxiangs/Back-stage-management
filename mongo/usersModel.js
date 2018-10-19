//该模块用来 操作users 相关的后台数据库处理代码
//注册操作
//登录操作
//修改操作
//删除操作
//查询列表操作
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://127.0.0.1:27017';
const usersModel = {
    /**
    *     注册操作
    *     @param {Object} data 注册信息
    *    @param {Function} cb 回调函数
    */
    add(data,cb){
        MongoClient.connect(url,function(err,client){
            if(err) throw err;
            const db = client.db('zwpan');
            //1.对data里面的isAdmin修改为is_admin
            //2.写一个id为1
            //下一个注册要得到之前用户表的记录条数加1之后写给下一个注册的人
            //不允许用户名相同。
            let saveData= {
                username:data.username,
                password: data.password,
                nickname: data.nickname,
                phone: data.phone,
                is_admin: data.isAdmin
            };
            db.collection('users').find({ username: saveData.username}).count(function(err,num){
                // 如果 num 为 0 ，没有注册，否则已经注册了
                if(err) throw err;
                if(num===0){
                    db.collection('users').find().count(function(err,num){
                        if(err) throw err;
                        saveData._id = num+1;
                        db.collection('users').insertOne(saveData,function(err){
                            if(err) throw err;
                            cb(null);
                            client.close();
                        });
                    });
                }else{
                    // console.log("00000000")
                    cd('已经注册过了');
                    client.close();
                }
            })
        })
    }
}
module.exports = usersModel;