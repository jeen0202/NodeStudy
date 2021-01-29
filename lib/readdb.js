const { request } = require('express');
const db = require('./db');

module.exports ={
    topic:(req,res,next)=>{
        db.query (`select * from topic`,function(error,topics){
            if(error){
                throw error;
            }
            req.topics = topics;
            next();
        })
    }
    ,author:(req,res,next)=>{
        db.query (`select * from author`,function(error2,authors){
            if(error2){
                throw error;
            }
        req.authors = authors;
        next();
    });
}
}