import api from './api';

export const userService = {
    async createUser(data: any) {
        const response = await api.post('/users', data);
        return response.data;
    },
    async getUsers(params?: any) {
        const response = await api.get('/users', { params });
        return response.data;
    },
    async getResponders() {
        const response = await api.get('/users/responders');
        return response.data;
    },
    async searchUsers(params?: { query: string }) {
        const response = await api.get('/users/search', { params });
        return response.data;
    },
    async getUsersByRole(role: string) {
        const response = await api.get(`/users/role/${role}`);
        return response.data;
    },
    async getProfile() {
        const response = await api.get('/users/profile');
        return response.data;
    },
    async getUserById(id: string) {
        const response = await api.get(`/users/${id}`);
        return response.data;
    },
    async updateUser(id: string, data: any) {
        const response = await api.patch(`/users/${id}`, data);
        return response.data;
    },
    async deleteUser(id: string) {
        const response = await api.delete(`/users/${id}`);
        return response.data;
    },
    async deactivateUser(id: string) {
        const response = await api.patch(`/users/${id}/deactivate`);
        return response.data;
    },
    async activateUser(id: string) {
        const response = await api.patch(`/users/${id}/activate`);
        return response.data;
    },
    async updateUserRole(id: string, role: string) {
        const response = await api.patch(`/users/${id}/role`, { role });
        return response.data;
    },
    async addTrustedContact(id: string, data: any) {
        const response = await api.post(`/users/${id}/trusted-contacts`, data);
        return response.data;
    },
    async getTrustedContacts(id: string) {
        const response = await api.get(`/users/${id}/trusted-contacts`);
        return response.data;
    },
    async removeTrustedContact(id: string, contactId: string) {
        const response = await api.delete(`/users/${id}/trusted-contacts/${contactId}`);
        return response.data;
    }
};
