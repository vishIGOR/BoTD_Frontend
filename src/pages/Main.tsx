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
            <NavbarLinkButton path="/groups">Группы</NavbarLinkButton>
            <NavbarLinkButton path="/create-request">Создать заявку</NavbarLinkButton>
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
            <h1>Добро пожаловать!</h1>
            <p>Это главная страница системы учёта пропусков ТГУ.</p>
            <RequestList /> {/* Список заявок */}
          </>
        ),
      }}
    />
  );
}

export default Main;
