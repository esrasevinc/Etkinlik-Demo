import { useStore } from "../../stores/store"
import { observer } from "mobx-react-lite";
import { Button, Flex, message, Popconfirm, Table, TableProps, Tooltip, Typography } from "antd";
import { Activity } from "../../models/activity";
import { Link } from "react-router-dom";
import { DeleteOutlined, EditOutlined, PictureOutlined } from "@ant-design/icons";



const Activities = () => {
  const { activityStore } = useStore();
  const { deleteActivity } = activityStore;

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
          <Link to={`galeri?newsId=${record.id}`}>
            <Tooltip title="Galeri">
              <Button type="default" shape="circle" icon={<PictureOutlined />} />
            </Tooltip>
          </Link>
          <Link to={`duzenle?newsId=${record.id}`}>
            <Tooltip title="Düzenle">
              <Button type="primary" shape="circle" icon={<EditOutlined />} />
            </Tooltip>
          </Link>
          <Popconfirm
            title="Haberi sil"
            description="Bu haberi silmek istediğinize emin misiniz?"
            onConfirm={() => {
              deleteActivity(record.id as string);
              message.success("Haber başarıyla silindi.");
            }}
            okText="Sil"
            cancelText="İptal"
          >
            <Button type="primary" danger shape="circle" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Flex>
      ),
      width: 250,
    },
  ];
  return (
    <Table
      bordered
      scroll={{ x: 500 }}
      columns={columns}
      dataSource={activityStore.activities}
    />
  );
}

export default observer(Activities);
