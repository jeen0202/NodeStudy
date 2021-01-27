var db = require('./db');
var url = require('url');
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
            db.query(`select * from topic left join author on topic.author_id =author.id where topic.id=?`,[queryData.id],function(error2,topic){
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
        }); 
    }
