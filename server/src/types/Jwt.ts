import { IUserDocument } from "../models/User";
import { IAdminDocument } from "src/models/Admin";

export interface JwtPayload {
  id: IUserDocument["_id"];
  username: IUserDocument["username"];
  currentAuthority: string;
}

export interface AdminJwtPayload {
  id: IAdminDocument["_id"];
}
