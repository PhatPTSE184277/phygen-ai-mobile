import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_API_URL_2 } from '@env';

const getToken = async () => {
  const data = await AsyncStorage.getItem('Auth_Data');
  return data ? JSON.parse(data).token : '';
};

const fetchClient = {
  get: async (endpoint, options = {}) => {
    const token = await getToken();
    const headers = {
      ...(options.headers || {}),
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    };
    return fetch(`${BASE_API_URL_2}${endpoint}`, {
      ...options,
      method: 'GET',
      headers,
    });
  },
  post: async (endpoint, body, options = {}) => {
    const token = await getToken();
    const headers = {
      ...(options.headers || {}),
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    };
    return fetch(`${BASE_API_URL_2}${endpoint}`, {
      ...options,
      method: 'POST',
      headers,
      body,
    });
  },
};

export default fetchClient;
