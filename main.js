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
//사용자 미들웨어 호출
//const readdb = require('./lib/readdb');
const readlow = require('./lib/readlow');
// 기본 인증정보

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
  var passport = require('./lib/passport')(app);

//인증기능 구현을 위한 구현

//사용자 미들웨어 실행
/*MySql을 사용할 시의 DB 호출 미들웨어
app.get('*',readdb.topic);
app.get("/author*",readdb.author);
*/
app.get('*',readlow.topic);
//구글 로그인을 위한 주소

//router 실행
app.use('/topic',topicRouter);
app.use('/author',authorRouter);
app.use('/auth',authRouter(passport));
app.use('/', indexRouter);
//에러 처리(진행중)

app.use((req,res,next)=>{
  res.status(404).send(`Sorry can't find that!`);
});
app.use((err,req,res,next)=>{
  console.error(err.stack)
  res.status(500).send("Something broke!")
});
app.listen(port, () => {console.log(`listening at port ${port}`) })
