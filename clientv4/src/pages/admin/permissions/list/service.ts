import request from '@/utils/request';
import { TableListParams, CreateParams } from './data.d';
import { FormValueType } from './components/UpdateForm';

export async function queryPermissions(params?: TableListParams) {
  return request('/admin/permissions', {
    params,
  });
}

export async function addPermission(params: CreateParams) {
  return request('/admin/permissions', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function updatePermission(params: FormValueType) {
  return request(`/admin/permissions/${params._id}`, {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}
