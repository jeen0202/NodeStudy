const { request } = require('express');
const db = require('./db');

module.exports ={
    topic:(req,res,next)=>{
        db.query (`select * from topic`,function(error,topics){
            if(error){
                next(error);
            }
            req.topics = topics;
            next();
        })
    }
    ,author:(req,res,next)=>{
        db.query (`select * from author`,function(error2,authors){
            if(error2){
                next(error);
            }
        req.authors = authors;
        next();
    });
}
}