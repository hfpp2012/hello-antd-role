import { Schema, model, Document } from "mongoose";
import mongoosePaginate from "mongoose-paginate";

import { IUserDocument } from "./User";
import { ICommentDocument } from "./Comment";

type Like = IUserDocument["_id"];

type Comment = ICommentDocument["_id"];

export interface IPostDocument extends Document {
  body: string;
  user: IUserDocument["_id"];
  likes: Like[];
  comments: Comment[];
}

export const postSchema: Schema = new Schema(
  {
    body: String,
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      autopopulate: true
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        autopopulate: true
      }
    ],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
        autopopulate: {
          path: "comments"
        }
      }
    ]
  },
  { timestamps: true }
);

postSchema.plugin(mongoosePaginate);
postSchema.plugin(require("mongoose-autopopulate"));

const Post = model<IPostDocument>("Post", postSchema);

export default Post;
