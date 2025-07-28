import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
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
import AsyncStorage from '@react-native-async-storage/async-storage';

const LogIn = ({
  onLogin,
  onGoogleLogin,
  onAppleLogin,
  onSignUp,
  onForgotPassword,
}) => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

    const [alertConfig, setAlertConfig] = useState({
      visible: false,
      title: '',
      message: '',
      type: 'info',
      buttonType: 'none',
      onClose: () => { },
    });
  
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

  const handleLogIn = async () => {
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

  try {
    const response = await axios.post(`${BASE_URL}/users/login`, {
      username,
      password,
    });

    if (response.data.success) {
      const { token, user } = response.data;
      
      try {
        if (token) {
          await AsyncStorage.setItem('jwt_token', token);
        }
        if (user) {
          await AsyncStorage.setItem('user_id', user.id?.toString() || '');
        }
        if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        console.log(response.data);
        
        showAlert(
          'Success',
          'Login successful!',
          'success',
          'none',
          () => {
            response.data.onboard? navigation.navigate('Home') : navigation.navigate('Onboarding');
          }
        );
        
      } catch (storageError) {
        console.error('Storage error:', storageError);
        showAlert(
          'Warning',
          'Login successful, but failed to save session data.',
          'warning',
          'single'
        );
      }
      
    } else {
      const errorMessage = response.data.message || 'Something went wrong';
      if (!fieldErrorHandled) {
        showAlert('Login Failed', errorMessage, 'error', 'single');
      }
    }
    
  } catch (error) {    
      if (error.response) {
        // Server responded with error status
        const errorMessage = error.response.data?.message || 'Login failed';
        const errorRow = error.response.data?.row;
        
        // Handle specific field errors for login
        if (errorRow === 'username') {
          setUsernameError(error.response.data.message || 'Invalid username');
        } else if (errorRow === 'password') {
          setPasswordError(error.response.data.message || 'Invalid password');
        } else {
          showAlert('Login Failed', errorMessage, 'error', 'single');
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
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.iconContainer}>
          <Image
            source={require('../assets/logo_dark_no_bg_no_name.png')}
            style={styles.Logo}
          />
        </View>

        {/* Welcome Text */}
        <Text style={styles.welcomeTitle}>Welcome Back</Text>
        <Text style={styles.welcomeSubtitle}>Sign in to your car account</Text>

        <FormBox>
          {/* Username Input */}
          <FormInput
            label="Username"
            placeholder="Enter your username"
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

          {/* Remember Me & Forgot Password */}
          <View style={styles.optionsRow}>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity
                style={styles.rememberMeContainer}
                onPress={() => setRememberMe(!rememberMe)}
              >
                <View
                  style={[
                    styles.checkbox,
                    rememberMe && styles.checkboxChecked,
                  ]}
                >
                  {rememberMe && (
                    <Icon name="checkmark" size={12} color="white" />
                  )}
                </View>
              </TouchableOpacity>
              <Text style={styles.rememberMeText}>Remember me</Text>
            </View>

            <TouchableOpacity
              onPress={() => {
                navigation.navigate('ForgotPassword');
              }}
            >
              <Link link="Forgot password?" />
            </TouchableOpacity>
          </View>

          {/* Sign In Button */}
          <AnimatedButton
            title={isLoading ? 'Login...' : 'Log In'}
            onPress={handleLogIn}
            style={{ marginBottom: 24 }}
          />

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>Or continue with</Text>
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
          <Text style={styles.signUpText}>Don't have an account? </Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('SignUp');
            }}
          >
            <Link link="Sign up" style={{marginBottom: 25}}/>
          </TouchableOpacity>
        </View>
      </View>

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
    marginBottom: 20,
  },
  Logo: {
    width: 110,
    height: 110,
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
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: -2,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Colors.neutral300,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  rememberMeText: {
    fontSize: 14,
    color: Colors.neutral700,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.neutral500,
  },
  dividerText: {
    marginHorizontal: 14,
    fontSize: 14,
    color: Colors.neutral500,
    marginTop: -2,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpText: {
    fontSize: 16,
    color: Colors.neutral500,
    marginTop: 5,
    marginBottom: 25,
  },
});

export default LogIn;
