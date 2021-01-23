// function a(){
//     console.log('A');
// }

const { callbackify } = require("util");

//변수 자체에 함수를 대입 할 수 있다.
var a = function(){
    console.log('A');
}

//함수를 매개변수로 하여 이를 실행하는 함수
function slowfunc(callback){
    callback();
}

slowfunc(a);
