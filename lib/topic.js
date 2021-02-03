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
              <a href="/topic/update/${topic.id}">update</a>
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
              var topic = db.get('topics').find({id:request.params.pageId}).value();            
              if(topic.user_id !== request.user.id){
                request.flash('error','Not yours!');
                return response.redirect('/');
              }
              var list = template.list(request.list);
              var html = template.HTML(sanitizeHTML(topic.title),list
              ,` <form action="/topic/update_process" method="post">
                  <input type = "hidden" name="id" value="${topic.id}">
                    <p><input type ="text" name="title" placeholder ="title" value="${sanitizeHTML(topic.title)}"></p>
                    <p>
                       <textarea name="description" placeholder="description">${sanitizeHTML(topic.description)}</textarea>
                    </p>
                       <p>
                         <input type="submit" value = "update">    
                       </p>
                      </form> `
                 ,`<a href="/topic/create">create</a> <a href="/update/${topic.id}">update</a>`
                 ,auth.StatusUI(request,response)
                 );              
                 response.send(html); 

    }
    exports.update_process = function(request,response){

      var post = request.body;
      var id = post.id;
      var topic = db.get('topics').find({id:id}).value();
      if(topic.user_id !== request.user.id){
        request.flash('error','Not yours!');
        return response.redirect('/');
      }else{
        db.get('topics').find({id:id}).assign({
          title:post.title,
          description:post.description
      }).write();
      response.redirect(`/topic/${topic.id}`);
      }       
    }
    exports.delete_process = function(request,response){
      if(!auth.IsOwner(request,response)){        
        response.redirect('/');
        return false;
      }             
          var post = request.body;          
          var topic = db.get('topics').find({id:post.id}).value();
          if(topic.user_id !== request.user.id){
            request.flash('error','Not yours!');
            return response.redirect('/');
          }
          db.get('topics').remove({id:post.id}).write();
        response.redirect('/');
    }
