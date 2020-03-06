import React, { useState, useEffect } from 'react';
import { Form, Button, Input, Modal, Spin, Row, Col } from 'antd';

import { TableListItem, PermissionFormParams } from '../data.d';

import { queryPermissions } from '@/pages/admin/permissions/list/service';

export interface FormValueType extends Partial<TableListItem> {}

export interface UpdateFormProps {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: PermissionFormParams) => void;
  updateModalVisible: boolean;
  values: Partial<TableListItem>;
}
const FormItem = Form.Item;

export interface UpdateFormState {
  formVals: FormValueType;
}

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

const PermissionForm: React.FC<UpdateFormProps> = props => {
  const [formVals, setFormVals] = useState<FormValueType>({
    _id: props.values._id,
    name: props.values.name,
    nameCn: props.values.nameCn,
  });

  const [permissions, setPermissions] = useState<FormValueType[]>([]);
  const [defaultPermissions] = useState(props.values.permissions || []);
  const [permissionIds, setPermissionIds] = useState<string[]>(
    defaultPermissions.map(permission => permission._id),
  );
  const [loading, setLoading] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    setLoading(true);
    async function getData() {
      const { success, data } = await queryPermissions();
      if (success) {
        setPermissions(data);
        setLoading(false);
      }
    }
    getData();
  }, []);

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

    const fields = fieldsValue as PermissionFormParams;

    handleUpdate({ ...fields, permissionIds });
  };

  const handelCheckboxChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked, value } = e.target;

    if (checked) {
      if (permissionIds.every(id => id !== value)) {
        setPermissionIds([...permissionIds, value]);
      }
    } else {
      setPermissionIds(permissionIds.filter(id => id !== value));
    }
  };

  const renderContent = () => {
    if (loading) {
      return <Spin />;
    }
    return (
      <>
        <Row>
          {permissions.map(permission => (
            <Col key={permission._id} span={8}>
              <input
                type="checkbox"
                onChange={handelCheckboxChange}
                defaultChecked={!!defaultPermissions.find(p => p._id === permission._id)}
                value={permission._id}
              ></input>
              {permission.nameCn}
            </Col>
          ))}
        </Row>

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
      title="分配权限"
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
          nameCn: formVals.nameCn,
          permissions: formVals.permissions,
        }}
      >
        {renderContent()}
      </Form>
    </Modal>
  );
};

export default PermissionForm;
