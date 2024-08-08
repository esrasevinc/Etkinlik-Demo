import { Button, Flex, Popconfirm, Table, TableProps, Tooltip } from "antd";
import { useStore } from "../../../stores/store";
import { Category } from "../../../models/category";
import { Link } from "react-router-dom";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";

const Categories = observer(() => {
  const { categoryStore } = useStore();
  const { categories, deleteCategory, categoriesRegistry, loadCategories } = categoryStore;

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);


  if (categoriesRegistry.size <= 0) return <div>Etkinlik türü bulunamadı.</div>;

  const columns: TableProps<Category>["columns"] = [
    {
      title: "Etlinlik Türü",
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
    <Table
      columns={columns}
      scroll={{ x: 500 }}
      dataSource={categories}
    />
  );
});

export default Categories;
