var fs = require('fs');
var template = require('./template.js');
module.exports = {
main:function(){
    fs.readdir('./data', function(error,filelist){          
    var title = 'Welcome';
    var descrpition = "Hello, Node.js";

    var list = template.list(filelist);
    var html = template.HTML(title,list
      ,`<h2>${title}</h2>${descrpition}`
      ,`<a href="/create">create</a>`
      );
    })
},
detail:function(){
    fs.readdir('./data', function(error,filelist){         
    fs.readFile(`./data/${queryData.id}`,'utf8',function(err,descrpition){
     var title = queryData.id;
     var list = template.list(filelist);
     var html = template.HTML(title,list
       ,`<h2>${title}</h2>${descrpition}`
       ,`<a href="/create">create</a>
       <a href="/update?id=${title}">update</a>
       <form action = "/delete_process" method = "post">
         <input type = "hidden" name="id" value ="${title}">
         <input type = "submit" value = "delete">
       </form>`
       //delete 기능을 링크를 통해 구현할 경우 문제가 발생할 수 있다.
       //submit으로 구현된 delete 버튼의 경우 css를 통해 재구성 하자.
       );
   });  
 });
}
}