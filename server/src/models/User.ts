import jwt from "jsonwebtoken";
import { Schema, model, Model, Document } from "mongoose";
import { JwtPayload } from "../types/Jwt";
import config from "../config/config";

export interface IUserDocument extends Document {
  username: string;
  email: string;
  password: string;
  _doc: IUserDocument;
  generateToken: () => string;
}

const userSchema: Schema = new Schema(
  {
    username: String,
    email: String,
    password: String
  },
  { timestamps: true }
);

userSchema.methods.generateToken = function(): string {
  const payload: JwtPayload = {
    id: this.id,
    username: this.username,
    currentAuthority: "user"
  };
  return jwt.sign(payload, config.auth.secretKey, {
    expiresIn: "5d"
  });
};

userSchema.set("toJSON", {
  transform: function(_doc, ret) {
    delete ret["password"];
    return ret;
  }
});

const User: Model<IUserDocument> = model<IUserDocument>("User", userSchema);

export default User;
