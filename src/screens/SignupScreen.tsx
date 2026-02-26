import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { authService } from '../services/authService';

export default function SignupScreen() {
  const navigation = useNavigation<any>();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!name || !phone || !password) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await authService.register({
        name,
        phone,
        email: email || undefined,
        password,
        role: 'CITIZEN',
      });
      navigation.navigate('Dashboard');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create account. Please try again.';
      Alert.alert('Signup Failed', message);
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
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
          <View className="flex-1 justify-center py-10">
            <View className="mb-10">
              <Text className="text-white text-4xl font-black mb-2">Create Account</Text>
              <Text className="text-gray-500 text-lg">Start your journey with TEKANA security.</Text>
            </View>

            <View className="space-y-6">
              <View>
                <Text className="text-brand-green text-xs font-bold uppercase mb-2 ml-1">Full Name</Text>
                <TextInput 
                  placeholder="John Doe"
                  placeholderTextColor="#444"
                  className="bg-brand-muted h-16 rounded-2xl px-5 text-white border border-gray-800 focus:border-brand-green"
                  value={name}
                  onChangeText={setName}
                />
              </View>

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
                <Text className="text-brand-green text-xs font-bold uppercase mb-2 ml-1">Email Address (Optional)</Text>
                <TextInput 
                  placeholder="email@example.com"
                  placeholderTextColor="#444"
                  className="bg-brand-muted h-16 rounded-2xl px-5 text-white border border-gray-800 focus:border-brand-green"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
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

              <TouchableOpacity 
                onPress={handleSignup}
                disabled={loading}
                activeOpacity={0.7}
                className={`h-16 rounded-2xl items-center justify-center mt-4 ${loading ? 'bg-gray-600' : 'bg-brand-green'}`}
              >
                <Text className="text-brand-dark text-xl font-bold">
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="pb-8 items-center flex-row justify-center">
            <Text className="text-gray-500 text-base">Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text className="text-brand-green text-base font-bold">Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
