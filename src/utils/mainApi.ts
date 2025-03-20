import axios from "axios";

const MAIN_BACKEND_URL = import.meta.env.VITE_MAIN_BACKEND_URL;

export const mainApi = axios.create({
  baseURL: MAIN_BACKEND_URL,
});

mainApi.interceptors.response.use(
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

export default mainApi;
