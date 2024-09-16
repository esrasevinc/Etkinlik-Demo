import  { useEffect, useState } from 'react'
import { Button, Col, Form, FormProps, Input,  Row, Select } from "antd";
import { ActivityFormValues } from '../../../models/activity';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../../stores/store';
import LoadingComponent from '../../../layout/LoadingComponent';
import { useLocation } from 'react-router';
import { EventHall } from '../../../models/eventHall';

const EventHallsEdit = observer(() => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const id = params.get("id");
  const [form] = Form.useForm();

  const { eventHallStore, placeStore } = useStore();
  const { places, loadPlaces } = placeStore;
  const {
    loadEventHallById,
    loadingInitial,
    updateEventHall,
    createEventHall,
    clearSelectedEventHall,
  } = eventHallStore;

  const [eventHall, setEventHall] = useState<EventHall>();

  useEffect(() => {
    loadPlaces();
    if (id) {
      loadEventHallById(id).then((eventHall) => {
        form.setFieldsValue(eventHall);
        setEventHall(eventHall);
      });
    }

    return () => clearSelectedEventHall();
  }, [id, loadEventHallById, clearSelectedEventHall, form, loadPlaces]);

  const onFinish: FormProps["onFinish"] = (values) => {
    if (id) {
      updateEventHall(values);
    } else {
      createEventHall(values);
    }
  };

  if (loadingInitial) return <LoadingComponent />;

  return (
    <Form
      form={form}
      initialValues={eventHall}
      onFinish={onFinish}
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
             <Input type='number' min={1} />
          </Form.Item>
          <Form.Item
            label="Genişlik"
            name="columns"
            rules={[{ required: true, message: "Bu alan boş bırakılamaz!" }]}
          >
             <Input type='number' min={1} />
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

