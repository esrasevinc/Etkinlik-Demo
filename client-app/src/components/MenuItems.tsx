import { type MenuProps } from "antd";
import { ReadOutlined } from "@ant-design/icons";
import { NavLink } from "react-router-dom";
import  useAuth  from "../hooks/useAuth";

type MenuItem = Required<MenuProps>["items"][number];

const menuItemGroupSpacing = {
  marginBottom: "10px", 
};


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
    style: type === "group" ? menuItemGroupSpacing : undefined,
  } as MenuItem;
}

export function MenuItems(): MenuProps["items"] {
  const user = useAuth();
  const userRole = user?.roles.includes("Admin") ? "Admin" : "User";

  const items: MenuProps["items"] = [
    getItem(
      "GENEL TANIMLAR",
      "genel tanımlar",
      null,
      [
        getItem("Gösteri Merkezleri", "gosteri-merkezleri", <ReadOutlined />, [
          getItem(<NavLink to={"/gosteri-merkezleri"}>Tümünü Listele</NavLink>, "gosteri-merkezleri", null),
          getItem(<NavLink to={"/gosteri-merkezleri/yeni-ekle"}>Yeni Ekle</NavLink>, "gosteri-merkezleri/yeni-ekle", null),
        ]),
        getItem("Salonlar", "salonlar", <ReadOutlined />, [
          getItem(<NavLink to={"/salonlar"}>Tümünü Listele</NavLink>, "salonlar", null),
          getItem(<NavLink to={"/salonlar/yeni-ekle"}>Yeni Ekle</NavLink>, "salonlar/yeni-ekle", null),
        ]),
        getItem("Etkinlik Türleri", "etkinlik-turleri", <ReadOutlined />, [
          getItem(<NavLink to={"/etkinlik-turleri"}>Tümünü Listele</NavLink>, "etkinlik-turleri", null),
          getItem(<NavLink to={"/etkinlik-turleri/yeni-ekle"}>Yeni Ekle</NavLink>, "etkinlik-turleri/yeni-ekle", null),
        ]),
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
    
    userRole === "Admin" ? getItem(
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
    ) : null
  ];

  return items;
}
