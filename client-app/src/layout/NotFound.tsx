import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <Result
      status="404"
      title="404"
      subTitle="Aradığınız sayfa bulunamadı."
      extra={
        <Button type="primary" onClick={() => navigate("/")}>
          Anasayfaya Dön
        </Button>
      }
    />
  );
};

export default NotFound;