const Movie = require('../models/movie');
const Category = require('../models/category');

// index page
exports.index = function(req, res) {
    Category
        .find({})
        .populate({
            path: 'movies', 
            options: {
                limit: 5
            }
        })
        .exec(function(err, categories) {
            if (err) {
                console.error(err);
            }
            res.render('index', {
                title: 'imooc 首页',
                categories: categories
            });
        });

    // Movie.fetch((err, movies) => {
    //     if (err) {
    //         console.error(err);
    //     }
    //     res.render('index', {
    //         title: 'imooc 首页',
    //         movies: movies
    //     });
    // });
};
