const Movie = require('../models/movie');

// index page
exports.index = function(req, res) {
    Movie.fetch((err, movies) => {
        if (err) {
            console.error(err);
        }
        res.render('index', {
            title: 'imooc 首页',
            movies: movies
        });
    });
};