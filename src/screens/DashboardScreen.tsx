import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, CameraView } from 'expo-camera';
import { Audio } from 'expo-av';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withSequence,
  interpolate,
  withDelay
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const RecordingOverlay = ({ onStop }: { onStop: () => void }) => {
  const bars = Array.from({ length: 20 }, (_, i) => i);
  
  return (
    <View style={StyleSheet.absoluteFill} className="items-center justify-end pb-24 bg-black/40">
      {/* Waveform Visualization */}
      <View className="flex-row items-center justify-center mb-10 h-24 w-full px-12">
        {bars.map((bar) => (
          <AudioBar key={bar} index={bar} />
        ))}
        {/* Center Stop Button */}
        <TouchableOpacity 
          onPress={onStop}
          activeOpacity={0.9}
          className="mx-4 w-20 h-20 rounded-3xl bg-brand-green items-center justify-center shadow-2xl shadow-brand-green"
        >
          <View className="w-8 h-8 rounded-lg bg-brand-dark" />
        </TouchableOpacity>
        {bars.map((bar) => (
          <AudioBar key={`right-${bar}`} index={bar} />
        ))}
      </View>
    </View>
  );
};

const AudioBar = ({ index }: { index: number }) => {
  const heightVal = useSharedValue(10);
  
  useEffect(() => {
    heightVal.value = withRepeat(
      withSequence(
        withTiming(20 + Math.random() * 40, { duration: 300 + Math.random() * 200 }),
        withTiming(10, { duration: 300 + Math.random() * 200 })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    height: heightVal.value,
  }));

  return (
    <Animated.View 
      style={animatedStyle}
      className="w-1 bg-brand-green mx-[2px] rounded-full"
    />
  );
};

export default function DashboardScreen() {
  const [isRecording, setIsRecording] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const pulse = useSharedValue(1);

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      const audioStatus = await Audio.requestPermissionsAsync();
      setHasPermission(cameraStatus.status === 'granted' && audioStatus.status === 'granted');
    })();

    pulse.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1,
      true
    );
  }, []);

  const animatedGlow = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
    opacity: interpolate(pulse.value, [1, 1.2], [0.6, 0.2]),
  }));

  const startSOS = () => setIsRecording(true);
  const stopSOS = () => setIsRecording(false);

  if (hasPermission === false) {
    return (
      <View className="flex-1 bg-brand-dark items-center justify-center px-10">
        <Text className="text-white text-center text-lg">Camera and Audio permissions are required for SOS features.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-brand-dark">
      {isRecording ? (
        <View style={StyleSheet.absoluteFill}>
          <CameraView 
            style={StyleSheet.absoluteFill} 
            facing="back"
            mode="video"
          />
          <RecordingOverlay onStop={stopSOS} />
        </View>
      ) : (
        <>
          <View className="absolute top-[-50px] left-[-20%] w-[140%] h-[300px] bg-[#141414] rotate-[-5deg]" />
          <View className="absolute top-[280px] left-[-10%] w-[120%] h-[400px] bg-[#111111] rotate-[10deg]" />
          
          <SafeAreaView className="flex-1 px-6">
            <View className="pt-4">
              <Image 
                source={require('../../assets/logo.png')} 
                className="w-12 h-12"
                resizeMode="contain"
              />
            </View>

            <View className="flex-1 items-center justify-end pb-24">
              <Animated.View 
                style={animatedGlow}
                className="absolute bottom-[86px] w-[260px] h-[260px] rounded-full bg-brand-green"
              />
              <View className="w-[230px] h-[230px] rounded-full bg-black items-center justify-center border-[6px] border-[#A2D149]">
                <TouchableOpacity 
                  onPress={startSOS}
                  activeOpacity={0.9}
                  className="w-[190px] h-[190px] rounded-full bg-brand-green items-center justify-center"
                >
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
        </>
      )}
    </View>
  );
}
