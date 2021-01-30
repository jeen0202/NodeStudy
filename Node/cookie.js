var http = require('http');
var cookie = require('cookie');
var app = http.createServer((req,res)=>{
    var cookies = {};
    //쿠키 읽기
    if(req.headers.cookie!==undefined){       
        cookies = cookie.parse(req.headers.cookie);
        
    }
    //console.log(cookies.yummy_cookie);
  //  쿠키 만들기    
    res.writeHead(200, {
        'Set-Cookie' : [
            'yummy_cookie=choco',
             'tasty_cookie=strawberry',
             `Permanent=cookies; Max-Age=${60*60*24*30}`,
             //secure을 사용하여 https에서의 접근일 경우만 보이도록 한다.
             `Secure=Secure; Secure`,
             //Javascript에서는 호출 할수 없다.
             `HttpOnly=HttpOnly; HttpOnly`,
             //path를 지정하여 해당하는 path와 그 하위에서만 사용 가능하게 할 수 있다.
             `Path=Path; Path=/cookie`,
             //어떤 도메인에서 동작할지 제한
             `Domain=Domain; Domain=o2.org`
        ]
    });
    res.end('Cookie!!');    

})

app.listen(3000);