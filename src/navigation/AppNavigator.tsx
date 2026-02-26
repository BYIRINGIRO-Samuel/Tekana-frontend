import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import DashboardScreen from '../screens/DashboardScreen';
import TrustedPeopleScreen from '../screens/TrustedPeopleScreen';
import AddPersonScreen from '../screens/AddPersonScreen';
import VaultScreen from '../screens/VaultScreen';
import IntroAnimationScreen from '../screens/IntroAnimationScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator 
      initialRouteName="Intro"
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}
    >
      <Stack.Screen name="Intro" component={IntroAnimationScreen} />
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="TrustedPeople" component={TrustedPeopleScreen} />
      <Stack.Screen name="AddPerson" component={AddPersonScreen} />
      <Stack.Screen name="Vault" component={VaultScreen} />
    </Stack.Navigator>
  );
}
