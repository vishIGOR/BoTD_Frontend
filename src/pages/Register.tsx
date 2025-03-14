import React from "react";
import { Form, Input, Button, Select, message } from "antd";
import { useNavigate } from "react-router-dom";
import PageSceleton from "../components/PageSceleton";

const Register: React.FC = () => {
  const navigate = useNavigate();

  const onFinish = (values: { login: string; name: string; password: string; role: string }) => {
    console.log("Received values:", values);
    message.success("Регистрация прошла успешно!");
    navigate("/login");
  };

  return (
    <PageSceleton
      navbarProps={{
        leftButtons: <></>,
        rightButtons: <></>,
      }}
      contentProps={{
        breadcrumbItems: [{ title: "Регистрация" }],
        children: (
          <Form onFinish={onFinish}>
            <Form.Item
              label="Логин"
              name="login"
              rules={[{ required: true, message: "Пожалуйста, введите логин!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="ФИО"
              name="name"
              rules={[{ required: true, message: "Пожалуйста, введите ФИО!" }]}
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

            <Form.Item
              label="Роль"
              name="role"
              rules={[{ required: true, message: "Пожалуйста, выберите роль!" }]}
            >
              <Select>
                <Select.Option value="student">Студент</Select.Option>
                <Select.Option value="teacher">Преподаватель</Select.Option>
                <Select.Option value="admin">Администратор</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Зарегистрироваться
              </Button>
            </Form.Item>
          </Form>
        ),
      }}
    />
  );
};

export default Register;
