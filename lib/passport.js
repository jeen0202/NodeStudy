let authData ={
    email: 'jeen0202@korea.ac.kr',
    password:'111111',
    nickname:'jeen0202'
    }

module.exports =(app)=>{
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

  app.use(passport.initialize()); //passport 초기화
  app.use(passport.session());
  //session사용을 위한 serialize(로그인 성공시 session-store에 저장)
  passport.serializeUser(function(user, done) {
   
    done(null, user.email); //done 함수의 매개변수에 식별자
  });
  //page를 호출할때마다 같이 호출되는 callback 함수(페이지 방문시 마다 인증된 사용자인지 확인)
  passport.deserializeUser(function(id, done) {
    consol
    done(null,authData)//원래는 사용자 정보를 조회해야한다.
  });
  //인증 성공 유무를 확인
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
    function(username, password, done) {     
      if(username === authData.email){
        if(password === authData.password){
          return done(null, authData,{
            message: "Login success."
          });//2번째 파라미터에 사용자의 실제 정보를 담는다.
          }else{
            return done(null, false, { message: 'Incorrect password.' });
          }        
      }else{
        return done(null, false, { message: 'Incorrect username.' });
      }
    }
  ));
  return passport;
}