var sanitizeHTML = require('sanitize-html');

module.exports={
    HTML:function(title, list,body, control){
      return `
      <!doctype html>
      <html>
      <head>        
        <title>WEB3 - ${title}</title>
        <meta charset="utf-8">
      </head>
      <body>  
        <a href = "/login">login</a>
        <h1><a href="/">WEB</a></h1>        
        <a href = "/author">author</a>
                
        ${list}
        ${control} 
        ${body}
      </body>
      </html>
      `;
    }
    ,list:function(topics){
      var list = '<ul>';
            var i = 0;
            for(i in topics){             
            list += `<li><a href="/topic/${topics[i].id}">${sanitizeHTML(topics[i].title)}</a></li>`;            
           }
            list +='</ul>';
            return list;
    }
    //create 페이지에서 저자를 선택할 수 있게 하는 html문을 반환하는 함수
    ,authorSelect:function(authors,author_id){ 
      var tag = '';            
        for(var i in authors){      
          var selected ='';  
          if(authors[i].id===author_id){
            console.log(authors[i].id);
            selected = ' selected';
          }
          tag +=`<option value ="${authors[i].id}"${selected}>${sanitizeHTML(authors[i].name)}</option>`
        }
        return `<select name="author">
          ${tag}
       </select>`
    },authorTable:function(authors){
      var tag = '<table>';
            for(i in authors){
                tag += `
                <tr>
                    <td>${sanitizeHTML(authors[i].name)}</td>
                    <td>${sanitizeHTML(authors[i].profile)}</td>    
                    <td><a href="/author/update/${authors[i].id}">update</a></td>
                    <td>
                      <form action = "/author/delete_process" method = "post">
                      <input type = "hidden" name="id" value="${authors[i].id}">
                      <input type = "submit" value = "delete">
                      </form>
                      </td>
                </tr>
                `
            }
            tag+=`</table>`;
            return tag;
    }
  }
