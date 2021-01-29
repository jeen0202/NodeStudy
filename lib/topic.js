var db = require('./db');
var sanitizeHTML = require('sanitize-html');

//사용자 모듈 
var template = require('./template.js');
    // '/' 페이지에 대한 출력을 반환하는 모듈
    exports.home = function(request, response){
      
           var title = 'Welcome';
            var descrpition = "Hello, Node.js";
            var list = template.list(request.topics);
            var html = template.HTML(title,list
            ,`<h2>${title}</h2>${descrpition}`
            ,`<a href="/create">create</a>`
            );
            response.send(html);
      
    }
    exports.page = function(request,response){   
       
          // SQL injection 방지
          // var sql = `select * from topic left join author on topic.author_id =author.id where topic.id=${db.escape(queryData.id)}`;        
          // var query = db.query(sql,function(error2,topic){
            db.query(`select * from topic left join author on topic.author_id =author.id where topic.id=?`,
            [request.params.pageId],
            function(error2,topic){
              if(error2){
                throw error2;
              }                      
              var list = template.list(request.topics);
              var html = template.HTML(topic[0].title,list
              ,`
              <h2>${sanitizeHTML(topic[0].title)}</h2>
              ${sanitizeHTML(topic[0].description)}
              <p>by ${sanitizeHTML(topic[0].name)}</p>`
              ,`<a href="/create">create</a>
                    <a href="/update/${request.params.pageId}">update</a>
                    <form action = "/delete_process" method = "post">
                      <input type = "hidden" name="id" value ="${request.params.pageId}">
                      <input type = "submit" value = "delete">
                    </form>`
              );                
              response.send(html); 
            });                        
                
    }
    exports.create = function(request,response){                   
            db.query(`select * from author`,function(error2,authors){        
            //author_name 표시를 위해 author table을 호출
              
              var title = 'Create';     
              var list = template.list(request.topics);
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
              response.send(html); 
            });
             
    }
    exports.create_process = function(request,response){
      //body-Parser를 미들웨어로 사용하면 request 객체 안에 body 객체가 생긴다.
      var post = request.body;
      db.query(`
          insert into topic (title,description,created,author_id) values(?,?, Now(), ?)`
          ,[post.title,post.description,post.author],function(error,result){
            if(error){
              throw error;
            }
           // console.log("insertedId : ", result.insertedId);
            response.redirect(`/page/${result.insertId}`);            
          });       
    }
    exports.update = function(request,response){
      db.query(`select * from topic where id=?`,[request.params.pageId],function(error2,topic){
        if(error2){
          throw error2;
        }
        //저자 수정을 위해 author 테이블의 데이터 호출
        db.query(`select * from author`,function(error3,authors){                
          var list = template.list(request.topics);
          var html = template.HTML(sanitizeHTML(topic[0].title),list
          ,` <form action="/update_process" method="post">
              <input type = "hidden" name="id" value="${topic[0].id}">
                <p><input type ="text" name="title" placeholder ="title" value="${sanitizeHTML(topic[0].title)}"></p>
                <p>
                   <textarea name="description" placeholder="description">${sanitizeHTML(topic[0].description)}</textarea>
                </p>
                 <p>
                ${template.authorSelect(authors,topic[0].author_id)}
                </p>
                   <p>
                     <input type="submit" value = "update">    
                   </p>
                  </form> `
             ,`<a href="/create">create</a> <a href="/update/${topic[0].id}">update</a>`
             );              
             response.send(html); 
           }); 
       });
    }
    exports.update_process = function(request,response){
      var post = request.body; 
      db.query(`
      update topic set title = ?,description = ?,author_id=? where id =?`,
      [post.title,post.description,post.author,post.id],
      function(error){
        if(error){
          throw error;
        }response.redirect(`/page/${post.id}`);
      }); 
    }
    exports.delete_process = function(request,response){        
          var post = request.body;
          db.query(`delete from topic where id = ?`,[post.id],function(error,result){
            if(error){
              throw error;
            }response.redirect(`/`);            
          }); 
    }