var http = require('http');
var url = require('url');
var template = require('./lib/template.js');
var path = require('path');
var conn = require('./lib/db');
//refactoring : 동작방식은 유지하면서 내부의 코드를 효율적으로 바꾸는 행위

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url,true).query;
    var pathname = url.parse(_url,true).pathname;
    var qs = require('querystring');        
    
    if(pathname === '/'){
      //id값이 없는 최초의 페이지에 대한 부분 추가
      if(queryData.id === undefined){
        conn.query (`select * from topic`,function(error,topics){         
          var title = 'Welcome';
          var descrpition = "Hello, Node.js";
          var list = template.list(topics);
          var html = template.HTML(title,list
          ,`<h2>${title}</h2>${descrpition}`
          ,`<a href="/create">create</a>`
          );
          response.writeHead(200);
          response.end(html); 
          })               
      }else{
          conn.query (`select * from topic`,function(error,topics){
            if(error){
              throw error;
            }
            //join을 활용하여 author테이블의 name값을 가져올 수 있다.
            conn.query(`select * from topic left join author on topic.author_id =author.id where topic.id=?`,[queryData.id],function(error2,topic){
              if(error2){
                throw error2;
              }
              console.log(topic);          
              var list = template.list(topics);
              var html = template.HTML(topic[0].title,list
              ,`
              <h2>${topic[0].title}</h2>
              ${topic[0].description}
              <p>by ${topic[0].name}</p>`
              ,`<a href="/create">create</a>
                    <a href="/update?id=${queryData.id}">update</a>
                    <form action = "/delete_process" method = "post">
                      <input type = "hidden" name="id" value ="${queryData.id}">
                      <input type = "submit" value = "delete">
                    </form>`
              );              
              response.writeHead(200);
              response.end(html); 
            });
          })                
    }       
  }else if(pathname ==="/create"){   
    conn.query (`select * from topic`,function(error,topics){   
      conn.query(`select * from author`,function(error2,authors){        
      //author_name 표시를 위해 author table을 호출
        
        var title = 'Create';     
        var list = template.list(topics);
        var html = template.HTML(title,list
        ,`<form action="/create_process" method="post">
        <p><input type ="text" name="title" placeholder ="title"></p>
        <p>
          <textarea name="description" placeholder="description"></textarea>
        </p>
        <p>
          ${template.authorSelect(authors)}
        </p>
        <p>
          <input type="submit">    
        </p>
        </form>`,'' );
        response.writeHead(200);
        response.end(html); 
      })
    })   
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
      //submit에서 보낸 정보가 담겨있는 body의 데이터를 sql에 사용      
      conn.query(`
      insert into topic (title,description,created,author_id) values(?,?, Now(), ?)`
      ,[post.title,post.description,post.author],
      function(error,result){
        if(error){
          throw error;
        }response.writeHead(302, {Location: `/?id=${result.insertId}`});
        response.end(); 
      })
    });   
  }else if(pathname === "/update"){
  conn.query (`select * from topic`,function(error,topics){
    if(error){
      throw error;
    }
    conn.query(`select * from topic where id=?`,[queryData.id],function(error2,topic){
      if(error2){
        throw error2;
      }
      //저자 수정을 위해 author 테이블의 데이터 호출
      conn.query(`select * from author`,function(error3,authors){
        var list = template.list(topics);
        var html = template.HTML(topic[0].title,list
        ,`<form action="/update_process" method="post">
            <input type = "hidden" name="id" value="${topic[0].id}">
              <p><input type ="text" name="title" placeholder ="title" value="${topic[0].title}"></p>
              <p>
                <textarea name="description" placeholder="description">${topic[0].description}</textarea>
              </p>
              <p>
              ${template.authorSelect(authors,topic[0].author_id)}
              </p>
              <p>
                <input type="submit">    
               </p>
             </form> `
        ,`<a href="/create">create</a> <a href="/update?id=${topic[0].id}">update</a>`
        );              
        response.writeHead(200);
        response.end(html); 
      });           
     
    });
  }) 
  }else if(pathname === "/update_process"){
    var body = "";
    //post방식으로 파편화 된 data가 수신될 때마다 callback함수를 실행한다.(Data event)
    request.on('data',function(data){
        body += data;
        //전송된 data 사이즈가 너무 클 경우 연결을 끊어버리는 안전장치도 만들 수 있다.
    });
    //정보의 수신이 끝났을 경우(end event)
    request.on("end",function(){
      var post = qs.parse(body); 
      conn.query(`
      update topic set title = ?,description = ?,author_id=? where id =?`,
      [post.title,post.description,post.author,post.id],
      function(error,result){
        if(error){
          throw error;
        }response.writeHead(302, {Location: `/?id=${post.id}`});
        response.end(); 
      })
    });  
  }else if(pathname === "/delete_process"){
    var body = "";
    request.on('data',function(data){
        body += data;
    });
    request.on("end",function(){
      var post = qs.parse(body);
      var id = post.id;
      var filterdId = path.parse(id).base;     
      // fs.unlink(`data/${filterdId}`, function(error){
      //   response.writeHead(302, {Location: `/`});
      //   response.end(); 
      // })
      conn.query(`delete from topic where id = ?`,[post.id],function(error,result){
        if(error){
          throw error;
        }response.writeHead(302, {Location: `/`});
        response.end(); 
      })
    }); 
  }else{
    response.writeHead(404);
    response.end('Not found');    
  }
 });


app.listen(3000);