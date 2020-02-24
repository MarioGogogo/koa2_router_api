var mysql = require('mysql');
var config = require('../config/default.js');

var pool = mysql.createPool({
  host     : config.database.HOST,
  user     : config.database.USERNAME,
  password : config.database.PASSWORD,
  database : config.database.DATABASE,
  port     : config.database.PORT
});

let query = (sql, values) => {
  return new Promise((resolve, reject) => {
    // 执行sql脚本对数据库进行读写
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
      } else {
        connection.query(sql, values, (err, rows) => {
          if (err) {
            reject(err);
          } else {
            console.log('数据库连接正常');
            resolve(rows);
          }
          connection.release();
        });
      }
    });
  });
};
/**
 * 用户表
 */
let users = `create table if not exists users(
  id INT NOT NULL AUTO_INCREMENT,
  username VARCHAR(100) NOT NULL COMMENT '用户名',
  password VARCHAR(100) NOT NULL COMMENT '密码',
  email VARCHAR(100) NOT NULL COMMENT '邮箱',
  phone VARCHAR(100) NOT NULL COMMENT '手机',
  question VARCHAR(255) NOT NULL COMMENT '问题',
  answer VARCHAR(255) NOT NULL COMMENT '答案',
  createtime VARCHAR(100) NOT NULL COMMENT '创建时间',
  updatetime VARCHAR(100) NOT NULL COMMENT '更新时间',
  role VARCHAR(100) NOT NULL COMMENT '角色',
  PRIMARY KEY ( id )
 );`;

let createTable = (sql) => {
  return query(sql, []);
};

// 建表
createTable(users);
console.log('创建表');

// 注册用户
// 通过名字查找用户
const findDataByName = (name) => {
  let _sql = `select * from users where username="${name}";`;
  return query(_sql);
};
findDataByName('jack').then((res) => {
  console.log(res);
});
