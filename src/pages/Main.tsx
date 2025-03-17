import NavbarLinkButton from "../components/NavbarLinkButton";
import MainPageSceleton from "../components/MainPageSceleton";
import RequestList from "../components/RequestList";

function Main() {
  return (
    <MainPageSceleton
      navbarProps={{
        leftButtons: (
          <>
            <NavbarLinkButton path="/requests">Заявки</NavbarLinkButton>
          </>
        ),
        rightButtons: (
          <>
            <NavbarLinkButton path="/login">Вход</NavbarLinkButton>
            <NavbarLinkButton path="/register">Регистрация</NavbarLinkButton>
          </>
        ),
      }}
      contentProps={{
        breadcrumbItems: [{ title: "Главная" }],
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
