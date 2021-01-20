var http = require('http');
var fs = require('fs');
var url = require('url');
var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url,true).query;
    console.log(queryData.id);
    if(_url == '/'){
      _url = '/index.html';
    }
    if(_url == '/favicon.ico'){
      response.writeHead(404);
      response.end();
      return;
    }
    response.writeHead(200);
    //console.log(__dirname + _url);
    //client의 request에 따라 file을 만들어서 read한다.
    //client 에게 전송하는 데이터를 생성할 수 있다.
    response.end(queryData.id);
 
});
app.listen(3000);