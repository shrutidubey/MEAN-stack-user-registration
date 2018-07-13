//import all the dependencies.
var express = require('express'); // include express
var router = express.Router();// set up express router
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

// for register route
router.get('/register', function (req, res) { // get request route for home page to render index
res.render('register');
});

//login route
router.get('/login', function (req, res) {
res.render('login');
});

// for register route
router.post('/register', function (req, res) { // get request route for home page to render index
var name = req.body.name;
var email = req.body.email;
var username = req.body.username;
var password = req.body.password;
var password2 = req.body.password2;

//Validate user input. 
//value in teh registration form are accessible through req.body
req.checkBody('name', 'Name is required').notEmpty();
req.checkBody('username', 'username is required').notEmpty();
req.checkBody('email', 'Email is required').notEmpty();// if email is not empty
req.checkBody('email', 'Email is not valid').isEmail();// to check whether its a valid email or not
req.checkBody('password', 'Password is required');
req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

var username = req.body.username
console.log("abc" + username);

var username1 = User.find({ 'username': username }, { username: 1 });
console.log("abcabc" + username1);
if (username1 === username) {
console.log("error");
}

var email = req.body.email
var errors = req.validationErrors();
var name = req.body.name;
var email = req.body.email;
var usern = req.body.username;
var password = req.body.password;
var cpassword = req.body.password2;
console.log("name:" + name);
console.log("email" + email);
console.log("usern" + usern);
console.log("password:" + password);
console.log("cpass" + cpassword);
var user = User.findOne({$or:[{'email':email},{'username':username}]});
if (!(password === cpassword)) {
req.flash('error_msg', 'Passwords dont match');

} else if (name === "" || email === "" || usern === "" || password === "") {
req.flash('error_msg', 'Please fill all the fields');
console.log("empty")
}

User.findOne({ $or: [{ 'email': email }, { 'username': username }] }, function (err, user) {
if (err) {
next(err)
}
else
if (user) {
req.flash('error', 'Username/Email is already in use.')
res.redirect('/users/register')
}
else {
console.log("ok");
var newUser = new User({
name: name,
email: email,
username: username,
password: password
});

User.createUser(newUser, function (err, user) {
if (err) {

throw err;
console.log(user);
}
});

req.flash('success_msg', 'You are registered and can now log in');
res.redirect('/users/login');
}

});
});

passport.use(new LocalStrategy(
function (username, password, done) {
User.getUserByUsername(username, function (err, user) {
if (err) throw err;
if (!user) {
return done(null, false, { message: 'Unknown User' });
}

User.comparePassword(password, user.password, function (err, isMatch) {
if (err) throw err;
if (isMatch) {
return done(null, user);
} else {
return done(null, false, { message: 'Invalid password' });
}
})
});
}));
/*--?--*/

passport.serializeUser(function (user, done) {
done(null, user.id);
});
passport.deserializeUser(function (id, done) {
User.getUserById(id, function (err, user) {
done(err, user);
});
});
/*--?--*/
router.post('/login',
passport.authenticate('local', { successRedirect: '/', failureRedirect: '/users/login', failureFlash: true }), // use local strategy since we are using local database
function (req, res) {
res.redirect('/');
res.flash('success_msg', 'You are now logged in');

});
/*router.get('/logout', function (req, res, next) {
if (req.session) {
req.session.destroy(function (err) {
if (err) {
return next(err);
}
else {
return res.redirect('/')

}
});
}

});*/

router.get('/logout', function (req, res, next) {
if (req.session) {
req.session.destroy(function (err) {
if (err) {
return next(err)
}
else {
return res.redirect('/')
}
});
}
});

module.exports = router;

