import { Request, Response } from "express";

import {
  validateRegisterInput,
  validateLoginInput,
  LoginInputError
} from "../utils/validator";
import HttpException from "../exceptions/HttpException";
import { UNPROCESSABLE_ENTITY } from "http-status-codes";

import User, { IUserDocument } from "../models/User";

import bcrypt from "bcryptjs";
import { wrapAsync } from "../helpers/wrap-async";

const throwLoginValidateError = (errors: LoginInputError) => {
  throw new HttpException(
    UNPROCESSABLE_ENTITY,
    "User login input error",
    errors
  );
};

/**
 * Login User
 *
 * @Method POST
 * @URL /api/users/login
 *
 */
export const postLogin = wrapAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body;

    const { errors, valid } = validateLoginInput(username, password);

    if (!valid) {
      return throwLoginValidateError(errors);
    }

    const user = await User.findOne({ username });

    if (!user) {
      errors.general = "User not found";
      return throwLoginValidateError(errors);
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      errors.general = "Wrong credentials";
      return throwLoginValidateError(errors);
    }

    const token = user.generateToken();

    res.json({
      success: true,
      data: {
        id: user.id,
        username: user.username,
        token
      }
    });
  }
);

/**
 * Register User
 *
 * @Method POST
 * @URL /api/users/register
 *
 */
export const postRegister = wrapAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { username, password, confirmPassword, email } = req.body;

    const { errors, valid } = validateRegisterInput(
      username,
      password,
      confirmPassword,
      email
    );

    if (!valid) {
      throw new HttpException(
        UNPROCESSABLE_ENTITY,
        "User register input error",
        errors
      );
    }

    const user = await User.findOne({ username });

    if (user) {
      throw new HttpException(UNPROCESSABLE_ENTITY, "Username is taken", {
        username: "The username is taken"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser: IUserDocument = new User({
      username,
      email,
      password: hashedPassword
    });

    const resUser: IUserDocument = await newUser.save();

    const token: string = resUser.generateToken();

    res.json({
      success: true,
      data: {
        id: resUser.id,
        username: resUser.username,
        token
      }
    });
  }
);

/**
 * Current User
 *
 * @Method GET
 * @URL /api/users/currentUser
 *
 */
export const currentUser = wrapAsync(
  async (req: Request, res: Response): Promise<void> => {
    const user = req.currentUser as IUserDocument;

    res.json({
      success: true,
      data: {
        userid: user._id,
        name: user.username,
        avatar:
          "https://www.qiuzhi99.com/assets/logo-f46be81047e24aa656ea1048aa0c078e6168bb324c3df36506c014c1be677235.png"
      }
    });
  }
);
