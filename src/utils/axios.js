import axios from 'axios';
import store from '../store';
import config from '../config';

const handler = (error) => {
  let err;
  if (typeof error.response.data === 'object') {
    if (error.response.data.error) {
      err = `Error: ${error.response.status} ${error.response.data.error}`;
    }
    if (error.response.data.message) {
      err = `Error: ${error.response.status} ${error.response.data.message}`;
    }
  } else err = `Error: ${error.response.status} ${error.response.data}`;
  if (!store.state.errors.isOpen) {
    store.dispatch('errors/showMessage', err);
  }
  return Promise.reject(err);
};

export const guestAxiosInstance = axios.create({
  baseURL: config.baseUrl,
  timeout: 5000
});

guestAxiosInstance.interceptors.response.use(null, handler);

export var axiosInstance;

export function initAxiosInstance(token, logoutAction) {
  const unauthorizedStatusCode = 401;

  axiosInstance = axios.create({
    baseURL: config.baseUrl,
    timeout: 5000,
    headers: {
      accept: 'application/json',
      token
    }
  });

  axiosInstance.interceptors.response.use(null, (error) => {
    const { status } = error.response;
    if (status === unauthorizedStatusCode) {
      logoutAction();
    }
    handler(error).catch((e) => {
      console.log(e);
    });
  });
}
