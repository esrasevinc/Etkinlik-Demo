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
    const [activityId, setActivityId] = useState<string | null>(null);

    useEffect(() => {
        loadActivities();

        if (id) {
            loadTicketById(id).then(async (tic) => {
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

                    const response = await agent.TicketSeats.listByActivityId(tic.activity?.id ?? '');
                    setSeats(response);
                    setActivityId(tic.activity?.id ?? '');
                }
            });
        }

        return () => clearSelectedTicket();
    }, [id, loadTicketById, clearSelectedTicket, form, loadActivities]);

    const handleActivityChange = async (activityId: string) => {
        try {
            if (selectedSeatId) {
                const previousSeat = seats.find(seat => seat.id === selectedSeatId);
                if (previousSeat) {
                    previousSeat.status = 'Boş'; 
                }
            }

            const response = await agent.TicketSeats.listByActivityId(activityId);
            setSeats(response);
            setActivityId(activityId);
        } catch (error) {
            console.error('Koltukları yüklerken hata oluştu:', error);
        }
    };

    const createSeatingChart = (): (TicketSeat | undefined)[][] => {
        if (!activityId) return [];
        
        const activity = activitiesAll.find(a => a.id === activityId);
        const seatingChart: (TicketSeat | undefined)[][] = Array.from({ length: activity?.eventHall.rows! }, () =>
            Array.from({ length: activity?.eventHall.columns! }, () => undefined)
        );

        seats.forEach(seat => {
            const { row, column } = seat;
            if (row < activity?.eventHall.rows! && column < activity?.eventHall.columns!) {
                seatingChart[row][column] = seat;
            }
        });

        return seatingChart;
    };

    const seatingChart = createSeatingChart();

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
                });
            } else {
                await createTicket(ticketData);
            }

            form.resetFields();
            setSelectedSeatId(null);

        } catch (error) {
            console.error('Bir hata oluştu:', error);
        }
    };

    const handleSeatClick = async (seatId: string) => {
        try {
            const seat = seats.find(seat => seat.id === seatId);
            if (seat && seat.status === 'Boş' && seat.id) {
                if (selectedSeatId) {
                    const previousSeat = seats.find(seat => seat.id === selectedSeatId);
                    if (previousSeat) {
                        previousSeat.status = 'Boş'; 
                        await agent.TicketSeats.update({ 
                            id: previousSeat.id, 
                            status: 'Boş', 
                            seatId: previousSeat.seatId,
                            activityId: previousSeat.activityId,
                            label: previousSeat.label,
                            row: previousSeat.row,
                            column: previousSeat.column,
                        });
                    }
                }

                setSelectedSeatId(seat.id);
                seat.status = 'Dolu';
                await agent.TicketSeats.update({ 
                    id: seat.id, 
                    status: 'Dolu', 
                    seatId: seat.seatId, 
                    activityId: seat.activityId,
                    label: seat.label,
                    row: seat.row,
                    column: seat.column,
                });
            }
        } catch (error) {
            console.error("Koltuk güncellenirken bir hata oluştu:", error);
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
                            {activitiesAll.map(activity => (
                                <Select.Option key={activity.id} value={activity.id}>{activity.name}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            {id ? 'Güncelle' : 'Kaydet'}
                        </Button>
                    </Form.Item>
                </Col>
                <Col xs={24} lg={8}>
                    <h3>Koltuk Seçimi</h3>
                    <div className="seating-chart">
                        {seatingChart.map((row, rowIndex) => (
                            <div key={rowIndex} className="seating-row" style={{ display: 'flex' }}>
                                {row.map((seat, colIndex) => (
                                    seat ? (
                                        <div
                                            key={colIndex}
                                            className={`seating-seat ${seat ? seat.status : 'empty'}`}
                                            onClick={() => seat && handleSeatClick(seat.id)}
                                            style={{
                                                width: '30px',
                                                height: '30px',
                                                backgroundColor: seat 
                                                    ? (seat.id === selectedSeatId 
                                                        ? 'lightblue' 
                                                        : (seat.status === 'Dolu' ? 'lightcoral' : 'lightgreen')) 
                                                    : 'transparent',
                                                margin: '2px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                cursor: seat ? 'pointer' : 'not-allowed',
                                                border: '1px solid #ccc'
                                            }}
                                        >
                                            {seat.label}
                                        </div>
                                    ) : null 
                                ))}
                            </div>
                        ))}
                    </div>
                </Col>
            </Row>
        </Form>
    );
});

export default CreateTicket;
