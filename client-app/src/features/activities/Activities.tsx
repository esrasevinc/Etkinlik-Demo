import { useStore } from "../../stores/store"
import { observer } from "mobx-react-lite";
import { Button, Flex, message, Popconfirm, Table, TableProps, Tooltip, Typography } from "antd";
import { Activity } from "../../models/activity";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { router } from "../../routes/Routes";
import { toJS } from "mobx";
import { useEffect } from "react";


const Activities = () => {
  const { activityStore } = useStore();
  const { activitiesAll, deleteActivity, loadingInitial, loadActivities } = activityStore;

  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  console.log(toJS(activitiesAll))

  const columns: TableProps<Activity>["columns"] = [
    {
      title: "Etkinlik İsmi",
      dataIndex: "name",
      key: "name",
      render: (text) => <p>{text}</p>,
      width: 300,
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
       
            <Tooltip title="Düzenle">
              <Button type="primary" shape="circle" icon={<EditOutlined />} />
            </Tooltip>
       
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
    <Flex wrap gap='large' vertical>
    <Table
      bordered
      scroll={{ x: 500 }}
      columns={columns}
      dataSource={activitiesAll}
      loading={loadingInitial}
    />
    <Button 
    type="primary" 
    size="large" 
    onClick={() => router.navigate('/etkinlikler/yeni-ekle')}
    style={ { flexBasis : 'auto' }}
    >
      Yeni Ekle
    </Button>
    </Flex>
    </>
    
  );
}

export default observer(Activities);
