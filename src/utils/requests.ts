import { Role } from "../models/Role";
import { UserProfile } from "../models/User";
import authApi from "./authApi";
import mainApi from "./mainApi";
import { getTokenData, saveTokenData } from "./storage";

const AUTH_BACKEND_URL = import.meta.env.VITE_AUTH_BACKEND_URL;
const MAIN_BACKEND_URL = import.meta.env.VITE_MAIN_BACKEND_URL;

export const createRequest = async (data: {
  reason: string;
  date: string;
  status: string;
  file?: File;
}) => {
  if (!AUTH_BACKEND_URL) {
    throw new Error("MAIN_BACKEND_URL is not defined");
  }

  const formData = new FormData();
  formData.append("reason", data.reason);
  formData.append("date", data.date);
  formData.append("status", data.status);
  if (data.file) {
    formData.append("document", data.file);
  }

  return authApi.post("/request", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const register = async (data: {
  login: string;
  name: string;
  password: string;
  role: Role;
}): Promise<void> => {
  if (!AUTH_BACKEND_URL) {
    throw new Error("AUTH_BACKEND_URL is not defined");
  }

  return authApi
    .post("/auth/register", data, {
      headers: { "Content-Type": "application/json" },
    })
    .then((response: { data: { token: string; expire: string } }) => {
      saveTokenData({
        token: response.data.token,
        expiresIn: response.data.expire,
      });
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

export const login = async (data: {
  login: string;
  password: string;
}): Promise<void> => {
  if (!AUTH_BACKEND_URL) {
    throw new Error("AUTH_BACKEND_URL is not defined");
  }

  return authApi
    .post("/auth/login", data, {
      headers: { "Content-Type": "application/json" },
    })
    .then((response: { data: { token: string; expire: string } }) => {
      saveTokenData({
        token: response.data.token,
        expiresIn: response.data.expire,
      });
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

export const getCurrentUserProfile = async (): Promise<UserProfile> => {
  if (!MAIN_BACKEND_URL) {
    throw new Error("MAIN_BACKEND_URL is not defined");
  }

  const tokenData = getTokenData();
  if (!tokenData) {
    throw new Error("No token found");
  }

  return mainApi
    .get("/users/me", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenData.token}`,
      },
    })
    .then(
      (response: {
        data: { id: string; name: string; login: string; role: string };
      }) => {
        return { ...response.data, role: response.data.role as Role };
      }
    )
    .catch((error) => {
      return Promise.reject(error);
    });
};
