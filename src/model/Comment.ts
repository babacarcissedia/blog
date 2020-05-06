import mongoose, { Document } from 'mongoose'
import IComment from 'api/comment/IComment'
// createdAt: { type: Date, default: Date.now },

const commentSchema = new mongoose.Schema({
    content: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    author: { type : mongoose.Schema.Types.ObjectId, ref: 'User'},
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post'}
})

const commentModel = mongoose.model<IComment & Document>('Comment', commentSchema)
export default commentModel
