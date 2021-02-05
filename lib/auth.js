var template = require('./template');
var db = require('./lowdb');
var nanoid = require('nanoid');
const bcrypt = require('bcrypt');
let authData ={ 
  email: 'jeen0202@korea.ac.kr',
  password:'111111',
  nickname:'jeen0202'
}

exports.login = function(request, response){
  var fmsg = request.flash();
  var feedback = '';
  if(fmsg.error){
    feedback = fmsg.error[0];
  }  
    var title = 'Login';
     var list = template.list(request.topics);
     var html = template.HTML(title,list      
     ,`<div style="color:red;">${feedback}</div>
     <form action ="/auth/login_process" method ="post">
      <p><input type = "text" name = "email" placeholder ="email"></p>
      <p><input type = "password" name = "password" placeholder ="password"></p>
      <p><input type = "submit" value ="login"></p>
     </form>
     `
     ,`<a href="/topic/create">create</a>`
     ,this.StatusUI(request,response)
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
  exports.register = function(request, response){
    var fmsg = request.flash();
    var feedback = '';
    if(fmsg.error){
      feedback = fmsg.error[0];
    }  
      var title = 'Register';
       var list = template.list(request.topics);
       var html = template.HTML(title,list      
       ,`<div style="color:red;">${feedback}</div>
       <form action ="/auth/register_process" method ="post">
        <p><input type = "text" name = "email" placeholder ="email" value = "jeen0202@korea.ac.kr"></p>
        <p><input type = "password" name = "password1" placeholder ="password" value = "111111"></p>
        <p><input type = "password" name = "password2" placeholder ="password" value = "111111"></p>
        <p><input type = "test" name="displayName" placeholder="display name" value = "jeen0202"></p>
        <p><input type = "submit" value ="Register"></p>
       </form>
       `
       ,`<a href="/topic/create">create</a>`
       ,this.StatusUI(request,response)
       );
       response.send(html);      
  }
  exports.register_process = function(request,response){ 
    var post = request.body;
    var email = post.email;  
    var pass1 = post.password1;
    var pass2 = post.password2;
    var displayName = post.displayName;
    if(pass1 !== pass2){
      request.flash('error', 'Passwords must be same!');
      response.redirect('/auth/register');
      
    }else{
      //bcrypt를 사용한 비밀번호 저장
      bcrypt.hash(pass1, 10, function(err, hash) {
        var user = db.get('users').find({email:email}).value();
        if(user){
          user.password = hash;
          user.displayName = displayName;
          db.get('uesrs').find({id:user.id}).assign(user).write();
        }else{
          var user ={
            id:nanoid.nanoid(),
            email:email,
            password:hash,
            displayName:displayName
          }
          db.get('users').push(user).write();
        }
        request.login(user, (err)=>{
          return response.redirect('/')
        })    
      });
    }
  }  
  exports.logout_process = (request,response)=>{ 
  request.logout();  
  // session을 지우는 코드   
  // request.session.destroy((err)=>{  
  //  })
  request.session.save(()=>{
    response.redirect('/');
  });
  }
exports.IsOwner= (req,res)=>{
  if(req.user){
    return true;
  }else{
    return false;
  }
}
exports.StatusUI=(req,res)=>{  
  var authStatusUI = `
  <a href="/auth/login">login</a> | 
  <a href="/auth/register">Register</a> |
  <a href="/auth/google">Login with Google</a> |
  <a href="/auth/facebook">Login with Facebook</a>`;           
  if(this.IsOwner(req,res)){
    authStatusUI = `${req.user.displayName} | <a href = "/auth/logout_process">logout</a>`;
  }
  return authStatusUI;
}
