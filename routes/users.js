var express = require('express');
var router = express('router');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var twitterStrategy = require('passport-twitter').Strategy; 
var User = require('../models/user')


//get homepage
router.get('/register',function(req,res){
	res.render('register');
});


router.get('/login',function(req,res){
	res.render('login');
});

router.post('/register',function(req,res){
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;

	req.checkBody("name","Name required").notEmpty();
	req.checkBody("email","Email required").notEmpty();
	req.checkBody("email","Email not valid").isEmail();

	req.checkBody("username","Username required").notEmpty();
	req.checkBody("password","Password required").notEmpty();
	req.checkBody("password2","name is required").equals(req.body.password);

	var errors = req.validationErrors();

	if(errors){
		res.render('register',{
			errors:errors
		});
	}else{
		console.log('news_user')
		//var newUser
		var newUser = new User({
			name:name,
			email:email,
			username:username,
			password:password
		});

		User.createUser(newUser,function(err,user){
			if(err) throw err;
			console.log(user);
		});

		req.flash('success_msg','You are registered and can now login');
		res.redirect('/users/login');
	}
});



router.post('/login',				//options object 
	passport.authenticate('local',{successRedirect:'/',
								   failureRedirect:'/users/login', 
								   failureFlash:true}), // using local databse

	function(req,res){
		res.redirect('/');
	});

//passport.use(new LocalStrategy(func(){return done}))	

passport.use(new LocalStrategy(
  function(username, password, done) {
   	//User is a model 		pass in username and function
   	User.getUserbyUsername(username,function(err,user){
   		if(err) throw err;
   		if (!user){//not a match 
   			return done(null,false,{message:'unknown user'}); //
   		}

   	var x = twitterApp(user);
   	console.log(x);

   	//if there is a user
   	User.comparePassword(password,user.password,function(err,isMatch){
   		if(err) throw err;
   		if(isMatch){
   			return done(null,user); // pass in null and the user if match
   		}
   		else{
   			return done(null,false,{message:'invalid password'});
   		}
   		});
   	});
  }));


router.post('/login',				//options object 
	passport.authenticate('local',{successRedirect:'/',
								   failureRedirect:'/users/login', 
								   failureFlash:true}), // using local databse

	function(req,res){
		res.redirect('/');
	});

passport.serializeUser(function(user, callback) {
  callback(null, user.id); // saved in session
});

passport.deserializeUser(function(id, done) {
  User.getUserbyId(id, function(err, user) {
    done(err, user);
  });
});



router.post('/login',				//options object 
	passport.authenticate('local',{successRedirect:'/', failureRedirect:'/users/login', failureFlash:true}), // using local databse
	function(req,res){
		res.redirect('/');
	});


router.get('/logout',function(req,res){
	req.logout();
	req.flash('sucess_msg','You are logged out');
	res.redirect('/users/login');
})

module.exports = router;


