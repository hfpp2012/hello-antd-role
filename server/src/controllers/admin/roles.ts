import { Request, Response } from "express";

import Role from "../../models/Role";

import { wrapAsync } from "../../helpers/wrap-async";
import { throwRoleNotFoundError } from "../../utils/throwError";

/**
 * Role list
 *
 * @Method GET
 * @URL /api/admin/roles
 *
 */
export const index = wrapAsync(
  async (_req: Request, res: Response): Promise<void> => {
    const roles = await Role.find();

    res.json({
      success: true,
      data: roles
    });
  }
);

/**
 * Add role
 *
 * @Method POST
 * @URL /api/admin/roles
 *
 */
export const addRole = wrapAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { name, nameCn } = req.body;

    const newRole = new Role({
      name,
      nameCn
    });

    const resRole = await newRole.save();

    res.json({
      success: true,
      data: {
        role: resRole,
        message: "created successfully"
      }
    });
  }
);

/**
 * Update role
 *
 * @Method PUT
 * @URL /api/admin/roles/:id
 *
 */
export const updateRole = wrapAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { name, nameCn } = req.body;

    const { id } = req.params;

    const role = await Role.findById(id);

    if (role) {
      const resRole = await Role.findByIdAndUpdate(
        id,
        { name, nameCn },
        { new: true }
      );

      res.json({
        success: true,
        data: {
          role: resRole,
          message: "updated successfully"
        }
      });
    } else {
      throwRoleNotFoundError();
    }
  }
);

/**
 * Add permissions fro role
 *
 * @Method POST
 * @URL /api/admin/roles/:id/permissions
 *
 */
export const permissions = wrapAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { permissionIds } = req.body;
    const { id } = req.params;

    const role = await Role.findById(id);

    if (role) {
      role.permissions = permissionIds;

      await role.save();

      const resRole = await Role.findById(id);

      res.json({
        success: true,
        data: {
          role: resRole
        }
      });
    } else {
      throwRoleNotFoundError();
    }
  }
);
