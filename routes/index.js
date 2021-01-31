const express = require('express')
const router = express.Router();
const topic = require('../lib/topic');

router.get('/', (req, res) =>{topic.home(req, res);})
router.get('/login',(req,res)=>{topic.login(req,res);})
router.post('/login_process',(req,res)=>{topic.login_process(req,res);})
router.get('/logout_process',(req,res)=>{topic.logout_process(req,res);})
module.exports  = router;