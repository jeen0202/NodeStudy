//버전 관리도구 사용시에는 원격저장소에 올라가는것을 방지하자
var mysql = require('mysql');
var db = mysql.createConnection({
    host:'',
    user:'',
    password: '',
    database : ''
  });
  db.connect();
  module.exports = db;