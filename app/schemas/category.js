const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var CategorySchema = new Schema({
    name: String,
    movies: [{type: ObjectId, ref: 'movies'}],
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
CategorySchema.pre('save', function(next) {
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
CategorySchema.static('fetch', function (cb) {
  return this
        .find({})
        .sort('meta.updateAt')
        .exec(cb);
});

CategorySchema.static('findById', function (id, cb) {
  return this
        .findOne({_id: id})
        .exec(cb);
});

module.exports = CategorySchema;
