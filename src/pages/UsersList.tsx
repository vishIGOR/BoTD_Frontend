import {
  DeleteOutlined,
  PlusOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import {
  Button,
  Collapse,
  Input,
  message,
  Select,
  Spin,
  Tabs,
  Tag,
  List,
} from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import MainPageSceleton from "../components/MainPageSceleton";
import NavbarLinkButton from "../components/NavbarLinkButton";
import { useUserProfileContext } from "../context/UserProfileContext";
import { useNavigate } from "react-router-dom";
import { roleToString } from "../models/Role";
import { deleteTokenData } from "../utils/storage";

const { Option } = Select;

interface User {
  id: string;
  name: string;
  login: string;
  role: "STUDENT" | "ADMIN" | "DEAN" | "TEACHER";
  groupNumber?: number;
}

interface Group {
  id: string;
  number: number;
  students: User[]; 
}

const API_URL = "https://j2fyo7-79-136-223-200.ru.tuna.am/api/v1";

const UsersAndGroups = () => {
  const { userProfile } = useUserProfileContext();
  const navigate = useNavigate();

  const [users, setUsers] = useState<User[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingGroups, setLoadingGroups] = useState(true);
  const [newGroupNumber, setNewGroupNumber] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]); 
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    fetchUsers();
    fetchGroups();
  }, []);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      if (!token) {
        throw new Error("Токен авторизации отсутствует.");
      }

      const response = await axios.get(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data && Array.isArray(response.data)) {
        setUsers(response.data);
      } else {
        throw new Error("Некорректные данные пользователей.");
      }
    } catch (error) {
      console.error("Ошибка при загрузке пользователей:", error);
      message.error("Не удалось загрузить пользователей.");
    } finally {
      setLoadingUsers(false);
    }
  };

  const updateUserRole = async (id: string, newRole: "STUDENT" | "ADMIN" | "DEAN" | "TEACHER") => {
    try {
      if (!token) {
        throw new Error("Токен авторизации отсутствует.");
      }

      await axios.patch(
        `${API_URL}/users/${id}`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUsers((prev) =>
        prev.map((user) => (user.id === id ? { ...user, role: newRole } : user))
      );
      message.success(`Роль пользователя изменена на ${newRole}`);
    } catch (error) {
      console.error("Ошибка при изменении роли пользователя:", error);
      message.error("Не удалось изменить роль пользователя.");
    }
  };

  const fetchGroups = async () => {
    setLoadingGroups(true);
    try {
      if (!token) {
        throw new Error("Токен авторизации отсутствует.");
      }

      const response = await axios.get(`${API_URL}/groups`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data && Array.isArray(response.data)) {
        setGroups(response.data);
      } else {
        throw new Error("Некорректные данные групп.");
      }
    } catch (error) {
      console.error("Ошибка при загрузке групп:", error);
      message.error("Не удалось загрузить группы.");
    } finally {
      setLoadingGroups(false);
    }
  };

  const createGroup = async () => {
    if (!newGroupNumber) {
      message.warning("Введите номер группы!");
      return;
    }

    const groupNumber = parseInt(newGroupNumber);
    if (isNaN(groupNumber)) {
      message.warning("Номер группы должен быть числом!");
      return;
    }

    try {
      if (!token) {
        throw new Error("Токен авторизации отсутствует.");
      }

      const response = await axios.post(
        `${API_URL}/groups`,
        { number: groupNumber, students: selectedUsers },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 204) {
        message.success("Группа создана!");

  
        const newGroup = {
          id: Date.now().toString(), 
          number: groupNumber,
          students: users.filter((user) => selectedUsers.includes(user.id)), 
        };
        setGroups((prevGroups) => [...prevGroups, newGroup]);

        setNewGroupNumber("");
        setSelectedUsers([]);
      } else {
        throw new Error(`Не удалось создать группу. Код ответа: ${response.status}`);
      }
    } catch (error) {
      console.error("Ошибка при создании группы:", error);
      message.error("Не удалось создать группу. Проверьте данные и попробуйте снова.");
    }
  };

  const deleteGroup = async (id: string) => {
    try {
      if (!token) {
        throw new Error("Токен авторизации отсутствует.");
      }

      await axios.delete(`${API_URL}/groups/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      message.success("Группа удалена!");
      setGroups((prevGroups) => prevGroups.filter((group) => group.id !== id));
    } catch (error) {
      console.error("Ошибка при удалении группы:", error);
      message.error("Не удалось удалить группу.");
    }
  };

  const collapseItems = users.map((user) => ({
    key: user.id,
    label: `${user.name} (${user.login})`,
    children: (
      <>
        <p>
          <b>Роль:</b> <Tag color="blue">{user.role}</Tag>
        </p>
        <p>
          <b>Группа:</b> {user.groupNumber || "Нет"}
        </p>
        {user.role === "STUDENT" ? (
          <Button
            type="primary"
            icon={<UserSwitchOutlined />}
            onClick={() => updateUserRole(user.id, "TEACHER")}
          >
            Назначить учителем
          </Button>
        ) : user.role === "TEACHER" ? (
          <Button
            danger
            icon={<UserSwitchOutlined />}
            onClick={() => updateUserRole(user.id, "STUDENT")}
          >
            Снять роль учителя
          </Button>
        ) : null}
      </>
    ),
  }));

  const groupCollapseItems = groups.map((group) => ({
    key: group.id,
    label: `Группа №${group.number}`,
    children: (
      <>
        <h3>Участники группы:</h3>
        <List
          dataSource={group.students}
          renderItem={(student) => (
            <List.Item>
              {student.name} ({student.login})
            </List.Item>
          )}
        />
        <Button
          icon={<DeleteOutlined />}
          danger
          onClick={() => deleteGroup(group.id)}
        >
          Удалить группу
        </Button>
      </>
    ),
  }));

  const tabItems = [
    {
      key: "1",
      label: "Пользователи",
      children: (
        <>
          <h1>Список пользователей</h1>
          {loadingUsers ? (
            <Spin tip="Загрузка..." size="large" fullscreen />
          ) : (
            <Collapse accordion items={collapseItems} />
          )}
        </>
      ),
    },
    {
      key: "2",
      label: "Группы",
      children: (
        <>
          <h1>Список групп</h1>
          <Input
            placeholder="Введите номер группы"
            type="number"
            value={newGroupNumber}
            onChange={(e) => setNewGroupNumber(e.target.value)}
            style={{ width: 200, marginRight: 10 }}
          />
          <Select
            mode="multiple"
            placeholder="Выберите пользователей"
            value={selectedUsers}
            onChange={(values) => setSelectedUsers(values)}
            style={{ width: "100%", marginBottom: 16 }}
          >
            {users
              .filter((user) => user.role === "STUDENT") 
              .map((user) => (
                <Option key={user.id} value={user.id}>
                  {user.name} ({user.login})
                </Option>
              ))}
          </Select>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={createGroup}
          >
            Создать группу
          </Button>

          {loadingGroups ? (
            <Spin tip="Загрузка..." size="large" fullscreen />
          ) : (
            <Collapse accordion items={groupCollapseItems} />
          )}
        </>
      ),
    },
  ];

  return (
    <MainPageSceleton
      navbarProps={{
        leftButtons: (
          <>
            <NavbarLinkButton path="/">Заявки</NavbarLinkButton>
            <NavbarLinkButton path="/users">
              Пользователи и группы
            </NavbarLinkButton>
          </>
        ),
        rightButtons: (
          <>
            <div style={{ color: "white" }}>{`${
              userProfile?.role
                ? roleToString(userProfile?.role)
                : "Пользователь"
            } ${userProfile?.name}`}</div>
            <Button
              style={{ color: "white" }}
              type="link"
              onClick={() => {
                deleteTokenData();
                navigate("/login");
              }}
            >
              Выход
            </Button>
          </>
        ),
      }}
      contentProps={{
        breadcrumbItems: [{ title: "Пользователи и группы" }],
        children: <Tabs defaultActiveKey="1" items={tabItems} />,
      }}
    />
  );
};

export default UsersAndGroups;