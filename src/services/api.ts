import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Use localhost for iOS and 10.0.2.2 for Android emulator
const BASE_URL = Platform.OS === 'android'
    ? 'http://10.0.2.2:3086/api'
    : 'http://localhost:3086/api';

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to include JWT token
api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('user_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
