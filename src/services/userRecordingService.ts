import api from './api';

export interface UserRecording {
  id: string;
  userId: string;
  videoUrl: string;
  audioUrl: string | null;
  location: string | null;
  time: string | null;
  createdAt: string;
  updatedAt: string;
}

export const userRecordingService = {
  // Upload a recording
  async uploadRecording(userId: string, title: string, file: File, location?: string): Promise<UserRecording> {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('file', file);
    if (location) {
      formData.append('location', location);
    }

    const response = await api.post(`/user-recordings/upload/${userId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get user recordings
  async getUserRecordings(userId: string): Promise<UserRecording[]> {
    const response = await api.get(`/user-recordings/${userId}`);
    return response.data;
  },

  // Delete a recording
  async deleteRecording(userId: string, recordingId: string): Promise<any> {
    const response = await api.delete(`/user-recordings/${userId}/${recordingId}`);
    return response.data;
  },
};
