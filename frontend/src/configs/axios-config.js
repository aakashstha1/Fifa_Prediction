// import axios from "axios";

// export const api = axios.create({
//   baseURL:
//     import.meta.env.VITE_API_URL || "https://fifa-predicitons.onrender.com/api",
//   timeout: 10000,
//   withCredentials: true,
// });

import axios from "axios";

export const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL || "https://fifa-predictions.onrender.com/api",
  timeout: 10000,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
