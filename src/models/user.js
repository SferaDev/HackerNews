import {postSchema} from "./post";

const mongoose = require('mongoose');
const autoIncrement = require("mongoose-auto-increment");
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        default: 1
    },
    createdDate: {
        type: Date,
        default: Date.now
    }
});

// Before save, hash the stored password to database
userSchema.pre('save', function(next) {
    if (!this.isModified('password')) return next();
    this.password = bcrypt.hashSync(this.password, 10);
    next();
});

// Compare Password async with a callback(error, isMatch)
userSchema.methods.comparePassword = function(candidatePassword) {
    return bcrypt.compareSync(candidatePassword, this.password);
};

// Export User model as module
module.exports = mongoose.model('User', userSchema);

postSchema.schema.plugin(autoIncrement.plugin, 'User');