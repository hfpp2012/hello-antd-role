import express, { Router } from "express";
import * as usersController from "../controllers/users";
import checkAuthMiddleware from "../middlewares/check-auth.middleware";

const router: Router = express.Router();

router.post("/register", usersController.postRegister);
router.post("/login", usersController.postLogin);
router.get("/currentUser", checkAuthMiddleware, usersController.currentUser);

export default router;
