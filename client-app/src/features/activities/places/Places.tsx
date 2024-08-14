import { Button, Flex, Popconfirm, Table, TableProps, Tooltip } from "antd";
import { useStore } from "../../../stores/store";
import { Link } from "react-router-dom";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import LoadingComponent from "../../../layout/LoadingComponent";
import { Place } from "../../../models/place";

const Places = observer(() => {
  const { placeStore } = useStore();
  const { places, deletePlace, loadPlaces, loadingInitial } = placeStore;

  useEffect(() => {
    loadPlaces();
  }, [loadPlaces]);


  if (loadingInitial) return <LoadingComponent />;

  const columns: TableProps<Place>["columns"] = [
    {
      title: "Etkinlik Yeri",
      dataIndex: "title",
      key: "title",
      render: (text) => <p>{text}</p>,
      sorter: (a, b) => a.title.localeCompare(b.title),
      width: 300,
    },
    {
      title: "İşlemler",
      dataIndex: "actions",
      render: (_, record) => (
        <Flex wrap="wrap" gap="small">
          <Link to={`duzenle?placeId=${record.id}`}>
            <Tooltip title="Düzenle">
              <Button type="primary" shape="circle" icon={<EditOutlined />} />
            </Tooltip>
          </Link>
          <Popconfirm
            title="Etkinlik yerini silmek istediğinize emin misiniz?"
            onConfirm={() => deletePlace(record.id!)}
            okText="Evet"
            cancelText="Hayır"
          >
            <Button type="primary" danger shape="circle" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Flex>
      ),
      width: 100,
    },
  ];

  return (
    <Table
      columns={columns}
      scroll={{ x: 500 }}
      dataSource={places}
    />
  );
});

export default Places;
