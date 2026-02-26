import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeOut } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

export default function IntroAnimationScreen() {
  const navigation = useNavigation<any>();

  useEffect(() => {
    // Navigate to Welcome screen after 4 seconds (approx length of a typical high-quality intro)
    const timer = setTimeout(() => {
      navigation.replace('Welcome');
    }, 4500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View exiting={FadeOut.duration(800)} style={styles.container}>
      <LottieView
        source={{ uri: 'https://assets9.lottiefiles.com/packages/lf20_ndm9v25o.json' }} // Security Shield scan animation
        autoPlay
        loop={false}
        style={styles.animation}
        onAnimationFinish={() => {
          // Alternative trigger: navigation.replace('Welcome');
        }}
      />
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
});
