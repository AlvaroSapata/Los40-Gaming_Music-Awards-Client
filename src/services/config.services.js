import axios from "axios";

const service = axios.create({
  baseURL: process.env.REACT_APP_SERVER_URL,
});

service.interceptors.request.use((config) => {
  const authToken = localStorage.getItem("authToken");

  if (authToken) {
    config.headers.authorization = `Bearer ${authToken}`;
  }
  return config;
});

export default service;
