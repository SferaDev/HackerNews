import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import hat from "hat";
import idValidator from "mongoose-id-validator";

import {timeSince} from "../utils/timeUtils";
import * as appConfig from "../../config.json";
import {propertyFinder} from "../utils/magicUtils";

const baseOptions = {
    timestamps: true,
    toJSON: {
        transform: function (doc, ret) {
            let publicProperties = propertyFinder(userModel, 'public');
            for (let key in ret)
                if (ret.hasOwnProperty(key) && key !== '_id' && !publicProperties.includes(key)) delete ret[key];
        }
    }
};

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        public: true
    },
    fullName: {
        type: String,
        public: true
    },
    githubId: {
        type: String,
        unique: true,
        required: true,
        public: true
    },
    password: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now,
        public: true
    },
    karma: {
        type: Number,
        default: 1,
        public: true
    },
    about: {
        type: String,
        default: '',
        editable: true,
        public: true
    },
    email: {
        type: String,
        default: '',
        public: true
    },
    apiKey: {
        type: String,
        default: hat()
    },
    picture: {
        type: String,
        public: true
    }
}, baseOptions);

userSchema.virtual('timeSince').get(function () {
    return timeSince(this.createdAt);
});

userSchema.virtual('isAdmin').get(function () {
    return appConfig.admins.some(e => e.username === this.username);
});

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

userSchema.statics.identifier = () => 'username';

userSchema.methods.canEdit = function (userId) {
    return this._id.toString() === userId.toString();
};

userSchema.methods.executeDelete = function (next) {
    this.remove();
    next(true);
};

// Apply ObjectId reference validation
userSchema.plugin(idValidator);

// Export User model as module
export const userModel = mongoose.model('User', userSchema);
