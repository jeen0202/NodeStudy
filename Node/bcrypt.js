const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = '111111'; //실제 비밀번호
const someOtherPlaintextPassword = '111112';

bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) {
    // Store hash in your password DB.
    console.log(hash);
   console.log(res1 =bcrypt.compareSync(myPlaintextPassword, hash)); // true
   console.log(res2 =bcrypt.compareSync(someOtherPlaintextPassword, hash)); // false
});
