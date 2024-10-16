import { Button, Divider, Form, Input, Select, Switch, DatePicker, FormProps, DatePickerProps } from 'antd';
import { observer } from 'mobx-react-lite';
import { useLocation } from 'react-router-dom';
import { useStore } from '../../stores/store';
import { useEffect, useState } from 'react';
import LoadingComponent from '../../layout/LoadingComponent';
import { ActivityFormValues } from '../../models/activity';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import dayjs from 'dayjs';
import locale from 'antd/es/date-picker/locale/tr_TR';

dayjs.extend(utc);
dayjs.extend(timezone);

const ActivitiesEdit = observer(() => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const id = params.get("activityId") || '';
    const [form] = Form.useForm();
    const { activityStore, categoryStore, placeStore, eventHallStore } = useStore();
    const { loadActivityById, loadingInitial, updateActivity, createActivity, clearSelectedActivity, loading } = activityStore;
    const { categories, loadCategories } = categoryStore;
    const { places, loadPlaces } = placeStore;
    const { getEventHallsByPlaceId } = eventHallStore;
    const [selectedPlaceId, setSelectedPlaceId] = useState<string | undefined>(undefined);

    useEffect(() => {
        loadCategories();
        loadPlaces();

        if (id) {
            loadActivityById(id).then((activity) => {
                if (activity) {
                    setSelectedPlaceId(activity.placeId); 
                    form.setFieldsValue({
                        ...activity,
                        date: dayjs.utc(activity.date).tz('Europe/Istanbul'),
                    });
                    getEventHallsByPlaceId(activity.placeId); 
                }
            });
        } else {
            form.setFieldsValue({ isActive: true });
        }

        return () => clearSelectedActivity();
    }, [id, loadActivityById, clearSelectedActivity, form, loadCategories, loadPlaces, getEventHallsByPlaceId]);

    useEffect(() => {
        if (selectedPlaceId) {
            getEventHallsByPlaceId(selectedPlaceId); 
        }
    }, [selectedPlaceId, getEventHallsByPlaceId]);


      const onFinish: FormProps<ActivityFormValues>["onFinish"] = async (values) => {
        try {
            if (id) {
                await updateActivity(values); 
            } else {
    
                await createActivity(values);
            }
            form.resetFields(); 
        } catch (error) {
            console.error('An error occurred while saving the activity:', error);
        }
    };

    if (loadingInitial) return <LoadingComponent />;

    const onChange: DatePickerProps['onChange'] = (_) => {
        console.log(dayjs.utc(_).tz('Europe/Istanbul').format('DD.MM.YYYY HH:mm'));
    };

    return (
        <Form
            layout='horizontal'
            form={form}
            onFinish={onFinish}
            initialValues={{ layout: 'horizontal' }}
            style={{ maxWidth: 800 }}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
        >
            <Form.Item name={"id"} noStyle>
                <Input type="hidden" />
            </Form.Item>
            <Form.Item<ActivityFormValues> label="Durum" name="isActive" valuePropName="checked">
                <Switch checkedChildren="Aktif" unCheckedChildren="Pasif" defaultChecked />
            </Form.Item>
            <Form.Item<ActivityFormValues> label="Ücretli mi?" name="isPaid" valuePropName="unchecked">
                <Switch checkedChildren="Evet" unCheckedChildren="Hayır" />
            </Form.Item>
            <Divider orientation="left">Etkinlik Detayları</Divider>
            <Form.Item<ActivityFormValues> label="Başlık" name="name" rules={[{ required: true, message: "Bu alan boş bırakılamaz!" }]}>
                <Input />
            </Form.Item>
            <Form.Item<ActivityFormValues> label="Gösteri Merkezi" name={"placeId"} rules={[{ required: true, message: "Bu alan boş bırakılamaz!" }]}>
                <Select
                    onChange={(value) => {
                        setSelectedPlaceId(value);
                        form.setFieldsValue({ eventHallId: undefined }); 
                    }}
                >
                    {places.map((pl) => (
                        <Select.Option key={pl.id} value={pl.id}>
                            {pl.title.charAt(0).toUpperCase() + pl.title.slice(1)}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item<ActivityFormValues> label="Salon" name={"eventHallId"} rules={[{ required: true, message: "Bu alan boş bırakılamaz!" }]}>
                <Select disabled={!selectedPlaceId}>
                    {selectedPlaceId && eventHallStore.eventHallsByPlaceIdRegistry.get(selectedPlaceId)?.map((eventHall) => (
                        <Select.Option key={eventHall.id} value={eventHall.id}>
                            {eventHall.title.charAt(0).toUpperCase() + eventHall.title.slice(1)}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item<ActivityFormValues> label="Etkinlik Türü" name={"categoryId"} rules={[{ required: true, message: "Bu alan boş bırakılamaz!" }]}>
                <Select>
                    {categories.map((category) => (
                        <Select.Option key={category.id} value={category.id}>
                            {category.title.charAt(0).toUpperCase() + category.title.slice(1)}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item<ActivityFormValues> label="Açıklama" name="description">
                <Input />
            </Form.Item>
            <Form.Item<ActivityFormValues> label="Tarih" name={"date"} rules={[{ required: true, message: "Bu alan boş bırakılamaz!" }]}>
                <DatePicker
                    format="DD.MM.YYYY HH:mm"
                    placeholder='Tarih seçiniz'
                    showTime={{ showSecond: false, minuteStep: 15, hourStep: 1 }}
                    onChange={onChange}
                    showNow={false}
                    locale={locale}
                />
            </Form.Item>
            <Form.Item<ActivityFormValues> label="Etkinlik Süresi" name="duration">
                <Input />
            </Form.Item>
            <Form.Item>
                <Button type="primary" size='large' htmlType='submit' loading={loading}>Kaydet</Button>
            </Form.Item>
        </Form>
    );
});

export default ActivitiesEdit;
