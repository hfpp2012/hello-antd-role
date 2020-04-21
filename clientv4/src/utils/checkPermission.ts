import { ConnectState, UserModelState } from '@/models/connect';
import { useSelector } from 'dva';

const checkPermission = (name: string) => {
  const isAllowed = (permissions: string[]) => permissions.indexOf(name) > -1;

  const { currentUser } = useSelector<ConnectState, UserModelState>(state => state.user);

  if (currentUser && currentUser.isAdmin) {
    return true;
  }

  if (
    currentUser &&
    currentUser.roles &&
    currentUser.roles.some(role => isAllowed(role.permissions.map(permission => permission.name)))
  ) {
    return true;
  }

  return false;
};

export default checkPermission;
