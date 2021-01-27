module.exports={
    HTML:function(title, list,body, control){
      return `
      <!doctype html>
      <html>
      <head>
        <title>WEB2 - ${title}</title>
        <meta charset="utf-8">
      </head>
      <body>
        <h1><a href="/">WEB</a></h1>
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
            while (i<topics.length){
            list += `<li><a href="/?id=${topics[i].id}">${topics[i].title}</a></li>`;
            i+=1;
           }
            list = list +'</ul>';
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
          tag +=`<option value ="${authors[i].id}"${selected}>${authors[i].name}</option>`
        }
        return `<select name="author">
          ${tag}
       </select>`
    }
  }
