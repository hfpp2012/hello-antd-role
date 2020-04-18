import { TableListItem as RoleData } from '../pages/admin/roles/list/data.d';

const allow = (roles: RoleData[], allowed: string) => {
  const isAllowed = (permissions: string[]) => permissions.indexOf(allowed) > -1;

  return roles.some(role => isAllowed(role.permissions.map(permission => permission.name)));
};

export default allow;
