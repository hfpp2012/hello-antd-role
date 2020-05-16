import { Request, Response } from "express";

import { wrapAsync } from "../../helpers/wrap-async";
import Menu from "../../models/Menu";
import { throwMenuNotFoundError } from "../../utils/throwError";
import { IAdminDocument } from "../../models/Admin";
import { checkMenu } from "../../utils/admin/check-menu";

/**
 * Fetch menu list
 *
 * @Method GET
 * @URL /api/admin/menus/fetch
 *
 */
export const fetch = wrapAsync(
  async (req: Request, res: Response): Promise<void> => {
    const menus = await Menu.find({ parent: null }).populate("children");

    const admin = req.currentAdmin as IAdminDocument;

    res.json({
      success: true,
      data: checkMenu(menus, admin),
    });
  }
);

/**
 * menu list
 *
 * @Method GET
 * @URL /api/admin/menus
 *
 */
export const index = wrapAsync(
  async (req: Request, res: Response): Promise<void> => {
    let { pageSize, current } = req.query;

    [pageSize, current] = [+pageSize, +current];

    const menus = await Menu.find()
      .sort({ createdAt: "desc" })
      .limit(pageSize)
      .skip((current - 1) * pageSize);

    const count = await Menu.count({});

    // await new Promise(resolve => setTimeout(resolve, 1000));

    res.json({
      success: true,
      data: menus,
      total: count,
      current,
      pageSize,
    });
  }
);

/**
 * Add menu
 *
 * @Method POST
 * @URL /api/admin/menus
 *
 */
export const addMenu = wrapAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { name, path, parent, nameCn, permission } = req.body;

    const newMenu = new Menu({
      path,
      name,
      parent,
      nameCn,
      permission,
    });

    const resMenu = await newMenu.save();

    res.json({
      success: true,
      data: {
        menu: resMenu,
        message: "created successfully",
      },
    });
  }
);

/**
 * Update menu
 *
 * @Method PUT
 * @URL /api/admin/menus/:id
 *
 */
export const updateMenu = wrapAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { name, path, parent, nameCn, permission } = req.body;

    const { id } = req.params;

    const menu = await Menu.findById(id);

    if (menu) {
      const resMenu = await Menu.findByIdAndUpdate(
        id,
        { name, path, parent, nameCn, permission },
        { new: true }
      );

      res.json({
        success: true,
        data: {
          menu: resMenu,
          message: "updated successfully",
        },
      });
    } else {
      throwMenuNotFoundError();
    }
  }
);

/**
 * Fetch selected menu list
 *
 * @Method GET
 * @URL /api/admin/menus/selectMenus
 *
 */
export const selectMenus = wrapAsync(
  async (_req: Request, res: Response): Promise<void> => {
    const menus = await Menu.find();
    res.json({
      success: true,
      data: menus,
    });
  }
);
