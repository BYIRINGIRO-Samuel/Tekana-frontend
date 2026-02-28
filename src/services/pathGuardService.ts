import api from './api';

export const pathGuardService = {
    // Start a new PathGuard session
    async startSession(data: { destinationLat: number; destinationLng: number; destinationAddress?: string; estimatedDuration?: number }) {
        const response = await api.post('/path-guard/start', data);
        return response.data;
    },

    // Get the active PathGuard session for current user
    async getActiveSession() {
        const response = await api.get('/path-guard/active');
        return response.data;
    },

    // Report current location for an active PathGuard session
    async reportLocation(sessionId: string, data: { latitude: number; longitude: number; batteryLevel?: number }) {
        const response = await api.post(`/path-guard/${sessionId}/location`, data);
        return response.data;
    },

    // Complete or cancel an active PathGuard session
    async completeSession(sessionId: string, data: { status: 'COMPLETED' | 'CANCELLED' }) {
        const response = await api.patch(`/path-guard/${sessionId}/complete`, data);
        return response.data;
    }
};
