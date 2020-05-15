import { IAdminDocument } from "../../models/Admin";
import { IPermissionDocument } from "../../models/Permission";

const checkMenu = (permission: string, currentAdmin: IAdminDocument) => {
  const isAllowed = (permissions: string[]) =>
    permissions.indexOf(permission) > -1;

  if (currentAdmin.isAdmin) {
    return true;
  }

  const roles = currentAdmin.roles;

  if (!roles) {
    return false;
  }

  if (
    roles.some((role) =>
      isAllowed(
        role.permissions.map(
          (permission: IPermissionDocument) => permission.name
        )
      )
    )
  ) {
    return true;
  } else {
    return false;
  }
};

export { checkMenu };
