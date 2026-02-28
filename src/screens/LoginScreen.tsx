import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { authService } from '../services/authService';

export default function LoginScreen({ navigate, goBack }: { navigate: (screen: string) => void, goBack?: () => void }) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!phone || !password) {
      Alert.alert('Error', 'Please enter both phone number and password');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.login({ phone, password });
      if (response.user.role.toUpperCase() === 'ADMIN') {
        navigate('AdminDashboard');
      } else {
        navigate('Dashboard');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed. Please check your credentials.';
      Alert.alert('Login Error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-brand-dark">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 px-6"
      >
        <View className="flex-1 justify-center">
          <View className="mb-10">
            <Text className="text-white text-4xl font-black mb-2">Welcome Back</Text>
            <Text className="text-gray-500 text-lg">Sign in to access your secure assets.</Text>
          </View>

          <View className="space-y-6">
            <View>
              <Text className="text-brand-green text-xs font-bold uppercase mb-2 ml-1">Phone Number</Text>
              <TextInput 
                placeholder="+250788123456"
                placeholderTextColor="#444"
                className="bg-brand-muted h-16 rounded-2xl px-5 text-white border border-gray-800 focus:border-brand-green"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />
            </View>

            <View>
              <Text className="text-brand-green text-xs font-bold uppercase mb-2 ml-1">Password</Text>
              <TextInput 
                placeholder="••••••••"
                placeholderTextColor="#444"
                className="bg-brand-muted h-16 rounded-2xl px-5 text-white border border-gray-800 focus:border-brand-green"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <TouchableOpacity className="items-end">
              <Text className="text-gray-500 font-medium">Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.7}
              className={`h-16 rounded-2xl items-center justify-center mt-4 ${loading ? 'bg-gray-600' : 'bg-brand-green'}`}
            >
              <Text className="text-brand-dark text-xl font-bold">
                {loading ? 'Signing In...' : 'Sign In'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="pb-8 items-center flex-row justify-center">
          <Text className="text-gray-500 text-base">Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigate('Signup')}>
            <Text className="text-brand-green text-base font-bold">Sign Up</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
