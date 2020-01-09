import express, { Router } from "express";
import * as permissionsRouter from "../../controllers/admin/permissions";
import checkAdminAuthMiddleware from "../../middlewares/admin/check-auth.middleware";

const router: Router = express.Router();

router
  .get("/", checkAdminAuthMiddleware, permissionsRouter.index)
  .post("/", checkAdminAuthMiddleware, permissionsRouter.addPermission);

router
  .put("/:id", checkAdminAuthMiddleware, permissionsRouter.updatePermission)
  .delete("/:id", checkAdminAuthMiddleware, permissionsRouter.deletePermission);

export default router;
