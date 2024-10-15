import { useStore } from "../../stores/store";
import { Button, Col, DatePicker, DatePickerProps, Form, FormProps, Input, Row, Select } from "antd";
import LoadingComponent from "../../layout/LoadingComponent";
import { observer } from "mobx-react-lite";
import agent from "../../api/agent";
import { useEffect, useState } from "react";
import { TicketSeat } from "../../models/ticketSeat";
import dayjs from "dayjs";
import locale from 'antd/es/date-picker/locale/tr_TR';
import { useLocation } from "react-router-dom";

const CreateTicket = observer(() => {
  const [form] = Form.useForm();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const id = params.get("ticketId") || '';

  const { ticketStore, activityStore } = useStore();
  const { loadingInitial, loading, createTicket, updateTicket, loadTicketById, clearSelectedTicket } = ticketStore;
  const { loadActivities, activitiesAll } = activityStore;

  const [seats, setSeats] = useState<TicketSeat[]>([]);
  const [selectedSeatId, setSelectedSeatId] = useState<string | null>(null); 

  useEffect(() => {
    loadActivities();

    if (id) {
        loadTicketById(id).then((tic) => {
            if (tic) {
                setSelectedSeatId(tic.ticketSeat?.id ?? null); 
                form.setFieldsValue({
                    id: tic.id,
                    name: tic.customer?.name ?? '',
                    tcNumber: tic.customer?.tcNumber ?? '',                   
                    phone: tic.customer?.phone ?? '',
                    email: tic.customer?.email ?? '',
                    address: tic.customer?.address ?? '',
                    birthDate: tic.customer?.birthDate ? dayjs(tic.customer.birthDate) : null,
                    activityId: tic.activity?.id ?? '',
                });
            }
        });
    }

    return () => clearSelectedTicket();
}, [id, loadTicketById, clearSelectedTicket, form, loadActivities]);


  const handleActivityChange = async (activityId: string) => {
    try {
      const response = await agent.TicketSeats.listByActivityId(activityId); 
      setSeats(response);
    } catch (error) {
      console.error('Koltukları yüklerken hata oluştu:', error);
    }
  };

  const onChange: DatePickerProps['onChange'] = (_) => {
    console.log(dayjs.utc(_).tz('Europe/Istanbul').format('DD.MM.YYYY'));
};

  const onFinish: FormProps["onFinish"] = async (values) => {
    
    try {
        const customerResponse = await agent.Customers.create({
            name: values.name,
            tcNumber: values.tcNumber,
            phone: values.phone,
            email: values.email,
            address: values.address,
            birthDate: values.birthDate,
        });

        const customerId = customerResponse.id;

        if (!customerId || selectedSeatId === null) {
            throw new Error('Customer ID or selected seat not returned');
        } 

        const activity = activitiesAll.find(activity => activity.id === values.activityId); 
        const ticketSeat = seats.find(seat => seat.id === selectedSeatId); 

        if (!activity || !ticketSeat) {
            throw new Error('Geçersiz etkinlik veya koltuk.');
        }

        const ticketData = {
            customerId: customerId,
            activityId: values.activityId,
            ticketSeatId: selectedSeatId,
            customer: { ...customerResponse }, 
            activity: { ...activity }, 
            ticketSeat: { ...ticketSeat } 
        };

        if (id) {
          await updateTicket({
            id: id,
            customerId: customerId,
            activityId: values.activityId,
            ticketSeatId: selectedSeatId,
            customer: { ...customerResponse }, 
            activity: { ...activity }, 
            ticketSeat: { ...ticketSeat } 
          })
        } else {
          await createTicket(ticketData); 
        }
        

        form.resetFields();
        setSelectedSeatId(null); 

    } catch (error) {
        console.error('Bir hata oluştu:', error);
    }
};



const handleSeatClick = (seatId: string) => {
  const seat = seats.find(seat => seat.id === seatId);
  if (seat && seat.status === 'Boş' && seat.id) { 
      setSelectedSeatId(seat.id);
  }
};



  if (loadingInitial) return <LoadingComponent />;

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
          <Form.Item name={"id"} noStyle>
            <Input type="hidden" />
          </Form.Item>
          <Form.Item
            label="Ad Soyad"
            name="name"
            rules={[{ required: true, message: "Bu alan boş bırakılamaz!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="TC Kimlik"
            name="tcNumber"
            rules={[{ required: true, message: "Bu alan boş bırakılamaz!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Telefon"
            name="phone" 
            rules={[{ required: true, message: "Bu alan boş bırakılamaz!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email" 
            rules={[{ required: true, message: "Bu alan boş bırakılamaz!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Adres"
            name="address" 
            rules={[{ required: true, message: "Bu alan boş bırakılamaz!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Doğum Tarihi" name={"birthDate"} rules={[{ required: true, message: "Bu alan boş bırakılamaz!" }]}>
                <DatePicker
                    format="DD.MM.YYYY"
                    placeholder='Tarih seçiniz'
                    onChange={onChange}
                    showNow={false}
                    locale={locale}
                />
            </Form.Item>
          <Form.Item label="Etkinlik Seçimi" name={"activityId"} rules={[{ required: true, message: "Bu alan boş bırakılamaz!" }]}>
            <Select onChange={handleActivityChange}>
              {activitiesAll.map((a) => (
                <Select.Option key={a.id} value={a.id}>
                  {a.name.charAt(0).toUpperCase() + a.name.slice(1)}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Row gutter={8}>
            {seats.map(seat => (
              <Col key={seat.id} span={4} style={{ marginBottom: 16 }}>

                <div
                  onClick={() => handleSeatClick(seat.id)} 
                  style={{
                    width: '50px', 
                    height: '50px', 
                    backgroundColor: selectedSeatId === seat.id ? 'lightblue' : (seat.status === 'Boş' ? 'lightgreen' : 'lightcoral'),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                    color: seat.status === 'Boş' ? 'black' : 'white', 
                    fontWeight: 'bold', 
                    cursor: seat.status === 'Boş' ? 'pointer' : 'not-allowed' 
                  }}
                >
                  {seat.label}
                </div>
                
              </Col>
            ))}
          </Row>

          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" loading={loading}>
              Bilet Oluştur
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
});

export default CreateTicket;
