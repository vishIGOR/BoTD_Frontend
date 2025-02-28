import NavbarLinkButton from "../components/NavbarLinkButton";
import PageSceleton from "../components/PageSceleton";

function Main() {
  return (
    <PageSceleton
      navbarProps={{
        leftButtons: (
          <>
            <NavbarLinkButton path="/requests">Заявки</NavbarLinkButton>
            <NavbarLinkButton path="/groups">Группы</NavbarLinkButton>
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
        breadcrumbItems: [
          { title: "Главная" },
        ],
        children: (
          <>
            <h1>Добро пожаловать!</h1>
            <p>Это главная страница системы учёта пропусков ТГУ.</p>
          </>
        ),
      }}
    />
  );
}

export default Main;
