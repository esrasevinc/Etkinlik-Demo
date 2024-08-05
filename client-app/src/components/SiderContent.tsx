import { Avatar, Menu, Typography } from "antd";
import { items } from "./MenuItems";


const { Title } = Typography;

const SiderContent = () => {
  return (
    <div className="sider">
      <div className="sider-logo">
        <img src="/assets/bb-logo.png" alt="Beylikdüzü Belediyesi Logo" height={50} />
        <Avatar
          className="avatar"
          size={80}
          src={<img src={"/assets/avatar.jpg"} alt="avatar" />}
        />
      </div>
      <Title className="title" level={5}>
        Esra Sevinç
      </Title>
      <Menu items={items} theme="dark" mode="inline" /> 
    </div>
  );
};

export default SiderContent;