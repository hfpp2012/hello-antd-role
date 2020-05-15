export interface TableListItem {
  _id: string;
  name: string;
  path: string;
  parent: TableListItem;
  nameCn: string;
  parentId: string;
  permission: string;
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
  path: string;
  parent: string;
  nameCn: string;
  permission: string;
}

export interface UpdateParams {
  _id: string;
  name: string;
  path: string;
  nameCn: string;
  parentId?: string;
  parent?: string;
  permission: string;
}
