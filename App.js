import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from './src/screens/SplashScreen';
import HomeScreen from './src/screens/HomeScreen';
import LogIn from './src/screens/LogIn'
import SignUp from './src/screens/SignUp'
import ForgotPassword from './src/screens/ForgotPassword';
import Verification from './src/screens/Verification'
import LoadingScreen from './src/screens/LoadingScreen';
import Onboarding from './src/screens/Onboarding';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="LogIn" component={LogIn} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="Verification" component={Verification} />
        <Stack.Screen name="Onboarding" component={Onboarding} />
        <Stack.Screen name="LoadingsScreen" component={LoadingsScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
