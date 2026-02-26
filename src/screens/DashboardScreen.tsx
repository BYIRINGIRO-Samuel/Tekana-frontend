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
} from 'react-native-reanimated';
import { cssInterop } from 'nativewind';

// Ensure Animated components work with NativeWind className
cssInterop(Animated.View, { className: 'style' });

const { width, height } = Dimensions.get('window');

const RecordingOverlay = ({ onStop, isPreparing, isActualRecording }: { onStop: () => void, isPreparing: boolean, isActualRecording: boolean }) => {
  const bars = Array.from({ length: 15 }, (_, i) => i);
  return (
    <View style={StyleSheet.absoluteFill} className="items-center justify-end pb-24 bg-black/40">
      {isPreparing && (
        <View className="absolute inset-0 items-center justify-center bg-black/90 z-50">
          <ActivityIndicator size="large" color="#A2D149" />
          <Text className="text-white mt-6 font-bold text-xl tracking-tight">SECURING FEED...</Text>
          <Text className="text-gray-400 text-sm mt-3 text-center px-16 leading-5">Establishing encrypted video surface. Do not close the app.</Text>
        </View>
      )}
      <View className="flex-row items-center justify-center mb-10 h-24 w-full px-12">
        {bars.map((bar) => <AudioBar key={`left-${bar}`} index={bar} active={isActualRecording} />)}
        <TouchableOpacity 
          onPress={onStop}
          activeOpacity={0.9}
          className="mx-4 w-20 h-20 rounded-3xl bg-brand-green items-center justify-center shadow-2xl shadow-brand-green/40"
        >
          <View style={{ width: 32, height: 32, borderRadius: 8 }} className="bg-brand-dark" />
        </TouchableOpacity>
        {bars.map((bar) => <AudioBar key={`right-${bar}`} index={bar} active={isActualRecording} />)}
      </View>
      {isActualRecording && (
        <View className="absolute top-16 left-6 flex-row items-center bg-red-600 px-4 py-2 rounded-full border border-red-400">
          <View className="w-2.5 h-2.5 rounded-full bg-white mr-2.5" />
          <Text className="text-white font-black text-xs uppercase tracking-widest">Live SOS Signal</Text>
        </View>
      )}
    </View>
  );
};

const AudioBar = ({ index, active }: { index: number, active: boolean }) => {
  const heightVal = useSharedValue(10);
  useEffect(() => {
    if (active) {
      heightVal.value = withRepeat(
        withSequence(
          withTiming(20 + Math.random() * 40, { duration: 300 + Math.random() * 200 }),
          withTiming(10, { duration: 300 + Math.random() * 200 })
        ),
        -1,
        true
      );
    } else {
      heightVal.value = withTiming(10);
    }
  }, [active]);
  const animatedStyle = useAnimatedStyle(() => ({ height: heightVal.value }));
  return <Animated.View style={animatedStyle} className="w-1 bg-brand-green mx-[2px] rounded-full" />;
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

    pulse.value = withRepeat(
      withSequence(withTiming(1.2, { duration: 1000 }), withTiming(1, { duration: 1000 })),
      -1,
      true
    );
  }, []);

  const animatedGlow = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
    opacity: interpolate(pulse.value, [1, 1.2], [0.6, 0.2]),
  }));

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
          // EMULATOR FALLBACK
          Alert.alert(
            "Hardware Error", 
            "Your device (likely an emulator) cannot create a persistent video surface. Would you like to simulate a successful SOS for testing?",
            [
              { text: "Cancel", onPress: () => stopSOS(), style: "cancel" },
              { 
                text: "Simulate SOS", 
                onPress: async () => {
                  setIsActualRecording(true);
                  setIsPreparing(false);
                  setTimeout(async () => {
                    const fileName = `simulated_sos_${Date.now()}.mp4`;
                    const destination = `${FileSystem.documentDirectory}recordings/${fileName}`;
                    // Create a dummy text file if no video exists to at least show something in vault
                    await FileSystem.writeAsStringAsync(destination, "Simulated SOS Data");
                    Alert.alert("Simulation Complete", "A mock recording has been saved to your Vault.");
                    stopSOS();
                  }, 3000);
                }
              }
            ]
          );
        }
      }
    };

    // Delay to ensure the UI has transitioned and surface is ready
    setTimeout(() => tryToRecord(0), 1000);
  }, [isActualRecording]);

  const startSOS = useCallback(async () => {
    isCanceled.current = false;
    setIsRecording(true);
    setIsPreparing(true);
    
    // If camera is already ready, start the sequence immediately
    if (isCameraReady) {
      runRecordingSequence();
    }
  }, [isCameraReady, runRecordingSequence]);

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

  // We only show the camera if the dashboard is focused
  if (!isFocused) return <View className="flex-1 bg-brand-dark" />;

  if (hasPermission === false) {
    return (
      <SafeAreaView className="flex-1 bg-brand-dark items-center justify-center px-10">
        <Text className="text-white text-center text-lg mb-4 font-medium italic text-balance">Hardware Access Required</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} className="bg-brand-green px-10 py-4 rounded-2xl">
          <Text className="text-brand-dark font-black">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 bg-brand-dark">
      {/* BACKGROUND CAMERA - Always mounted to avoid surface recreate lag */}
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

      {/* BLUR/OVERLAY Layer when NOT recording or when PREPARING */}
      {!isActualRecording && (
        <View style={StyleSheet.absoluteFill} className="bg-brand-dark/95" />
      )}

      {/* DASHBOARD CONTENT */}
      {!isRecording ? (
        <View className="flex-1">
          <View className="absolute top-[-50px] left-[-20%] w-[140%] h-[300px] bg-[#141414]" style={{ transform: [{ rotate: '-5deg' }] }} />
          <View className="absolute top-[280px] left-[-10%] w-[120%] h-[400px] bg-[#111111]" style={{ transform: [{ rotate: '10deg' }] }} />
          <SafeAreaView className="flex-1 px-6">
            <View className="pt-4 flex-row justify-between items-center">
              <Image source={require('../../assets/logo.png')} style={{ width: 48, height: 48 }} resizeMode="contain" />
              <View className="flex-row">
                <TouchableOpacity 
                  onPress={() => navigation.navigate('Vault')} 
                  className="w-12 h-12 bg-brand-muted rounded-2xl border border-gray-800 items-center justify-center mr-3"
                >
                  <Text style={{ fontSize: 20 }}>🛡️</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => navigation.navigate('TrustedPeople')} 
                  className="w-12 h-12 bg-brand-muted rounded-2xl border border-gray-800 items-center justify-center"
                >
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
                  <Text className="text-brand-dark text-2xl font-black tracking-tighter text-center leading-6 uppercase">SEND SOS</Text>
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
