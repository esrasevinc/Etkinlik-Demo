import { Alert, Form, Input } from "antd";
import type { FormProps } from "antd";
import { UserFormValues } from "../../models/user";
import { useStore } from "../../stores/store";
import { Navigate, useLocation } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { AxiosError } from "axios";

const Login = observer(() => {
  const { userStore } = useStore();
  const location = useLocation();
  const [error, setError] = useState<string>("");

  const onFinish: FormProps<UserFormValues>["onFinish"] = (values) => {
    userStore.login(values).catch((error: AxiosError) => {
      if (error.response?.status === 401) {
        setError("Kullanıcı adı veya şifre hatalı!");
      }
    });
  };

  const onFinishFailed: FormProps<UserFormValues>["onFinishFailed"] = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  if (userStore.user !== null) {
    return <Navigate to="/" state={{ from: location }} />;
  }

  return (
    <div className="login-main">
      <div className="login-left">
        <img src={"/assets/bb-logo.png"} alt="" />
      </div>
      <div className="login-right">
        <div className="login-right-container">
          <div className="login-center">
            <h2>Beylikdüzü Belediyesi Kültür İşleri Müdürlüğü</h2>
            <p>Etkinlik Yönetim Sistemi</p>
            <Form
              name="basic"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
              onValuesChange={() => setError("")}
            >
              <Form.Item<UserFormValues>
                name="email"
                rules={[{ required: true, message: "Mail adresinizi girin!" }]}
              >
                <Input type="email" placeholder="E-Posta" />
              </Form.Item>
              <div className="pass-input-div">
                <Form.Item<UserFormValues>
                  name="password"
                  rules={[{ required: true, message: "Şifrenizi girin!" }]}
                >
                  <Input type={"password"} placeholder="Şifre" />
                </Form.Item>
              </div>
              {error && <Alert message="Hata" description={error} type="error" />}
              <div className="login-center-buttons">
                <button type="submit" id="login-button">
                  Giriş Yap
                </button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Login;
