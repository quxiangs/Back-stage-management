const MongoClient = require('mongodb').MongoClient;
const async = require('async');
const url = 'mongodb://127.0.0.1:27017';


const addPhone = {

    /**
     *
     * @param {Object} data 增加的信息
     * @param {cd} cd 回调函数
     */
    newlyShoping(data, cd) {
        console.log(']]]]]]]]]]]]]]')
        var saveData = data;
        MongoClient.connect(url, function (err, client) {
            if (err) {
                console.log('连接数据库失败', err);
            } else {
                const db = client.db('zwpan');
                var Num = 0;
                async.series([
                    function (callback) {
                        db.collection('type').find().count(function (err, num) {
                            if (err) {
                                callback({ code: -101, msg: '查询表数据失败' });
                            } else {
                                Num = num;
                                callback(null);
                            }
                        })
                    },
                    function (callback) {
                        if (Num < 1) {
                            saveData._id = 1;
                            callback(null);
                        } else {
                            db.collection('type').find().skip(Num - 1).toArray(function (err, data) {
                                if (err) {
                                    console.log('查询最后一条数据失败', err);
                                    callback({ code: -101, msg: '查询最后一条数据失败' });
                                } else {
                                    saveData._id = parseInt(data[0]._id) + 1;
                                    callback(null);
                                }
                            })
                        }
                    },
                    function (callback) {
                        console.log(saveData._id)
                        db.collection('type').insertOne(saveData, function (err) {
                            if (err) {
                                callback({ code: -101, msg: '写入数据失败' });
                            } else {
                                callback(null);

                            }
                        });
                    }
                ], function (err, results) {
                    if (err) {
                        console.log('上面操作可能出错')
                    } else {
                        console.log('添加数据库成功')
                        cd(null);
                        client.close();
                    }
                })
            }
        })
    },
    /**
     *
     *
     * @param {Object} data 全局渲染
     * @param {cd} cd 回调函数
     */

    /**
     *
     *
     * @param {Object} data 查询的页数
     * @param {cd} cd 回调函数
     */
    loadPhone(data, cd) {
        console.log(data)
        MongoClient.connect(url, function (err, client) {
            if (err) {
                console.log('数据库连接失败');
                cd({ code: -101, msg: '加载中请稍后' });
            } else {
                var db = client.db('zwpan');
                var skipnum = parseInt(data.page) * parseInt(data.pageSize) - parseInt(data.pageSize);
                var pageSize = parseInt(data.pageSize);
                async.parallel([
                    function (callback) {
                        db.collection('type').find().count(function (err, num) {
                            if (err) {
                                console.log('查询数据库条数失败');
                                callback({ code: -101, msg: '查询数据库条数失败' });
                            } else {
                                callback(null, num);
                            }
                        })
                    }, function (callback) {
                        //显示分页数据
                        db.collection('type').find().limit(pageSize).skip(skipnum).toArray(function (err, data) {
                            if (err) {
                                console.log('数据查询失败');
                                callback({ code: -100, msg: '数据查询失败' });
                            } else {
                                callback(null, data);
                            }
                        })
                    }
                ], function (err, results) {
                    if (err) {
                        console.log('以上操作可能出错');
                        cd({ code: -101, msg: '以上操作可能出错' });
                    } else {
                        cd(null, {
                            shopingList: results[1],
                            totalPage: Math.ceil(results[0] / data.pageSize),
                            page: data.page,
                            COUNT: results[0]
                        });
                    }
                    client.close();
                })
            }
        })
    },

    /**
     *
     *
     * @param {Object} data  接受修改信息
     * @param {cd} cd  回调函数
     */
    deleteUp(data,cd){
        saveData = data;
        saveData._id = parseInt(data._id);
        
        MongoClient.connect(url,function(err,client){
            if(err) {
                console.log('数据库连接失败', err);
                cd({ code: -101, msg: '加载中请稍后' });
            }else {
                var db = client.db('zwpan');
                db.collection('type').updateOne({ _id: saveData._id},{$set:saveData},function(err){
                    if (err) {
                        console.log('修改信息失败', err);
                        cd({ code: -101, msg: "信息修改失败" });
                    } else {
                        console.log('信息修改成功');
                        cd(null);
                    }
                    client.close();
                })
            }
        });
    },

    /**
     *
     *
     * @param {Object} data 删除的品牌id
     * @param {*} cd  回调函数
     */
    cutShoping(data,cd){
        MongoClient.connect(url,function(err,client){
            if (err) {
                console.log('连接数据库失败');
                cd({ code: -101, msg: '数据库连接失败' });
            } else{
                console.log(data)
                var db = client.db('zwpan');
                db.collection('type').deleteOne({_id:parseInt(data)},function(err){
                    if (err) {
                        console.log('删除信息失败', err);
                        cd({ code: -101, msg: '删除信息失败' })
                    } else {
                        console.log('删除信息成功');
                        cd(null);
                    }
                    client.close()
                })
            }
        })
    }
}



module.exports = addPhone;












