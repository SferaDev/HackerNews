import mongoose from "mongoose";
import {propertyFinder} from "../utils/magicUtils";

const baseOptions = {
    timestamps: true,
    toJSON: {
        transform: function (doc, ret) {
            let publicProperties = propertyFinder(favouriteModel, 'public');
            for (let key in ret)
                if (ret.hasOwnProperty(key) && key !== '_id' && !publicProperties.includes(key)) delete ret[key];
        }
    }
};

const favouriteSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
}, baseOptions);

let autoPopulate = function (next) {
    this.populate('post');
    next();
};

favouriteSchema.pre('findOne', autoPopulate);
favouriteSchema.pre('find', autoPopulate);

favouriteSchema.statics.findOneOrCreate = function findOneOrCreate(condition, callback) {
    const self = this;
    self.findOne(condition, (err, result) => {
        return result ? callback(err, result) : self.create(condition, (err, result) => {
            return callback(err, result)
        })
    })
};

favouriteSchema.statics.identifier = () => '_id';

favouriteSchema.methods.canEdit = function (userId) {
    return this.user.toString() === userId.toString();
};

favouriteSchema.methods.executeDelete = function () {
    this.remove();
};

export const favouriteModel = mongoose.model('Favourite', favouriteSchema);