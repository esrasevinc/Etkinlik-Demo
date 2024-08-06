
import { Button, DatePicker, Divider, Form, Input, Select, Space, Switch, TimePicker } from 'antd';
import { router } from '../../routes/Routes';

const ActivitiesAdd = () => {
  const [form] = Form.useForm();

  const formItemLayout ={ labelCol: { span: 8 }, wrapperCol: { span: 14 } } ;
  const buttonItemLayout ={ wrapperCol: { span: 14, offset: 8 } } ;

  const handleSubmit = () => {
    router.navigate('/etkinlikler')
  }

  return (
    <Form
      {...formItemLayout}
      layout='horizontal'
      form={form}
      initialValues={{ layout: 'horizontal' }}
      style={{ maxWidth: 600 }}
    >
      <Form.Item name={"id"} noStyle>
        <Input type="hidden" />
      </Form.Item>
      <Form.Item label="Durum" name="isActive" valuePropName="checked">
        <Switch checkedChildren="Aktif" unCheckedChildren="Pasif" defaultChecked />
      </Form.Item>
      <Divider orientation="left">Etkinlik Detayları</Divider>
      <Form.Item label="Başlık" name="title">
        <Input />
      </Form.Item>
      <Form.Item label="Açıklama" name="description">
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
        <Form.Item label="Tarih" name="date" >
          <Space size={'large'}>
        <DatePicker format={'DD-MM-YYYY'} placeholder='Tarih seçiniz'/>
        <TimePicker minuteStep={15} hourStep={1} showSecond={false} showNow={false} placeholder='Saat seçiniz'/>
        </Space>
      </Form.Item>
      <Form.Item {...buttonItemLayout}>
        <Button type="primary" size='large'  onClick={handleSubmit} >Kaydet</Button>
      </Form.Item>
    </Form>
  );
};

export default ActivitiesAdd;