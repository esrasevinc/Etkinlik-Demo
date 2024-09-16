import  { useEffect } from 'react'
import { Button, Col, Form, Input, Row, Select } from "antd";
import { ActivityFormValues } from '../../../models/activity';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../../stores/store';

const EventHallsEdit = observer(() => {

  const [form] = Form.useForm();
  const { placeStore } = useStore();
  const { places, loadPlaces } = placeStore;
  
  useEffect(() => {
    loadPlaces();
    
  }, [ form, loadPlaces]);

  return (
    <Form
      form={form}
      layout="vertical"
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 20 }}
    >
      <Row gutter={50}>
        <Col xs={24} lg={16}>
          <Form.Item name={"id"} noStyle>
            <Input type="hidden" />
          </Form.Item>
          <Form.Item
            label="Salon Adı"
            name="title"
            rules={[{ required: true, message: "Bu alan boş bırakılamaz!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item<ActivityFormValues> label="Gösteri Merkezi" name={"placeId"} rules={[{ required: true, message: "Bu alan boş bırakılamaz!" }]}>
        <Select>
          {places.map((pl) => (
            <Select.Option key={pl.id} value={pl.id}>
              {pl.title.charAt(0).toUpperCase() + pl.title.slice(1)}
            </Select.Option>
          ))}
        </Select>
        </Form.Item>
        <Form.Item
            label="Yükseklik"
            name="rows"
            rules={[{ required: true, message: "Bu alan boş bırakılamaz!" }]}
          >
            <Input type='number'/>
          </Form.Item>
          <Form.Item
            label="Genişlik"
            name="columns"
            rules={[{ required: true, message: "Bu alan boş bırakılamaz!" }]}
          >
            <Input type='number'/>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" >
              Kaydet
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  )
});

export default EventHallsEdit

