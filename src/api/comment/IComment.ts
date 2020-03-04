import IUser from "../user/IUser";
import IPost from "../post/IPost";
export default interface IComment {
    content: string,
    created_at: string,
    user: IUser,
    post: IPost
}
