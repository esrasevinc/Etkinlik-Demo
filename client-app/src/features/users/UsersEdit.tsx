import { Button, Col, Form, FormProps, Input, Row } from "antd";
import { observer } from "mobx-react-lite";
import { useStore } from "../../stores/store";
import { User, UserFormValues } from "../../models/user";
import { useLocation } from "react-router";
import { useEffect, useState } from "react";
import LoadingComponent from "../../layout/LoadingComponent";

const UsersEdit = observer(() => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const userID = params.get("userId");
  const [form] = Form.useForm();
  const { userStore } = useStore();
  const {
    getUserById,
    loadingInitial,
    loading,
    updateUser,
    register,
    clearSelectedUser,
  } = userStore;

  const [user, setUser] = useState<User>();

  useEffect(() => {
    if (userID) {
      getUserById(userID).then((user) => {
        form.setFieldsValue(user);
        setUser(user);
      });
    }

    return () => clearSelectedUser();
  }, [userID, getUserById, clearSelectedUser, form]);

  const onFinish: FormProps["onFinish"] = (values) => {
    if (userID) {
      updateUser(values);
    } else {
      register(values);
    }
  };

  if (loadingInitial) return <LoadingComponent />;

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 20 }}
      initialValues={user}
    >
      <Row gutter={50}>
        <Col xs={24} lg={16}>
          <Form.Item name={"id"} noStyle>
            <Input type="hidden" />
          </Form.Item>
          <Form.Item<UserFormValues>
            label="Email"
            name="email"
            rules={[{ required: true, message: "Bu alan boş bırakılamaz!" }]}
          >
            <Input type="email"/>
          </Form.Item>
          <Form.Item<UserFormValues>
            label="Şifre"
            name="password"
            rules={[{ required: true, message: "Bu alan boş bırakılamaz!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item<UserFormValues>
            label="Kullanıcı Adı"
            name="userName"
            rules={[{ required: true, message: "Bu alan boş bırakılamaz!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item<UserFormValues>
            label="Ad Soyad"
            name="displayName"
          >
            <Input />
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" loading={loading} >
              Kaydet
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
});

export default UsersEdit;
