//express.js 호출
const express = require('express')
const app = express();
const port = 3000;
//사용자 모듈 호출
const topic = require('./lib/topic');
const author = require('./lib/author');
//Router 호출
const topicRouter = require('./routes/topic');
const authorRouter = require('./routes/author');
const indexRouter = require('./routes/index')
//미들웨어 호출
//post방식에서 body를 검출해 주는 body-parser
var bodyParser = require('body-parser');
//압축을 통해 서버에서 전송하는 data의 size를 줄여주는 compression
var compression = require('compression')
//사용자 미들웨어 호출
const readdb = require('./lib/readdb');
//미들웨어 실행
//정적 파일 서비스(이미지파일)를 위해 directory 설정
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(compression());
//사용자 미들웨어 실행
//user가 아닌 get을 사용할 경우 get방식으로 모듈을 호출할때만 미들웨어가 실행된다.
app.get('*',readdb.topic);
//get 방식에서 첫주소가 author일 경우 미들웨어가 실행된다.
app.get("/author*",readdb.author);
//route 기능 수행
app.use('/topic',topicRouter);
app.use('/author',authorRouter);
app.use('/', indexRouter);

app.use(function(req, res, next) {
    res.status(404).send('Sorry cant find that!');
  });

app.use(function(error, req, res, next) {
  console.error(error.stack);
  res.status(500).send('Something broke!');
});  
app.listen(port, () => {console.log(`listening at port ${port}`) })
