const { request } = require('express');
const db = require('./lowdb');

module.exports ={
    topic:(req,res,next)=>{       
        req.list = db.get('topics').value();
        next();
    }
    ,author:(req,res,next)=>{
        req.author = db.get('users').value();
        next();
    }
}