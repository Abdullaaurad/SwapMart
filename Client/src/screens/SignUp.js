import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import Colors from '../constants/colors';
import AnimatedButton from '../components/AnimatedButton';
import FormInput from '../components/FormInput';
import Link from '../components/Link';
import SocialLoginButtons from '../components/SocialLoginButtons';
import FormBox from '../components/FormBox';
import CustomAlert from '../components/CustomAlert';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { BASE_URL } from '../API/key';

const SignUpScreen = ({
  onSignUp,
  onGoogleLogin,
  onAppleLogin,
  onLoginRedirect,
}) => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: '',
    message: '',
    type: 'info',
    buttonType: 'none',
    onClose: () => { },
  });

  // Listen for keyboard events
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidHideListener?.remove();
      keyboardDidShowListener?.remove();
    };
  }, []);

  const showAlert = (title, message, type = 'info', buttonType = 'none', onClose = () => { }) => {
    setAlertConfig({
      visible: true,
      title,
      message,
      type,
      buttonType,
      onClose: () => {
        setAlertConfig(prev => ({ ...prev, visible: false }));
        onClose();
      },
    });
  };

  const handleUsernameChange = (text) => {
    setUsername(text);
    if (usernameError) {
      setUsernameError('');
    }
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
    if (passwordError) {
      setPasswordError('');
    }
  };

  // Clear all field errors
  const clearFieldErrors = () => {
    setUsernameError('');
    setPasswordError('');
  };

  const handleSignUp = async () => {
    // Clear any existing errors
    clearFieldErrors();
    
    // Basic validation
    if (!username.trim() || !password.trim()) {
      if (!username.trim()) {
        setUsernameError('Username is required');
      }
      if (!password.trim()) {
        setPasswordError('Password is required');
      }
      return;
    }

    setIsLoading(true);
    console.log(username, password);

    try {
      const response = await axios.post(`${BASE_URL}/users/signup`, {
        username,
        password,
      });

      if (response.data.success) {
        showAlert(
          'Success', 
          'Account created successfully!', 
          'success', 
          'none',
          () => { 
            navigation.navigate('LogIn');
          }
        );
      } else {
        // Handle server response with success: false
        const errorMessage = response.data.message;
        
        // If no field errors, show general alert
        if (errorMessage) {
          showAlert('Error', errorMessage, 'error', 'single');
        }
      }
    } catch (error) {
      console.error('SignUp Error:', error);
      
      if (error.response) {
        // Server responded with error status
        const errorMessage = error.response.data?.message || 'Registration failed';
        if(error.response.data.row === 'username'){
          setUsernameError('Username already exists');
        }else if(error.response.data.row === 'password'){
          setPasswordError('Password must be at least 6 characters long');
        }else{
          showAlert('Registration Failed', errorMessage, 'error', 'none');
        }     
      } else if (error.request) {
        // Network error
        showAlert(
          'Connection Error',
          'Could not connect to server. Please check your internet connection and try again.',
          'error',
          'single'
        );
      } else {
        // Other error
        showAlert('Error', 'An unexpected error occurred. Please try again.', 'error', 'single');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <View style={styles.content}>
          {/* Logo - Hide when keyboard is visible */}
          {!isKeyboardVisible && (
            <View style={styles.iconContainer}>
              <Image
                source={require('../assets/logo_dark_no_bg_no_name.png')}
                style={styles.Logo}
              />
            </View>
          )}

          {/* Welcome Text - Hide when keyboard is visible */}
          {!isKeyboardVisible && (
            <>
              <Text style={styles.welcomeTitle}>Create Account</Text>
              <Text style={styles.welcomeSubtitle}>Sign up for a new car account</Text>
            </>
          )}

          <FormBox>
            {/* Username Input */}
            <FormInput
              label="Username"
              placeholder="Choose a username"
              iconName="person-outline"
              value={username}
              onChangeText={handleUsernameChange}
              autoCapitalize="none"
              autoCorrect={false}
              error={usernameError}
            />

            {/* Password Input */}
            <FormInput
              label="Password"
              placeholder="Enter your password"
              iconName="lock-closed-outline"
              value={password}
              onChangeText={handlePasswordChange}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              error={passwordError}
            />

            {/* Sign Up Button */}
            <AnimatedButton
              title={isLoading ? 'Signing Up...' : 'Sign Up'}
              onPress={handleSignUp}
              style={{ marginBottom: 24 }}
              loading={isLoading}
            />

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>Or sign up with</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Login Buttons */}
            <SocialLoginButtons
              onGoogleLogin={onGoogleLogin}
              onAppleLogin={onAppleLogin}
            />
          </FormBox>

          {/* Sign Up Link */}
          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>Already have an account? </Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('LogIn');
              }}
            >
              <Link link="LogIn" style={{ marginTop: 2 }}/>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        buttonType={alertConfig.buttonType}
        onClose={alertConfig.onClose}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primarybg,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    justifyContent: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 15,
  },
  Logo: {
    width: 100,
    height: 100,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.neutral1000,
    textAlign: 'center',
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: Colors.neutral500,
    textAlign: 'center',
    marginBottom: 30,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.neutral500,
  },
  dividerText: {
    marginHorizontal: 6,
    fontSize: 14,
    color: Colors.neutral500,
    marginTop: -10,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpText: {
    fontSize: 16,
    color: Colors.neutral500,
    marginTop: 2,
  },
});

export default SignUpScreen;