import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Dimensions, Alert, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Video, ResizeMode } from 'expo-av';
import Animated, { FadeInUp, FadeInRight } from 'react-native-reanimated';
import { userRecordingService, UserRecording } from '../services/userRecordingService';
import { authService } from '../services/authService';

const { width } = Dimensions.get('window');

export default function VaultScreen({ navigate, goBack }: { navigate: (screen: string) => void, goBack: () => void }) {
  const [recordings, setRecordings] = useState<UserRecording[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecordings();
  }, []);

  const loadRecordings = async () => {
    try {
      setLoading(true);
      const user = await authService.getCurrentUser();
      if (user) {
        const recordingsData = await userRecordingService.getUserRecordings(user.id);
        setRecordings(recordingsData);
      }
    } catch (e) {
      console.error("Failed to load recordings", e);
    } finally {
      setLoading(false);
    }
  };

  const deleteRecording = async (recordingId: string) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to permanently delete this SOS recording?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: async () => {
            try {
              const user = await authService.getCurrentUser();
              if (user) {
                await userRecordingService.deleteRecording(user.id, recordingId);
                loadRecordings();
                if (selectedVideo === recordingId) setSelectedVideo(null);
              }
            } catch (error) {
              console.error('Failed to delete recording:', error);
            }
          }
        }
      ]
    );
  };

  const shareRecording = async (uri: string) => {
    try {
      await Share.share({ url: uri });
    } catch (error) {
      console.error(error);
    }
  };

  const renderItem = ({ item, index }: { item: UserRecording, index: number }) => {
    const date = new Date(item.createdAt);
    const dateStr = date.toLocaleDateString();
    const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
      <Animated.View 
        entering={FadeInUp.delay(index * 100).duration(400)}
        className="mb-4 mx-6 rounded-3xl overflow-hidden bg-brand-muted border border-gray-800"
      >
        <TouchableOpacity 
          onPress={() => setSelectedVideo(item.id)}
          className="p-4 flex-row items-center"
        >
          <View className="w-14 h-14 rounded-2xl bg-brand-dark items-center justify-center mr-4 border border-gray-700">
            <Text className="text-2xl">📹</Text>
          </View>
          <View className="flex-1">
            <Text className="text-white font-bold text-lg">{item.title}</Text>
            <Text className="text-gray-400 text-sm">{dateStr} • {timeStr}</Text>
          </View>
          <View className="bg-brand-green/10 px-3 py-1 rounded-full border border-brand-green/20">
            <Text className="text-brand-green font-bold text-xs">SECURE</Text>
          </View>
        </TouchableOpacity>

        {selectedVideo === item.id && (
          <View className="h-64 w-full bg-black">
            <Video
              source={{ uri: `http://localhost:3000${item.fileUrl}` }}
              style={StyleSheet.absoluteFill}
              useNativeControls
              resizeMode={ResizeMode.CONTAIN}
              shouldPlay
            />
          </View>
        )}

        <View className="flex-row border-t border-gray-800 bg-brand-dark/30">
          <TouchableOpacity 
            onPress={() => shareRecording(item.fileUrl)}
            className="flex-1 py-3 items-center border-r border-gray-800"
          >
            <Text className="text-blue-400 font-medium">Share Feed</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => deleteRecording(item.id)}
            className="flex-1 py-3 items-center"
          >
            <Text className="text-red-400 font-medium">Purge Data</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  };

  return (
    <View className="flex-1 bg-brand-dark">
      <SafeAreaView className="flex-1">
        <View className="px-6 py-4 flex-row justify-between items-center">
          <TouchableOpacity 
            onPress={() => goBack()}
            className="w-10 h-10 rounded-full bg-brand-muted items-center justify-center border border-gray-800"
          >
            <Text className="text-white text-xl">←</Text>
          </TouchableOpacity>
          <Text className="text-white text-2xl font-black tracking-tighter">SECURE VAULT</Text>
          <View className="w-10" />
        </View>

        <View className="px-6 mb-6">
          <Text className="text-gray-400 leading-5">
            Your SOS recordings are encrypted and stored locally on your device. Only you can access this data.
          </Text>
        </View>

        {recordings.length === 0 && !loading ? (
          <View className="flex-1 items-center justify-center px-10">
            <View className="w-24 h-24 rounded-full bg-brand-muted items-center justify-center mb-6 opacity-50">
              <Text className="text-5xl">🛡️</Text>
            </View>
            <Text className="text-white text-xl font-bold text-center">No Data in Vault</Text>
            <Text className="text-gray-400 text-center mt-2 leading-5">
              Saved SOS recordings will appear here automatically for your review.
            </Text>
          </View>
        ) : (
          <FlatList
            data={recordings}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 40 }}
            refreshing={loading}
            onRefresh={loadRecordings}
          />
        )}
      </SafeAreaView>
    </View>
  );
}
