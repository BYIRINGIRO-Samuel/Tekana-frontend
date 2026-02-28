import api from './api';

export const streamingService = {
    // Webhook for when a stream starts publishing
    async publish(data: { name: string;[key: string]: any }) {
        const response = await api.post('/streaming/publish', data);
        return response.data;
    },

    // Webhook for when a stream stops publishing
    async publishDone(data: { name: string;[key: string]: any }) {
        const response = await api.post('/streaming/publish_done', data);
        return response.data;
    },

    // Webhook for when a stream starts playing
    async play(data: { name: string;[key: string]: any }) {
        const response = await api.post('/streaming/play', data);
        return response.data;
    },

    // Webhook for when a stream stops playing
    async playDone(data: { name: string;[key: string]: any }) {
        const response = await api.post('/streaming/play_done', data);
        return response.data;
    },
};
