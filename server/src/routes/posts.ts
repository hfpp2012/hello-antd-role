import express, { Router } from "express";
import * as postsController from "../controllers/posts";
import * as commentsController from "../controllers/comments";

import checkAuthMiddleware from "../middlewares/check-auth.middleware";

const router: Router = express.Router();

router
  .route("/")
  .get(postsController.getPosts)
  .post(checkAuthMiddleware, postsController.createPost);

router
  .route("/:id")
  .get(postsController.getPost)
  .put(checkAuthMiddleware, postsController.updatePost)
  .delete(checkAuthMiddleware, postsController.deletePost);

router.post("/:id/like", checkAuthMiddleware, postsController.likePost);

router.post(
  "/:id/comments",
  checkAuthMiddleware,
  commentsController.createComment
);

router.delete(
  "/:id/comments/:commentId",
  checkAuthMiddleware,
  commentsController.deleteComment
);

export default router;
