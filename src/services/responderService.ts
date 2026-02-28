import api from './api';

export const responderService = {
    // Get current user responder profile
    async getProfile() {
        const response = await api.get('/responders/profile');
        return response.data;
    },

    // Update responder profile
    async updateProfile(data: any) {
        const response = await api.patch('/responders/profile', data);
        return response.data;
    },

    // Verify responder profile (admin only)
    async verifyProfile(data: { responderId: string; verified: boolean }) {
        const response = await api.post('/responders/profile/verify', data);
        return response.data;
    },

    // Get responder actions
    async getActions(params?: any) {
        const response = await api.get('/responders/actions', { params });
        return response.data;
    },

    // Complete a responder action
    async completeAction(actionId: string, data: { status: string; notes?: string }) {
        const response = await api.post(`/responders/actions/${actionId}/complete`, data);
        return response.data;
    },

    // Get nearby incidents for response
    async getNearbyIncidents(params?: { lat?: number; lng?: number; radius?: number }) {
        const response = await api.get('/responders/nearby-incidents', { params });
        return response.data;
    },

    // Resolve an incident (for assigned responders)
    async resolveIncident(incidentId: string, data: { resolutionNotes: string }) {
        const response = await api.post(`/responders/incidents/${incidentId}/resolve`, data);
        return response.data;
    }
};
