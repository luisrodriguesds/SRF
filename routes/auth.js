/*  Put license terms here

    This code was developed by Eduardo Melo de Carvalho Braga, for the
    physics laboratory LRX - Laboratório de Raios X da UFC.

    email: eduardom4020@gmail.com

    ##############################################################################
                                Revisions
    ##############################################################################
    
    -> 29/06/2017: Create basic documentation (oficial code creation date)                    
*/

var bcrypt = require('bcrypt-nodejs');

var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    req.session_controller.checkAuth(req, function(user) {
        if(!user) {
            res.redirect("/auth/login");
            return;
        }

        res.redirect("/oven");
    });
});

router.get('/login', function(req, res) {
    res.render('login', {message: "no_msg"});
});

router.get('/signup', function(req, res) {
    res.render('signup', {message: "no_msg"});
});

router.post('/exit', function(req, res) {
    console.log("req:" + req.body);

    req.session = null;
    res.redirect("/auth");
});

router.post('/enter', function(req, res, next) {
    var db = req.db;
    var users = db.get('users');

    var email = req.body.email;
    var password = req.body.password;

    users.findOne({_email: email}).then((user) => {
        if(user == null) { 
            req.failure = true;
        }
        else {
            req.user = user;
            req.password = password;
            req.is_admin = user._admin==1 ? true : false;
            req.is_wait = user.is_wait==1 ? true : false;
        }

        next();
    }); 
}, function(req, res) {
    var user_password =  req.user._password;
    var password =  req.password;

    if(req.failure || !decryptPassword(password, user_password)) {

        res.redirect("/auth/login");
        return;
    }

    var user_email = req.user._email;

    //session rule:
    //  username + \t + password hash
    //to translate:
    //  find username in db, get password and compare it to password hash

    req.session.secret_code = user_email + "\t" + user_password;

    //implement more info after
    req.session.profile_info = {name: user_email, is_admin: req.is_admin, is_wait: req.is_wait};

    res.redirect("/oven");
});

router.post('/add', function(req, res, next) {
    var db = req.db;
    var users = db.get('users');

    var email = req.body.email;
    var password = encryptPassword(req.body.password);

    req.email = email;
    req.password = password;

    users.findOne({_email: email}).then((user) => {
        if(user != null) { 
            req.failure = true;
            next();
        } else {
            var new_user = {
                "_email": email,
                "_password": password,
                "_admin": 0,
                "is_wait": 0
            };

            users.insert(new_user, function(err, r) {
                if(!err) {
                    req.user = new_user;
                    next();
                }
                else {
                    req.not_insert = true;
                    next();
                }
            });
        }
    }); 
}, function(req, res) {
    if(req.failure) {

        res.redirect("/auth/signup");
        return;
    }

    if(req.not_insert) {

        res.redirect("/auth/signup");
        return;
    }

    var user_password =  req.user._password;
    var user_email = req.user._email;

    //session rule:
    //  username + \t + password hash
    //to translate:
    //  find username in db, get password and compare it to password hash

    req.session.secret_code = user_email + "\t" + user_password;

    req.session.profile_info = {name: user_email};

    res.redirect("/oven");

});

function encryptPassword(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

function decryptPassword(password, hash) {
    return bcrypt.compareSync(password, hash);
};

module.exports = router;
