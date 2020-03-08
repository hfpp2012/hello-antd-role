import React, { useState, useEffect } from 'react';
import { Form, Button, Input, Modal, Row, Col } from 'antd';

import { TableListItem, RoleFormParams } from '../data.d';
import { queryRoles } from '@/pages/admin/roles/list/service';
import { TableListItem as RoleData } from '../../../roles/list/data.d';

export interface FormValueType extends Partial<TableListItem> {}

export interface UpdateFormProps {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: RoleFormParams) => void;
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

const RoleForm: React.FC<UpdateFormProps> = props => {
  const [formVals, setFormVals] = useState<FormValueType>({
    _id: props.values._id,
    username: props.values.username,
    password: props.values.password,
  });

  const [roles, setRoles] = useState<RoleData[]>([]);

  const [loading, setLoading] = useState<boolean | undefined>(undefined);
  const [defaultRoles] = useState(props.values.roles || []);
  const [roleIds, setRoleIds] = useState<string[]>(defaultRoles.map(role => role._id));

  useEffect(() => {
    setLoading(true);
    async function getPermissions() {
      if (loading) {
        return;
      }
      const { success, data } = await queryRoles();
      if (success) {
        setRoles(data);
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

    const fields = fieldsValue as RoleFormParams;

    handleUpdate({ ...fields, roleIds });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked, value } = e.target;

    if (checked && roleIds.every(id => id !== value)) {
      setRoleIds([...roleIds, value]);
    } else {
      setRoleIds(roleIds.filter(id => id !== value));
    }
  };

  const renderContent = () => {
    return (
      <>
        <Row>
          {roles.map(role => (
            <Col key={role._id} span={8}>
              <input
                defaultChecked={!!defaultRoles.find(p => p._id === role._id)}
                onChange={handleCheckboxChange}
                type="checkbox"
                value={role._id}
              />
              {role.nameCn}
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
      title="分配角色"
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
          username: formVals.username,
          roles: formVals.roles,
        }}
      >
        {renderContent()}
      </Form>
    </Modal>
  );
};

export default RoleForm;
