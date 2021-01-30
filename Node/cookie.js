var http = require('http');
var cookie = require('cookie');
var app = http.createServer((req,res)=>{
    var cookies = {};
    //쿠키 읽기
    if(req.headers.cookie!==undefined){       
        cookies = cookie.parse(req.headers.cookie);
        
    }
    console.log(cookies.yummy_cookie);
    //쿠키 만들기    
    res.writeHead(200, {
        'Set-Cookie' : ['yummy_cookie=choco', 'tasty_cookie=strawberry']
    });
    res.end('Cookie!!');    

})

app.listen(3000);