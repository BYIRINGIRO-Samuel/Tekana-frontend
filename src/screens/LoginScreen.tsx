import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
  const navigation = useNavigation<any>();

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
              <Text className="text-brand-green text-xs font-bold uppercase mb-2 ml-1">Email Address</Text>
              <TextInput 
                placeholder="email@example.com"
                placeholderTextColor="#444"
                className="bg-brand-muted h-16 rounded-2xl px-5 text-white border border-gray-800 focus:border-brand-green"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View>
              <Text className="text-brand-green text-xs font-bold uppercase mb-2 ml-1">Password</Text>
              <TextInput 
                placeholder="••••••••"
                placeholderTextColor="#444"
                className="bg-brand-muted h-16 rounded-2xl px-5 text-white border border-gray-800 focus:border-brand-green"
                secureTextEntry
              />
            </View>

            <TouchableOpacity className="items-end">
              <Text className="text-gray-500 font-medium">Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => navigation.navigate('Dashboard')}
              activeOpacity={0.7}
              className="bg-brand-green h-16 rounded-2xl items-center justify-center mt-4"
            >
              <Text className="text-brand-dark text-xl font-bold">Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="pb-8 items-center flex-row justify-center">
          <Text className="text-gray-500 text-base">Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text className="text-brand-green text-base font-bold">Sign Up</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
