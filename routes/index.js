var express = require('express'); // include express
var router = express.Router();// set up express router



// for homepage

router.get('/', ensureAuthenticated, function (req, res) {  // get request route for home page to render index
    res.render('index');
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/users/login');
    }
}
module.exports = router;
