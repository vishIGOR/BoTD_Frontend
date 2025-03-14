import axios from "axios";

export const createRequest = async (data: {
  reason: string;
  date: string;
  status: string;
  file?: File;
}) => {
  const formData = new FormData();
  formData.append("reason", data.reason);
  formData.append("date", data.date);
  formData.append("status", data.status);
  if (data.file) {
    formData.append("document", data.file);
  }

  return axios.post("https://api.example.com/requests", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
