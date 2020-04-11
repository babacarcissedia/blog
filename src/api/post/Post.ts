import * as mongoose from 'mongoose'
import IPost from "./IPost";
const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    user: {
        ref: 'User',
        type: mongoose.Schema.Types.ObjectId
    }
})
const Post = mongoose.model<IPost & mongoose.Document>('Post', postSchema)
export default Post
