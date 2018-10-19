//该模块用来 操作users 相关的后台数据库处理代码
//注册操作
//登录操作
//修改操作
//删除操作
//查询列表操作
const MongoClient = require('mongodb').MongoClient;
const async = require('async');
const url = 'mongodb://127.0.0.1:27017';
const usersModel = {
    /**
    *     注册操作
    *     @param {Object} data 注册信息
    *    @param {Function} cb 回调函数
    */
    add(data, cb) {
        MongoClient.connect(url, function (err, client) {
            if (err) {
                console.log('连接数据库失败', err);
                cb({ code: -100, msg: '连接数据库失败' });
                return;
            };
            const db = client.db('zwpan');
            // 1.对data里面的isAdmin修改为is_admin
            //2.写一个id为1
            //下一个注册要得到之前用户表的记录条数加1之后写给下一个注册的人
            //不允许用户名相同。
            let saveData = {
                username: data.username,
                password: data.password,
                nickname: data.nickname,
                phone: data.phone,
                is_admin: data.isAdmin
            };
            //async写法
            async.series([
                function (callback) {
                    //查询是已注册
                    db.collection('users').find({ usersname: saveData.username }).count(function (err, num) {
                        if (err) {
                            callback({ code: -101, msg: '查询是否已经注册失败' });
                        } else if (num !== 0) {
                            console.log('用户已经注册过了');
                            callback({ code: -102, msg: '用户已经注册了' });
                        } else {
                            console.log('当前用户可以注册');
                            callback(null);
                        }
                    });
                },
                function (callback) {
                    //查询表的所有数据
                    db.collection('users').find().count(function (err, num) {
                        console.log(num)
                        if (err) {
                            callback({ code: -101, msg: '查询表数据失败' });
                        } else {
                            saveData._id = num + 1;
                            console.log(saveData._id)
                            callback(null);
                        }
                    })
                },
                function (callback) {
                    //写入数据库
                    db.collection('users').insertOne(saveData, function (err) {
                        if (err) {
                            console.log(err);
                            callback({ code: -101, msg: '写入数据失败' });
                        } else {
                            callback(null);
                        }
                    });
                }
            ], function (err, results) {
                if (err) {
                    console.log('上面的操作,可能出错了');
                    cb(err);
                } else {
                    cb(null);
                }
                client.close();
            });
        });

        // //回调地狱写法
        // MongoClient.connect(url,function(err,client){
        //     if(err) throw err;
        //     const db = client.db('zwpan');
        //     //1.对data里面的isAdmin修改为is_admin
        //     //2.写一个id为1
        //     //下一个注册要得到之前用户表的记录条数加1之后写给下一个注册的人
        //     //不允许用户名相同。
        //     let saveData= {
        //         username:data.username,
        //         password: data.password,
        //         nickname: data.nickname,
        //         phone: data.phone,
        //         is_admin: data.isAdmin
        //     };

        //     db.collection('users').find({ username: saveData.username}).count(function(err,num){
        //         // 如果 num 为 0 ，没有注册，否则已经注册了
        //         if(err) throw err;
        //         if(num===0){
        //             db.collection('users').find().count(function(err,num){
        //                 if(err) throw err;
        //                 saveData._id = num+1;
        //                 db.collection('users').insertOne(saveData,function(err){
        //                     if(err) throw err;
        //                     cb(null);
        //                     client.close();
        //                 });
        //             });
        //         }else{
        //             cd('已经注册过了');
        //             client.close();
        //         }
        //     })
        // })
        
    },
      /**
   * 登录方法
   * @param {Object} data 登录信息 {username: '', password: ''}
   * @param {Function} cb 回调函数
   */

login (data,cd){
    MongoClient.connect(url,function(err,client){
        if(err){
            cb({code:-100,msg:'数据库连接失败'});
        }else{
            const db = client.db('zwpan');
            db.collection('users').find({
                username:data.username,
                password:data.password
            }).toArray(function(err,data){
                if(err){
                    console.log('查询数据库失败',err);
                    cd({ code: -101, msg:'查询数据库失败'});
                }else if( data.length <=0 ){
                    console.log('用户不能登录');
                    cd({code:-102,msg:'用户名密码错误'});
                }else{
                    console.log('用户登录成功');
                    cd(null,{
                        username:data[0].username,
                        nickname:data[0].nickname,
                        isAdmin:data[0].is_admin
                    });
                }
            client.close();
            });
        }
    });
    }
}
module.exports = usersModel;