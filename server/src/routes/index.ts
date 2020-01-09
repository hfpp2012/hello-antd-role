import express, { Router } from "express";
import usersRouter from "./users";
import postsRouter from "./posts";
import adminRouter from "./admin";

const router: Router = express.Router();

router.use("/users", usersRouter);
router.use("/posts", postsRouter);

router.use("/admin", adminRouter);

export default router;
