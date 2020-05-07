import express, { Router } from "express";
import * as menusRouter from "../../controllers/admin/menus";
import checkAdminAuthMiddleware from "../../middlewares/admin/check-auth.middleware";

const router: Router = express.Router();

router.get("/fetch", checkAdminAuthMiddleware, menusRouter.fetch);

router.get("/selectMenus", checkAdminAuthMiddleware, menusRouter.selectMenus);

router
  .get("/", checkAdminAuthMiddleware, menusRouter.index)
  .post("/", checkAdminAuthMiddleware, menusRouter.addMenu);

router.put("/:id", checkAdminAuthMiddleware, menusRouter.updateMenu);

export default router;
