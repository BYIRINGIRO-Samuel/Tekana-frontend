import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Use localhost for iOS and your machine's IP for Android device (replace with actual IP)
// const BASE_URL = Platform.OS === 'android'
//   ? 'http://10.0.2.2:3086/api'
//   : 'http://localhost:3086/api';

// For Android device, use your computer's IP address
const BASE_URL = 'http://10.12.75.205:3086/api'; // Your Wi-Fi IP address

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to include JWT token
api.interceptors.request.use(
    async (config) => {
        try {
            const token = await AsyncStorage.getItem('user_token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.error('AsyncStorage error in interceptor:', error);
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
