// array, object, 

// 함수는 변수에 대입되어서 사용 될 수 있다.
var f = function(){
    console.log(1+1);
    console.log(1+2);
}
var a = [f];
a[0]();

var o = {
    func:f
}
o.func();