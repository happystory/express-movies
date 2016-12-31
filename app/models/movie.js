const mongoose = require('mongoose');
const MovieSchema = require('../schemas/movie');

// Mongoose#model(name, [schema], [collection], [skipInit])
// Defines a model or retrieves it.
var Movie = mongoose.model('movies', MovieSchema);

module.exports = Movie;