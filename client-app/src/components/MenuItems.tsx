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
    "GENEL TANIMLAR",
    "genel tanımlar",
    null,
    [
      getItem("Etkinlik Türleri", "etkinlik-turleri", <ReadOutlined />, [
        getItem(<NavLink to={"/etkinlik-turleri"}>Tümünü Listele</NavLink>, "etkinlik-turleri", null),
        getItem(<NavLink to={"/etkinlik-turleri/yeni-ekle"}>Yeni Ekle</NavLink>, "etkinlik-turleri/yeni-ekle", null),
      ]),
      getItem("Etkinlik Yerleri", "etkinlik-yerleri", <ReadOutlined />, [
        getItem(<NavLink to={"/etkinlik-yerleri"}>Tümünü Listele</NavLink>, "etkinlik-yerleri", null),
        getItem(<NavLink to={"/etkinlik-yerleri/yeni-ekle"}>Yeni Ekle</NavLink>, "etkinlik-yerleri/yeni-ekle", null),
      ])
    ],
    "group"
  ),
  getItem(
    "ETKİNLİK YÖNETİMİ",
    "etkinlik yönetimi",
    null,
    [
      getItem("Etkinlikler", "etkinlikler", <ReadOutlined />, [
        getItem(<NavLink to={"/etkinlikler"}>Tümünü Listele</NavLink>, "etkinlikler", null),
        getItem(<NavLink to={"/etkinlikler/yeni-ekle"}>Yeni Ekle</NavLink>, "etkinlikler/yeni-ekle", null),
      ]),
    ],
    "group"
  ),
  getItem(
    "YÖNETİCİ İŞLEMLERİ",
    "yönetici işlemleri",
    null,
    [
      getItem("Kullanıcılar", "kullanicilar", <ReadOutlined />, [
        getItem(<NavLink to={"/kullanicilar"}>Tümünü Listele</NavLink>, "kullanicilar", null),
        getItem(<NavLink to={"/kullanicilar/yeni-ekle"}>Yeni Ekle</NavLink>, "kullanicilar/yeni-ekle", null),
      ]),
    ],
    "group"
  ),
];