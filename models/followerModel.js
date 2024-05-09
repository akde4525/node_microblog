import mongoose from "mongoose";

const followerSchema = new mongoose.Schema({

    followerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
}, { timestamps: true });

export default mongoose.model('Follower', followerSchema);
