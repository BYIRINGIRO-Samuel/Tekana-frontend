import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';
import Animated, { FadeOut, FadeIn } from 'react-native-reanimated';
import { authService } from '../services/authService';

const { width } = Dimensions.get('window');

export default function IntroAnimationScreen({ navigate }: { navigate: (screen: string) => void }) {
  useEffect(() => {
    const checkAuthAndNavigate = async () => {
      try {
        const authenticated = await authService.isAuthenticated();
        console.log('Authenticated:', authenticated);
        
        setTimeout(() => {
          console.log('Navigating...');
          if (authenticated) {
            navigate('Dashboard');
          } else {
            navigate('Welcome');
          }
        }, 1000);
      } catch (error) {
        console.error('Error checking auth:', error);
        // Fallback to Welcome if error
        setTimeout(() => {
          navigate('Welcome');
        }, 1000);
      }
    };

    checkAuthAndNavigate();
  }, []);

  return (
    <Animated.View exiting={FadeOut.duration(800)} style={styles.container}>
      <LottieView
        source={{ uri: 'https://lottie.host/7970d4f3-7848-4395-8854-fc946e356885/mB1XbL3Oat.json' }}
        autoPlay
        loop={false}
        style={styles.animation}
      />
      <View style={{ position: 'absolute', bottom: 100 }}>
        <Animated.Text entering={FadeIn.delay(1000)} style={styles.fallbackText}>
          Tekana
        </Animated.Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  animation: {
    width: width * 0.9,
    height: width * 0.9,
  },
  fallbackText: {
    color: '#A2D149',
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 10,
    textTransform: 'uppercase',
  }
});
