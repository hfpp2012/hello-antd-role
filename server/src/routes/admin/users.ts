import express, { Router } from "express";
import * as usersController from "../../controllers/admin/users";
import checkAdminAuthMiddleware from "../../middlewares/admin/check-auth.middleware";
import allow from "../../middlewares/admin/roles.middleware";

const router: Router = express.Router();

router.post("/login", usersController.postLogin);

router
  .get(
    "/",
    checkAdminAuthMiddleware,
    allow("read admin"),
    usersController.index
  )
  .post(
    "/",
    checkAdminAuthMiddleware,
    allow("create admin"),
    usersController.addAdmin
  )
  .get("/currentUser", checkAdminAuthMiddleware, usersController.currentUser);

router.put(
  "/:id",
  checkAdminAuthMiddleware,
  allow("update admin"),
  usersController.updateAdmin
);

router.post("/:id/role", checkAdminAuthMiddleware, usersController.role);

router.post(
  "/:id/roles",
  checkAdminAuthMiddleware,
  allow("allocate roles"),
  usersController.roles
);

export default router;
