import { useState, useEffect } from 'react';
import axios from 'axios';
import { useStore } from '../../stores/store';
import { Button, Col, Form, Input, Row, Select } from "antd";

const CreateReport = () => {
    const [form] = Form.useForm();
    const { activityStore } = useStore();
    const { loadActivities, activitiesAll } = activityStore; 
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        loadActivities(); 
    }, [loadActivities, form]);

    const onFinish = async (values: any) => {
        const { activityId } = values; 
        if (!activityId) {
            alert("Lütfen bir etkinlik seçin.");
            return;
        }
    
        try {
            setLoading(true);
            const response = await axios({
                url: `http://localhost:5000/api/reports/excel/${activityId}`,
                method: 'GET',
                responseType: 'blob', 
            });
    
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `EtkinlikRaporu_${activityId}.xlsx`); 
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error("Rapor indirilemedi:", error);
            alert("Rapor indirilirken bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };
    



    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
        >
            <Row gutter={50}>
                <Col xs={24} lg={16}>
                    <Form.Item name="id" noStyle>
                        <Input type="hidden" />
                    </Form.Item>
                    <Form.Item
                        label="Etkinlik Seçimi"
                        name="activityId"
                        rules={[{ required: true, message: "Bu alan boş bırakılamaz!" }]}
                    >
                        <Select
                            placeholder="Etkinlik seçiniz"
                            loading={loading} 
                        >
                            {activitiesAll && activitiesAll.map((activity) => (
                                <Select.Option key={activity.id} value={activity.id}>
                                    {activity.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" size="large" loading={loading}>
                            Rapor Oluştur
                        </Button>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    );
};

export default CreateReport;
