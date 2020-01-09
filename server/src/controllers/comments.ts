import { Request, Response } from "express";

import { IUserDocument } from "../models/User";
import Post from "../models/Post";
import Comment from "../models/Comment";

import { checkBody } from "../utils/validator";
import {
  throwPostNotFoundError,
  throwCommentNotFoundError,
  throwActionNotAllowedError
} from "../utils/throwError";

import { wrapAsync } from "../helpers/wrap-async";

/**
 * create comment
 *
 * @Method POST
 * @URL /api/posts/:id/comments
 *
 */
export const createComment = wrapAsync(
  async (req: Request, res: Response): Promise<void> => {
    const user = req.currentUser as IUserDocument;

    const { id } = req.params;
    const { body } = req.body;

    checkBody(body);

    const post = await Post.findById(id);

    if (post) {
      const newComment = new Comment({
        body,
        post: post._id,
        user: user._id
      });

      const comment = await newComment.save();

      post.comments.unshift(comment._id);

      await post.save();

      // just for fix autopopulate bug
      const resPost = await Post.findById(post.id);

      res.json({
        success: true,
        data: { message: "comment was created successfully", post: resPost }
      });
    } else {
      throwPostNotFoundError();
    }
  }
);

/**
 * delete comment
 *
 * @Method DELETE
 * @URL /api/comments/:id
 *
 */
export const deleteComment = wrapAsync(
  async (req: Request, res: Response): Promise<void> => {
    const user = req.currentUser as IUserDocument;

    const { id, commentId } = req.params;

    const comment = await Comment.findById(commentId);

    const post = await Post.findById(id);

    if (!comment) {
      throwCommentNotFoundError();
    }

    if (!post) {
      throwPostNotFoundError();
    }

    if (post && comment) {
      if (
        comment.user.equals(user) &&
        post.comments.find(c => c.equals(comment))
      ) {
        post.comments.filter(c => !c.equals(comment));

        await Comment.findByIdAndDelete(commentId);
        await post.save();

        const resPost = await Post.findById(post.id);

        res.json({
          success: true,
          data: { message: "comment was deleted successfully", post: resPost }
        });
      } else {
        throwActionNotAllowedError();
      }
    }
  }
);
