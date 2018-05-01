import mongoose from "mongoose";

const baseOptions = {
    timestamps: true
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

export const favouriteModel = mongoose.model('Favourite', favouriteSchema);