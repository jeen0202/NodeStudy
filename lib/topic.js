var db = require('./db');

var sanitizeHTML = require('sanitize-html');

//사용자 모듈 
var template = require('./template.js');
    
    exports.home = function(request, response){

            var title = 'Welcome';
            var descrpition = "Hello, Node.js";
            var authStatusUI =`<a href = "/login">login</a>`
            if(request.isOwner){
              authStatusUI = `<a href = logout_process">logout</a>`;
            }
            var list = template.list(request.topics);
            var html = template.HTML(title,list
            ,`<h2>${title}</h2>${descrpition}
              <img src="/images/hello.jpg" style="width:309px; display:block; margin-top:10px;">
            `
            ,`<a href="/topic/create">create</a>`
            ,authStatusUI
            );
            response.send(html);      
    }
    exports.page = function(request,response){
          // SQL injection 방지
          // var sql = `select * from topic left join author on topic.author_id =author.id where topic.id=${db.escape(queryData.id)}`;        
          // var query = db.query(sql,function(error2,topic){
            db.query(`select * from topic left join author on topic.author_id =author.id where topic.id=?`,
            [request.params.pageId],
            function(err,topic){
              if(err | topic === undefined){
                console.log('Error!!')
               throw new error("err");
              }
              else{                      
              var list = template.list(request.topics);
              var html = template.HTML(topic[0].title,list
              ,`
              <h2>${sanitizeHTML(topic[0].title)}</h2>
              ${sanitizeHTML(topic[0].description)}
              <p>by ${sanitizeHTML(topic[0].name)}</p>`
              ,`<a href="/topic/create">create</a>
                    <a href="/topic/update/${request.params.pageId}">update</a>
                    <form action = "/topic/delete_process" method = "post">
                      <input type = "hidden" name="id" value ="${request.params.pageId}">
                      <input type = "submit" value = "delete">
                    </form>`
              );                
              response.send(html); 
            }
            });                        
                
    }
    exports.login = function(request, response){      
      var title = 'Login';
       var list = template.list(request.topics);
       var html = template.HTML(title,list
       ,`
       <form action ="/login_process" method ="post">
        <p><input type = "text" name = "email" placeholder ="email"></p>
        <p><input type = "password" name = "password" placeholder ="password"></p>
        <p><input type = "submit" value ="login"></p>
       </form>
       `
       ,`<a href="/topic/create">create</a>`
       );
       response.send(html);      
}
    exports.login_process = (request,response)=>{
      var post = request.body;
              if(post.email === 'jeen0202@korea.ac.kr' && post.password ==='111111'){
                response.writeHead(302, {
                  'Set-Cookie' : [
                      `email=${post.email}`,
                      `password=${post.password}`,
                      `nickname=jeen0202`,                       
                  ],
                  Location : '/'
              });
              response.end();
            }else{
              response.end('Who?');
            }        
          }
    
    exports.create = function(request,response){                   
            db.query(`select * from author`,function(err,authors){        
            if(err){
              throw err;
            }
            else{
              var title = 'Create';     
              var list = template.list(request.topics);
              var html = template.HTML(sanitizeHTML(title),list
              ,`<form action="/topic/create_process" method="post">
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
            }
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
            }else{
              response.redirect(`/topic/${result.insertId}`);  
            }     
                     
          });       
    }
    exports.update = function(request,response){
      db.query(`select * from topic where id=?`,[request.params.pageId],function(error2,topic){
        if(error2){
          throw error2;
        }else{
          db.query(`select * from author`,function(error3,authors){ 
            if(error3){
              throw error3;
            }            
            else{
              var list = template.list(request.topics);
              var html = template.HTML(sanitizeHTML(topic[0].title),list
              ,` <form action="/topic/update_process" method="post">
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
                 ,`<a href="/topic/create">create</a> <a href="/update/${topic[0].id}">update</a>`
                 );              
                 response.send(html); 
            }
          }); 
        }
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
        }else{
          response.redirect(`/topic/${post.id}`);
        }
      }); 
    }
    exports.delete_process = function(request,response){        
          var post = request.body;
          db.query(`delete from topic where id = ?`,[post.id],function(error,result){
            if(error){
              throw error;
            }else{
            response.redirect(`/`);
            }            
          }); 
    }
