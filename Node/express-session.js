var express = require('express')
var parseurl = require('parseurl')
var session = require('express-session')
//session의 정보를 파일에 저장하기 위한 모듈 호출
var FileStore = require('session-file-store')(session);
var app = express()

//session 미들웨어 사용시 req에 session 객체가 추가된다.
app.use(session({
  secret: 'holly molly',
  resave: false,
  saveUninitialized: true,
  store : new FileStore()
}))  

app.get('/', function (req, res, next) {
    //console.log(req.session);
    if(req.session.num === undefined){
        req.session.num =1; 
    }else{
        req.session.num++;
    }
  res.send(`Views : ${req.session.num}`)
})

app.listen(3000, ()=>{
    console.log('3000!')
})