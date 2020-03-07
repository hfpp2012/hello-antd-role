import React, { useState, useEffect } from 'react';
import { Form, Button, Input, Modal, Row, Col, Spin } from 'antd';

import { TableListItem, PermissionFormParams } from '../data.d';
import { queryPermissions } from '@/pages/admin/permissions/list/service';
import { TableListItem as PermissionData } from '../../../permissions/list/data.d';

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
  currentStep: number;
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

  const [permissions, setPermissions] = useState<PermissionData[]>([]);

  const [loading, setLoading] = useState<boolean | undefined>(undefined);
  const [defaultPermissions] = useState(props.values.permissions || []);
  const [permissionIds, setPermissionIds] = useState<string[]>(
    defaultPermissions.map(permission => permission._id),
  );

  useEffect(() => {
    setLoading(true);
    async function getPermissions() {
      if (loading) {
        return;
      }
      const { success, data } = await queryPermissions();
      if (success) {
        setPermissions(data);
        setLoading(false);
      }
    }
    getPermissions();
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

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked, value } = e.target;

    if (checked && permissionIds.every(id => id !== value)) {
      setPermissionIds([...permissionIds, value]);
    } else {
      setPermissionIds(permissionIds.filter(id => id !== value));
    }
  };

  const renderContent = () => {
    if (loading) {
      return <Spin />;
    } else {
      return (
        <>
          <Row>
            {permissions.map(permission => (
              <Col key={permission._id} span={8}>
                <input
                  defaultChecked={!!defaultPermissions.find(p => p._id === permission._id)}
                  onChange={handleCheckboxChange}
                  type="checkbox"
                  value={permission._id}
                />
                {permission.nameCn}
              </Col>
            ))}
          </Row>

          <FormItem name="_id" label={false}>
            <Input type="hidden" />
          </FormItem>
        </>
      );
    }
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
        }}
      >
        {renderContent()}
      </Form>
    </Modal>
  );
};

export default PermissionForm;
