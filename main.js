var http = require('http');
var fs = require('fs');
var url = require('url');
var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url,true).query;
    var pathname = url.parse(_url,true).pathname;        
    
    if(pathname === '/'){
      //id값이 없는 최초의 페이지에 대한 부분 추가
      if(queryData.id === undefined){

        fs.readdir('./data', function(error,filelist){          
          var title = 'Welcome';
        var descrpition = "Hello, Node.js";
        var list = '<ul>';
        var i = 0;
        while (i<filelist.length){
        list += `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
        i+=1;
       }
        list = list +'</ul>';
        var template = `
     <!doctype html>
 <html>
 <head>
   <title>WEB1 - ${title}</title>
   <meta charset="utf-8">
 </head>
 <body>
   <h1><a href="/">WEB</a></h1>
   ${list}
   <h2>${title}</h2>
   <p>${descrpition}</p>
 </body>
 </html>
   `;
  response.writeHead(200);
  response.end(template); 
        })        
      }else{
        fs.readdir('./data', function(error,filelist){
      var descrpition = "Hello, Node.js";
      var list = '<ul>';
      var i = 0;
      while (i<filelist.length){
      list += `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
      i+=1;
     }
      list = list +'</ul>';
        var title = queryData.id;
        fs.readFile(`./data/${title}`,'utf8',function(err,descrpition){
          var template = `
        <!doctype html>
    <html>
    <head>
      <title>WEB1 - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1><a href="/">WEB</a></h1>
      ${list}
      <h2>${title}</h2>
      <p>${descrpition}</p>
    </body>
    </html>
      `;
      response.writeHead(200);
     response.end(template); 
     });  
    });  
      }       
  }else{
    response.writeHead(200);
    response.end('Not found');    
  }
 });


app.listen(3000);