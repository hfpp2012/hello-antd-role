import express, { Router } from "express";
import * as permissionsRouter from "../../controllers/admin/permissions";
import checkAdminAuthMiddleware from "../../middlewares/admin/check-auth.middleware";
import allow from "../../middlewares/admin/roles.middleware";

const router: Router = express.Router();

router
  .get(
    "/",
    checkAdminAuthMiddleware,
    allow("read permission"),
    permissionsRouter.index
  )
  .post(
    "/",
    checkAdminAuthMiddleware,
    allow("create permission"),
    permissionsRouter.addPermission
  );

router
  .put(
    "/:id",
    checkAdminAuthMiddleware,
    allow("update permission"),
    permissionsRouter.updatePermission
  )
  .delete("/:id", checkAdminAuthMiddleware, permissionsRouter.deletePermission);

export default router;
