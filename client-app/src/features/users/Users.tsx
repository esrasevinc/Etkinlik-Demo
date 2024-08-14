import { Button, Flex, Popconfirm, Table, TableProps, Tooltip } from "antd";
import { Link } from "react-router-dom";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useEffect } from "react";
import { User } from "../../models/user";
import { useStore } from "../../stores/store";
import LoadingComponent from "../../layout/LoadingComponent";
import { observer } from "mobx-react-lite";


const Users = () => {

  const { userStore } = useStore();
  const { usersAll, deleteUser, loadUsers, loadingInitial } = userStore;

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);


  if (loadingInitial) return <LoadingComponent />;
  


  const columns: TableProps<User>["columns"] = [
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text) => <p>{text}</p>,
      sorter: (a, b) => a.email.localeCompare(b.email),
      width: 300,
    },
    {
      title: "Kullanıcı Adı",
      dataIndex: "userName",
      key: "userName",
      render: (text) => <p>{text}</p>,
      width: 300,
    },
    {
      title: "Ad Soyad",
      dataIndex: "displayName",
      key: "displayName",
      render: (text) => <p>{text}</p>,
      width: 300,
    },
    {
      title: "İşlemler",
      dataIndex: "actions",
      render: (_, record) => (
        <Flex wrap="wrap" gap="small">
          <Link to={`duzenle?userId=${record.id}`}>
            <Tooltip title="Düzenle">
              <Button type="primary" shape="circle" icon={<EditOutlined />} />
            </Tooltip>
          </Link>
          <Popconfirm
            title="Kullanıcıyı silmek istediğinize emin misiniz?"
            onConfirm={() => deleteUser(record.id!)}
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
      dataSource={usersAll}
    />
  );
};

export default observer(Users);
