import { Button, Flex, Table, TableProps } from "antd";
import { useStore } from "../../stores/store";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import LoadingComponent from "../../layout/LoadingComponent";
import { router } from "../../routes/Routes";
import { Ticket } from "../../models/ticket";

const Tickets = observer(() => {
  const { ticketStore } = useStore();
  const { tickets, loadTickets, loadingInitial } = ticketStore;

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);


  if (loadingInitial) return <LoadingComponent />;

  const columns: TableProps<Ticket>["columns"] = [
    {
      title: "Bilet ID",
      dataIndex: "id",
      key: "id",
      render: (text) => <p>{text}</p>,
      width: 300,
    },
    {
      title: "Ad Soyad",
      dataIndex: "customer",
      key: "customer",
      render: (customer) => {
        return customer?.name && <p>{customer.name.charAt(0).toUpperCase() + customer.name.slice(1)}</p>
      },
      width: 300,
    },
    {
      title: "Telefon Numarası",
      dataIndex: "customer",
      key: "customer",
      render: (customer) => <p>{customer.phone}</p>,
      width: 300,
    },
    {
      title: "Email",
      dataIndex: "customer",
      key: "customer",
      render: (customer) => <p>{customer.email}</p>,
      width: 300,
    },
    {
      title: "Etkinlik",
      dataIndex: "activity",
      key: "activity",
      render: (activity) => <p>{activity.name}</p>,
      width: 300,
    },
    {
      title: "Koltuk",
      dataIndex: "ticketSeat",
      key: "ticketSeat",
      render: (ticketseat) => <p>{ticketseat.label}</p>,
      width: 300,
    },
  ];

  return (
    <>
    <Flex wrap gap='large' vertical align="end">
    <Button 
    type="primary" 
    size="large" 
    onClick={() => router.navigate('/bilet-olustur')}
    style={ { width : '25%' }}
    >
      Bilet Oluştur
    </Button>
    <Table
      bordered
      scroll={{ x: 500 }}
      columns={columns}
      dataSource={tickets}
      loading={loadingInitial}
      style={ { width : '100%' }}
    />
    </Flex>
    
    </>
  );
});

export default Tickets;
