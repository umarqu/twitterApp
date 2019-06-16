var express = require('express');
var router = express('router');
var config = require('../config.js');



//get homepage
router.get('/',ensureAuth,function(req,res){
	res.render('index');
});


router.get('/home',function(req,res){
	res.render('home');
});


function ensureAuth(req,res,next){
	if(req.isAuthenticated()){
		return next(); 
	}
	else{
		req.flash('error_msg', "You are not logged in");
		res.redirect("/users/login");
	}
}

module.exports = router;
