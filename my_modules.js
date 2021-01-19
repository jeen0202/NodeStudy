//여러 함수 export
let foo = function() {
    console.log("foo");
};
let bar = function() {
    console.log("bar")
};
let private = function() {
    console.log("private")
};

//module.exports 대신 exports를 사용할 경수 함수를 직접 대입 할 수는 없다.
exports.foo = foo;
exports.bar = bar;