import api from './api';

export interface UserRecording {
  id: string;
  userId: string;
  title: string;
  fileUrl: string;
  createdAt: string;
  updatedAt: string;
}

export const userRecordingService = {
  // Upload a recording
  async uploadRecording(userId: string, title: string, file: File): Promise<UserRecording> {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('file', file);

    const response = await api.post(`/users/${userId}/recordings/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get user recordings
  async getUserRecordings(userId: string): Promise<UserRecording[]> {
    const response = await api.get(`/users/${userId}/recordings`);
    return response.data;
  },

  // Delete a recording
  async deleteRecording(userId: string, recordingId: string): Promise<any> {
    const response = await api.delete(`/users/${userId}/recordings/${recordingId}`);
    return response.data;
  },
};
