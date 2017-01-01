const User = require('../models/user');

// signup page
exports.showSignup = function(req, res) {
    res.render('signup', {
        title: '注册页面'
    });
};

// signin page
exports.showSignin = function(req, res) {
    res.render('signin', {
        title: '登录页面'
    });
};

// signup
exports.signup = function(req, res) {
    var _user = req.body.user;

    User.findOne({ name: _user.name }, function(err, user) {
        if (err) {
            console.error(err);
        }
        if (user) {
            return res.redirect(303, '/signin');
        } else {
            user = new User(_user);
            user.save(function(err, user) {
                if (err) {
                    console.error(err);
                }
                res.redirect(303, '/');
            });
        }
    });
};

// signin
exports.signin = function(req, res) {
    var _user = req.body.user;
    var name = _user.name;
    var password = _user.password;

    User.findOne({ name: name }, function(err, user) {
        if (err) {
            console.error(err);
        }

        if (!user) {
            return res.redirect(303, '/signup');
        }

        user.comparePassword(password, function(err, isMatch) {
            if (isMatch) {
                req.session.user = user;
                return res.redirect(303, '/');
            } else {
                return res.redirect(303, '/signin');
            }
        });
    });
};

// logout
exports.logout = function(req, res) {
    delete req.session.user;
    res.redirect(303, '/');
};

// userlist page
exports.list = function(req, res) {
    User.fetch((err, users) => {
        if (err) {
            console.log(err);
        }
        res.render('userlist', {
            title: 'imooc 用户列表页',
            users: users
        });
    });
};

// middleware for user
exports.signinRequired = function(req, res, next) {
    var user = req.session.user;
    if (!user) {
        return res.redirect(303, '/signin');
    }
    next();
};

// middleware for admin
exports.adminRequired = function(req, res, next) {
    var user = req.session.user;
    if (user.role <= 10) {
        return res.redirect(303, '/signin');
    }
    next();
};
