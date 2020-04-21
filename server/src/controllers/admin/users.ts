import { Request, Response } from "express";

import { InputError, validateInput } from "../../utils/admin/validator";
import HttpException from "../../exceptions/HttpException";
import { UNPROCESSABLE_ENTITY } from "http-status-codes";

import bcrypt from "bcryptjs";

import Admin, { IAdminDocument } from "../../models/Admin";

import { throwAdminNotFoundError } from "../../utils/throwError";

import { wrapAsync } from "../../helpers/wrap-async";

const throwValidateError = (errors: InputError) => {
  throw new HttpException(UNPROCESSABLE_ENTITY, "Admin input error", errors);
};

/**
 * Login admin
 *
 * @Method POST
 * @URL /api/admin/users/login
 *
 */
export const postLogin = wrapAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body;

    const { errors, valid } = validateInput(username, password);

    if (!valid) {
      return throwValidateError(errors);
    }

    const admin = await Admin.findOne({ username });

    if (!admin) {
      errors.general = "Admin not found";
      return throwValidateError(errors);
    }

    const match = await bcrypt.compare(password, admin.password);

    if (!match) {
      errors.general = "Wrong credentials";
      return throwValidateError(errors);
    }

    const token = admin.generateToken();

    res.json({
      success: true,
      data: {
        id: admin.id,
        token,
      },
    });
  }
);

/**
 * Admin list
 *
 * @Method GET
 * @URL /api/admin/users
 *
 */
export const index = wrapAsync(
  async (_req: Request, res: Response): Promise<void> => {
    const admins = await Admin.find();

    res.json({
      success: true,
      data: admins,
    });
  }
);

/**
 * Add admin
 *
 * @Method POST
 * @URL /api/admin/users
 *
 */
export const addAdmin = wrapAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body;

    const { errors, valid } = validateInput(username, password);

    if (!valid) {
      return throwValidateError(errors);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({
      username,
      password: hashedPassword,
    });

    const resAdmin = await newAdmin.save();

    res.json({
      success: true,
      data: {
        admin: resAdmin,
        message: "created successfully",
      },
    });
  }
);

/**
 * Update admin
 *
 * @Method PUT
 * @URL /api/admin/users/:id
 *
 */
export const updateAdmin = wrapAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body;

    const { errors, valid } = validateInput(username, password);

    if (!valid) {
      return throwValidateError(errors);
    }

    const { id } = req.params;

    const admin = await Admin.findById(id);

    if (admin) {
      const hashedPassword = await bcrypt.hash(password, 10);

      const resAdmin = await Admin.findByIdAndUpdate(
        id,
        { username: username, password: hashedPassword },
        { new: true }
      );

      res.json({
        success: true,
        data: {
          admin: resAdmin,
          message: "updated successfully",
        },
      });
    } else {
      throwAdminNotFoundError();
    }
  }
);

/**
 * Add role for admin
 *
 * @Method POST
 * @URL /api/admin/users/:id/role
 *
 */
export const role = wrapAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const { roleId } = req.body;

    const admin = await Admin.findById(id);

    if (!admin) {
      throwAdminNotFoundError();
    }

    if (admin) {
      admin.role = roleId;

      await admin.save();

      const resAdmin = await Admin.findById(id);

      res.json({
        success: true,
        data: {
          admin: resAdmin,
        },
      });
    }
  }
);

/**
 * Add roles for admin
 *
 * @Method POST
 * @URL /api/admin/users/:id/roles
 *
 */
export const roles = wrapAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const { roleIds } = req.body;

    const admin = await Admin.findById(id);

    if (!admin) {
      throwAdminNotFoundError();
    }

    if (admin) {
      admin.roles = roleIds;

      await admin.save();

      const resAdmin = await Admin.findById(id);

      res.json({
        success: true,
        data: {
          admin: resAdmin,
        },
      });
    }
  }
);

/**
 * Current User
 *
 * @Method GET
 * @URL /api/admin/users/currentUser
 *
 */
export const currentUser = wrapAsync(
  async (req: Request, res: Response): Promise<void> => {
    const admin = req.currentAdmin as IAdminDocument;

    res.json({
      success: true,
      data: {
        userid: admin._id,
        name: admin.username,
        avatar:
          "https://www.qiuzhi99.com/assets/logo-f46be81047e24aa656ea1048aa0c078e6168bb324c3df36506c014c1be677235.png",
        roles: admin.roles,
        isAdmin: admin.isAdmin,
      },
    });
  }
);
