import { Button, Col, Flex, Modal, Popconfirm, QRCode, Row, Table, TableProps, Tooltip } from "antd";
import { useStore } from "../../stores/store";
import { observer } from "mobx-react-lite";
import { Key, useEffect, useState } from "react";
import LoadingComponent from "../../layout/LoadingComponent";
import { Ticket } from "../../models/ticket";
import { DeleteOutlined, LinkOutlined } from "@ant-design/icons";
import jsPDF from "jspdf";
import dayjs from "dayjs";
// import { Link } from "react-router-dom";

const Tickets = observer(() => {
  const { ticketStore, activityStore } = useStore();
  const { tickets, loadTickets, loadingInitial, deleteTicket } = ticketStore;
  const { loadActivities, activitiesAll } = activityStore;
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null); 
  const [isModalVisible, setIsModalVisible] = useState(false); 

  const calculateAge = (birthdate: Date): number => {
    const birthDate = typeof birthdate === 'string' ? new Date(birthdate) : birthdate;
  
    if (isNaN(birthDate.getTime())) return 0; 
  
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
  
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
  
    return age;
  };
  
  
  useEffect(() => {
    loadTickets();
    loadActivities();
  }, [loadTickets, loadActivities]);

  if (loadingInitial) return <LoadingComponent />;

  const downloadTicketPDF = (ticket: Ticket) => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("Bilet Detayları", 20, 20);

    const qrCodeCanvas = document.querySelector("canvas") as HTMLCanvasElement;
    const qrCodeURL = qrCodeCanvas.toDataURL("image/png");
    doc.addImage(qrCodeURL, "PNG", 150, 10, 40, 40); 

    doc.setFontSize(12);
    doc.text(`Ad Soyad: ${ticket.customer.name}`, 20, 50);
    doc.text(`Telefon: ${ticket.customer.phone}`, 20, 60);
    doc.text(`Email: ${ticket.customer.email}`, 20, 70);
    doc.text(`Etkinlik: ${ticket.activity.name}`, 20, 80);
    doc.text(`Etkinlik Yeri: ${ticket.activity.place.title}`, 20, 90);
    doc.text(`Koltuk: ${ticket.ticketSeat.label}`, 20, 100);

    doc.save(`bilet_${ticket.id}.pdf`);
  };

  const showModal = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedTicket(null);
  };

  const columns: TableProps<Ticket>["columns"] = [
    {
      title: "Bilet ID",
      dataIndex: "id",
      key: "id",
      render: (text) => <p>{text}</p>,
      width: 200,
    },
    {
      title: "Ad Soyad",
      dataIndex: "customer",
      key: "customer",
      render: (customer) =>
        customer?.name && <p>{customer.name.charAt(0).toUpperCase() + customer.name.slice(1)}</p>,
      width: 150,
    },
    {
      title: "Telefon Numarası",
      dataIndex: "customer",
      key: "customer",
      render: (customer) => <p>{customer.phone}</p>,
      width: 150,
    },
    {
      title: "Email",
      dataIndex: "customer",
      key: "customer",
      render: (customer) => <p>{customer.email}</p>,
      width: 150,
    },
    {
      title: "Yaş",
      dataIndex: "customer",
      key: "customer",
      render: (customer) => {
        const age = calculateAge(customer.birthDate);
        return <p>{age}</p>;
      },
      width: 50,
    },
    {
      title: "Etkinlik Adı",
      dataIndex: "activity",
      key: "activity",
      render: (activity) => <p>{activity.name}</p>,
      filters: activitiesAll.map(a => ({
        text: a.name.charAt(0).toUpperCase() + a.name.slice(1), 
        value: a.id!,
      })),
      onFilter: (value: boolean | Key, record: Ticket) => record.activity.id === value,
      width: 150,
    },
    {
      title: "Gösteri Merkezi",
      dataIndex: "activity",
      key: "activity",
      render: (activity) => <p>{activity.place.title}</p>,
      filters: activitiesAll.map(a => ({
        text: a.place.title.charAt(0).toUpperCase() + a.place.title.slice(1), 
        value: a.id!,
      })),
      onFilter: (value: boolean | Key, record: Ticket) => record.activity.id === value,
      width: 200,
    },
    {
      title: "Salon",
      dataIndex: "activity",
      key: "activity",
      render: (activity) => <p>{activity.eventHall.title}</p>,
      filters: activitiesAll.map(a => ({
        text: a.place.title.charAt(0).toUpperCase() + a.place.title.slice(1), 
        value: a.id!,
      })),
      onFilter: (value: boolean | Key, record: Ticket) => record.activity.id === value,
      width: 200,
    },
    {
      title: "Etkinlik Tarihi ve Saati",
      dataIndex: "activity",
      key: "activity",
      render: (activity) => {
        return dayjs.utc((activity.date)).tz('Europe/Istanbul').format('DD.MM.YYYY HH:mm')
       },
       sorter: (a: Ticket, b: Ticket) => {
        const dateA = dayjs.utc(a.activity.date).tz('Europe/Istanbul');
        const dateB = dayjs.utc(b.activity.date).tz('Europe/Istanbul');
        return dateA.isBefore(dateB) ? -1 : dateA.isAfter(dateB) ? 1 : 0;
      },
      width: 200,
    },
    {
      title: "Koltuk",
      dataIndex: "ticketSeat",
      key: "ticketSeat",
      render: (ticketseat) => <p>{ticketseat.label}</p>,
      width: 100,
    },
    {
      title: "İşlemler",
      dataIndex: "actions",
      render: (_, record) => (
        <Flex wrap="wrap" gap="small">
          {/* <Link to={`duzenle?ticketId=${record.id}`}>
            <Tooltip title="Düzenle">
              <Button type="primary" shape="circle" icon={<EditOutlined />} />
            </Tooltip>
            </Link> */}
          
          <Tooltip title="Bileti Görüntüle">
          <Button
          style={{ backgroundColor: 'green', borderColor: 'green' }} 
            type="primary"
            shape="circle"
            icon={<LinkOutlined />}
            onClick={() => showModal(record)} 
          />
        </Tooltip>

        <Popconfirm
            title="Bileti sil"
            description="Bu bileti silmek istediğinize emin misiniz?"
            onConfirm={() => {
              deleteTicket(record.id as string);
            }}
            okText="Sil"
            cancelText="İptal"
          >
            <Tooltip title="Sil">
            <Button type="primary" danger shape="circle" icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Flex>
      ),
      width: 150,
    },

  ];

  return (
    <>
      <Table
        bordered
        scroll={{ x: 500 }}
        columns={columns}
        dataSource={tickets}
        loading={loadingInitial}
        style={{ width: "100%" }}
      />
      <Modal
        title="Bilet Detayları"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button
            key="download"
            type="primary"
            onClick={() => {
                if (selectedTicket) {
                   downloadTicketPDF(selectedTicket);
                }
      }}
    >
     PDF Olarak İndir
    </Button>
        ]}
      >
        {selectedTicket && (
          <>
            <Row justify="center" style={{ marginBottom: 20 }}>
              <QRCode value={JSON.stringify(selectedTicket)} />
            </Row>

            <Row>
              <Col span={12}><strong>Ad Soyad:</strong> {selectedTicket.customer.name}</Col>
              <Col span={12}><strong>Telefon:</strong> {selectedTicket.customer.phone}</Col>
            </Row>
            <Row>
              <Col span={12}><strong>Email:</strong> {selectedTicket.customer.email}</Col>
              <Col span={12}><strong>Etkinlik:</strong> {selectedTicket.activity.name}</Col>
            </Row>
            <Row>
              <Col span={12}><strong>Etkinlik Yeri:</strong> {selectedTicket.activity.place.title}</Col>
              <Col span={12}><strong>Koltuk:</strong> {selectedTicket.ticketSeat.label}</Col>
            </Row>
          </>
        )}
      </Modal>
    </>
  );
});

export default Tickets;
