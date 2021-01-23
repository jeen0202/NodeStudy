var fs = require('fs');

// Sync방식의 실행
// console.log('A');
// //readFileSync
// var result = fs.readFileSync('Day5/sample.txt','utf8');
// console.log(result);
// console.log('C'); 

console.log('A');
//readFile => Async 방식의 실행
//Async(비동기식)으로 실행하였을 경우 callback을 통해 작업이 완료 되었을 경우 결과 반환
fs.readFile('Day5/sample.txt','utf8',function(err,result){
    //처리 완료후 실행되는 실행부
    console.log(result);
});

console.log('C'); 