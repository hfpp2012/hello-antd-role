import express, { Router } from "express";
import * as rolesController from "../../controllers/admin/roles";
import checkAdminAuthMiddleware from "../../middlewares/admin/check-auth.middleware";

const router: Router = express.Router();

router
  .get("/", checkAdminAuthMiddleware, rolesController.index)
  .post("/", checkAdminAuthMiddleware, rolesController.addRole);

router.put("/:id", checkAdminAuthMiddleware, rolesController.updateRole);

router.post(
  "/:id/permissions",
  checkAdminAuthMiddleware,
  rolesController.permissions
);

export default router;
