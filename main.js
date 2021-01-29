//express.js 호출
const express = require('express')
const app = express();
const port = 3000;
//사용자 모듈 호출
var topic = require('./lib/topic');
var author = require('./lib/author');

//route 기능 수행
//topic 관련페이지 호출
app.get('/', (req, res) =>{topic.home(req, res);})
app.get('/page/:pageId', (req, res) => {topic.page(req,res);})
app.get('/create',(req,res)=> {topic.create(req,res);})
app.post('/create_process',(req,res)=>{topic.create_process(req,res);})
app.get('/update/:pageId',(req,res) =>{topic.update(req,res);})
app.post('/update_process',(req,res) =>{topic.update_process(req,res);})
app.post('/delete_process',(req,res) =>{topic.delete_process(req,res);})
//author 관련 페이지 호출
app.get('/author',(req,res) => {author.home(req,res);})
app.post('/author/create_process', (req,res) =>{author.create_process(req,res);})
app.get(`/author/update/:authorId`, (req,res) =>{author.update(req,res);})
app.post('/author/update_process',(req,res)=>{author.update_process(req,res);})
app.post("/author/delete_process", (req,res)=>{author.delete_process(req,res);})

app.listen(port, () => {console.log(`listening at port ${port}`) })