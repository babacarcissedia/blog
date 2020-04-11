import mongoose, {Document} from 'mongoose'
import IUser from "../api/user/IUser";

const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: String,
  password: String,
  token: String
})

const userModel = mongoose.model<IUser & Document>('User', userSchema)

export default userModel
