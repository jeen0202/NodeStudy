// 함수 모듈 불러오기
const calc = require('./cal.js');
console.log(calc(2,3));

//객체 모듈 불러오기
const cal = require('./calM.js');
let result = cal.geometricSum(3,4,5);
console.log(result);

//여러 함수 불러오기
let myMod = require('./my_modules');
myMod.foo();
myMod.bar();
myMod.private(); //에러