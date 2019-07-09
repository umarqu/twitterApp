var express = require('express');
var router = express('router');
var config = require('../config.js');
var passport = require('passport')




//get homepage
router.get('/',function(req,res){
	res.render('index');
});

router.get('/twitter/return',
  passport.authenticate('twitter'));

router.get('/auth/twitter/return',
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/home');
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
