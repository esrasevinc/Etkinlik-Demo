
import { Button, DatePicker, Divider, Form, Input, Select, Space, Switch, TimePicker } from 'antd';

const ActivitiesAdd = () => {
  const [form] = Form.useForm();




  const formItemLayout ={ labelCol: { span: 4 }, wrapperCol: { span: 14 } } ;

  const buttonItemLayout ={ wrapperCol: { span: 14, offset: 4 } } ;

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
        <Switch checkedChildren="Aktif" unCheckedChildren="Pasif" />
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
        <DatePicker format={'DD-MM-YYYY'}/>
        <TimePicker minuteStep={15} hourStep={1} showSecond={false} showNow={false}/>
        </Space>
      </Form.Item>
      <Form.Item {...buttonItemLayout}>
        <Button type="primary">Submit</Button>
      </Form.Item>
    </Form>
  );
};

export default ActivitiesAdd;