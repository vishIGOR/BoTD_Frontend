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
  Divider,
} from "antd";
import { useEffect, useState } from "react";
import MainPageSceleton from "../components/MainPageSceleton";
import NavbarLinkButton from "../components/NavbarLinkButton";
import { useUserProfileContext } from "../context/UserProfileContext";
import { useNavigate } from "react-router-dom";
import { roleToString } from "../models/Role";
import { deleteTokenData } from "../utils/storage";
import {
  getGroups,
  createGroup,
  getUsers,
  updateUserRole,
} from "../utils/requests"; // Import your request functions

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

const UsersAndGroups = () => {
  const { userProfile } = useUserProfileContext();
  const navigate = useNavigate();

  const [users, setUsers] = useState<User[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingGroups, setLoadingGroups] = useState(true);
  const [newGroupNumber, setNewGroupNumber] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const dangerousActionsRight =
    userProfile.role === "ADMIN" || userProfile.role === "DEAN";

  useEffect(() => {
    fetchUsers();
    fetchGroups();
  }, []);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const usersData = await getUsers({});
      setUsers(usersData.data); // Assuming getUsers returns the data in the expected format
    } catch (error) {
      console.error("Ошибка при загрузке пользователей:", error);
      message.error("Не удалось загрузить пользователей.");
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleUpdateUserRole = async (
    id: string,
    newRole: "STUDENT" | "ADMIN" | "DEAN" | "TEACHER"
  ) => {
    try {
      await updateUserRole(id, newRole);
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
      const groupsData = await getGroups();
      setGroups(groupsData);
    } catch (error) {
      console.error("Ошибка при загрузке групп:", error);
      message.error("Не удалось загрузить группы.");
    } finally {
      setLoadingGroups(false);
    }
  };

  const handleCreateGroup = async () => {
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
      await createGroup({
        number: groupNumber,
        students: selectedUsers.map((id) => id),
      });

      message.success("Группа создана!");
      fetchGroups(); // Refresh the groups list
      setNewGroupNumber("");
      setSelectedUsers([]);
    } catch (error) {
      console.error("Ошибка при создании группы:", error);
      message.error(
        "Не удалось создать группу. Проверьте данные и попробуйте снова."
      );
    }
  };

  const handleDeleteGroup = async (id: string) => {
    try {
      // await deleteGroup(id);
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
        {dangerousActionsRight &&
          (user.role === "STUDENT" ? (
            <Button
              type="primary"
              icon={<UserSwitchOutlined />}
              onClick={() => handleUpdateUserRole(user.id, "TEACHER")}
            >
              Назначить учителем
            </Button>
          ) : user.role === "TEACHER" ? (
            <Button
              danger
              icon={<UserSwitchOutlined />}
              onClick={() => handleUpdateUserRole(user.id, "STUDENT")}
            >
              Снять роль учителя
            </Button>
          ) : null)}
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
        {dangerousActionsRight && (
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDeleteGroup(group.id)}
          >
            Удалить группу
          </Button>
        )}
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
          {dangerousActionsRight && (
            <>
              <h2>Создать новую группу</h2>
              <Input
                placeholder="Введите номер группы"
                type="number"
                value={newGroupNumber}
                onChange={(e) => setNewGroupNumber(e.target.value)}
                style={{ width: "100%", marginBottom: 12 }}
                size="large"
              />
              <Select
                mode="multiple"
                placeholder="Выберите пользователей"
                value={selectedUsers}
                onChange={(values) => setSelectedUsers(values)}
                style={{ width: "100%", marginBottom: 12 }}
                size="large"
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
                onClick={handleCreateGroup}
                size="large"
              >
                Создать группу
              </Button>
              <Divider />
            </>
          )}

          <h2>Список групп</h2>

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
