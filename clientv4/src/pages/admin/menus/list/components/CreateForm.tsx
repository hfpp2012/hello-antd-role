import React from 'react';
import { Form, Input, Modal } from 'antd';
import { TableListItem } from '../data.d';

const FormItem = Form.Item;

interface CreateFormProps {
  modalVisible: boolean;
  onSubmit: (fieldsValue: TableListItem) => void;
  onCancel: () => void;
}

const CreateForm: React.FC<CreateFormProps> = props => {
  const [form] = Form.useForm();

  const { modalVisible, onSubmit: handleAdd, onCancel } = props;
  const okHandle = async () => {
    const fieldsValue = (await form.validateFields()) as TableListItem;
    form.resetFields();
    handleAdd(fieldsValue);
  };
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
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="路径"
          name="path"
          rules={[{ required: true, message: '请输入路径！' }]}
        >
          <Input placeholder="请输入路径！" />
        </FormItem>
      </Form>
    </Modal>
  );
};

export default CreateForm;
