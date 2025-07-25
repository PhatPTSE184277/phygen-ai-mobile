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
            Authorization: `Bearer ${token}`
        };
        return fetch(`${BASE_API_URL_2}${endpoint}`, {
            ...options,
            method: 'GET',
            headers
        });
    },
    
    post: async (endpoint, body, options = {}) => {
        const token = await getToken();
        const isFormData = body instanceof FormData;
        
        const headers = {
            ...(options.headers || {}),
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
        };
        
        if (!isFormData) {
            headers['Content-Type'] = 'application/json';
        }

        try {
            const response = await fetch(`${BASE_API_URL_2}${endpoint}`, {
                ...options,
                method: 'POST',
                headers,
                body: isFormData ? body : JSON.stringify(body)
            });

            console.log('Response status:', response.status);
            console.log('Response headers:', Object.fromEntries(response.headers.entries()));

            const responseText = await response.text();
            console.log('Raw response:', responseText.substring(0, 200) + '...');

            let responseData;
            
            if (responseText.trim().startsWith('{') || responseText.trim().startsWith('[')) {
                try {
                    responseData = JSON.parse(responseText);
                } catch (parseError) {
                    console.warn('Failed to parse JSON:', parseError);
                    responseData = {
                        success: false,
                        message: 'Invalid JSON response',
                        rawText: responseText
                    };
                }
            } else {
                console.warn('Response is not JSON:', responseText.substring(0, 100));
                responseData = {
                    success: false,
                    message: 'Server returned non-JSON response',
                    rawText: responseText
                };
            }

            return {
                status: response.status,
                ok: response.ok,
                data: responseData
            };
        } catch (networkError) {
            console.error('Network error:', networkError);
            return {
                status: 0,
                ok: false,
                data: {
                    success: false,
                    message: networkError.message || 'Network error'
                }
            };
        }
    }
};

export default fetchClient;