import React, { useState, useEffect } from 'react';
import { Form, Button, Input, Modal, Select } from 'antd';
import request from '@/utils/request';

import { TableListItem, UpdateParams } from '../data.d';

export interface FormValueType extends Partial<TableListItem> {}

export interface UpdateFormProps {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: UpdateParams) => void;
  updateModalVisible: boolean;
  values: Partial<TableListItem>;
}
const FormItem = Form.Item;

const { Option } = Select;

export interface UpdateFormState {
  formVals: FormValueType;
  currentStep: number;
}

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

const UpdateForm: React.FC<UpdateFormProps> = props => {
  const [formVals, setFormVals] = useState<FormValueType>({
    _id: props.values._id,
    name: props.values.name,
    path: props.values.path,
    nameCn: props.values.nameCn,
    parent: props.values.parent,
    parentId: props.values.parentId,
    permission: props.values.permission,
  });

  const [form] = Form.useForm();

  const {
    onSubmit: handleUpdate,
    onCancel: handleUpdateModalVisible,
    updateModalVisible,
    values,
  } = props;

  const handleNext = async () => {
    const fieldsValue = await form.validateFields();

    setFormVals({ ...formVals, ...fieldsValue });

    handleUpdate(fieldsValue as UpdateParams);
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

  const renderContent = () => {
    return (
      <>
        <FormItem name="name" label="名称" rules={[{ required: true, message: '请输入名称！' }]}>
          <Input placeholder="请输入名称！" />
        </FormItem>
        <FormItem label="中文描述" name="nameCn">
          <Input placeholder="请输入中文描述！" />
        </FormItem>
        <FormItem name="path" label="路径" rules={[{ required: true, message: '请输入路径！' }]}>
          <Input placeholder="请输入路径！" />
        </FormItem>

        <FormItem label="权限" name="permission">
          <Input placeholder="请输入权限！" />
        </FormItem>

        <FormItem label="父类菜单" name="parentId">
          <Select allowClear={true} placeholder="请选择父类菜单！" style={{ width: '100%' }}>
            {menus.map((menu: TableListItem) => (
              <Option key={menu._id} value={menu._id}>
                {menu.nameCn}
              </Option>
            ))}
          </Select>
        </FormItem>

        <FormItem name="_id" label={false}>
          <Input type="hidden" />
        </FormItem>
      </>
    );
  };

  const renderFooter = () => {
    return (
      <>
        <Button onClick={() => handleUpdateModalVisible(false, values)}>取消</Button>
        <Button type="primary" onClick={() => handleNext()}>
          保存
        </Button>
      </>
    );
  };

  return (
    <Modal
      width={640}
      bodyStyle={{ padding: '32px 40px 48px' }}
      destroyOnClose
      title="修改菜单"
      visible={updateModalVisible}
      footer={renderFooter()}
      onCancel={() => handleUpdateModalVisible(false, values)}
      afterClose={() => handleUpdateModalVisible()}
    >
      <Form
        {...formLayout}
        form={form}
        initialValues={{
          _id: formVals._id,
          name: formVals.name,
          path: formVals.path,
          nameCn: formVals.nameCn,
          parent: formVals.parent,
          parentId: formVals.parentId,
          permission: formVals.permission,
        }}
      >
        {renderContent()}
      </Form>
    </Modal>
  );
};

export default UpdateForm;
