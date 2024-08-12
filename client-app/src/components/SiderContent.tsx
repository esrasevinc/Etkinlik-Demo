import { Avatar, Button, Menu, Typography } from "antd";
import { items } from "./MenuItems";
import { LogoutOutlined } from "@ant-design/icons";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";

const { Title } = Typography;

type Props = {
  collapseHandler: () => void;
};

const SiderContent = ({ collapseHandler }: Props) => {

  return (
    <SimpleBar style={{ height: "100%" }}>
      <div className="sider">
        <div className="sider-logo">
          <img src="/assets/bb-logo.png" alt="Beylikdüzü Belediyesi Logo" width={250}/>
          <Avatar
            className="avatar"
            size={80}
            src={<img src={"/assets/avatar.jpg"} alt="avatar" />}
          />
        </div>
        <Title className="title" level={5}>
          Esra SEVİNÇ
        </Title>
        <Menu items={items} theme="dark" mode="inline" onClick={() => collapseHandler()} />
        <Button
          icon={<LogoutOutlined />}
          type="link"
          danger
          style={{  display: "flex", marginLeft: "13px", alignItems: "center" }}
        >
          Çıkış Yap
        </Button>
      </div>
    </SimpleBar>
  );
};

export default SiderContent;