import axios from 'axios';
import queryString from 'query-string';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_API_URL } from '@env';

const baseURL = BASE_API_URL;

const getAuthData = async () => {
  try {
    const authDataString = await AsyncStorage.getItem('Auth_Data');
    return authDataString ? JSON.parse(authDataString) : null;
  } catch (error) {
    console.log('🔴 Error reading auth data:', error);
    return null;
  }
};

const setAuthData = async (data) => {
  try {
    await AsyncStorage.setItem('Auth_Data', JSON.stringify(data));
  } catch (error) {
    console.log('🔴 Error saving auth data:', error);
  }
};

const refreshAccessToken = async () => {
  const authData = await getAuthData();
  if (!authData?.refreshToken) return null;

  try {
    const res = await axios.post(`${baseURL}/api/Auth/refresh-token`, authData.refreshToken, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (res?.data?.success) {
      const { accessToken, refreshToken, expiresIn } = res.data.data;
      const updatedData = {
        ...authData,
        token: accessToken,
        refreshToken,
        expiryTime: Date.now() + expiresIn * 1000,
      };
      await setAuthData(updatedData);
      return accessToken;
    }
  } catch (err) {
    console.log('🔴 Refresh token failed:', err.message);
  }

  return null;
};

const axiosClient = axios.create({
  baseURL,
  timeout: 5000,
  paramsSerializer: (params) => queryString.stringify(params),
});

// Add token to request headers
axiosClient.interceptors.request.use(async (config) => {
  const authData = await getAuthData();
  const token = authData?.token || '';

  config.headers = {
    Authorization: token ? `Bearer ${token}` : '',
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...config.headers,
  };

  return { ...config, data: config.data ?? null };
});

// Auto-refresh token on 401
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshAccessToken();
        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          processQueue(null, newToken);
          return axiosClient(originalRequest);
        } else {
          processQueue(new Error('Refresh token failed'), null);
        }
      } catch (err) {
        processQueue(err, null);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
