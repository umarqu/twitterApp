var express = require('express');
var router = express('router');

//get homepage
router.get('/',ensureAuth,function(req,res){
	res.render('index');
});


function ensureAuth(req,res,next){
	if(req.isAuthenticated()){
		return next(); // keep on going
	}
	else{
		req.flash('error_msg', "You are not logged in");
		res.redirect("/users/login");
	}
}

module.exports = router;


