const mongoose = require('mongoose');
const CommentSchema = require('../schemas/comment');

// Mongoose#model(name, [schema], [collection], [skipInit])
// Defines a model or retrieves it.
var Comment = mongoose.model('comments', CommentSchema);

module.exports = Comment;