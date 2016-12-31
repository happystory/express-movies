const User = require('../models/user');

// signup
exports.signup = function(req, res) {
    var _user = req.body.user;

    User.findOne({ name: _user.name }, function(err, user) {
        if (err) {
            console.error(err);
        }
        if (user) {
            return res.redirect(303, '/');
        } else {
            user = new User(_user);
            user.save(function(err, user) {
                if (err) {
                    console.error(err);
                }
                res.redirect(303, '/admin/userlist');
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
            return res.redirect(303, '/');
        }

        user.comparePassword(password, function(err, isMatch) {
            if (isMatch) {
                req.session.user = user;
                return res.redirect(303, '/');
            } else {
                console.log('Password is not matched');
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
