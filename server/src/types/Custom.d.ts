import { IUserDocument } from "../models/User";
import { IAdminDocument } from "../models/Admin";

declare global {
  namespace Express {
    export interface Request {
      currentUser?: IUserDocument;
      currentAdmin?: IAdminDocument;
    }
  }
}
