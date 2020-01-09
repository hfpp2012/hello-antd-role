import express, { Router } from "express";
import * as usersController from "../../controllers/admin/users";
import checkAdminAuthMiddleware from "../../middlewares/admin/check-auth.middleware";
import allow from "../../middlewares/admin/role.middleware";

const router: Router = express.Router();

router.post("/login", usersController.postLogin);

router
  .get(
    "/",
    checkAdminAuthMiddleware,
    allow("read admin"),
    usersController.index
  )
  .post("/", checkAdminAuthMiddleware, usersController.addAdmin);

router.put("/:id", usersController.updateAdmin);

router.post("/:id/role", usersController.role);
router.post("/:id/roles", usersController.roles);

export default router;
