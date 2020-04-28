import request from '@/utils/request';
import { TableListParams, CreateParams } from './data.d';
import { FormValueType } from './components/UpdateForm';

export async function queryMenus(params?: TableListParams) {
  return request('/admin/menus', {
    params,
  });
}

export async function addMenu(params: CreateParams) {
  return request('/admin/menus', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function updateMenu(params: FormValueType) {
  return request(`/admin/menus/${params._id}`, {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}
