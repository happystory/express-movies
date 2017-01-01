const Comment = require('../models/comment');

// admin poster movie
exports.save = function(req, res) {
    var comment = req.body.comment;
    var movieId = comment.movie;

    _comment = new Comment(comment);

    _comment.save((err, comment) => {
        if (err) {
            console.error(err);
        }
        res.redirect(303, '/movie/' + movieId);
    });
};