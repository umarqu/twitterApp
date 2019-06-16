const express = require('express');
const passport = require('passport')
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')
const session = require('express-session');
const path = require('path');
const exphbs = require('express-handlebars');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const config = require('./config.js');

const mongoose = require('mongoose');

const mongo = require('mongodb');
mongoose.connect('mongodb://localhost/loginapp');
const db = mongoose.connection;

require('dotenv').config();

const routes = require('./routes/index');
const users = require('./routes/users');


const app = express();

app.set('views', path.join(__dirname + 'views')); // set 
app.engine('handlebars',exphbs({defaultLayout:'layout'}));
app.set('view engine', 'handlebars'); // veiw engine to handlebars


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

//set static folder
app.use(express.static(path.join(__dirname,'public')));

// middle ware for express session
app.use(session({
	secret:'secret', 
	saveUninitialized:true,
	resave:true
}));


//app.use(passport.initialize());
//app.use(passport.session());

//middleware for express-validator 
app.use(expressValidator({
	errorFormatter:function(param,msg,value){
		var namespace = param.split('.')
		,root = namespace.shift()
		,formParam = root;
	
	while(namespace.length){
		formParam += '[' + namepsace.shift() + ']';
	}
	return {
		param:formParam,
		msg:msg,
		value:value
	};
 }
}))

// middleware for Connect flash
app.use(flash());

// global vars for flash 
app.use(function(req,res,next){
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error = req.flash('error_msg');
	res.locals.error = req.flash('error'); 
	res.locals.user = req.user || null // if the user is there. we can access user from anywhere
	next();
})

// middleware for routes
app.use('/',routes);
app.use('/users',users);

// set port
const port = 3001;
app.set('port',(process.env.PORT || 3001));

app.listen(port, () => {
  	console.log(`This is on port ${port }`);
});