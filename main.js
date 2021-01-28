//express.js 호출
const express = require('express')
var topic = require('./lib/topic');
var author = require('./lib/author');
//express는 
const app = express();
const port = 3000;

//route 기능 수행
app.get('/', (request, response) => {
  topic.home(request, response);
})
app.get('/page', (req, res) => {
  res.send('/page')
})
//위의 코드와 같은 기능을 수행
// app.get('/', function(req,res){
//   return res.send('Hello World!')
// });
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

/*
var http = require('http');
var url = require('url');

//사용자 모듈


//refactoring : 동작방식은 유지하면서 내부의 코드를 효율적으로 바꾸는 행위

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url,true).query;
    var pathname = url.parse(_url,true).pathname;      
    if(pathname === '/'){
      //id값이 없는 최초의 페이지에 대한 부분 모듈화
      if(queryData.id === undefined){
        topic.home(request, response);              
      }else{
        topic.page(request,response);
                
    }       
  }else if(pathname ==="/create"){   
    topic.create(request,response);
  }else if (pathname==="/create_process"){
    topic.create_process(request, response);
  }else if(pathname === "/update"){
    topic.update(request, response);
  }else if(pathname === "/update_process"){
    topic.update_process(request,response);
  }else if(pathname === "/delete_process"){
    topic.delete_process(request,response);
  }else if(pathname === "/author"){
    author.home(request,response);
  }
  else if(pathname === "/author/create_process"){
    author.create_process(request,response);
  }else if(pathname === "/author/update"){
    author.update(request,response);
  }else if(pathname === "/author/update_process"){
    author.update_process(request,response);
  }else if(pathname === "/author/delete_process"){
    author.delete_process(request,response);
  }
  else{
    response.writeHead(404);
    response.end('Not found');    
  }
 });


app.listen(3000);
*/
