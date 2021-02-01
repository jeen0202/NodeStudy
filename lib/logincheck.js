var cookie = require('cookie');

module.exports = (req,res)=>{
    var cookies = {};    
    var authStatusUI =`<a href = "/auth/login">login</a>`
     if(req.headers.cookie){
         cookies = cookie.parse(req.headers.cookie);        
     }
    //console.log(req.cookies);
     if(cookies.email ==='jeen0202@korea.ac.kr' && cookies.password === '111111'){
        authStatusUI = `<a href = "/auth/logout_process">logout</a>`;
     }
     return authStatusUI;      
    }
