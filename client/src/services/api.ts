import axios from "axios";
import {
  type Shoe,
  type AuthResponse,
  type LoginData,
  type RegisterData,
  type ShoeData,
} from "../types";
import { type User } from "../types/index";

// axios özelleştirme
const api = axios.create({
  baseURL: "http://localhost:5001/api",
  withCredentials: true,
});

// her api isteği öncesinde local'de token varsa header olarak ekle
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// eğer accessToken'ın süresi dolmuşsa otomatik olarak refresh endpointine istek atıp accessToken'ı yenile
// api'dan gelen her cevabı izler
api.interceptors.response.use(
  // cevap olumluysa hiçbirşey yapmaz
  (res) => res,
  // cevap olumsuzsa bu fonksiyon çalışır
  async (err) => {
    const originalRequest = err.config;

    // hata sebebi token kaynaklıysa bu if çalışır
    if (err?.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // refresh endpointine istek atılır ve token yenilenir
      try {
        const res = await api.post<AuthResponse>("/auth/refresh");
        const { accessToken } = res.data;
        localStorage.setItem("accessToken", accessToken);

        // orijinal api isteği tekrardan atılır
        return api(originalRequest);
      } catch (error) {
        // accessToken yenilenmezse demekki refresh token'ın da süresi dolmuştur o zaman sistemden atarız
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
        return Promise.reject(error);
      }
    }
  }
);

// auth endpoints
export const authApi = {
  register: (data: RegisterData) =>
    api.post<AuthResponse>("/auth/register", data),

  login: (data: LoginData) => api.post<AuthResponse>("/auth/login", data),

  logout: () => api.post("/auth/logout"),

  getCurrentUser: () => api.get<{ user: User }>("/auth/me"),
};

// shoe endpoints
export const shoesApi = {
  getAll: () => api.get<Shoe[]>("/shoes"),
  getById: (id: string) => api.get<Shoe>(`/shoes/${id}`),
  create: (data: ShoeData) => api.post<Shoe>("/shoes", data),
  edit: (id: string, data: ShoeData) => api.put<Shoe>(`/shoes/${id}`, data),
  delete: (id: string) => api.delete(`/shoes/${id}`),
};
