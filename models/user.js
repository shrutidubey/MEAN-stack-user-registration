// import the dependencies

var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');


// a new schema is created for each user we want to save the 
// username,password,email,name.
var UserSchema = mongoose.Schema({
    username: {
        type: String,
        index: true,
    },

    password: {
        type: String
    },
    email: {
        type: String,
        /*set:toLower*/
    },
    name: {
        type: String
    }
});


// the model is defined and assigned to a variable.
var User = mongoose.model('User', UserSchema); // User is a variable that can be aaccessed outside of this file
// the model is exported so that it can be used in other parts of application
module.exports = User;

// hashing password using salt.
//salt will be generated using bcryptjs 
// this method will be called at the tym of user registration.

module.exports.createUser = function (newUser, callback) {
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(newUser.password, salt, function (err, hash) {
            newUser.password = hash;
            newUser.save(callback);   //?
        });
    });
}

module.exports.getUserByUsername = function (username, callback) {
    var query = { username: username };
    User.findOne(query, callback);
}

module.exports.getUserById = function (id, callback) {

    User.findById(id, callback);
}

module.exports.comparePassword = function (candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, function (err, isMatch) {
        if (err)
            throw err;
        callback(null, isMatch);

    });
}
