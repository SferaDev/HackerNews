const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const findOrCreate = require('mongoose-findorcreate');

const baseOptions = {
    timestamps: true
};

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        default: ''
    },
    githubId: {
        type: String,
        default: ''
    },
    karma: {
        type: Number,
        default: 1
    },
    about: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        default: ''
    },
    showdead: {
        type: Boolean,
        default: false
    },
    noprocrat: {
        type: Boolean,
        default: false
    },
    maxvisit: {
        type: Number,
        default: 20
    },
    minaway: {
        type: Number,
        default: 180
    },
    delay: {
        type: Number,
        default: 0
    }
}, baseOptions);

userSchema.plugin(findOrCreate);

// Before save, hash the stored password to database
userSchema.pre('save', function (next) {
    if (!this.isModified('password')) return next();
    this.password = bcrypt.hashSync(this.password, 10);
    next();
});

// Compare Password async with a callback(error, isMatch)
userSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compareSync(candidatePassword, this.password);
};

// Export User model as module
export const userModel = mongoose.model('User', userSchema);