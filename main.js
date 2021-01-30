//express.js 호출
const express = require('express')
const app = express();
const port = 3000;
//Router 호출
const topicRouter = require('./routes/topic');
const authorRouter = require('./routes/author');
const indexRouter = require('./routes/index')
//미들웨어 호출
var bodyParser = require('body-parser');//post방식에서 body를 검출해 주는 body-parser
var compression = require('compression')//압축을 통해 서버에서 전송하는 data의 size를 줄여주는 compression
//사용자 미들웨어 호출
const readdb = require('./lib/readdb');
//미들웨어 실행
app.use(express.static('public')); //정적 파일 서비스
app.use(bodyParser.urlencoded({ extended: false })) //post 방식에서 body parsing
app.use(compression()); // 파일 압축
//사용자 미들웨어 실행

app.get('*',readdb.topic);
app.get("/author*",readdb.author);
//router 실행
app.use('/topic',topicRouter);
app.use('/author',authorRouter);
app.use('/', indexRouter);
//에러 처리(진행중)

app.listen(port, () => {console.log(`listening at port ${port}`) })
