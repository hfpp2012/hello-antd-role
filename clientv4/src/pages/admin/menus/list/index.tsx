import { PlusOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import React, { useState, useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import CreateForm from './components/CreateForm';
import UpdateForm, { FormValueType } from './components/UpdateForm';
import { TableListItem, CreateParams } from './data.d';
import { queryMenus, updateMenu, addMenu } from './service';
import moment from 'moment';
import checkPermission from '@/utils/checkPermission';

/**
 * 添加菜单
 * @param fields
 */
const handleAdd = async (fields: CreateParams) => {
  const hide = message.loading('正在添加');
  try {
    await addMenu({
      name: fields.name,
      path: fields.path,
      parent: fields.parent,
      nameCn: fields.nameCn,
    });
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};

/**
 * 更新菜单
 * @param fields
 */
const handleUpdate = async (fields: FormValueType) => {
  const hide = message.loading('正在修改');
  try {
    await updateMenu({
      _id: fields._id,
      name: fields.name,
      path: fields.path,
      parent: fields.parentId,
      nameCn: fields.nameCn,
    });
    hide();

    message.success('修改成功');
    return true;
  } catch (error) {
    hide();
    message.error('修改失败请重试！');
    return false;
  }
};

const TableList: React.FC<{}> = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '中文描述',
      dataIndex: 'nameCn',
    },
    {
      title: '路径',
      dataIndex: 'path',
    },
    {
      title: '父类菜单',
      dataIndex: 'parent',
      renderText: (menu: TableListItem) => menu && menu.nameCn,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      renderText: (val: string) => moment(val).fromNow(),
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      valueType: 'dateTime',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          {checkPermission('update permission') ? (
            <a
              onClick={() => {
                handleUpdateModalVisible(true);
                setStepFormValues(record);
              }}
            >
              修改
            </a>
          ) : null}
        </>
      ),
    },
  ];

  const renderCreateButton = () => {
    if (checkPermission('create role')) {
      return (
        <Button type="primary" onClick={() => handleModalVisible(true)}>
          <PlusOutlined /> 新建
        </Button>
      );
    } else {
      return null;
    }
  };

  return (
    <PageHeaderWrapper>
      <ProTable<TableListItem>
        actionRef={actionRef}
        rowKey="_id"
        toolBarRender={(action, { selectedRows }) => [renderCreateButton()]}
        pagination={{ defaultPageSize: 8 }}
        search={false}
        request={params => queryMenus(params)}
        columns={columns}
      />
      <CreateForm
        onSubmit={async value => {
          const success = await handleAdd(value);
          if (success) {
            handleModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => handleModalVisible(false)}
        modalVisible={createModalVisible}
      />
      {stepFormValues && Object.keys(stepFormValues).length ? (
        <UpdateForm
          onSubmit={async value => {
            const success = await handleUpdate(value);
            if (success) {
              handleUpdateModalVisible(false);
              setStepFormValues({});
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          onCancel={() => {
            handleUpdateModalVisible(false);
            setStepFormValues({});
          }}
          updateModalVisible={updateModalVisible}
          values={stepFormValues}
        />
      ) : null}
    </PageHeaderWrapper>
  );
};

export default TableList;
