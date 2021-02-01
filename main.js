//express.js 호출
const express = require('express')
const app = express();
const port = 3000;
//Router 호출
const topicRouter = require('./routes/topic');
const authorRouter = require('./routes/author');
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
//Session 호출
var session = require('express-session');
var FileStore = require('session-file-store')(session);
//미들웨어 호출
var bodyParser = require('body-parser');//post방식에서 body를 검출해 주는 body-parser
var compression = require('compression')//압축을 통해 서버에서 전송하는 data의 size를 줄여주는 compression
var flash = require('connect-flash');// Flash message 전송
var passport = require('passport')//인증기능을 위한 passport
  , LocalStrategy = require('passport-local').Strategy;
//사용자 미들웨어 호출
const readdb = require('./lib/readdb');
// 기본 인증정보
let authData ={
  email: 'jeen0202@korea.ac.kr',
  password:'111111',
  nickname:'jeen0202'
  }
//미들웨어 실행
app.use(express.static('public')); //정적 파일 서비스
app.use(bodyParser.urlencoded({ extended: false })) //post 방식에서 body parsing
app.use(compression()); // 파일 압축
app.use(session({ // session
    // secure: true 옵션으로 https에서만 작동되게 할 수 있다.
    // httpOnley: true 옵션으로 javascript로 세션에 접근하는것 을 차단 할 수 있다.
    secret: 'holly molly',
    resave: false,
    saveUninitialized: false,
    store : new FileStore()
  }));   
  app.use(flash()); //flash 호출
  app.use(passport.initialize()); //passport 초기화
  app.use(passport.session());
  //session사용을 위한 serialize(로그인 성공시 session-store에 저장)
  passport.serializeUser(function(user, done) {
    console.log('serializeUser', user);    
    done(null, user.email); //done 함수의 매개변수에 식별자
  });
  //page를 호출할때마다 같이 호출되는 callback 함수(페이지 방문시 마다 인증된 사용자인지 확인)
  passport.deserializeUser(function(id, done) {
    console.log('deserializeUser', id);
    done(null,authData)//원래는 사용자 정보를 조회해야한다.
  });
  //인증 성공 유무를 확인
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
    function(username, password, done) {     
      console.log('LocalStrategy',username,password);
      if(username === authData.email){
        console.log(1);
        if(password === authData.password){
          console.log(2);
          return done(null, authData,{
            message: "Login success."
          });//2번째 파라미터에 사용자의 실제 정보를 담는다.
          }else{
            console.log(3);
            return done(null, false, { message: 'Incorrect password.' });
          }        
      }else{
        console.log(4);
        return done(null, false, { message: 'Incorrect username.' });
      }
    }
  ));

//인증기능 구현을 위한 구현
//File-Store를 사용했기때문에 바로 redirect하지 않고 save를 통해 저장후 redirect하자  
app.post('/auth/login_process'
,passport.authenticate('local',{
  failureRedirect : '/auth/login'
  ,successFlash: true
  ,failureFlash: true}) , (req, res) => 
  {
  req.session.save( () => {
  res.redirect('/')
  })
  }
  )

//사용자 미들웨어 실행
app.get('*',readdb.topic);
app.get("/author*",readdb.author);
//router 실행
app.use('/topic',topicRouter);
app.use('/author',authorRouter);
app.use('/auth',authRouter);
app.use('/', indexRouter);
//에러 처리(진행중)

app.listen(port, () => {console.log(`listening at port ${port}`) })
