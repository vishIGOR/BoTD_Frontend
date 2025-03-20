import {
  DeleteOutlined,
  EditOutlined,
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
const { Panel } = Collapse;

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
}

const UsersAndGroups = () => {
  const { userProfile } = useUserProfileContext();
  const navigate = useNavigate();

  const [users, setUsers] = useState<User[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingGroups, setLoadingGroups] = useState(true);
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [groupFilter, setGroupFilter] = useState<number | null>(null);
  const [searchName, setSearchName] = useState<string>("");
  const [newGroupNumber, setNewGroupNumber] = useState("");
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    fetchUsers();
    fetchGroups();
  }, []);

  const mockUsers: User[] = [
    {
      id: "1",
      name: "Иван Иванов",
      login: "ivanov",
      role: "STUDENT",
      groupNumber: 101,
    },
    {
      id: "2",
      name: "Мария Смирнова",
      login: "smirnova",
      role: "TEACHER",
      groupNumber: 102,
    },
    {
      id: "3",
      name: "Алексей Кузнецов",
      login: "kuznetsov",
      role: "STUDENT",
      groupNumber: 103,
    },
  ];

  const mockGroups: Group[] = [
    { id: "g1", number: 101 },
    { id: "g2", number: 102 },
    { id: "g3", number: 103 },
  ];

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const response = await axios.get("https://api.example.com/users", {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          name: searchName || undefined,
          groupNumber: groupFilter || undefined,
          role: roleFilter || undefined,
        },
      });
      setUsers(response.data);
    } catch (error) {
      message.warning("API не работает, загружены тестовые данные.");
      setUsers(mockUsers);
    } finally {
      setLoadingUsers(false);
    }
  };

  const updateUserRole = async (id: string, newRole: "STUDENT" | "TEACHER") => {
    try {
      await axios.patch(
        `https://api.example.com/users/${id}`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers((prev) =>
        prev.map((user) => (user.id === id ? { ...user, role: newRole } : user))
      );
      message.success(`Роль пользователя изменена на ${newRole}`);
    } catch (error) {
      message.warning("API не работает, меняем локально.");
      setUsers((prev) =>
        prev.map((user) => (user.id === id ? { ...user, role: newRole } : user))
      );
    }
  };

  const fetchGroups = async () => {
    setLoadingGroups(true);
    try {
      const response = await axios.get("https://api.example.com/groups", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGroups(response.data);
    } catch (error) {
      message.warning("API не работает, загружены тестовые данные.");
      setGroups(mockGroups);
    } finally {
      setLoadingGroups(false);
    }
  };

  const createGroup = async () => {
    if (!newGroupNumber) {
      message.warning("Введите номер группы!");
      return;
    }
    try {
      await axios.post(
        "https://api.example.com/groups",
        { number: parseInt(newGroupNumber), students: [] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success("Группа создана!");
      fetchGroups();
    } catch (error) {
      message.warning("API не работает, добавляем тестовые данные.");
      setGroups((prev) => [
        ...prev,
        { id: `mock-${Date.now()}`, number: parseInt(newGroupNumber) },
      ]);
    }
  };

  const deleteGroup = async (id: string) => {
    try {
      await axios.delete(`https://api.example.com/groups/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success("Группа удалена!");
      fetchGroups();
    } catch (error) {
      message.warning("API не работает, удаляем локально.");
      setGroups((prev) => prev.filter((group) => group.id !== id));
    }
  };

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
        children: (
          <Tabs defaultActiveKey="1">
            {}
            <Tabs.TabPane tab="Пользователи" key="1">
              <h1>Список пользователей</h1>
              {loadingUsers ? (
                <Spin tip="Загрузка..." />
              ) : (
                <Collapse accordion>
                  {users.map((user) => (
                    <Panel
                      key={user.id}
                      header={`${user.name} (${user.login})`}
                    >
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
                    </Panel>
                  ))}
                </Collapse>
              )}
            </Tabs.TabPane>

            {}
            <Tabs.TabPane tab="Группы" key="2">
              <h1>Список групп</h1>

              <Input
                placeholder="Введите номер группы"
                type="number"
                onChange={(e) => setNewGroupNumber(e.target.value)}
                style={{ width: 200, marginRight: 10 }}
              />
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={createGroup}
              >
                Создать группу
              </Button>

              {loadingGroups ? (
                <Spin tip="Загрузка..." />
              ) : (
                <Collapse accordion>
                  {groups.map((group) => (
                    <Panel key={group.id} header={`Группа №${group.number}`}>
                      <Button
                        icon={<EditOutlined />}
                        style={{ marginRight: 8 }}
                        onClick={() =>
                          message.info("Редактирование групп пока не доступно")
                        }
                      >
                        Редактировать
                      </Button>
                      <Button
                        icon={<DeleteOutlined />}
                        danger
                        onClick={() => deleteGroup(group.id)}
                      >
                        Удалить
                      </Button>
                    </Panel>
                  ))}
                </Collapse>
              )}
            </Tabs.TabPane>
          </Tabs>
        ),
      }}
    />
  );
};

export default UsersAndGroups;
