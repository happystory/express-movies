const mongoose = require('mongoose');
const CategorySchema = require('../schemas/category');

// Mongoose#model(name, [schema], [collection], [skipInit])
// Defines a model or retrieves it.
var Category = mongoose.model('categories', CategorySchema);

module.exports = Category;