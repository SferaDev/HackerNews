const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const baseOptions = {
    timestamps: true
};

const userSchema = new mongoose.Schema({
    githubId: {
        type: String,
        unique: true
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String
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

userSchema.statics.findOneOrCreate = function findOneOrCreate(condition, callback) {
    const self = this;
    self.findOne(condition, (err, result) => {
        return result ? callback(err, result) : self.create(condition, (err, result) => {
            return callback(err, result)
        })
    })
};

// Export User model as module
export const userModel = mongoose.model('User', userSchema);