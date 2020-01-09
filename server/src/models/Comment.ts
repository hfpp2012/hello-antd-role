import { Schema, model, Model, Document } from "mongoose";
import { IPostDocument } from "./Post";
import { IUserDocument } from "./User";

export interface ICommentDocument extends Document {
  user: IUserDocument["_id"];
  body: IPostDocument["body"];
  post: IPostDocument["_id"];
}

const commentSchema: Schema = new Schema(
  {
    body: String,
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      autopopulate: true
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true
      // autopopulate: { maxDepth: 1, select: ["-comments", "-likes"] }
    }
  },
  { timestamps: true }
);

commentSchema.plugin(require("mongoose-autopopulate"));

const Comment: Model<ICommentDocument> = model<ICommentDocument>(
  "Comment",
  commentSchema
);

export default Comment;
