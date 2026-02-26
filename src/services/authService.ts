import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface RegisterData {
    phone: string;
    name: string;
    email?: string;
    password?: string;
    role?: string;
}

export interface LoginData {
    phone: string;
    password?: string;
    otp?: string;
}

export interface AuthResponse {
    user: {
        id: string;
        phone: string;
        name: string;
        email?: string;
        role: string;
        isVerified: boolean;
    };
    token: string;
    expiresIn: string;
}

export const authService = {
    async register(data: RegisterData): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>('/auth/register', data);
        await this.saveSession(response.data);
        return response.data;
    },

    async login(data: LoginData): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>('/auth/login', data);
        await this.saveSession(response.data);
        return response.data;
    },

    async saveSession(data: AuthResponse) {
        await AsyncStorage.setItem('user_token', data.token);
        await AsyncStorage.setItem('user_data', JSON.stringify(data.user));
    },

    async logout() {
        await AsyncStorage.removeItem('user_token');
        await AsyncStorage.removeItem('user_data');
    },

    async getCurrentUser() {
        const userData = await AsyncStorage.getItem('user_data');
        return userData ? JSON.parse(userData) : null;
    },

    async isAuthenticated() {
        const token = await AsyncStorage.getItem('user_token');
        return !!token;
    }
};
