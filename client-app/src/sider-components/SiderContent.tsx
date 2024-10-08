import { Avatar, Button, Menu, Typography } from "antd";
import { useStore } from "../stores/store";
import { LogoutOutlined } from "@ant-design/icons";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import { MenuItems } from "./MenuItems";

const { Title } = Typography;

type Props = {
  collapseHandler: () => void;
};

const SiderContent = ({ collapseHandler }: Props) => {
  const { userStore } = useStore();
  const { user } = userStore;
  const items = MenuItems();

  return (
    <SimpleBar style={{ height: "100%" }}>
      <div className="sider">
        <div className="sider-logo">
          <img src="/assets/bb-logo.png" alt="Beylikdüzü Belediyesi Logo" width="250px"/>
          <Avatar
            className="avatar"
            size={80}
            src={<img src={"/assets/avatar.jpg"} alt="avatar" />}
          />
        </div>
        <Title className="title" level={5}>
          {user?.displayName ? user.displayName : user?.email}
        </Title>
        <Menu  items={items} theme="dark" mode="inline" onClick={() => collapseHandler()} />
        <Button
          icon={<LogoutOutlined />}
          type="link"
          danger
          onClick={() => userStore.logout()}
          style={{ display: "flex", marginLeft: "13px", alignItems: "center" }}
        >
          Çıkış Yap
        </Button>
      </div>
    </SimpleBar>
  );
};

export default SiderContent;
