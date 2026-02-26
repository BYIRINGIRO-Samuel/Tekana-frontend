import { View, Text, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

export default function WelcomeScreen() {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView className="flex-1 bg-brand-dark">
      <View className="flex-1 items-center justify-between py-12 px-6">
        <View className="flex-1 items-center justify-center -mt-10">
          <Image 
            source={require('../../assets/logo.png')} 
            className="w-56 h-56 mb-4"
            resizeMode="contain"
          />
          <Text className="text-brand-green text-5xl font-black tracking-widest">
            TEKANA
          </Text>
          <Text className="text-gray-500 text-center mt-4 text-lg font-medium max-w-[280px]">
            The next generation of digital security and asset protection.
          </Text>
        </View>

        <View className="w-full space-y-4">
          <TouchableOpacity 
            onPress={() => navigation.navigate('Signup')}
            activeOpacity={0.7}
            className="bg-brand-green h-16 rounded-2xl items-center justify-center flex-row"
          >
            <Text className="text-brand-dark text-xl font-bold">Get Started</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={() => navigation.navigate('Login')}
            activeOpacity={0.7}
            className="h-16 rounded-2xl items-center justify-center"
          >
            <Text className="text-gray-400 text-base font-semibold">Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
