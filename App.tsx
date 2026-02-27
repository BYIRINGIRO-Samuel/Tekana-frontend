import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import './global.css';
import IntroAnimationScreen from './src/screens/IntroAnimationScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import TrustedPeopleScreen from './src/screens/TrustedPeopleScreen';
import VaultScreen from './src/screens/VaultScreen';
import ProfileScreen from './src/screens/ProfileScreen';

export default function App() {
  const [screenStack, setScreenStack] = useState<string[]>(['Intro']);

  const navigate = (screen: string) => {
    setScreenStack(prev => [...prev, screen]);
  };

  const goBack = () => {
    if (screenStack.length > 1) {
      setScreenStack(prev => prev.slice(0, -1));
    }
  };

  const currentScreen = screenStack[screenStack.length - 1];

  const renderScreen = () => {
    switch (currentScreen) {
      case 'Intro':
        return <IntroAnimationScreen navigate={navigate} />;
      case 'Welcome':
        return <WelcomeScreen navigate={navigate} goBack={goBack} />;
      case 'Login':
        return <LoginScreen navigate={navigate} goBack={goBack} />;
      case 'Signup':
        return <SignupScreen navigate={navigate} goBack={goBack} />;
      case 'Dashboard':
        return <DashboardScreen navigate={navigate} goBack={goBack} />;
      case 'TrustedPeople':
        return <TrustedPeopleScreen navigate={navigate} goBack={goBack} />;
      case 'Vault':
        return <VaultScreen navigate={navigate} goBack={goBack} />;
      case 'Profile':
        return <ProfileScreen navigate={navigate} goBack={goBack} />;
      default:
        return <IntroAnimationScreen navigate={navigate} />;
    }
  };

  return (
    <SafeAreaProvider>
      {renderScreen()}
      <StatusBar style="light" />
    </SafeAreaProvider>
  );
}
