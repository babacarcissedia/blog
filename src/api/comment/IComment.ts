import IUser from "../user/IUser";
import IPost from "../post/IPost";
export default interface IComment {
    content: string,
    createdAt: Date,
    user: IUser,
    post: IPost
}
