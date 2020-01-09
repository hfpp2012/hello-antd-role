import express, { Router } from "express";
import usersRouter from "./users";
import rolesRouter from "./roles";
import permissionsRouter from "./permissions";

const router: Router = express.Router();

router.use("/users", usersRouter);
router.use("/roles", rolesRouter);
router.use("/permissions", permissionsRouter);

export default router;
