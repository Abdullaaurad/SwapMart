import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from './src/screens/SplashScreen';
import LogIn from './src/screens/LogIn';
import SignUp from './src/screens/SignUp';
import ForgotPassword from './src/screens/ForgotPassword';
import Verification from './src/screens/Verification';
import LoadingScreen from './src/screens/LoadingScreen';
import Onboarding from './src/screens/Onboarding';

import Profile from './src/screens/Profile';
import EditProfile from './src/screens/EditProfile';
import PrivacyPolicy from './src/screens/PrivacyPolicy';
import PrivacySettings from './src/screens/PrivacySettings';
import HelpSupport from './src/screens/Help';
import FAQ from './src/screens/Faq';
import ChatScreen from './src/screens/ChatBox';
import SupportChat from './src/screens/SupportChat';
import AccountDelegation from './src/screens/DeleteAccount';
import ResetPassword from './src/screens/ResetPassword';
import LoginActivity from './src/screens/LoginActivity';
import FaqAnswer from './src/screens/FaqAnswer'
import RecoverPassword from './src/screens/RecoverPassword';

import HomeScreen from './src/screens/HomeScreen';
import ViewAllCategories from './src/screens/ViewAllCategory';
import ViewAllFeaturedItems from './src/screens/ViewAllFetured';
import Search from './src/screens/SearchScreen';
import AddProduct from './src/screens/AddProductFlow';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{ headerShown: false }}
      >
        {/* Initial & Auth Screens */}
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Onboarding" component={Onboarding} />
        <Stack.Screen name="LogIn" component={LogIn} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="ResetPassword" component={ResetPassword} />
        <Stack.Screen name="Verification" component={Verification} />
        <Stack.Screen name="LoadingScreen" component={LoadingScreen} />

        {/* Main App Screens */}
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="EditProfile" component={EditProfile} />
        <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
        <Stack.Screen name="PrivacySettings" component={PrivacySettings} />
        <Stack.Screen name="Help" component={HelpSupport} />
        <Stack.Screen name="FAQ" component={FAQ} />
        <Stack.Screen name="ChatScreen" component={ChatScreen} />
        <Stack.Screen name="SupportChat" component={SupportChat} />
        <Stack.Screen name="DeleteAccount" component={AccountDelegation} />
        <Stack.Screen name="LoginActivity" component={LoginActivity} />
        <Stack.Screen name="FaqAnswer" component={FaqAnswer} />
        <Stack.Screen name="RecoverPassword" component={RecoverPassword} />

        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="ViewAllCategories" component={ViewAllCategories} />
        <Stack.Screen name="ViewAllFeaturedItems" component={ViewAllFeaturedItems} />
        <Stack.Screen name="Search" component={Search} />
        <Stack.Screen name="AddProduct" component={AddProduct} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}
