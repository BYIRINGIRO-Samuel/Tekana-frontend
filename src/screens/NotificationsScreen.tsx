import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authService } from '../services/authService';
import { userService } from '../services/userService';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export default function NotificationsScreen({ navigate, goBack }: { navigate: (screen: string) => void, goBack: () => void }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const user = await authService.getCurrentUser();
      if (user) {
        const response = await userService.getNotifications(user.id);
        setNotifications(response);
      }
    } catch (error) {
      console.error('Failed to load notifications:', error);
      Alert.alert('Error', 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const renderNotification = ({ item }: { item: Notification }) => (
    <TouchableOpacity 
      activeOpacity={0.7}
      className={`p-4 mb-2 rounded-xl border ${item.read ? 'bg-gray-100 border-gray-300' : 'bg-blue-50 border-blue-300'}`}
    >
      <Text className="text-lg font-bold text-gray-800 mb-1">{item.title}</Text>
      <Text className="text-gray-700 mb-2">{item.message}</Text>
      <Text className="text-xs text-gray-500">{new Date(item.createdAt).toLocaleString()}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-brand-dark">
      <View className="flex-row justify-between items-center py-6 px-6">
        <TouchableOpacity 
          onPress={goBack}
          className="w-12 h-12 bg-brand-muted rounded-lg border border-gray-800 items-center justify-center"
        >
          <Text className="text-white text-xl">←</Text>
        </TouchableOpacity>
        <Text className="text-white text-2xl font-black">Notifications</Text>
        <View className="w-12" />
      </View>

      <View className="flex-1 px-6">
        {loading ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-white">Loading notifications...</Text>
          </View>
        ) : notifications.length > 0 ? (
          <FlatList 
            data={notifications}
            keyExtractor={(item) => item.id}
            renderItem={renderNotification}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        ) : (
          <View className="flex-1 justify-center items-center">
            <Text className="text-gray-500 text-lg">No notifications yet</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
