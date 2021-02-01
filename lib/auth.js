var template = require('./template.js');
var isOwner = require('./logincheck.js');

let authData ={ 
  email: 'jeen0202@korea.ac.kr',
  password:'111111',
  nickname:'jeen0202'
}
exports.login = function(request, response){            
    var title = 'Login';
     var list = template.list(request.topics);
     var html = template.HTML(title,list
     ,`
     <form action ="/auth/login_process" method ="post">
      <p><input type = "text" name = "email" placeholder ="email"></p>
      <p><input type = "password" name = "password" placeholder ="password"></p>
      <p><input type = "submit" value ="login"></p>
     </form>
     `
     ,`<a href="/topic/create">create</a>`
     ,isOwner(request,response)
     );
     response.send(html);      
}
  exports.login_process = (request,response)=>{
    var post = request.body;
    var email = post.email;
    var password = post.password;
            if(email === authData.email && password ===authData.password){
            request.session.is_logined = true;
            request.session.nickname = authData.nickname;
            //session을 저장한 이후에 redirect를 수행
            request.session.save(()=>{
              response.redirect('/');
            })         
          }else{
            response.end('Who?');
          }        
  }
  exports.logout_process = (request,response)=>{      
          request.session.destroy((err)=>{
            response.redirect('/');
          })
          }
exports.IsOwner= (req,res)=>{
  if(req.session.is_logined){
    return true;
  }else{
    return false;
  }
}
exports.StatusUI=(req,res)=>{
  var authStatusUI = `<a href="/auth/login">login</a>`           
  if(this.IsOwner(req,res)){
    authStatusUI = `${req.session.nickname} | <a href = "/auth/logout_process">logout</a>`;
  }
  return authStatusUI;
}
