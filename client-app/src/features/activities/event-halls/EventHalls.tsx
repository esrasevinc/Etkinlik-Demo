
import { observer } from "mobx-react-lite";
import { Button, ConfigProvider, Flex, Popconfirm, Table, TableProps, Tooltip } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Key, useEffect } from "react";
import { Link } from "react-router-dom";
import locale from 'antd/es/locale/tr_TR';
import { useStore } from "../../../stores/store";
import { EventHall } from "../../../models/eventHall";
import { router } from "../../../routes/Routes";

const EventHalls = observer(() => {
  const { eventHallStore, placeStore } = useStore();
  const { eventHalls, loadEventHalls, deleteEventHall, loadingInitial } = eventHallStore;
  const { places, loadPlaces } = placeStore;

  useEffect(() => {
    loadEventHalls();
    loadPlaces();
  }, [loadEventHalls, loadPlaces]);


  const columns: TableProps<EventHall>["columns"] = [
    {
      title: "Salon İsmi",
      dataIndex: "title",
      key: "title",
      render: (text) => <p>{text}</p>,
      sorter: (a: { title: string }, b: { title: string }) => a.title.localeCompare(b.title),
      width: 250,
    },
    {
      title: "Gösteri Merkezi",
      dataIndex: "place",
      key: "place",
      render: (place) => {
        return place?.title && <p>{place.title.charAt(0).toUpperCase() + place.title.slice(1)}</p>
      },
      filters: places.map(pl => ({
        text: pl.title.charAt(0).toUpperCase() + pl.title.slice(1), 
        value: pl.id,
      })),
      onFilter: (value: boolean | Key, record: EventHall) => record.placeId === value,
      width: 250,
    },
    {
      title: "Yükseklik",
      dataIndex: "rows",
      key: "rows",
      width: 100,
    },
    {
      title: "Genişlik",
      dataIndex: "columns",
      key: "columns",
      width: 100,
    },
    {
      title: "İşlemler",
      dataIndex: "actions",
      render: (_, record) => (
        <Flex wrap="wrap" gap="small">
          <Link to={`duzenle?id=${record.id}`}>
            <Tooltip title="Düzenle">
              <Button type="primary" shape="circle" icon={<EditOutlined />} />
            </Tooltip>
            </Link>
          <Popconfirm
            title="Etlikliği sil"
            description="Bu salonu silmek istediğinize emin misiniz?"
            onConfirm={() => {
              deleteEventHall(record.id as string);

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
      width: 200,
    },
  ];
  return (
    <>
    <Flex wrap gap='large' vertical align="end">
    <Button 
    type="primary" 
    size="large" 
    onClick={() => router.navigate('/salonlar/yeni-ekle')}
    style={ { width : '25%' }}
    >
      Yeni Ekle
    </Button>
    <ConfigProvider locale={locale}>
    <Table
      bordered
      scroll={{ x: 500 }}
      columns={columns}
      dataSource={eventHalls}
      loading={loadingInitial}
      style={ { width : '100%' }}
    />
    </ConfigProvider>
    </Flex>
    </>
    
  );
});

export default EventHalls;
