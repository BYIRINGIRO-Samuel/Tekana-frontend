import api from './api';

export const dangerZoneService = {
    // Report a new danger zone
    async createDangerZone(data: { title: string; description?: string; latitude: number; longitude: number; radius?: number; severity: string }) {
        const response = await api.post('/danger-zones', data);
        return response.data;
    },

    // Get danger zones with optional filters
    async getDangerZones(params?: { skip?: number; take?: number; isActive?: boolean; severity?: string; }) {
        const response = await api.get('/danger-zones', { params });
        return response.data;
    },

    // Get aggregated danger zones for mapping
    async getAggregatedZones() {
        const response = await api.get('/danger-zones/aggregated');
        return response.data;
    },

    // Get a specific danger zone
    async getDangerZoneById(id: string) {
        const response = await api.get(`/danger-zones/${id}`);
        return response.data;
    },

    // Update a danger zone
    async updateDangerZone(id: string, data: any) {
        const response = await api.patch(`/danger-zones/${id}`, data);
        return response.data;
    },

    // Delete a danger zone
    async deleteDangerZone(id: string) {
        const response = await api.delete(`/danger-zones/${id}`);
        return response.data;
    }
};
