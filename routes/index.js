const express = require('express')
const router = express.Router();
const topic = require('../lib/topic');

router.get('/', (req, res) =>{topic.home(req, res);})

module.exports  = router;