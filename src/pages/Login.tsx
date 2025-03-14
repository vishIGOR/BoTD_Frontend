import React from "react";
import { Form, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import PageSceleton from "../components/PageSceleton";

const Login: React.FC = () => {
  const navigate = useNavigate();

  const onFinish = (values: { username: string; password: string }) => {
    console.log("Received values:", values);
    message.success("Вход выполнен успешно!");
    navigate("/");
  };

  return (
    <PageSceleton
      navbarProps={{
        leftButtons: <></>,
        rightButtons: <></>,
      }}
      contentProps={{
        breadcrumbItems: [{ title: "Вход" }],
        children: (
          <Form onFinish={onFinish}>
            <Form.Item
              label="Логин"
              name="username"
              rules={[{ required: true, message: "Пожалуйста, введите логин!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Пароль"
              name="password"
              rules={[{ required: true, message: "Пожалуйста, введите пароль!" }]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Войти
              </Button>
            </Form.Item>
          </Form>
        ),
      }}
    />
  );
};

export default Login;