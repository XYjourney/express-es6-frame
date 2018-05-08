var express = require('express');
var router = express.Router();
var passport = require('../config/passport.config');
import retClass from '../lib/ret.class';

router.post('/signup',
    passport.authenticate('local.signup',{
        failureFlash:true
    }),function(req,res,next){
        res.json(new retClass('200','注册成功',true))
});

router.post('/login',
    passport.authenticate('local.login',{
        failureFlash:true
    }),function(req,res){
        res.json(new retClass('200','登录成功',true))
});
module.exports = router;