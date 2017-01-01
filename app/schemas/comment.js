const mongoose = require('mongoose');
var Schema = mongoose.Schema;
// Schema.Types
// The various built-in Mongoose Schema Types.
var ObjectId = Schema.Types.ObjectId;

var CommentSchema = new Schema({
    // ref 指定populate时查询的表
    movie: {
        type: ObjectId,
        ref: 'movies'
    },
    from: {
        type: ObjectId,
        ref: 'users'
    },
    to: {
        type: ObjectId,
        ref: 'users'
    },
    content: String,
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
CommentSchema.pre('save', function(next) {
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
CommentSchema.static('fetch', function (cb) {
  return this
        .find({})
        .sort('meta.updateAt')
        .exec(cb);
});

CommentSchema.static('findById', function (id, cb) {
  return this
        .findOne({_id: id})
        .exec(cb);
});

module.exports = CommentSchema;
