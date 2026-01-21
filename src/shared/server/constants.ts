import axios, {AxiosError, AxiosInstance, InternalAxiosRequestConfig} from 'axios';
import {AppStore} from '../redux-helpers/typed-hooks.ts';
import {showErrorNotification} from '../utils/notifications.ts';

export const BASE_URL = 'https://14.design.htmlacademy.pro/six-cities';

export const axiosClient = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
});

export const setupAxiosInterceptors = (store: AppStore, axiosInstance: AxiosInstance) => {
  // interceptor to add user token to requests
  axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const state = store.getState();
    const token = state.currentUser.userData?.token;

    if (token) {
      config.headers.set('X-Token', token);
    }

    return config;
  });

  // interceptor to catch some errors on response
  axiosInstance.interceptors.response.use((r) => r, (error: AxiosError) => {
    if (error.code === 'ERR_NETWORK') {
      showErrorNotification('Connection error');
    }

    if (error.code === 'ECONNABORTED') {
      showErrorNotification('Connection timeout');
    }

    return Promise.reject(error);
  });
};

export const userUrl = {
  login: '/login',
  logout: '/logout',
};

export const offersUrl = {
  offers: '/offers',
  offer: (offerId: string) => '/offers/' + offerId,
  nearby: (offerId: string) => `/offers/${offerId}/nearby`,
};

export enum FavoriteStatus {
  NotFavorite = 0,
  Favorite = 1,
}

export const favoritesUrl = {
  favorite: '/favorite',
  setFavoriteStatus: (offerId: string, status: FavoriteStatus) => `/favorite/${offerId}/${status}`,
};

export const commentsUrl = {
  comments: (offerId: string) => '/comments/' + offerId,
  addComment: (offerId: string) => '/comments/' + offerId,
};
