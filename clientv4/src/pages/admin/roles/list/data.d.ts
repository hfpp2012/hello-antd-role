import { TableListItem as PermissionData } from '../../permissions/list/data.d';
export interface TableListItem {
  _id: string;
  name: string;
  nameCn: string;
  permissions: PermissionData[];
}

export interface TableListPagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface TableListData {
  list: TableListItem[];
  pagination: Partial<TableListPagination>;
}

export interface TableListParams {
  pageSize?: number;
  currentPage?: number;
}

export interface CreateParams {
  name: string;
  nameCn: string;
}

export interface PermissionFormParams {
  _id: string;
  permissionIds: string[];
}
