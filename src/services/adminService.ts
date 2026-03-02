import api from './api';

export const adminService = {
    // Get all users
    async getAllUsers(params?: { skip?: number; take?: number; search?: string; role?: string }) {
        const response = await api.get('/admin/users', { params });
        return response.data;
    },

    // Get user by ID
    async getUserById(id: string) {
        const response = await api.get(`/admin/users/${id}`);
        return response.data;
    },

    // Update user role
    async updateUserRole(id: string, role: string) {
        const response = await api.patch(`/admin/users/${id}/role`, { role });
        return response.data;
    },

    // Get all responders
    async getAllResponders(params?: { skip?: number; take?: number; isAvailable?: boolean }) {
        const response = await api.get('/admin/responders', { params });
        return response.data;
    },

    // Get responder by ID
    async getResponderById(id: string) {
        const response = await api.get(`/admin/responders/${id}`);
        return response.data;
    },

    // Create responder profile for user
    async createResponderProfile(userId: string) {
        const response = await api.post(`/admin/responders/${userId}`);
        return response.data;
    }
};
