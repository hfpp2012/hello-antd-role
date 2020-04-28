import { Schema, model, Model, Document } from "mongoose";

export interface IMenuDocument extends Document {
  name: string;
  path: string;
}

const menuSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name must not be empty"],
    },
    path: {
      type: String,
      required: [true, "Path must not be empty"],
    },
  },
  { timestamps: true }
);

const Menu: Model<IMenuDocument> = model<IMenuDocument>("Menu", menuSchema);

export default Menu;
