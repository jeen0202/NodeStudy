var db = require('./db');
var url = require('url');
var qs = require('querystring');
var sanitizeHTML = require('sanitize-html');
//사용자 모듈 
var template = require('./template.js');
    // '/' 페이지에 대한 출력을 반환하는 모듈
    exports.home = function(request, response){
        db.query (`select * from topic`,function(error,topics){         
            var title = 'Welcome';
            var descrpition = "Hello, Node.js";
            var list = template.list(topics);
            var html = template.HTML(title,list
            ,`<h2>${title}</h2>${descrpition}`
            ,`<a href="/create">create</a>`
            );
            response.writeHead(200);
            response.end(html); 
            });
    }
    exports.page = function(request,response){
        var _url = request.url;
        var queryData = url.parse(_url,true).query;     
        db.query (`select * from topic`,function(error,topics){
            if(error){
              throw error;
            }
          // SQL injection 방지
          // var sql = `select * from topic left join author on topic.author_id =author.id where topic.id=${db.escape(queryData.id)}`;        
          // var query = db.query(sql,function(error2,topic){
            var query = db.query(`select * from topic left join author on topic.author_id =author.id where topic.id=?`,[queryData.id],function(error2,topic){
              if(error2){
                throw error2;
              }                       
              var list = template.list(topics);
              var html = template.HTML(topic[0].title,list
              ,`
              <h2>${sanitizeHTML(topic[0].title)}</h2>
              ${sanitizeHTML(topic[0].description)}
              <p>by ${sanitizeHTML(topic[0].name)}</p>`
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
        });        
    }
    exports.create = function(request,response){
        db.query (`select * from topic`,function(error,topics){            
            db.query(`select * from author`,function(error2,authors){        
            //author_name 표시를 위해 author table을 호출
              
              var title = 'Create';     
              var list = template.list(topics);
              var html = template.HTML(sanitizeHTML(title),list
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
    }
    exports.create_process = function(request,response){
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
          db.query(`
          insert into topic (title,description,created,author_id) values(?,?, Now(), ?)`
          ,[post.title,post.description,post.author],
          function(error,result){
            if(error){
              throw error;
            }response.writeHead(302, {Location: `/?id=${result.insertId}`});
            response.end(); 
          })
        }); 
    }
    exports.update = function(request,response){
        var _url = request.url;
        var queryData = url.parse(_url,true).query;
        db.query (`select * from topic`,function(error,topics){
            if(error){
              throw error;
            }
            db.query(`select * from topic where id=?`,[queryData.id],function(error2,topic){
              if(error2){
                throw error2;
              }
              //저자 수정을 위해 author 테이블의 데이터 호출
              db.query(`select * from author`,function(error3,authors){
                var list = template.list(topics);
                var html = template.HTML(sanitizeHTML(topic[0].title),list
                ,`<form action="/update_process" method="post">
                    <input type = "hidden" name="id" value="${topic[0].id}">
                      <p><input type ="text" name="title" placeholder ="title" value="${sanitizeHTML(topic[0].title)}"></p>
                      <p>
                        <textarea name="description" placeholder="description">${sanitizeHTML(topic[0].description)}</textarea>
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
    }
    exports.update_process = function(request,response){
        var body = "";
    //post방식으로 파편화 된 data가 수신될 때마다 callback함수를 실행한다.(Data event)
    request.on('data',function(data){
        body += data;
        //전송된 data 사이즈가 너무 클 경우 연결을 끊어버리는 안전장치도 만들 수 있다.
    });
    //정보의 수신이 끝났을 경우(end event)
    request.on("end",function(){
      var post = qs.parse(body); 
      db.query(`
      update topic set title = ?,description = ?,author_id=? where id =?`,
      [post.title,post.description,post.author,post.id],
      function(error,result){
        if(error){
          throw error;
        }response.writeHead(302, {Location: `/?id=${post.id}`});
        response.end(); 
      })
    });  
    }
    exports.delete_process = function(request,response){
        var body = "";
        request.on('data',function(data){
            body += data;
        });
        request.on("end",function(){
          var post = qs.parse(body);
          db.query(`delete from topic where id = ?`,[post.id],function(error,result){
            if(error){
              throw error;
            }response.writeHead(302, {Location: `/`});
            response.end(); 
          })
        }); 
    }