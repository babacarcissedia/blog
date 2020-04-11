import IUser from "./api/user/IUser";

declare global{
  namespace Express {
    export interface Request {
      token: any;
      user: IUser;
      isJson (): boolean;
    }
  }
}
