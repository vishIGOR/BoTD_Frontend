import NavbarLinkButton from "../components/NavbarLinkButton";
import PageSceleton from "../components/PageSceleton";
import RequestList from "../components/RequestList";

function Main() {
  return (
    <PageSceleton
      navbarProps={{
        leftButtons: (
          <>
            <NavbarLinkButton path="/requests">Заявки</NavbarLinkButton>
            <NavbarLinkButton path="/export">Экспорт заявок</NavbarLinkButton>
            <NavbarLinkButton path="/users">Пользователи</NavbarLinkButton>
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
