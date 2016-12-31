const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MovieSchema = new Schema({
    director: String,
    title: String,
    language: String,
    country: String,
    summary: String,
    flash: String,
    poster: String,
    year: Number,
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
});


// Schema#pre(method, callback)
// Defines a pre hook for the document.
MovieSchema.pre('save', function(next) {
    // Document#isNew
    // Boolean flag specifying if the document is new.
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    } else {
        this.meta.updateAt = Date.now();
    }
    next();
});

// Schema#static(name, [fn])
// Adds static "class" methods to Models compiled from this schema.
MovieSchema.static('fetch', function (cb) {
  return this
        .find({})
        .sort('meta.updateAt')
        .exec(cb);
});

MovieSchema.static('findById', function (id, cb) {
  return this
        .findOne({_id: id})
        .exec(cb);
});

module.exports = MovieSchema;
