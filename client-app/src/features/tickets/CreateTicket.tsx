
import { useStore } from "../../stores/store";
import { Button, Col, Form, FormProps, Input, Row, Select } from "antd";
import LoadingComponent from "../../layout/LoadingComponent";
import { observer } from "mobx-react-lite";
import agent from "../../api/agent";
import { useEffect } from "react";

const CreateTicket = observer(() => {
  const [form] = Form.useForm();

  const { ticketStore, activityStore } = useStore();
  const {
    loadingInitial,
    loading,
    createTicket,
  } = ticketStore;

  const { loadActivities, activitiesAll } = activityStore;

  useEffect(() => {
    loadActivities();
  }, [loadActivities, form]);


  const onFinish: FormProps["onFinish"] = async (values) => {
    try {
      
      const customerResponse = await agent.Customers.create({
        name: values.name,
        TCNumber: values.TCNumber,
        phone: values.phone,
        email: values.email,
        address: values.address,
        birthDate: values.birthDate,
      });
  
      const customerId = customerResponse.id;
      
      if (!customerId) {
        throw new Error('Customer ID not returned');
      }  
  
    } catch (error) {
      console.error('Error creating ticket:', error);
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
    >
      <Row gutter={50}>
        <Col xs={24} lg={16}>
          <Form.Item name={"id"} noStyle>
            <Input type="hidden" />
          </Form.Item>
          <Form.Item
            label="Ad Soyad"
            name="name"
            rules={[{ required: true, message: "Bu alan boş bırakılamaz!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="TC Kimlik"
            name="name"
            rules={[{ required: true, message: "Bu alan boş bırakılamaz!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Telefon"
            name="name"
            rules={[{ required: true, message: "Bu alan boş bırakılamaz!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="name"
            rules={[{ required: true, message: "Bu alan boş bırakılamaz!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Etkinlik Seçimi" name={"activityId"} rules={[{ required: true, message: "Bu alan boş bırakılamaz!" }]}>
          <Select>
          {activitiesAll.map((a) => (
            <Select.Option key={a.id} value={a.id}>
              {a.name.charAt(0).toUpperCase() + a.name.slice(1)}
            </Select.Option>
          ))}
        </Select>
        </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" loading={loading}>
              Bilet Oluşturrr
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
});

export default CreateTicket;
