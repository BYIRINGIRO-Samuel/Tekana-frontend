import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { Camera, CameraView, CameraMountError } from 'expo-camera';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system/legacy';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withSequence,
  interpolate,
  FadeIn,
} from 'react-native-reanimated';
import { cssInterop } from 'nativewind';

// Link Reanimated with NativeWind
cssInterop(Animated.View, { className: 'style' });

const { width, height } = Dimensions.get('window');

const RecordingOverlay = ({ onStop, isPreparing, isActualRecording }: { onStop: () => void, isPreparing: boolean, isActualRecording: boolean }) => {
  const bars = Array.from({ length: 15 }, (_, i) => i);
  
  // Pulse animation for the Red Live Dot
  const dotOpacity = useSharedValue(1);
  useEffect(() => {
    dotOpacity.value = withRepeat(withSequence(withTiming(0.4, { duration: 500 }), withTiming(1, { duration: 500 })), -1, true);
  }, []);
  const dotStyle = useAnimatedStyle(() => ({ opacity: dotOpacity.value }));

  return (
    <View style={StyleSheet.absoluteFill} className="items-center justify-end pb-24 bg-black/40">
      {isPreparing && (
        <View className="absolute inset-0 items-center justify-center bg-black/95 z-50">
          <ActivityIndicator size="large" color="#A2D149" />
          <Text className="text-white mt-6 font-bold text-xl tracking-tight uppercase">Securing Feed...</Text>
          <Text className="text-gray-400 text-sm mt-3 text-center px-16 leading-5">Establishing encrypted video surface. Do not close the app.</Text>
        </View>
      )}

      {isActualRecording && (
        <View className="absolute top-16 left-6 flex-row items-center bg-red-600/90 px-4 py-2 rounded-full border border-red-400">
          <Animated.View style={[dotStyle, { width: 10, height: 10, borderRadius: 5, backgroundColor: 'white', marginRight: 10 }]} />
          <Text className="text-white font-black text-xs uppercase tracking-widest">Live SOS Signal</Text>
        </View>
      )}

      <View className="flex-row items-center justify-center mb-10 h-24 w-full px-12">
        {bars.map((bar) => <AudioBar key={`left-${bar}`} index={bar} active={isActualRecording} />)}
        <TouchableOpacity 
          onPress={onStop}
          activeOpacity={0.9}
          className="mx-4 w-20 h-20 rounded-3xl bg-brand-green items-center justify-center shadow-2xl shadow-brand-green/40"
        >
          <View style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: '#0A0A0A' }} />
        </TouchableOpacity>
        {bars.map((bar) => <AudioBar key={`right-${bar}`} index={bar} active={isActualRecording} />)}
      </View>
    </View>
  );
};

const AudioBar = ({ index, active }: { index: number, active: boolean }) => {
  const heightVal = useSharedValue(10);
  
  useEffect(() => {
    if (active) {
      heightVal.value = withRepeat(
        withSequence(
          withTiming(15 + Math.random() * 45, { duration: 250 + Math.random() * 200 }),
          withTiming(8, { duration: 250 + Math.random() * 200 })
        ),
        -1,
        true
      );
    } else {
      heightVal.value = withTiming(10);
    }
  }, [active]);

  const animatedStyle = useAnimatedStyle(() => ({ height: heightVal.value }));
  return <Animated.View style={[animatedStyle, { width: 4, backgroundColor: '#A2D149', marginHorizontal: 2, borderRadius: 2 }]} />;
};

export default function DashboardScreen() {
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();
  const [isRecording, setIsRecording] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isPreparing, setIsPreparing] = useState(false);
  const [isActualRecording, setIsActualRecording] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const pulse = useSharedValue(1);
  const isCanceled = useRef(false);

  useEffect(() => {
    (async () => {
      const { status: camStatus } = await Camera.requestCameraPermissionsAsync();
      const { status: micStatus } = await Audio.requestPermissionsAsync();
      setHasPermission(camStatus === 'granted' && micStatus === 'granted');
      
      try {
        const recordingDir = `${FileSystem.documentDirectory}recordings/`;
        const info = await FileSystem.getInfoAsync(recordingDir);
        if (!info.exists) {
          await FileSystem.makeDirectoryAsync(recordingDir, { intermediates: true });
        }
        
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });
      } catch (e) { console.log('Init failed', e); }
    })();

    pulse.value = withRepeat(withSequence(withTiming(1.2, { duration: 1000 }), withTiming(1, { duration: 1000 })), -1, true);
  }, []);

  const animatedGlow = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
    opacity: interpolate(pulse.value, [1, 1.2], [0.6, 0.2]),
  }));

  const stopSOS = useCallback(() => {
    isCanceled.current = true;
    if (cameraRef.current && isActualRecording) {
      try {
        cameraRef.current.stopRecording();
      } catch (e) { console.log("Stop error:", e); }
    }
    setIsActualRecording(false);
    setIsRecording(false);
    setIsPreparing(false);
  }, [isActualRecording]);

  const runRecordingSequence = useCallback(async () => {
    if (isCanceled.current || !cameraRef.current || isActualRecording) return;

    const tryToRecord = async (attempt = 0) => {
      if (isCanceled.current || !cameraRef.current) return;
      
      try {
        console.log(`[SOS] Record attempt ${attempt}...`);
        const videoPromise = cameraRef.current.recordAsync();
        
        setIsActualRecording(true);
        setIsPreparing(false);
        
        const video = await videoPromise;
        if (video && !isCanceled.current) {
          const fileName = `sos_${Date.now()}.mp4`;
          const destination = `${FileSystem.documentDirectory}recordings/${fileName}`;
          await FileSystem.copyAsync({ from: video.uri, to: destination });
          Alert.alert("SOS Saved", "Emergency recording stored in your secure vault.");
        }
      } catch (e: any) {
        setIsActualRecording(false);
        setIsPreparing(true);
        console.log(`[SOS] Surface fail ${attempt}: ${e.message}`);
        
        if (attempt < 12 && e.message.includes('PersistentSurface')) {
          const delay = 1000 + (attempt * 200);
          setTimeout(() => tryToRecord(attempt + 1), delay);
        } else {
          // SIMULATION FALLBACK for Emulators
          Alert.alert(
            "Hardware Error", 
            "Device (Emulator) lacks a Persistent Video Surface. Simulate successful SOS?",
            [
              { text: "Cancel", onPress: () => stopSOS(), style: "cancel" },
              { 
                text: "Simulate SOS", 
                onPress: async () => {
                  setIsPreparing(true); // Show securing phase first
                  setTimeout(async () => {
                    setIsPreparing(false);
                    setIsActualRecording(true);
                    
                    setTimeout(async () => {
                      const fileName = `simulated_sos_${Date.now()}.mp4`;
                      const destination = `${FileSystem.documentDirectory}recordings/${fileName}`;
                      await FileSystem.writeAsStringAsync(destination, "Simulated SOS Data");
                      Alert.alert("Simulation Complete", "Mock recording saved to Vault.");
                      stopSOS();
                    }, 4000); // 4 seconds of "live" recording
                  }, 1500); // 1.5s of "securing"
                }
              }
            ]
          );
        }
      }
    };

    setTimeout(() => tryToRecord(0), 1000);
  }, [isActualRecording, stopSOS]);

  const startSOS = useCallback(async () => {
    isCanceled.current = false;
    setIsRecording(true);
    setIsPreparing(true);
    if (isCameraReady) {
      runRecordingSequence();
    }
  }, [isCameraReady, runRecordingSequence]);

  if (!isFocused) return <View className="flex-1 bg-brand-dark" />;

  if (hasPermission === false) {
    return (
      <SafeAreaView className="flex-1 bg-brand-dark items-center justify-center px-10">
        <Text className="text-white text-center text-lg mb-4 font-medium italic">Hardware Access Required</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} className="bg-brand-green px-10 py-4 rounded-2xl">
          <Text className="text-brand-dark font-black">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 bg-brand-dark">
      <CameraView 
        ref={cameraRef}
        style={StyleSheet.absoluteFill} 
        facing="back"
        mode="video"
        onCameraReady={() => {
          setIsCameraReady(true);
          if (isRecording) runRecordingSequence();
        }}
        onMountError={(e: CameraMountError) => {
          console.error("Camera Mount Error:", e);
          if (isRecording) stopSOS();
        }}
      />

      {!isActualRecording && <View style={StyleSheet.absoluteFill} className="bg-brand-dark/95" />}

      {!isRecording ? (
        <View className="flex-1">
          <View className="absolute top-[-50px] left-[-20%] w-[140%] h-[300px] bg-[#141414]" style={{ transform: [{ rotate: '-5deg' }] }} />
          <View className="absolute top-[280px] left-[-10%] w-[120%] h-[400px] bg-[#111111]" style={{ transform: [{ rotate: '10deg' }] }} />
          
          <SafeAreaView className="flex-1 px-6">
            <View className="pt-4 flex-row justify-between items-center">
              <Image source={require('../../assets/logo.png')} style={{ width: 48, height: 48 }} resizeMode="contain" />
              <View className="flex-row">
                <TouchableOpacity onPress={() => navigation.navigate('Vault')} className="w-12 h-12 bg-brand-muted rounded-2xl border border-gray-800 items-center justify-center mr-3">
                  <Text style={{ fontSize: 20 }}>🛡️</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('TrustedPeople')} className="w-12 h-12 bg-brand-muted rounded-2xl border border-gray-800 items-center justify-center">
                  <Text style={{ fontSize: 20 }}>👥</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View className="flex-1 items-center justify-end pb-24">
              <Animated.View style={animatedGlow} className="absolute bottom-[86px] w-[260px] h-[260px] rounded-full bg-brand-green" />
              <View className="w-[230px] h-[230px] rounded-full bg-black items-center justify-center border-[6px] border-brand-green">
                <TouchableOpacity onPress={startSOS} activeOpacity={0.9} className="w-[190px] h-[190px] rounded-full bg-brand-green items-center justify-center">
                  <View className="w-16 h-16 rounded-full border-[4px] border-brand-dark items-center justify-center mb-2">
                    <Text style={{ color: '#000', fontSize: 32, fontWeight: '900' }}>!</Text>
                  </View>
                  <Text className="text-brand-dark text-2xl font-black tracking-tighter text-center leading-6 uppercase">Send SOS</Text>
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </View>
      ) : (
        <RecordingOverlay onStop={stopSOS} isPreparing={isPreparing} isActualRecording={isActualRecording} />
      )}
    </View>
  );
}
