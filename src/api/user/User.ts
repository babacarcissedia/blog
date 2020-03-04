import IUser from "./IUser"
import * as mongoose from 'mongoose'
const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    }

})
const User = mongoose.model<IUser & mongoose.Document>('User', userSchema)
export default User
