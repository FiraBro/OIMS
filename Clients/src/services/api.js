// import axios from "axios";

// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001/api/v1",
//   withCredentials: true,
// });

// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );
// //
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     const status = error.response?.status;
//     const message = error.response?.data?.message || "";

//     if (status === 401) {
//       if (message.toLowerCase().includes("expired")) {
//         window.location.href = "/auth";
//       } else {
//         console.warn("Unauthorized request:", message);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default api;
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001/api/v1",
  withCredentials: true, // keep ONLY if backend uses cookies
});

/* =====================================
   🔹 REQUEST INTERCEPTOR
   Attach JWT token automatically
===================================== */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* =====================================
   🔹 RESPONSE INTERCEPTOR
   Handle auth errors globally
===================================== */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message?.toLowerCase() || "";

    // 🔐 Token expired → force logout
    if (status === 401 && message.includes("expired")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }

    return Promise.reject(error);
  }
);

export default api;
