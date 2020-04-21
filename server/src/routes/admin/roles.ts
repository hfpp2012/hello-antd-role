import express, { Router } from "express";
import * as rolesController from "../../controllers/admin/roles";
import checkAdminAuthMiddleware from "../../middlewares/admin/check-auth.middleware";
import allow from "../../middlewares/admin/roles.middleware";

const router: Router = express.Router();

router
  .get("/", checkAdminAuthMiddleware, allow("read role"), rolesController.index)
  .post(
    "/",
    checkAdminAuthMiddleware,
    allow("create role"),
    rolesController.addRole
  );

router.put(
  "/:id",
  checkAdminAuthMiddleware,
  allow("update role"),
  rolesController.updateRole
);

router.post(
  "/:id/permissions",
  checkAdminAuthMiddleware,
  allow("allocate permissions"),
  rolesController.permissions
);

export default router;
