import api from './api';

export const mediaService = {
    // Upload media file for an incident
    async uploadMedia(incidentId: string, uri: string, mimeType: string) {
        const formData = new FormData();
        const filename = uri.split('/').pop() || 'upload.mp4';

        // We append the basic details standard React Native expects for file uploads
        formData.append('file', {
            uri: uri,
            name: filename,
            type: mimeType
        } as any);

        const response = await api.post(`/media/upload/${incidentId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    // Get media file by ID
    async getMediaById(id: string) {
        const response = await api.get(`/media/${id}`);
        return response.data;
    },

    // Get all media for an incident
    async getIncidentMedia(incidentId: string) {
        const response = await api.get(`/media/incident/${incidentId}`);
        return response.data;
    }
};
