const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// 不使用mpromise
mongoose.Promise = global.Promise;
const _ = require('underscore');
const Movie = require('./models/movie');

const port = process.env.PORT || 3000;
var app = express();

app.locals.moment = require('moment');

// imooc 是数据库名
mongoose.connect('mongodb://localhost/imooc');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    // we're connected!
});

app.use(express.static(path.join(__dirname + '/public')));
// parse application/x-www-form-urlencoded 
// if extended is true, https://www.npmjs.com/package/qs#readme
app.use(bodyParser.urlencoded({ extended: true }));

app.set('views', './views/pages');
app.set('view engine', 'jade');

app.listen(port);
console.log('imooc started on port ' + port);

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
