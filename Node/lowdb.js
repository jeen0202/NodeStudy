const low = require('lowdb')
//FileSync방식으로 저장하기 위해 호출
const FileAsync = require('lowdb/adapters/FileAsync')

const adapter = new FileAsync('db.json')
const nanoid = require('nanoid');
const db = low(adapter).then(
    (db)=>{
    db.defaults({ topic: [], author:[]}).write()
    /* CREATE
db.get('table명').push({
    column명:값,
    column명:값
    ....
}).write();
*/
/*READ
db.get('table명')
  .find({ 찾고자하는 조건 })
  .sortBy('정렬기준') // 정렬
  .value()
*/
// console.log(
//     db.get('topic')
//     .value());
/*UPDATE
db.get('table명')
  .find({ 찾고자하는 조건 })  
  .assign({변경하려는 column:변경하려는 값})
  .write();
*/
// db.get('topic')
//     .find({id:1})
//     .assign({title: 'MySQL & MariaDB'})
//     .write();
// db.get('topic')
// .remove({id:2})
// .write();
/*DELETE
db.get('table명')
  .remove({삭제하려는 조건})
  .write();
*/
//nanoid 모듈을 사용하여 id 생성
var sid = nanoid.nanoid();
db.get('author')
.push({
    id: sid,
    namd : 'duru',
    profile : 'db admin'
}).write().then(()=>{
    console.log('add author')
});

db.get('topic')
    .push({
        id:nanoid.nanoid(),
        title : 'MSSQL',
        description : 'MSSQL is ...',
        author : sid 
    }).write().then(()=>{
        console.log('add topic')
    });;
    }
    // Set some defaults (required if your JSON file is empty)
)
