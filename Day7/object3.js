var q ={
    v1:'v1',
    v2:'v2',
    //javascript에서는 함수를 변수의 값으로 대입 할 수있다.
    f1:function(){
        //객체 내부의 변수를 참조할때는 this를 사용
        console.log(this.v1);
    },
    f2:function(){
        console.log(this.v2);
    }
}

q.f1();
q.f2();