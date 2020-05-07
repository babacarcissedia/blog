import mongoose from 'mongoose'
import { IUser } from './interfaces'

const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: String,
  password: String,
  token: String
})

userSchema.set('toJSON', {
  transform: (document, { password, __v, _id, ...rest }, options) => {
    return {
      ...rest, id: _id
    }
  }
});

const User = mongoose.model<IUser>('User', userSchema)

export const RULES = {
  first_name: 'required',
  last_name: 'required',
  email: ['required', 'unique:Users'],
  password: 'required|confirmed',
  token: 'required'
}
export default User
