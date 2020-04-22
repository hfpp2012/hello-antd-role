import express, { Router } from "express";
import usersRouter from "./users";
import rolesRouter from "./roles";
import permissionsRouter from "./permissions";
import menusRouter from "./menus";

const router: Router = express.Router();

router.use("/users", usersRouter);
router.use("/roles", rolesRouter);
router.use("/permissions", permissionsRouter);
router.use("/menus", menusRouter);

export default router;
