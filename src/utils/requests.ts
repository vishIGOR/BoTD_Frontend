import axios from "axios";
import { Role } from "../models/User";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const createRequest = async (data: {
  reason: string;
  date: string;
  status: string;
  file?: File;
}) => {
  if (!BACKEND_URL) {
    throw new Error("BACKEND_URL is not defined");
  }

  const formData = new FormData();
  formData.append("reason", data.reason);
  formData.append("date", data.date);
  formData.append("status", data.status);
  if (data.file) {
    formData.append("document", data.file);
  }

  return axios.post(BACKEND_URL + "/request", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const register = async (data: {
  login: string;
  name: string;
  password: string;
  role: Role;
}): Promise<{
  accessToken: "string";
  accessTokenExpiresIn: "string";
}> => {
  console.log(import.meta.env);
  if (!BACKEND_URL) {
    throw new Error("BACKEND_URL is not defined");
  }

  // const formData = new FormData();
  // formData.append("login", data.login);
  // formData.append("name", data.name);
  // formData.append("password", data.password);
  // formData.append("role", data.role);

  return axios.post(BACKEND_URL + "/auth/register", data, {
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  });
};
