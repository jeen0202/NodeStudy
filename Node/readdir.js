var testFolder = '../data';
var fs = require('fs');
//file system 의 readdir을 사용하여 지정된 경로의 파일 이름을 불러올 수 있다.
fs.readdir(testFolder,function(error , filelist){
    console.log(filelist);
})