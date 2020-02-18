import request from '@/utils/request';
import { TableListParams, CreateParams } from './data.d';
import { FormValueType } from './components/UpdateForm';

export async function queryUsers(params?: TableListParams) {
  return request('/admin/users', {
    params,
  });
}

export async function addUser(params: CreateParams) {
  return request('/admin/users', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function updateUser(params: FormValueType) {
  return request(`/admin/users/${params._id}`, {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}
