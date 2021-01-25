///순서가 있는 데이터를 관리하는데 유리한 array
var member = ['egoing','k8005','hoya'];
console.log(member[1]);
// for(let i=0;i<member.length;i++){
//     console.log('array loop',member[i]);
// }

//순서가 없이 이름으로 구분되는 데이터의 관리에 유리한 object
var roles = {
    //key 값 : value 값으로 구분
    'programmer':'egoing',
    'designer':'k8805',
    'manager':'hoya'
}
console.log(roles.manager);
for(let name in roles){
    console.log('object =>',name, 'value =>', roles[name]);
}

