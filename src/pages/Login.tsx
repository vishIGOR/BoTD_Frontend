import { Button, Form, Grid, Input, message, Space } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import AuthPageSceleton from "../components/AuthPageSceleton";
import NavbarLinkButton from "../components/NavbarLinkButton";
import formStyles from "../commonStyles/forms.module.css";
import { login } from "../utils/requests";

const Login: React.FC = () => {
  const navigate = useNavigate();

  const { lg } = Grid.useBreakpoint();

  const onFinish = (values: { login: string; password: string }) => {
    console.log("Received values:", values);

    login({ ...values })
      .then(() => navigate("/"))
      .catch(() => {
        message.error("Произошла ошибка при отправке запроса к серверу");
      });
  };

  return (
    <AuthPageSceleton
      navbarProps={{
        leftButtons: <div></div>,
        rightButtons: (
          <>
            <NavbarLinkButton path="/login">Вход</NavbarLinkButton>
            <NavbarLinkButton path="/register">Регистрация</NavbarLinkButton>
          </>
        ),
      }}
      contentProps={{
        children: (
          <Form onFinish={onFinish} className={formStyles.auth_form}>
            <Form.Item
              label="Логин"
              name="login"
              rules={[
                { required: true, message: "Пожалуйста, введите логин!" },
              ]}
            >
              <Input size="large" />
            </Form.Item>

            <Form.Item
              label="Пароль"
              name="password"
              rules={[
                { required: true, message: "Пожалуйста, введите пароль!" },
              ]}
            >
              <Input.Password size="large" />
            </Form.Item>

            <Form.Item>
              <Space
                size={10}
                direction={lg ? "horizontal" : "vertical"}
                style={{
                  display: "flex",
                }}
              >
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  style={{ width: lg ? undefined : "100%" }}
                >
                  Войти
                </Button>
                <Button
                  type="default"
                  htmlType="button"
                  onClick={() => {
                    navigate("/register");
                  }}
                  size="large"
                  style={{ width: lg ? undefined : "100%" }}
                >
                  На страницу регистрации
                </Button>
              </Space>
            </Form.Item>
          </Form>
        ),
      }}
    />
  );
};

export default Login;
