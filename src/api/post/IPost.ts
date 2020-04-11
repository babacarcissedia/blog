import IUser from "../user/IUser";
export default interface IPost {
    title: string,
    slug: string,
    content: string,
    user: IUser
}
