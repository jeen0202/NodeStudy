const express = require('express')
const router = express.Router();
const auth = require('../lib/auth')
module.exports = function(passport){
  router.get('/google',
  passport.authenticate('google', { 
    scope: ['https://www.googleapis.com/auth/plus.login','email']
  }));  
  router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/auth/login' }),
  function(req, res) {
    res.redirect('/');
  });
  router.get('/facebook', passport.authenticate('facebook',{
      scope:'email'
  }));
  router.get('/facebook/callback',
  passport.authenticate('facebook', 
  { successRedirect: '/',
  failureRedirect: '/auth/login' }));
  router.get('/login',(req,res)=>{auth.login(req,res);})
  //router.post('/login_process',(req,res)=>{auth.login_process(req,res);})
  //File-Store를 사용했기때문에 바로 redirect하지 않고 save를 통해 저장후 redirect하자  
  router.post('/login_process'
    ,passport.authenticate('local',{
    failureRedirect : '/auth/login'
    ,successFlash: true
    ,failureFlash: true}) , (req, res) => 
    {
    req.session.save( () => {
    res.redirect('/')
    })
  })
    router.get('/register',(req,res)=>{auth.register(req,res);})
    router.post('/register_process',(req,res)=>{auth.register_process(req,res);})
    router.get('/logout_process',(req,res)=>{auth.logout_process(req,res);})    
    return router;
}
