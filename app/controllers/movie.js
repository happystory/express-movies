const Movie = require('../models/movie');
const _ = require('underscore');

// detail page
exports.detail = function(req, res) {
    var id = req.params.id;

    Movie.findById(id, (err, movie) => {
        if (err) {
            console.error(err);
        }
        if (!movie) {
            return res.status(404).send('Not Found');
        }
        res.render('detail', {
            title: 'imooc ' + movie.title,
            movie: movie
        });
    });
};


// admin page
exports.new = function(req, res) {
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
};

// admin update movie
exports.update = function(req, res) {
    var id = req.params.id;

    if (id) {
        Movie.findById(id, (err, movie) => {
            if (err) {
                console.error(err);
            }
            if (!movie) {
                return res.status(404).send('Not Found');
            }
            res.render('admin', {
                title: 'imooc 后台更新页',
                movie: movie
            });
        });
    }
};

// admin poster movie
exports.save = function(req, res) {
    var id = req.body.movie._id;
    var movieObj = req.body.movie;
    var _movie;

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
};

// list page
exports.list = function(req, res) {
    Movie.fetch((err, movies) => {
        if (err) {
            console.log(err);
        }
        res.render('list', {
            title: 'imooc 列表页',
            movies: movies
        });
    });
};

// list delete movie
exports.del = function(req, res) {
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
};
