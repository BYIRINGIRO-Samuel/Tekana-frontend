import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withSequence,
  interpolate
} from 'react-native-reanimated';

export default function DashboardScreen() {
  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1,
      true
    );
  }, []);

  const animatedGlow = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pulse.value }],
      opacity: interpolate(pulse.value, [1, 1.2], [0.6, 0.2]),
    };
  });

  return (
    <View className="flex-1 bg-[#0D0D0D]">
      {/* Abstract Background Shapes */}
      <View className="absolute top-[-50px] left-[-20%] w-[140%] h-[300px] bg-[#141414] rotate-[-5deg]" />
      <View className="absolute top-[280px] left-[-10%] w-[120%] h-[400px] bg-[#111111] rotate-[10deg]" />
      
      <SafeAreaView className="flex-1 px-6">
        {/* Top Header */}
        <View className="pt-4">
          <Image 
            source={require('../../assets/logo.png')} 
            className="w-12 h-12"
            resizeMode="contain"
          />
        </View>

        <View className="flex-1 items-center justify-end pb-24">
          {/* Pulsing Glow Ring */}
          <Animated.View 
            style={animatedGlow}
            className="absolute bottom-[86px] w-[260px] h-[260px] rounded-full bg-brand-green"
          />
          
          {/* Outer Black Ring */}
          <View className="w-[230px] h-[230px] rounded-full bg-black items-center justify-center border-[6px] border-[#A2D149]">
            
            {/* Inner Green Button */}
            <TouchableOpacity 
              activeOpacity={0.9}
              className="w-[190px] h-[190px] rounded-full bg-brand-green items-center justify-center"
            >
              {/* Exclamation Mark Icon */}
              <View className="w-16 h-16 rounded-full border-[4px] border-brand-dark items-center justify-center mb-2">
                <Text className="text-brand-dark text-4xl font-black">!</Text>
              </View>
              
              <Text className="text-brand-dark text-2xl font-black tracking-tighter text-center">
                SEND SOS
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
