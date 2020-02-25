import { Request, Response } from "express";

import { IUserDocument } from "../models/User";
import Post from "../models/Post";
import Comment from "../models/Comment";

import {
  throwPostNotFoundError,
  throwActionNotAllowedError
} from "../utils/throwError";
import { checkBody } from "../utils/validator";

import { wrapAsync } from "../helpers/wrap-async";

/**
 * Show posts list
 *
 * @Method GET
 * @URL /api/posts
 *
 */
export const getPosts = wrapAsync(
  async (req: Request, res: Response): Promise<void> => {
    let { pageSize, current } = req.query;

    [pageSize, current] = [+pageSize, +current];

    const posts = await Post.find()
      .limit(pageSize)
      .skip((current - 1) * pageSize)
      .sort({ createdAt: -1 });

    const count = await Post.count({});

    res.json({
      success: true,
      data: posts,
      total: count,
      current,
      pageSize
    });
  }
);

/**
 * Show single post
 *
 * @Method GET
 * @URL /api/posts/:id
 *
 */
export const getPost = wrapAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const post = await Post.findById(id);

    if (post) {
      res.json({
        success: true,
        data: { post }
      });
    } else {
      throwPostNotFoundError();
    }
  }
);

/**
 * Update single post
 *
 * @Method PUT
 * @URL /api/posts/:id
 *
 */
export const updatePost = wrapAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const post = await Post.findById(id);

    const { body } = req.body;

    checkBody(body);

    const user = req.currentUser as IUserDocument;

    if (post) {
      if (post.user.equals(user)) {
        const resPost = await Post.findByIdAndUpdate(
          id,
          { body },
          { new: true }
        );

        res.json({
          success: true,
          data: { message: "updated successfully", post: resPost }
        });
      } else {
        throwActionNotAllowedError();
      }
    } else {
      throwPostNotFoundError();
    }
  }
);

/**
 * Delete a post
 *
 * @Method DELETE
 * @URL /api/posts/:id
 *
 */
export const deletePost = wrapAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const post = await Post.findById(id);

    const user = req.currentUser as IUserDocument;

    if (post) {
      if (post.user.equals(user)) {
        await Post.findByIdAndDelete(id);

        await Comment.deleteMany({ post: post._id });

        res.json({
          success: true,
          data: { message: "deleted successfully" }
        });
      } else {
        throwActionNotAllowedError();
      }
    } else {
      throwPostNotFoundError();
    }
  }
);

/**
 * Create post
 *
 * @Method POST
 * @URL /api/posts
 *
 */
export const createPost = wrapAsync(
  async (req: Request, res: Response): Promise<void> => {
    const user = req.currentUser as IUserDocument;

    const { body } = req.body;

    checkBody(body);

    const newPost = new Post({
      body,
      user: user._id
    });

    const post = await newPost.save();

    res.json({
      success: true,
      data: { message: "created successfully", post }
    });
  }
);

/**
 * Login user like post
 *
 * @Method POST
 * @URL /api/posts/:id/like
 *
 */
export const likePost = wrapAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const post = await Post.findById(id);

    const user = req.currentUser as IUserDocument;

    if (post) {
      if (post.likes.find(like => like.equals(user))) {
        post.likes = post.likes.filter(like => !like.equals(user));
      } else {
        post.likes.push(user._id);
      }

      post.populate("likes").execPopulate();

      await post.save();

      res.json({
        success: true,
        data: { post }
      });
    } else {
      throwPostNotFoundError();
    }
  }
);
