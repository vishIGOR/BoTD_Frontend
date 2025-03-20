import axios from "axios";

const AUTH_BACKEND_URL = import.meta.env.VITE_AUTH_BACKEND_URL;

export const authApi = axios.create({
  baseURL: AUTH_BACKEND_URL,
});

authApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      if (status >= 400 && status < 500) {
        console.error("Client error:", data);
      } else if (status >= 500) {
        console.error("Server error:", data);
      }
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Request setup error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default authApi;
