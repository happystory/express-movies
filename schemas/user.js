const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const SALT_SOUNDS = 10;

var Schema = mongoose.Schema;

var UserSchema = new Schema({
    name: {
        unique: true,
        type: String
    },
    password: String,
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
UserSchema.pre('save', function(next) {
    var user = this;

    // Document#isNew
    // Boolean flag specifying if the document is new.
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    } else {
        this.meta.updateAt = Date.now();
    }

    bcrypt.genSalt(SALT_SOUNDS, function(err, salt) {
        if (err) {
            return next(err);
        }
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) {
                return next(err);
            }
            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function(_password, cb) {
    bcrypt.compare(_password, this.password, function(err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

// Schema#static(name, [fn])
// Adds static "class" methods to Models compiled from this schema.
UserSchema.static('fetch', function (cb) {
  return this
        .find({})
        .sort('meta.updateAt')
        .exec(cb);
});

UserSchema.static('findById', function (id, cb) {
  return this
        .findOne({_id: id})
        .exec(cb);
});

module.exports = UserSchema;
