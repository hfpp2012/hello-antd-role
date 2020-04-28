import HttpException from "../exceptions/HttpException";
import { NOT_FOUND, UNAUTHORIZED } from "http-status-codes";

export const throwPostNotFoundError = () => {
  throw new HttpException(NOT_FOUND, "Post not found");
};

export const throwCommentNotFoundError = () => {
  throw new HttpException(NOT_FOUND, "Comment not found");
};

export const throwAdminNotFoundError = () => {
  throw new HttpException(NOT_FOUND, "Admin not found");
};

export const throwRoleNotFoundError = () => {
  throw new HttpException(NOT_FOUND, "Role not found");
};

export const throwPermissionNotFoundError = () => {
  throw new HttpException(NOT_FOUND, "Permission not found");
};

export const throwMenuNotFoundError = () => {
  throw new HttpException(NOT_FOUND, "Menu not found");
};

export const throwActionNotAllowedError = () => {
  throw new HttpException(UNAUTHORIZED, "Action not allowed");
};
