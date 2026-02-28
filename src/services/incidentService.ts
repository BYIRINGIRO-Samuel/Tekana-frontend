import api from './api';

export interface CreateIncidentData {
    type: string;
    severity?: string;
    title?: string;
    description?: string;
    locationLat: number;
    locationLng: number;
    locationAddress?: string;
    isSilentSOS?: boolean;
    isOfflineAlert?: boolean;
    pathGuardSessionId?: string;
}

export interface UpdateIncidentStatusData {
    status: string;
    severity?: string;
}

export interface AssignResponderData {
    responderId: string;
}

export interface RequestEmergencyServiceData {
    serviceType: string;
}

export const incidentService = {
    // Create a new incident (SOS alert)
    async createIncident(data: CreateIncidentData) {
        const response = await api.post('/incidents', data);
        return response.data;
    },

    // Retrieve incidents with optional filters
    async getIncidents(params?: any) {
        const response = await api.get('/incidents', { params });
        return response.data;
    },

    // Get incident details by ID
    async getIncidentById(id: string) {
        const response = await api.get(`/incidents/${id}`);
        return response.data;
    },

    // Update incident status and severity
    async updateIncidentStatus(id: string, data: UpdateIncidentStatusData) {
        const response = await api.patch(`/incidents/${id}/status`, data);
        return response.data;
    },

    // Assign a responder to an incident
    async assignResponder(id: string, data: AssignResponderData) {
        const response = await api.post(`/incidents/${id}/responders`, data);
        return response.data;
    },

    // Request emergency service (ambulance or police) for an incident
    async requestEmergencyService(id: string, data: RequestEmergencyServiceData) {
        const response = await api.post(`/incidents/${id}/request-emergency-service`, data);
        return response.data;
    }
};
