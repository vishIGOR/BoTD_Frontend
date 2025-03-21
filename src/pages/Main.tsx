import NavbarLinkButton from "../components/NavbarLinkButton";
import MainPageSceleton from "../components/MainPageSceleton";
import RequestList from "../components/RequestList";
import { useUserProfileContext } from "../context/UserProfileContext";
import { Button } from "antd";
import { deleteTokenData } from "../utils/storage";
import { useNavigate } from "react-router-dom";
import { roleToString } from "../models/Role";

function Main() {
  const { userProfile } = useUserProfileContext();
  const navigate = useNavigate();

  return (
    <MainPageSceleton
      navbarProps={{
        leftButtons: (
          <>
            <NavbarLinkButton path="/">Заявки</NavbarLinkButton>
            {(userProfile.role === "ADMIN" || userProfile.role === "DEAN") && (
              <NavbarLinkButton path="/users">
                Пользователи и группы
              </NavbarLinkButton>
            )}
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
        breadcrumbItems: [{ title: "Заявки" }],
        children: (
          <>
            <RequestList />
          </>
        ),
      }}
    />
  );
}

export default Main;
