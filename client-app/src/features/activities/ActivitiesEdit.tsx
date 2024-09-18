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
import { EventHall } from '../../models/eventHall';

dayjs.extend(utc);
dayjs.extend(timezone);

const ActivitiesEdit = observer(() => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const id = params.get("activityId");
    const [form] = Form.useForm();
    const { activityStore, categoryStore, placeStore, eventHallStore } = useStore();
    const { loadActivityById, loadingInitial, updateActivity, createActivity, clearSelectedActivity, loading } = activityStore;
    const { categories, loadCategories } = categoryStore;
    const { places, loadPlaces } = placeStore;
    const { getEventHallsByPlaceId } = eventHallStore;

    const [filteredEventHalls, setFilteredEventHalls] = useState<EventHall[]>([]);
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
                        placeId: activity.placeId,
                        eventHallId: activity.eventHallId
                    });
                }
            });
        } else {
            form.setFieldsValue({ isActive: true });
        }

        return () => clearSelectedActivity();
    }, [id, loadActivityById, clearSelectedActivity, form, loadCategories, loadPlaces]);

    useEffect(() => {
        if (selectedPlaceId) {
            getEventHallsByPlaceId(selectedPlaceId).then(eventHalls => {
                setFilteredEventHalls(eventHalls);
            });
        } else {
            setFilteredEventHalls([]);
        }
    }, [selectedPlaceId, getEventHallsByPlaceId]);

    const onPlaceChange = (placeId: string) => {
        setSelectedPlaceId(placeId);
    };

    const onFinish: FormProps<ActivityFormValues>["onFinish"] = (values) => {
        if (id) {
            updateActivity(values);
        } else {
            createActivity(values);
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
            <Divider orientation="left">Etkinlik Detayları</Divider>
            <Form.Item<ActivityFormValues> label="Başlık" name="name" rules={[{ required: true, message: "Bu alan boş bırakılamaz!" }]}>
                <Input />
            </Form.Item>
            <Form.Item<ActivityFormValues> label="Gösteri Merkezi" name={"placeId"} rules={[{ required: true, message: "Bu alan boş bırakılamaz!" }]}>
                <Select onChange={onPlaceChange} value={selectedPlaceId}>
                    {places.map((pl) => (
                        <Select.Option key={pl.id} value={pl.id}>
                            {pl.title.charAt(0).toUpperCase() + pl.title.slice(1)}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item<ActivityFormValues> label="Salon" name={"eventHallId"} rules={[{ required: true, message: "Bu alan boş bırakılamaz!" }]}>
                <Select>
                    {filteredEventHalls.map((eh) => (
                        <Select.Option key={eh.id} value={eh.id}>
                            {eh.title.charAt(0).toUpperCase() + eh.title.slice(1)}
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
            <Form.Item>
                <Button type="primary" size='large' htmlType='submit' loading={loading}>Kaydet</Button>
            </Form.Item>
        </Form>
    );
});

export default ActivitiesEdit;
