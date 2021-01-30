module.exports = (req,res)=>{
    var cookies = {};
    var isOwner = false;
    // if(req.headers.cookie){
    //     cookies = cookie.parse(req.cookies);        
    // }
    console.log(req.cookies);
    // if(cookies.email ==='jeen0202@korea.ac.kr' && cookies.password === '111111'){
    //     isOwner = true;
    // }
    // req.isOwner = isOwner;
    // console.log(isOwner);
    next();
}