import React, { useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Animated, { 
  FadeInDown, 
  FadeIn, 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withSequence, 
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { authService } from '../services/authService';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
  const navigation = useNavigation<any>();
  
  const scanLinePos = useSharedValue(-100);
  const bgOpacity = useSharedValue(0.1);

  useEffect(() => {
    const checkUser = async () => {
      if (await authService.isAuthenticated()) {
        navigation.replace('Dashboard');
      }
    };
    checkUser();

    scanLinePos.value = withRepeat(
      withTiming(500, { duration: 3000 }),
      -1,
      false
    );
    
    bgOpacity.value = withRepeat(
      withSequence(
        withTiming(0.15, { duration: 100 }),
        withTiming(0.05, { duration: 200 })
      ),
      -1,
      true
    );
  }, []);

  const scanLineStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: scanLinePos.value }],
    opacity: interpolate(scanLinePos.value, [-100, 200, 500], [0, 1, 0])
  }));

  const systemStatusStyle = useAnimatedStyle(() => ({
    opacity: bgOpacity.value
  }));

  return (
    <SafeAreaView className="flex-1 bg-brand-dark">
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Animated.View 
          style={[scanLineStyle, { 
            position: 'absolute', 
            top: 0, 
            width: '100%', 
            height: 2, 
            backgroundColor: '#A2D149',
            shadowColor: '#A2D149',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 1,
            shadowRadius: 10,
            elevation: 10 
          }]} 
        />
        
        <View className="absolute top-16 left-6 opacity-30">
          <Text className="text-brand-green font-mono text-[10px]">AUTH_MODE: BIOMETRIC_READY</Text>
          <Text className="text-brand-green font-mono text-[10px]">ENCRYPT_LEVEL: MIL_SPEC_AES256</Text>
        </View>
        <View className="absolute top-16 right-6 opacity-30 items-end">
          <Text className="text-brand-green font-mono text-[10px]">SIGNAL: ENCRYPTED</Text>
          <Text className="text-brand-green font-mono text-[10px]">LOC: 0.0.0.0.LOCAL</Text>
        </View>

        <Animated.View style={[systemStatusStyle, styles.gridLayout]} />
      </View>

      <View className="flex-1 items-center justify-between py-12 px-8">
        <View className="flex-1 items-center justify-center">
          <View className="w-64 h-64 items-center justify-center">
            <View className="absolute w-72 h-72 border border-brand-green/20 rounded-full rotate-45" />
            <View className="absolute w-60 h-60 border border-brand-green/40 rounded-full -rotate-12" />
            
            <Image 
              source={require('../../assets/logo.png')} 
              style={{ width: 180, height: 180 }}
              resizeMode="contain"
            />
          </View>

          <Text 
            className="text-white text-5xl font-black tracking-widest mt-8"
          >
            TEKANA
          </Text>
          
          <View 
            className="flex-row items-center mt-2 bg-brand-green/10 px-4 py-1 rounded-sm border-l-2 border-brand-green"
          >
            <View className="w-2 h-2 rounded-full bg-brand-green mr-2" />
            <Text className="text-brand-green font-mono text-xs tracking-widest">SYSTEM_LIVE: ACTIVE_SHIELD</Text>
          </View>
        </View>

        <View className="w-full">
          <Animated.View entering={FadeInDown.delay(700).duration(800)}>
            <TouchableOpacity 
              onPress={() => navigation.navigate('Signup')}
              activeOpacity={0.8}
              className="bg-brand-green h-16 rounded-sm items-center justify-center flex-row overflow-hidden shadow-lg shadow-brand-green/20"
            >
              <View className="absolute left-0 w-2 h-full bg-brand-dark/20" />
              <Text className="text-brand-dark text-xl font-black uppercase tracking-tighter">Initialize Protection</Text>
            </TouchableOpacity>
          </Animated.View>
          
          <Animated.View entering={FadeInDown.delay(900).duration(800)}>
            <TouchableOpacity 
              onPress={() => navigation.navigate('Login')}
              activeOpacity={0.6}
              className="h-16 mt-4 rounded-sm items-center justify-center border border-gray-800"
              style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
            >
              <Text className="text-gray-400 text-sm font-bold tracking-widest uppercase">Member Login</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  gridLayout: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1,
    borderColor: '#A2D149',
    opacity: 0.05,
    backgroundColor: 'transparent',
  },
  gameButton: {
    shadowColor: '#A2D149',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  }
});
