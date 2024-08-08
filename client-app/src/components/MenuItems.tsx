import { type MenuProps } from "antd";
import { ReadOutlined } from "@ant-design/icons";
import { NavLink } from "react-router-dom";

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: "group"
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

export const items: MenuProps["items"] = [
  
  getItem(
    "ETKİNLİK YÖNETİMİ",
    "etkinlik yönetimi",
    null,
    [
      getItem("Etkinlikler", "etkinlikler", <ReadOutlined />, [
        getItem(<NavLink to={"/etkinlikler"}>Tümünü Listele</NavLink>, "etkinlikler", null),
        getItem(<NavLink to={"/etkinlikler/yeni-ekle"}>Yeni Ekle</NavLink>, "etkinlikler/yeni-ekle", null),
      ]),
      getItem("Etkinlik Türleri", "etkinlik-turleri", <ReadOutlined />, [
        getItem(<NavLink to={"/etkinlik-turleri"}>Tümünü Listele</NavLink>, "etkinlik-turleri", null),
        getItem(<NavLink to={"/etkinlik-turleri/yeni-ekle"}>Yeni Ekle</NavLink>, "etkinlik-turleri/yeni-ekle", null),
      ]),
    ],
    "group"
  ),
];