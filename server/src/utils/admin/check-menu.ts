import { IAdminDocument } from "../../models/Admin";
import { IMenuDocument } from "../../models/Menu";
import { IPermissionDocument } from "../../models/Permission";

const checkMenu = (
  menus: IMenuDocument[],
  currentAdmin: IAdminDocument
): IMenuDocument[] => {
  return menus.filter((menu) => {
    if (menu.children) {
      menu.children = checkMenu(menu.children, currentAdmin);
    }

    if (currentAdmin.isAdmin) {
      return true;
    }

    const roles = currentAdmin.roles;

    if (!roles) {
      return false;
    }

    if (
      roles.some(
        (role) =>
          role.permissions
            .map((permission: IPermissionDocument) => permission.name)
            .indexOf(menu.permission) > -1
      )
    ) {
      return true;
    } else {
      return false;
    }
  });
};

export { checkMenu };
