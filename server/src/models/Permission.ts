import { Schema, model, Model, Document } from "mongoose";
// @ts-ignore
import uniqueValidator from "mongoose-unique-validator";

export interface IPermissionDocument extends Document {
  name: string;
  nameCn: string;
}

const permissionSchema: Schema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      trim: true,
      required: [true, "Name must not be empty"]
    },
    nameCn: String
  },
  { timestamps: true }
);

permissionSchema.plugin(uniqueValidator);

const Permission: Model<IPermissionDocument> = model<IPermissionDocument>(
  "Permission",
  permissionSchema
);

export default Permission;
