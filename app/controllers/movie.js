const Movie = require('../models/movie');
const Comment = require('../models/comment');
const Category = require('../models/category');
const _ = require('underscore');
const fs = require('fs');
const path = require('path');

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

        // 通过回调
        // Comment.find({movie: id}, function(err, comments) {
        //     if (err) {
        //         console.error(err);
        //     }
        //     console.log(comments);
        //     res.render('detail', {
        //         title: 'imooc ' + movie.title,
        //         movie: movie,
        //         comments: comments
        //     });
        // });

        Comment
            .find({ movie: id })
            // Model.populate(docs, options, [callback(err,doc)])
            // Populates document references.
            // Parameters:
            // docs <Document, Array> Either a single document or array of documents to populate.
            // options <Object> A hash of key/val (path, options) used for population.
            .populate('from', 'name')
            .populate('reply.from reply.to', 'name')
            .exec(function(err, comments) {
                if (err) {
                    console.error(err);
                }
                // console.log(comments);
                res.render('detail', {
                    title: 'imooc ' + movie.title,
                    movie: movie,
                    comments: comments
                });
            });
    });
};


// admin page
exports.new = function(req, res) {
    Category.find({}, function(err, categories) {
        res.render('admin', {
            title: 'imooc 后台录入页',
            categories: categories,
            movie: {}
        });
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
            Category.find({}, function(err, categories) {
                if (err) {
                    console.error(err);
                }
                res.render('admin', {
                    title: 'imooc 后台更新页',
                    movie: movie,
                    categories: categories
                });
            });
        });
    }
};

// admin poster movie
exports.save = function(req, res) {
    var id = req.body.movie._id;
    var movieObj = req.body.movie;
    var _movie;

    if (req.poster) {
        movieObj.poster = req.poster;
    }

    if (id) {
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
                Category.fetch(function(err, categories) {
                    if (err) {
                        console.error(err);
                    }
                    // 删除原有数据
                    categories.forEach((cat, index) => {
                        var order = cat.movies.indexOf(id);
                        if (order !== -1) {
                            cat.movies.splice(order, 1);
                            cat.save(function(err, category) {
                                if (err) {
                                    console.error(err);
                                }

                                // 保存新数据
                                Category.findById(movieObj.category, function(err, category) {
                                    if (err) {
                                        console.error(err);
                                    }
                                    category.movies.push(_movie._id);
                                    category.save(function(err, category) {
                                        if (err) {
                                            console.error(err);
                                        }
                                        res.redirect(303, '/movie/' + movie._id);
                                    });
                                });
                            });
                        }
                    });
                });
            });
        });
    } else {
        _movie = new Movie(movieObj);
        var categoryId = movieObj.category;
        var categoryName = movieObj.categoryName;

        _movie.save((err, movie) => {
            if (err) {
                console.error(err);
            }
            Category.findById(categoryId, function(err, category) {
                if (err) {
                    console.error(err);
                }
                if (categoryId) {
                    category.movies.push(_movie._id);
                    category.save(function(err, category) {
                        if (err) {
                            console.error(err);
                        }
                        res.redirect(303, '/movie/' + movie._id);
                    });
                } else if (categoryName) {
                    var _category = new Category({
                        name: categoryName,
                        movies: [movie._id]
                    });
                    _category.save(function() {
                        if (err) {
                            console.error(err);
                        }
                        movie.category = _category._id;
                        movie.save(function(err, category) {
                            if (err) {
                                console.error(err);
                            }
                            res.redirect(303, '/movie/' + movie._id);
                        });
                    });
                }
            });
        });
    }
};

// middle for saving poster
exports.savePoster = function(req, res, next) {
    var posterData = req.files.uploadPoster;
    var filePath = posterData.path;
    var originalFilename = posterData.originalFilename;

    if (originalFilename) {
        var timestamp = Date.now();
        var type = posterData.type.split('/')[1];
        var poster = originalFilename.split('.')[0] + '_' + timestamp + '.' + type;
        var newPath = path.resolve(__dirname, '../../', 'public/upload/' + poster);

        fs.rename(filePath, newPath, function(err) {
            if (err) {
                console.error(err);
            }
            req.poster = poster;
            next();
        });
    } else {
        next();
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
