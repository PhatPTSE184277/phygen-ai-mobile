import axios from 'axios';
import queryString from 'query-string';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_API_URL_2 } from '@env';

const baseURL = BASE_API_URL_2;

const getAccessToken = async () => {
  try {
    const authDataString = await AsyncStorage.getItem('Auth_Data');
    if (authDataString) {
      const authData = JSON.parse(authDataString);
      if (authData?.token) return authData.token;
    }
    return '';
  } catch (error) {
    console.log('Error getting access token:', error);
    return '';
  }
};

const axiosClient2 = axios.create({
  baseURL,
  timeout: 90000,
  paramsSerializer: (params) => queryString.stringify(params),
});

axiosClient2.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers.Accept = 'application/json';
  return config;
});

axiosClient2.interceptors.response.use(
  (res) => res,
  (err) => {
    console.log('Axios error:', err.response?.status, err.message);
    return Promise.reject(err);
  }
);

export default axiosClient2;
