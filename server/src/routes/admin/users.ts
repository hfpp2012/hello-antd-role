import express, { Router } from "express";
import * as usersController from "../../controllers/admin/users";
import checkAdminAuthMiddleware from "../../middlewares/admin/check-auth.middleware";

const router: Router = express.Router();

router.post("/login", usersController.postLogin);

router
  .get("/", checkAdminAuthMiddleware, usersController.index)
  .post("/", checkAdminAuthMiddleware, usersController.addAdmin)
  .get("/currentUser", checkAdminAuthMiddleware, usersController.currentUser)
  .get(
    "/currentPermissions",
    checkAdminAuthMiddleware,
    usersController.currentPermissions
  );

router.put("/:id", usersController.updateAdmin);

router.post("/:id/role", usersController.role);
router.post("/:id/roles", usersController.roles);

export default router;
