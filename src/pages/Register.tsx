import { Button, Form, Grid, Input, Select, Space, message } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import AuthPageSceleton from "../components/AuthPageSceleton";
import NavbarLinkButton from "../components/NavbarLinkButton";
import formStyles from "../commonStyles/forms.module.css";
import { register } from "../utils/requests";
import { isRole, Role } from "../models/User";

const Register: React.FC = () => {
  const navigate = useNavigate();

  const { lg } = Grid.useBreakpoint();

  const onFinish = async (values: {
    login: string;
    name: string;
    password: string;
    role: string;
  }) => {
    console.log("Received values:", values);

    if (!isRole(values.role) ) {
      return;
    }
    
    const tokenData = await register({...values, role: values.role as Role});

    console.log(tokenData);
    navigate("/");
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
              label="ФИО"
              name="name"
              rules={[{ required: true, message: "Пожалуйста, введите ФИО!" }]}
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

            <Form.Item
              label="Роль"
              name="role"
              rules={[
                { required: true, message: "Пожалуйста, выберите роль!" },
              ]}
            >
              <Select size="large">
                <Select.Option value="STUDENT">Студент</Select.Option>
                <Select.Option value="TEACHER">Преподаватель</Select.Option>
              </Select>
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
                  Зарегистрироваться
                </Button>
                <Button
                  type="default"
                  htmlType="button"
                  onClick={() => {
                    navigate("/login");
                  }}
                  size="large"
                  style={{ width: lg ? undefined : "100%" }}
                >
                  На страницу входа
                </Button>
              </Space>
            </Form.Item>
          </Form>
        ),
      }}
    />
  );
};

export default Register;
