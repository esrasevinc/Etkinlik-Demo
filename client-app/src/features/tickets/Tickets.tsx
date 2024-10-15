import { Button, Col, Modal, Row, Table, TableProps, Tooltip } from "antd";
import { useStore } from "../../stores/store";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import LoadingComponent from "../../layout/LoadingComponent";
import { Ticket } from "../../models/ticket";
import { LinkOutlined } from "@ant-design/icons";
import { QRCodeCanvas } from "qrcode.react"; 
import jsPDF from "jspdf";

const Tickets = observer(() => {
  const { ticketStore } = useStore();
  const { tickets, loadTickets, loadingInitial } = ticketStore;
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null); 
  const [isModalVisible, setIsModalVisible] = useState(false); 

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

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
      width: 200,
    },
    {
      title: "Telefon Numarası",
      dataIndex: "customer",
      key: "customer",
      render: (customer) => <p>{customer.phone}</p>,
      width: 200,
    },
    {
      title: "Email",
      dataIndex: "customer",
      key: "customer",
      render: (customer) => <p>{customer.email}</p>,
      width: 200,
    },
    {
      title: "Etkinlik Adı",
      dataIndex: "activity",
      key: "activity",
      render: (activity) => <p>{activity.name}</p>,
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
      title: "Görüntüle",
      dataIndex: "actions",
      render: (_, record) => (
        <Tooltip title="Bileti Görüntüle">
          <Button
            type="primary"
            shape="circle"
            icon={<LinkOutlined />}
            onClick={() => showModal(record)} 
          />
        </Tooltip>
      ),
      width: 200,
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
              <QRCodeCanvas value={JSON.stringify(selectedTicket)} />
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
