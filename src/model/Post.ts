import mongoose, {Document} from 'mongoose'
import IUser from "../api/user/IUser";

const userSchema = new mongoose.Schema({
  title: String,
  slug: String,
  content: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
})

const userModel = mongoose.model<IUser & Document>('User', userSchema)

export default userModel
