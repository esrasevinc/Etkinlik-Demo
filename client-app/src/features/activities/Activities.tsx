import { useStore } from "../../stores/store"
import { observer } from "mobx-react-lite";
import { Button, Flex, message, Popconfirm, Table, TableProps, Tooltip, Typography } from "antd";
import { Activity } from "../../models/activity";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { router } from "../../routes/Routes";
import { useEffect } from "react";
import { Link } from "react-router-dom";
//import { format } from "date-fns";

const Activities = observer(() => {
  const { activityStore } = useStore();
  const { activitiesAll, deleteActivity, loadingInitial, loadActivities } = activityStore;

  useEffect(() => {
    loadActivities();
  }, [loadActivities]);


  const columns: TableProps<Activity>["columns"] = [
    {
      title: "Etkinlik İsmi",
      dataIndex: "name",
      key: "name",
      render: (text) => <p>{text}</p>,
      width: 250,
    },
    {
      title: "Etkinlik Yeri",
      dataIndex: "location",
      key: "location",
      render: (text) => <p>{text}</p>,
      width: 200,
    },
    {
      title: "Tarih ve Saat",
      dataIndex: "date",
      key: "date",
      //render: (text) => <p>{format(text as Date, "dd.MM.yyyy HH:mm")}</p>,
      render: (text) => <p>{text}</p>,
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
              message.success("Etkinlik başarıyla silindi.");
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
      Yeni Etkinlik Ekle
    </Button>
    <Table
      bordered
      scroll={{ x: 500 }}
      columns={columns}
      dataSource={activitiesAll}
      loading={loadingInitial}
      style={ { width : '100%' }}
    />
    
    </Flex>
    </>
    
  );
});

export default Activities;
