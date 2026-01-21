import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { store } from '../../store';

const BASE_URL = 'https://14.design.htmlacademy.pro/six-cities';
const REQUEST_TIMEOUT = 5000;

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: REQUEST_TIMEOUT,
});

// Временный интерфейс для типизации
// Замените на реальный тип после диагностики
interface UserData {
  token?: string;
  email?: string;
}

interface AuthState {
  userData?: UserData;
  authorizationStatus?: string;
}

interface AppState {
  user?: AuthState;
  currentUser?: AuthState;
  auth?: AuthState;
  // другие состояния...
}

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  // Используем каст к нашему интерфейсу
  const state = store.getState() as unknown as AppState;

  // Пробуем получить токен из разных мест
  // Оставьте только один вариант после диагностики
  const token = state.user?.userData?.token
    || state.currentUser?.userData?.token
    || state.auth?.userData?.token;

  if (token) {
    config.headers['X-Token'] = token;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Вместо console.error можно добавить ваши уведомления
    if (error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED') {
      // showErrorNotification('Network error');
      // Можно оставить пустым или добавить логику без console
    }
    return Promise.reject(error);
  }
);

export const createAPI = () => api;
