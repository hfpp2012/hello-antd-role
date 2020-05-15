import React, { useEffect, useState } from 'react';
import { Form, Input, Modal, Select } from 'antd';
import { TableListItem, CreateParams } from '../data.d';
import request from '@/utils/request';

const FormItem = Form.Item;

const { Option } = Select;

interface CreateFormProps {
  modalVisible: boolean;
  onSubmit: (fieldsValue: CreateParams) => void;
  onCancel: () => void;
}

const CreateForm: React.FC<CreateFormProps> = props => {
  const [form] = Form.useForm();

  const { modalVisible, onSubmit: handleAdd, onCancel } = props;
  const okHandle = async () => {
    const fieldsValue = (await form.validateFields()) as CreateParams;
    form.resetFields();
    handleAdd(fieldsValue);
  };

  const [menus, setMenus] = useState([]);

  useEffect(() => {
    async function getSelectedMenus() {
      const response = await request('/admin/menus/selectMenus');
      if (response.success) {
        setMenus(response.data);
      }
    }

    getSelectedMenus();
  }, []);

  return (
    <Modal
      destroyOnClose
      title="新建菜单"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => onCancel()}
    >
      <Form form={form}>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="名称"
          name="name"
          rules={[{ required: true, message: '请输入名称！' }]}
        >
          <Input placeholder="请输入名称！" />
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="中文描述" name="nameCn">
          <Input placeholder="请输入中文描述！" />
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="路径"
          name="path"
          rules={[{ required: true, message: '请输入路径！' }]}
        >
          <Input placeholder="请输入路径！" />
        </FormItem>

        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="权限" name="permission">
          <Input placeholder="请输入权限！" />
        </FormItem>

        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="父类菜单" name="parent">
          <Select allowClear={true} placeholder="请选择父类菜单！" style={{ width: '100%' }}>
            {menus.map((menu: TableListItem) => (
              <Option key={menu._id} value={menu._id}>
                {menu.nameCn}
              </Option>
            ))}
          </Select>
        </FormItem>
      </Form>
    </Modal>
  );
};

export default CreateForm;
