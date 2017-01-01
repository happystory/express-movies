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


exports.search = function(req, res) {
    var catId = req.query.cat;
    var q = req.query.q;
    var page = parseInt(req.query.p, 10) || 0;
    var count = 2;
    var index = page * count;

    if (catId) {
        Category
        .find({_id: catId})
        .populate({
            path: 'movies', 
            select: 'title poster',
            // options: {
            //     limit: count,
            //     skip: index
            // }
        })
        .exec(function(err, categories) {
            if (err) {
                console.error(err);
            }
            var category = categories[0] || {};
            var movies = category.movies || [];
            var results = movies.slice(index, index + count);

            res.render('results', {
                title: 'imooc 结果列表页面',
                keyword: category.name,
                results: results,
                query: 'cat=' + catId,
                currentPage: (page + 1),
                totalPage: Math.ceil(movies.length / count)
            });
        });
    } else {
        Movie
            .find({title: new RegExp(q + '.*', 'i')})
            .exec(function(err, movies) {
                if (err) {
                    console.error(err);
                }
                var results = movies.slice(index, index + count);
                res.render('results', {
                    title: 'imooc 结果列表页面',
                    keyword: q,
                    results: results,
                    query: 'q=' + q,
                    currentPage: (page + 1),
                    totalPage: Math.ceil(movies.length / count)
                });
            });
    }
};