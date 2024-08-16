import { useStore } from "../../stores/store"
import { observer } from "mobx-react-lite";
import { Button, ConfigProvider, Flex, Popconfirm, Table, TableProps, Tooltip, Typography } from "antd";
import { Activity } from "../../models/activity";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { router } from "../../routes/Routes";
import { Key, useEffect } from "react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import locale from 'antd/es/locale/tr_TR';

const Activities = observer(() => {
  const { activityStore, categoryStore, placeStore } = useStore();
  const { activitiesAll, deleteActivity, loadingInitial, loadActivities  } = activityStore;
  const { categories, loadCategories } = categoryStore;
  const { places, loadPlaces } = placeStore;

  useEffect(() => {
    loadActivities();
    loadCategories();
    loadPlaces();
  }, [loadActivities, loadCategories, loadPlaces]);


  const columns: TableProps<Activity>["columns"] = [
    {
      title: "Etkinlik İsmi",
      dataIndex: "name",
      key: "name",
      render: (text) => <p>{text}</p>,
      sorter: (a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name),
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
      onFilter: (value: boolean | Key, record: Activity) => record.placeId === value,
      width: 200,
    },
    {
      title: "Etkinlik Türü",
      dataIndex: "category",
      key: "category",
      render: (category) => {
        return category?.title && <p>{category.title.charAt(0).toUpperCase() + category.title.slice(1)}</p>
      },
      filters: categories.map(cat => ({
        text: cat.title.charAt(0).toUpperCase() + cat.title.slice(1), 
        value: cat.id,
      })),
      onFilter: (value: boolean | Key, record: Activity) => record.categoryId === value,
      width: 200,
    },
  {
        title: "Tarih ve Saat",
        dataIndex: "date",
        key: "date",
        render: (date) => {
         return dayjs.utc((date)).tz('Europe/Istanbul').format('DD.MM.YYYY HH:mm')
        },
        sorter: (a: Activity, b: Activity) => {
          const dateA = dayjs.utc(a.date).tz('Europe/Istanbul');
          const dateB = dayjs.utc(b.date).tz('Europe/Istanbul');
          return dateA.isBefore(dateB) ? -1 : dateA.isAfter(dateB) ? 1 : 0;
        },
        width: 200,
      }, 
    {
      title: "Durum",
      dataIndex: "isActive",
      key: "isActive",
      render: (value) => (
        <>
          {value ? (
            <Typography.Text type="success" strong>
              Aktif
            </Typography.Text>
          ) : (
            <Typography.Text type="danger" strong>
              Pasif
            </Typography.Text>
          )}
        </>
      ),
      filters: [
        { text: 'Aktif', value: true },
        { text: 'Pasif', value: false },
      ],
      onFilter: (value: boolean | Key, record: Activity) => record.isActive === value,
      
      width: 100,
    },
    {
      title: "İşlemler",
      dataIndex: "actions",
      render: (_, record) => (
        <Flex wrap="wrap" gap="small">
          <Link to={`duzenle?activityId=${record.id}`}>
            <Tooltip title="Düzenle">
              <Button type="primary" shape="circle" icon={<EditOutlined />} />
            </Tooltip>
            </Link>
          <Popconfirm
            title="Etlikliği sil"
            description="Bu enkinliği silmek istediğinize emin misiniz?"
            onConfirm={() => {
              deleteActivity(record.id as string);

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
      width: 250,
    },
  ];
  return (
    <>
    <Flex wrap gap='large' vertical align="end">
    <Button 
    type="primary" 
    size="large" 
    onClick={() => router.navigate('/etkinlikler/yeni-ekle')}
    style={ { width : '25%' }}
    >
      Yeni Ekle
    </Button>
    <ConfigProvider locale={locale}>
    <Table
      bordered
      scroll={{ x: 500 }}
      columns={columns}
      dataSource={activitiesAll}
      loading={loadingInitial}
      style={ { width : '100%' }}
    />
    </ConfigProvider>
    </Flex>
    </>
    
  );
});

export default Activities;
