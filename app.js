var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');  //template-engine
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/loginapp');
var db = mongoose.connection;
/* include routes*//* folder routes has index and users*/
var routes = require('./routes/index');
var users = require('./routes/users');


/* initialize app*/
var app = express();


// setup the view engine(express-handlebars)
app.set('views', path.join(__dirname, 'views'));/* folder views will handle our views*/
app.engine('handlebars', exphbs({ defaultLayout: 'layout' }));/* setting the template engine to handlebars and defaultLayout file will be called layout*/
app.set('view engine', 'handlebars');/* set the view engine to handlebars*/

/* body-parser middleware*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//set public folder(to put stylesheets,images,jquery)
app.use(express.static(path.join(__dirname, 'public')));

// middleware for express-session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));
// setting the middleware for flash
app.use(flash());

//passport init //passport will  be used when user wants to login
app.use(passport.initialize());
app.use(passport.session());

//middleware for express-validator

app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
        var namespace = param.split('.')
            , root = namespace.shift()
            , formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

// connect flash middleware
//app.use(flash());

//set global variables for flash msgs
// setting the type type of messages to be used in flash
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');/*res.locals is used to create global variables of global functions*/
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');/* passprt sets its own flash messages to error*/
    res.locals.user = req.user || null;// if user is there then access user else it will be set to null
    next();
});
// middleware for route files,these routes will handle any request made to URL path

app.use('/', routes);
app.use('/users', users);

// middleware to handle 404 errors, this will be called when a 
// request does not map to any of the middleware above
app.use(function (req, res, next) {
    // render will move it to views/notFound.handlebars.
    res.render('notFound')
});


//set port
/*app.set('port', (process.env.PORT || 9000));
app.listen(app.get('port'), function () {
    console.log('Server started on port' + app.get('port'));
});*/



app.set('port', ( 9000));
app.listen(app.get('port'), function () {
    console.log('Server started on port' + app.get('port'));
});

