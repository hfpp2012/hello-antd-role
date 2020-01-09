import express, { Router } from "express";
import * as rolesController from "../../controllers/admin/roles";
import checkAdminAuthMiddleware from "../../middlewares/admin/check-auth.middleware";
import allow from "../../middlewares/admin/role.middleware";

const router: Router = express.Router();

router
  .get("/", checkAdminAuthMiddleware, allow("read role"), rolesController.index)
  .post(
    "/",
    checkAdminAuthMiddleware,
    allow("create role"),
    rolesController.addRole
  );

router.put("/:id", checkAdminAuthMiddleware, rolesController.updateRole);

router.post(
  "/:id/permissions",
  checkAdminAuthMiddleware,
  rolesController.permissions
);

export default router;
