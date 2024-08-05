import { Outlet } from "react-router-dom";
import { Layout, theme } from "antd";

const { Header, Content, Footer, Sider } = Layout;
import "./styles.css";
import SiderContent from "../components/SiderContent";

function App() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();


  return (
    <>
      <Layout hasSider style={{ minHeight: "100vh" }}>
        <Sider
          breakpoint="lg"
          collapsedWidth="0"
          width={275}
          style={{
            height: "100vh",
            position: "fixed",
            left: 0,
            top: 0,
            bottom: 0,
          }}
        >
          <SiderContent />
        </Sider>
        <Layout>
          <Header style={{ padding: 0, background: colorBgContainer }} />
          <Content style={{ margin: "24px 16px 0" }}>
            <div
              style={{
                padding: 24,
                minHeight: 360,
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
              }}
            >
              <Outlet />
            </div>
          </Content>
          <Footer style={{ textAlign: "center" }}>
            Beylikdüzü Belediyesi ©{new Date().getFullYear()} Bilgi İşlem Müdürlüğü
          </Footer>
        </Layout>
      </Layout>
    </>
  );
}

export default App;