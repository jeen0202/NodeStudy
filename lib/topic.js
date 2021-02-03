// var db = require('./db');
const db = require('./lowdb');
//const db = require('./db');
var auth = require('./auth');
var sanitizeHTML = require('sanitize-html');
var nanoid = require('nanoid');

//사용자 모듈 
var template = require('./template.js');
  
    exports.home = function(request, response){ 
      var fmsg = request.flash();
      var feedback = '';
      if(fmsg.success){
        feedback = fmsg.success[0];       
      }         
            var title = 'Welcome';
            var descrpition = "Hello, Node.js";            
            var list = template.list(request.list);
            var html = template.HTML(title,list
            ,`
            <div style="color:blue;">${feedback}</div>
            <h2>${title}</h2>${descrpition}
              <img src="/images/hello.jpg" style="width:309px; display:block; margin-top:10px;">
            `
            ,`<a href="/topic/create">create</a>`
            ,auth.StatusUI(request,response)
            );
            response.send(html);      
    }
    exports.page = function(request,response){
            var topic = db.get('topics').find({
              id:request.params.pageId}).value();
            var user = db.get('users').find({
              id:topic.user_id
            }).value();                                                           
            var list = template.list(request.list);
            var html = template.HTML(topic.title,list,
            `
            <h2>${sanitizeHTML(topic.title)}</h2>
            ${sanitizeHTML(topic.description)}
            <p>by ${user.displayName}</p>
            `
            ,`<a href="/topic/create">create</a>
              <a href="/topic/update/${request.params.pageId}">update</a>
              <form action = "/topic/delete_process" method = "post">
                <input type = "hidden" name="id" value ="${request.params.pageId}">
                <input type = "submit" value = "delete">
              </form>`,
              auth.StatusUI(request,response)
              );                
              response.send(html); 
                                   
                
    }
    exports.create = function(request,response){ 
      if(!auth.IsOwner(request,response)){        
        response.redirect('/');
        return false;
      }
              var title = 'Create';     
              var list = template.list(request.topics);
              var html = template.HTML(sanitizeHTML(title),list
              ,`<form action="/topic/create_process" method="post">
               <p><input type ="text" name="title" placeholder ="title"></p>
               <p>
                <textarea name="description" placeholder="description"></textarea>
              </p>
              <p>
                <input type="submit">    
              </p>
              </form>`
              ,'',
              //auth.StatusUI(request,response)
              );
              response.send(html); 
            
    }
    exports.create_process = function(request,response){
      if(!auth.IsOwner(request,response)){        
        response.redirect('/');
        return false;
      }     
      var post = request.body;
      var id = nanoid.nanoid()
      db.get('topics').push({
        id: id,
        title : post.title,
        description : post.description,
        user_id: request.user.id
      }).write();
      response.redirect(`/topic/${id}`);
      /* Mysql로 작성하는 방법
      db.query(`
          insert into topic (title,description,created,author_id) values(?,?, Now(), ?)`
          ,[post.title,post.description,post.author],function(error,result){
            if(error){
              throw error;
            }else{
              response.redirect(`/topic/${result.insertId}`);  
            }     
                     
          });       
    */
    }
    exports.update = function(request,response){
      if(!auth.IsOwner(request,response)){        
        response.redirect('/');
        return false;
      }       
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
                 ,auth.StatusUI(request,response)
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
      if(!auth.IsOwner(request,response)){        
        response.redirect('/');
        return false;
      }             
          var post = request.body;
          db.query(`delete from topic where id = ?`,[post.id],function(error,result){
            if(error){
              throw error;
            }else{
            response.redirect(`/`);
            }            
          }); 
    }
