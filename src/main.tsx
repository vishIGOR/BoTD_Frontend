import "antd/dist/reset.css";
import "@ant-design/v5-patch-for-react-19";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import LoginPage from "./pages/Login.tsx";
import Main from "./pages/Main.tsx";
import RegisterPage from "./pages/Register.tsx";
import ListPage from "./pages/UsersList.tsx";
import "./index.css";
import "antd/dist/reset.css";
import MainProviders from "./context/MainProviders.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <MainProviders>
              <Main />
            </MainProviders>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/users" element={<ListPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
