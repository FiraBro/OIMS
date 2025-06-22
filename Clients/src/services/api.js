import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api/v1" });

// Add token if needed
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const applyForPolicy = (formData) => API.post("/policy/apply", formData);

export const getUserApplications = () => API.get("/policy/my-applications");

export const getAllApplications = () => API.get("/policy/applications");

export const updateApplicationStatus = (id, data) =>
  API.put(`/policy/applications/${id}`, data);
