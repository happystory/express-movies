const Comment = require('../models/comment');

// admin poster movie
exports.save = function(req, res) {
    var _comment = req.body.comment;
    var movieId = _comment.movie;

    if (_comment.cid) {
        Comment.findById(_comment.cid, function(err, comment) {
            if (err) {
                console.error(err);
            }
            var reply = {
                from: _comment.from,
                to: _comment.tid,
                content: _comment.content
            };

            comment.reply.push(reply);
            comment.save(function(err, comment) {
                if (err) {
                    console.error(err);
                }
                res.redirect(303, '/movie/' + movieId);
            });
        });
    } else {
        var comment = new Comment(_comment);
        comment.save((err, comment) => {
            if (err) {
                console.error(err);
            }
            res.redirect(303, '/movie/' + movieId);
        });
    }
};