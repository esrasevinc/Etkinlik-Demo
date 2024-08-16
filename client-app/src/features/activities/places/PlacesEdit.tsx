import { useLocation } from "react-router-dom";
import { useStore } from "../../../stores/store";
import { useEffect, useState } from "react";
import { Button, Col, Form, FormProps, Input, Row } from "antd";
import LoadingComponent from "../../../layout/LoadingComponent";
import { observer } from "mobx-react-lite";
import { Place } from "../../../models/place";

const PlacesEdit = observer(() => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const placeID = params.get("placeId");
  const [form] = Form.useForm();

  const { placeStore } = useStore();
  const {
    loadPlaceById,
    loadingInitial,
    loading,
    updatePlace,
    createPlace,
    clearSelectedPlace,
  } = placeStore;

  const [place, setPlace] = useState<Place>();

  useEffect(() => {
    if (placeID) {
      loadPlaceById(placeID).then((place) => {
        form.setFieldsValue(place);
        setPlace(place);
      });
    }

    return () => clearSelectedPlace();
  }, [placeID, loadPlaceById, clearSelectedPlace, form]);

  const onFinish: FormProps["onFinish"] = (values) => {
    if (placeID) {
      updatePlace(values);
    } else {
      createPlace(values);
    }
  };

  if (loadingInitial) return <LoadingComponent />;

  return (
    <Form
      initialValues={place}
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
            label="Gösteri Merkezi"
            name="title"
            rules={[{ required: true, message: "Bu alan boş bırakılamaz!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" loading={loading}>
              Kaydet
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
});

export default PlacesEdit;
