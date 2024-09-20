import { Button, Flex, Popconfirm, Table, TableProps, Tooltip } from "antd";
import { Link } from "react-router-dom";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useStore } from "../../stores/store";
import LoadingComponent from "../../layout/LoadingComponent";
import { Category } from "../../models/category";
import { router } from "../../routes/Routes";


const Categories = observer(() => {
  const { categoryStore } = useStore();
  const { categories, deleteCategory, loadCategories, loadingInitial } = categoryStore;

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);


  if (loadingInitial) return <LoadingComponent />;

  const columns: TableProps<Category>["columns"] = [
    {
      title: "Etkinlik Türü",
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
        <Flex wrap gap='small'>
          <Link to={`duzenle?categoryId=${record.id}`}>
            <Tooltip title="Düzenle">
              <Button type="primary" shape="circle" icon={<EditOutlined />} />
            </Tooltip>
          </Link>
          <Popconfirm
            title="Kategoriyi silmek istediğinize emin misiniz?"
            onConfirm={() => deleteCategory(record.id!)}
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
    <>
    <Flex wrap gap='large' vertical align="end">
    <Button 
    type="primary" 
    size="large" 
    onClick={() => router.navigate('/etkinlik-turleri/yeni-ekle')}
    style={ { width : '25%' }}
    >
      Yeni Ekle
    </Button>
    <Table
      bordered
      scroll={{ x: 500 }}
      columns={columns}
      dataSource={categories}
      loading={loadingInitial}
      style={ { width : '100%' }}
    />
    </Flex>
    
    </>
  );
});

export default Categories;
