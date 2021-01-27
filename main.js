var http = require('http');
var url = require('url');
var template = require('./lib/template.js');
var path = require('path');
var conn = require('./lib/db');
var qs = require('querystring'); 
var topic = require('./lib/topic');
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
  }else{
    response.writeHead(404);
    response.end('Not found');    
  }
 });


app.listen(3000);