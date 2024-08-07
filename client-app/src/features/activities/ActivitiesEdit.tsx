
import { Button, DatePicker, Divider, Form, Input, Select, Space, Switch, TimePicker, FormProps, message } from 'antd';
import { observer } from 'mobx-react-lite';
import { useLocation } from 'react-router-dom';
import { useStore } from '../../stores/store';
import { useEffect } from 'react';
import LoadingComponent from '../../layout/LoadingComponent';
import { Activity } from '../../models/activity';
import { router } from '../../routes/Routes';

const ActivitiesEdit = observer(() => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const id = params.get("activityId");
  const [form] = Form.useForm();
  const { activityStore } = useStore();
  const { loadActivityById, loadingInitial, updateActivity, createActivity, clearSelectedActivity, loading } = activityStore;
  
  useEffect(() => {
    if (id) {
      loadActivityById(id).then((activity) => {
        form.setFieldsValue(activity);
      });
    } else {
      form.setFieldsValue({ isActive: true });
    }

    return () => clearSelectedActivity();
  }, [id, loadActivityById, clearSelectedActivity, form]);


  const onFinish: FormProps<Activity>["onFinish"] = (values) => {
    if (id) {
      form.setFieldValue("id", Number(id));
      updateActivity(values);
      message.success("Etkinlik başarıyla güncellendi.");
    } else {
      createActivity(values);
      message.success("Etkinlik başarıyla oluşturuldu.");
    }
    router.navigate('/etkinlikler')
  };

  if (loadingInitial) return <LoadingComponent />;

  return (
    <Form
      layout='horizontal'
      form={form}
      onFinish={onFinish}
      initialValues={{ layout: 'horizontal' }}
      style={{ maxWidth: 600 }}
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 20 }}
    >
      <Form.Item name={"id"} noStyle>
        <Input type="hidden" />
      </Form.Item>
      <Form.Item label="Durum" name="isActive" valuePropName="checked">
        <Switch checkedChildren="Aktif" unCheckedChildren="Pasif" defaultChecked />
      </Form.Item>
      <Divider orientation="left">Etkinlik Detayları</Divider>
      <Form.Item<Activity> label="Başlık" name="name">
        <Input />
      </Form.Item>
      <Form.Item<Activity> label="Açıklama" name="description">
        <Input />
      </Form.Item>
      <Form.Item label="Etkinlik Yeri" name="location">
          <Select placeholder='Etkinlik yeri seçiniz'>
            <Select.Option value="baksm">BAKSM</Select.Option>
            <Select.Option value="fsm">FSM</Select.Option>
          </Select>
        </Form.Item>
      <Form.Item label="Etkinlik Türü" name="category">
          <Select placeholder='Etkinlik türü seçiniz'>
            <Select.Option value="tiyatro">Tiyatro</Select.Option>
            <Select.Option value="konser">Konser</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item<Activity> label="Tarih" name="date" >
          <Space size={'large'}>
        <DatePicker format={'DD-MM-YYYY'} placeholder='Tarih seçiniz'/>
        <TimePicker minuteStep={15} hourStep={1} showSecond={false} showNow={false} placeholder='Saat seçiniz'/>
        </Space>
      </Form.Item>
      <Form.Item>
        <Button type="primary" size='large' htmlType='submit' loading={loading}>Kaydet</Button>
      </Form.Item>
    </Form>
  );
});

export default ActivitiesEdit;