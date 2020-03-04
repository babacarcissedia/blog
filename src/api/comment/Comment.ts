import * as mongoose from 'mongoose'
import IComment from "./IComment";
const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    created_at: {
        type: String,
        required: true
    },
    user: {
        ref: 'User',
        type: mongoose.Schema.Types.ObjectId
    },
    post: {
        ref: 'Post',
        type: mongoose.Schema.Types.ObjectId
    }
})
const Comment = mongoose.model<IComment & mongoose.Document>('Comment', commentSchema)
export default Comment
