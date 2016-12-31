const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// 不使用mpromise
mongoose.Promise = global.Promise;
const _ = require('underscore');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const Movie = require('./models/movie');
const User = require('./models/user');
const port = process.env.PORT || 3000;
var app = express();
var dbUrl = 'mongodb://localhost/imooc';

app.locals.moment = require('moment');

// imooc 是数据库名
mongoose.connect(dbUrl);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    // we're connected!
});

app.use(express.static(path.join(__dirname + '/public')));
// parse application/x-www-form-urlencoded 
// if extended is true, https://www.npmjs.com/package/qs#readme
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    name: 'imooc_movie', // session ID, the default value is 'connect.sid'
    secret: 'imooc', // This is the secret used to sign the session ID cookie
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 3600000
    },
    store: new MongoStore({
       url: dbUrl,
       collection: 'sessions'
    })
}));

app.set('views', './views/pages');
app.set('view engine', 'jade');

app.listen(port);
console.log('imooc started on port ' + port);

// 判断登录状态中间件
app.use((req, res, next) => {
    var _user = req.session.user;
    if (_user) {
        res.locals.user = _user;
    }
    next();
});

// index page
app.get('/', (req, res) => {
    Movie.fetch((err, movies) => {
        if (err) {
            console.error(err);
        }
        res.render('index', {
            title: 'imooc 首页',
            /**
             * movies mock
             * [{ title, _id, poster }]
             */
            movies: movies
        });
    });
});

// signup
app.post('/user/signup', (req, res) => {
    var _user = req.body.user;

    User.findOne({name: _user.name}, function(err, user) {
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
});

// signin
app.post('/user/signin', (req, res) => {
    var _user = req.body.user;
    var name = _user.name;
    var password = _user.password;

    User.findOne({name: name}, function(err, user) {
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
});

// logout
app.get('/logout', (req, res) => {
    delete req.session.user;
    res.redirect(303, '/');
});

// userlist page
app.get('/admin/userlist', (req, res) => {
    User.fetch((err, users) => {
        if (err) {
            console.log(err);
        }
        res.render('userlist', {
            title: 'imooc 用户列表页',
            users: users
        });
    });
});

// detail page
app.get('/movie/:id', (req, res) => {
    var id = req.params.id;

    Movie.findById(id, (err, movie) => {
        if (err) {
            console.error(err);
        }
        res.render('detail', {
            title: 'imooc ' + movie.title,
            /**
             * movie mock
             * {director, country, title, year, poster, language, flash, summary}
             */
            movie: movie
        });
    });
});


// admin page
app.get('/admin/movie', (req, res) => {
    res.render('admin', {
        title: 'imooc 后台录入页',
        movie: {
            director: '',
            country: '',
            title: '',
            year: '',
            poster: '',
            language: '',
            flash: '',
            summary: ''
        }
    });
});

// admin update movie
app.get('/admin/update/:id', (req, res) => {
    var id = req.params.id;

    if (id) {
        Movie.findById(id, (err, movie) => {
            if (err) {
                console.error(err);
                return res.send('查询失败');
            }

            res.render('admin', {
                title: 'imooc 后台更新页',
                movie: movie
            });
        });
    }
});

// admin poster movie
app.post('/admin/movie/new', (req, res) => {
    var id = req.body.movie._id;
    var movieObj = req.body.movie;
    var _movie;
    // console.log(movieObj);

    if (id !== 'undefined') {
        Movie.findById(id, (err, movie) => {
            if (err) {
                console.log(err);
            }

            // 用新对象替换旧对象
            // _movie = Object.assign(movie, movieObj);
            _movie = _.extend(movie, movieObj);
            _movie.save((err, movie) => {
                if (err) {
                    console.error(err);
                }
                // 默认为302重定向 暂时性转移(Temporarily Moved )
                res.redirect(303, '/movie/' + movie._id);
            });
        });
    } else {
        _movie = new Movie({
            director: movieObj.director,
            title: movieObj.title,
            country: movieObj.country,
            language: movieObj.language,
            year: movieObj.year,
            poster: movieObj.poster,
            summary: movieObj.summary,
            flash: movieObj.flash
        });

        _movie.save((err, movie) => {
            if (err) {
                console.error(err);
            }
            res.redirect(303, '/movie/' + movie._id);
        });
    }
});

// list delete movie
app.delete('/admin/list', (req, res) => {
    var id = req.query.id;

    if (id) {
        // Query#remove([criteria], [callback])
        // Declare and/or execute this query as a remove() operation.
        Movie.remove({ _id: id }, (err, movie) => {
            if (err) {
                console.error(err);
            } else {
                res.json({
                    errno: 0
                });
            }
        });
    }
});

// list page
app.get('/admin/list', (req, res) => {
    Movie.fetch((err, movies) => {
        if (err) {
            console.log(err);
        }
        res.render('list', {
            title: 'imooc 列表页',
            /**
             * movies mock
             * { _id, director, country, title, year, poster, language, flash, summary}
             */
            movies: movies
        });
    });
});
