import mongoose, {Document} from 'mongoose'
import IPost from "../api/post/IPost";

const userSchema = new mongoose.Schema({
  title: String,
  slug: String,
  content: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
})

const postModel = mongoose.model<IPost & Document>('Post', userSchema)

export default postModel
