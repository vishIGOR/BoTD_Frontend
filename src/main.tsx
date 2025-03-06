import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Main from "./pages/Main.tsx";
import "./index.css";
import 'antd/dist/reset.css';
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Register />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
