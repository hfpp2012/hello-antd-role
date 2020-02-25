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
      title="新建权限"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => onCancel()}
    >
      <Form form={form}>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="标识符"
          name="name"
          rules={[{ required: true, message: '请输入英文名称！' }]}
        >
          <Input placeholder="请输入英文名称！" />
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="名称"
          name="nameCn"
          rules={[{ required: true, message: '请输入中文标识符！' }]}
        >
          <Input placeholder="请输入中文标识符！" />
        </FormItem>
      </Form>
    </Modal>
  );
};

export default CreateForm;
