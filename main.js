var http = require('http');
var fs = require('fs');
var url = require('url');

function templateHTML(title, list,body){
  return `
  <!doctype html>
  <html>
  <head>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
  </head>
  <body>
    <h1><a href="/">WEB</a></h1>
    ${list}
    <a href="/create">create</a>
    ${body}
  </body>
  </html>
  `;
}
function templateList(filelist){
  var list = '<ul>';
        var i = 0;
        while (i<filelist.length){
        list += `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
        i+=1;
       }
        list = list +'</ul>';
        return list;
}
var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url,true).query;
    var pathname = url.parse(_url,true).pathname;
    var qs = require('querystring');        
    
    if(pathname === '/'){
      //id값이 없는 최초의 페이지에 대한 부분 추가
      if(queryData.id === undefined){

        fs.readdir('./data', function(error,filelist){          
          var title = 'Welcome';
        var descrpition = "Hello, Node.js";
        var list = templateList(filelist);
        var template = templateHTML(title,list,`<h2>${title}</h2>${descrpition}`);
        response.writeHead(200);
        response.end(template); 
        })        
      }else{
        fs.readdir('./data', function(error,filelist){         
         fs.readFile(`./data/${queryData.id}`,'utf8',function(err,descrpition){
          var title = queryData.id;
          var list = templateList(filelist);
          var template = templateHTML(title,list,`<h2>${title}</h2>${descrpition}`);
      response.writeHead(200);
     response.end(template); 
        });  
      });  
    }       
  }else if(pathname ==="/create"){
    fs.readdir('./data', function(error,filelist){          
      var title = 'WEB - create';    
    var list = templateList(filelist);
    var template = templateHTML(title,list,`
      <form action="http://localhost:3000/create_process" method="post">
        <p><input type ="text" name="title" placeholder ="title"></p>
        <p>
          <textarea name="description" placeholder="descrption"></textarea>
       </p>
        <p>
          <input type="submit">    
        </p>
      </form>
    `);
    response.writeHead(200);
    response.end(template); 
    });   
  }else if (pathname==="/create_process"){
    var body = "";
    //post방식으로 파편화 된 data가 수신될 때마다 callback함수를 실행한다.(Data event)
    request.on('data',function(data){
        body += data;
        //전송된 data 사이즈가 너무 클 경우 연결을 끊어버리는 안전장치도 만들 수 있다.
    });
    //정보의 수신이 끝났을 경우(end event)
    request.on("end",function(){
      var post = qs.parse(body);
      var title = post.title;
      var descrpition = post.description;
      fs.writeFile(`data/${title}`,descrpition,'utf8',
      function(err){
        response.writeHead(302, {Location: `/?id=${title}`});
        response.end(); 
      })
    });   
  }else{
    response.writeHead(404);
    response.end('Not found');    
  }
 });


app.listen(3000);