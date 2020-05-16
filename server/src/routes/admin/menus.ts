import express, { Router } from "express";
import * as menusRouter from "../../controllers/admin/menus";
import checkAdminAuthMiddleware from "../../middlewares/admin/check-auth.middleware";
import allow from "../../middlewares/admin/roles.middleware";

const router: Router = express.Router();

router.get("/fetch", checkAdminAuthMiddleware, menusRouter.fetch);

router.get("/selectMenus", checkAdminAuthMiddleware, menusRouter.selectMenus);

router
  .get("/", checkAdminAuthMiddleware, allow("read menu"), menusRouter.index)
  .post(
    "/",
    checkAdminAuthMiddleware,
    allow("create menu"),
    menusRouter.addMenu
  );

router.put(
  "/:id",
  checkAdminAuthMiddleware,
  allow("update menu"),
  menusRouter.updateMenu
);

export default router;
