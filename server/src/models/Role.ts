import { Schema, model, Model, Document } from "mongoose";
import { IPermissionDocument } from "./Permission";
// @ts-ignore
import uniqueValidator from "mongoose-unique-validator";
// @ts-ignore
import exists from "mongoose-exists";

export interface IRoleDocument extends Document {
  name: string;
  nameCn: string;
  permissions: IPermissionDocument["_id"][];
}

const roleSchema: Schema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      trim: true,
      required: [true, "Name must not be empty"]
    },
    nameCn: String,
    permissions: [
      {
        type: Schema.Types.ObjectId,
        ref: "Permission",
        exists: true,
        autopopulate: true
      }
    ]
  },
  { timestamps: true }
);

roleSchema.plugin(uniqueValidator);
roleSchema.plugin(require("mongoose-autopopulate"));
roleSchema.plugin(exists);

const Role: Model<IRoleDocument> = model<IRoleDocument>("Role", roleSchema);

export default Role;
