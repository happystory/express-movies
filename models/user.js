const mongoose = require('mongoose');
const UserSchema = require('../schemas/user');

// Mongoose#model(name, [schema], [collection], [skipInit])
// Defines a model or retrieves it.
var User = mongoose.model('users', UserSchema);

module.exports = User;