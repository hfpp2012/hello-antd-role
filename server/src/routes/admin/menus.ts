import express, { Router } from "express";
import * as menusRouter from "../../controllers/admin/menus";
import checkAdminAuthMiddleware from "../../middlewares/admin/check-auth.middleware";

const router: Router = express.Router();

router.get("/fetch", checkAdminAuthMiddleware, menusRouter.fetch);

export default router;