
import { Button, Divider, Form, Input, Select, Switch, FormProps, DatePicker, DatePickerProps } from 'antd';
import { observer } from 'mobx-react-lite';
import { useLocation } from 'react-router-dom';
import { useStore } from '../../stores/store';
import { useEffect} from 'react';
import LoadingComponent from '../../layout/LoadingComponent';
import {  ActivityFormValues } from '../../models/activity';
import utc  from 'dayjs/plugin/utc';
import timezone  from 'dayjs/plugin/timezone';
import dayjs from 'dayjs';

dayjs.extend(utc)
dayjs.extend(timezone)


const ActivitiesEdit = observer(() => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const id = params.get("activityId");
  const [form] = Form.useForm();
  const { activityStore, categoryStore } = useStore();
  const { loadActivityById, loadingInitial, updateActivity, createActivity, clearSelectedActivity, loading } = activityStore;
  const { categories, loadCategories } = categoryStore;

  
  useEffect(() => {
    loadCategories();
    if (id) {
      loadActivityById(id).then((activity) => {
        form.setFieldsValue(activity);
      });
      
    } else {
      form.setFieldsValue({ isActive: true });
    }
    return () => clearSelectedActivity();
  }, [id, loadActivityById, clearSelectedActivity, form, loadCategories]);


  const onFinish: FormProps<ActivityFormValues>["onFinish"] = (values) => {
    if (id) {
      updateActivity(values);
    } else {
      createActivity(values);
    }
  };

  if (loadingInitial) return <LoadingComponent />;

  const onChange: DatePickerProps['onChange'] = (_) => {
    console.log(dayjs.utc(_).tz('Europe/Istanbul').format('DD.MM.YYYY HH:mm'))
  };

 
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
      <Form.Item<ActivityFormValues> label="Durum" name="isActive" valuePropName="checked">
        <Switch checkedChildren="Aktif" unCheckedChildren="Pasif" defaultChecked />
      </Form.Item>
      <Divider orientation="left">Etkinlik Detayları</Divider>
      <Form.Item<ActivityFormValues> label="Başlık" name="name" rules={[{ required: true, message: "Bu alan boş bırakılamaz!" }]}>
        <Input />
      </Form.Item>
      <Form.Item<ActivityFormValues> label="Açıklama" name="description">
        <Input />
      </Form.Item>
      <Form.Item label="Etkinlik Yeri" name="location" rules={[{ required: true, message: "Bu alan boş bırakılamaz!" }]}>
          <Select>
            <Select.Option value="BAKSM">
              BAKSM
            </Select.Option>
          </Select>
        </Form.Item>
      <Form.Item<ActivityFormValues> label="Etkinlik Türü" name={"categoryId"}  >
      <Select>
          {categories.map((category) => (
            <Select.Option key={category.id} value={category.id}>
              {category.title}
            </Select.Option>
          ))}
        </Select>
        </Form.Item>
       <Form.Item<ActivityFormValues> label="Tarih" name={"date"}  >
          <DatePicker
            format="DD.MM.YYYY HH:mm"
            placeholder='Tarih seçiniz'
            showTime={{ showSecond: false, minuteStep:15, hourStep:1}}
            onChange={onChange}
            showNow={false}
          />
      
      </Form.Item> 
      <Form.Item>
        <Button type="primary" size='large' htmlType='submit' loading={loading}>Kaydet</Button>
      </Form.Item>
    </Form>
  );
});

export default ActivitiesEdit;