import mongoose from "mongoose";

const postSchema = new mongoose.Schema({

    content: {
        type: String,
        required: true
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
}, { timestamps: true })

export default mongoose.model('Post', postSchema)