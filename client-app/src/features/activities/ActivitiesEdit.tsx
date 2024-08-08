
import { Button, DatePicker, Divider, Form, Input, Select, Switch, FormProps } from 'antd';
import { observer } from 'mobx-react-lite';
import { useLocation } from 'react-router-dom';
import { useStore } from '../../stores/store';
import { useEffect } from 'react';
import LoadingComponent from '../../layout/LoadingComponent';
import { Activity, ActivityFormValues } from '../../models/activity';
import type { DatePickerProps } from 'antd';
import tr from 'antd/es/date-picker/locale/tr_TR';



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


  const onFinish: FormProps<Activity>["onFinish"] = (values) => {
    if (id) {
      updateActivity(values);
    } else {
      createActivity(values);
    }
  };

  const dateLocale: typeof tr = {
    ...tr,
    lang: {
      ...tr.lang,
      fieldDateFormat: 'DD-MM-YYYY',
      fieldDateTimeFormat: 'DD-MM-YYYY HH:mm',
      yearFormat: 'YYYY',
      cellYearFormat: 'YYYY',
    },
  };

  if (loadingInitial) return <LoadingComponent />;

  const onChange: DatePickerProps['onChange'] = (_, dateStr) => {
    console.log('onChange:', dateStr);
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
      <Form.Item<ActivityFormValues> label="Etkinlik Türü" name={"categoryId"} >
      <Select>
          {categories.map((category) => (
            <Select.Option key={category.id} value={category.id}>
              {category.title}
            </Select.Option>
          ))}
        </Select>
        </Form.Item>
        <Form.Item<ActivityFormValues> label="Tarih" name={"date"} >
          <DatePicker
            placeholder='Tarih seçiniz'
            showTime={{ format: "HH:mm" , showSecond: false, minuteStep:15, hourStep:1}}
            locale={dateLocale}
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