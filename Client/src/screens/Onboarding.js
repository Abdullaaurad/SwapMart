import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Alert,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform,
  PermissionsAndroid,
  KeyboardAvoidingView,
  Keyboard,
} from "react-native";
import Colors from "../constants/colors";
import FormBox from "../components/FormBox";
import FormInput from "../components/FormInput";
import AnimatedButton from "../components/AnimatedButton";
import VerificationRow from "../components/Verification";
import { useNavigation } from "@react-navigation/native";
import CustomAlert from '../components/CustomAlert';
import axios from 'axios';
import { BASE_URL } from '../API/key';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OnboardingScreen = ({ route }) => {
  const navigation = useNavigation();
  const { userId: routeUserId } = route.params || {};
  
  const [userId, setUserId] = useState(null);
  const [jwtToken, setJwtToken] = useState(null);
  const [fullname, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  const [verificationStatus, setVerificationStatus] = useState({
    email: false,
    phone: false,
    location: false,
  });

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

  // Request permissions and get user data on component mount
  useEffect(() => {
    requestPermissions();
    getUserData();
  }, []);

  const getUserData = async () => {
    try {
      // Get userId and JWT token from AsyncStorage
      const storedUserId = await AsyncStorage.getItem('user_id');
      const storedToken = await AsyncStorage.getItem('jwt_token');
      
      if (!storedUserId || !storedToken) {
        showAlert('Authentication Error', 'Please login again', 'error', 'single', () => {
          navigation.navigate('LogIn');
        });
        return;
      }

      setUserId(storedUserId);
      setJwtToken(storedToken);
      
      // Set Authorization header for all requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      
      // If userId was passed via route params, use it as fallback
      if (!storedUserId && routeUserId) {
        setUserId(routeUserId);
      }
      
    } catch (error) {
      console.error('Error getting user data:', error);
      showAlert('Error', 'Failed to get user data. Please login again.', 'error', 'single', () => {
        navigation.navigate('LogIn');
      });
    }
  };

  const requestPermissions = async () => {
    try {
      // Request camera permissions
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      if (cameraStatus !== 'granted') {
        showAlert('Permission Required', 'Camera permission is needed to take profile photos', 'warning');
      }

      // Request location permissions
      const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
      if (locationStatus !== 'granted') {
        showAlert('Permission Required', 'Location permission is needed to set your location', 'warning');
      }
    } catch (error) {
      console.error('Error requesting permissions:', error);
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setProfileImage(result.assets[0].uri);
        showAlert('Success', 'Profile image selected successfully', 'success');
      }
    } catch (error) {
      console.error('Error picking image:', error);
      showAlert('Error', 'Failed to select image', 'error');
    }
  };

  const getCurrentLocation = async () => {
    try {
      setIsLoading(true);
      
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        showAlert('Permission Denied', 'Location permission is required', 'error');
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setLatitude(location.coords.latitude);
      setLongitude(location.coords.longitude);

      // Get address from coordinates
      const addressResponse = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (addressResponse.length > 0) {
        const address = addressResponse[0];
        const locationString = `${address.city || ''} ${address.region || ''} ${address.country || ''}`.trim();
        setLocation(locationString);
        setVerificationStatus(prev => ({ ...prev, location: true }));
        showAlert('Success', 'Location detected successfully', 'success');
      }
    } catch (error) {
      console.error('Error getting location:', error);
      showAlert('Error', 'Failed to get location. Please enter manually.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailVerify = () => {
    if (!email.trim()) {
      showAlert('Email Required', 'Please enter your email address first.', 'error');
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      showAlert('Invalid Email', 'Please enter a valid email address.', 'warning');
      return;
    }

    setVerificationStatus(prev => ({ ...prev, email: true }));
    showAlert('Email Verified', 'Your email has been successfully verified.', 'success');
  };

  const handlePhoneVerify = () => {
    if (!phone.trim()) {
      showAlert('Phone Required', 'Please enter your phone number first.', 'error');
      return;
    }

    if (phone.length < 10) {
      showAlert('Invalid Phone', 'Please enter a valid phone number.', 'error');
      return;
    }

    setVerificationStatus(prev => ({ ...prev, phone: true }));
    showAlert('Phone Verified', 'Your phone number has been successfully verified.', 'success');
  };

  const handleOnboarding = async () => {
    if (!userId) {
      showAlert('Authentication Error', 'User ID not found. Please login again.', 'error', 'single', () => {
        navigation.navigate('LogIn');
      });
      return;
    }

    if (!fullname.trim() || !email.trim() || !phone.trim() || !location.trim()) {
      showAlert('Incomplete', 'Please fill in all required fields', 'warning');
      return;
    }

    if (!verificationStatus.email || !verificationStatus.phone || !verificationStatus.location) {
      showAlert('Verification Required', 'Please verify your email, phone, and location', 'warning');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(`${BASE_URL}/users/onboard`, {
        userId: parseInt(userId),
        fullname,
        email,
        phone,
        profile_image: profileImage,
        bio,
        location,
        latitude,
        longitude,
      });

      if (response.data.success) {
        // Update the user's onboard status in AsyncStorage
        await AsyncStorage.setItem('user_onboarded', 'true');
        
        showAlert(
          'Success', 
          'Profile updated successfully!', 
          'success', 
          'none',
          () => { 
            navigation.navigate('Home');
          }
        );
      } else {
        showAlert('Error', response.data.message || 'Failed to update profile', 'error');
      }
    } catch (error) {
      console.error('Onboarding Error:', error);
      
      if (error.response) {
        const errorMessage = error.response.data?.message || 'Failed to update profile';
        
        // Handle authentication errors
        if (error.response.status === 401) {
          showAlert('Authentication Error', 'Session expired. Please login again.', 'error', 'single', () => {
            navigation.navigate('LogIn');
          });
        } else {
          showAlert('Error', errorMessage, 'error');
        }
      } else if (error.request) {
        showAlert(
          'Connection Error',
          'Could not connect to server. Please check your internet connection and try again.',
          'error'
        );
      } else {
        showAlert('Error', 'An unexpected error occurred. Please try again.', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep === 1) {
      if (!fullname.trim() || !email.trim() || !phone.trim()) {
        showAlert('Incomplete', 'Please fill in all fields in step 1', 'warning');
        return;
      }
      setCurrentStep(2);
    }
  };

  const prevStep = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section - Hide when keyboard is visible */}
          {!isKeyboardVisible && (
            <View style={styles.header}>
              <View style={styles.headerBackground} />
              <Text style={styles.welcomeTitle}>Complete Your Profile</Text>
              <Text style={styles.welcomeSubtitle}>
                {currentStep === 1 ? 'Step 1: Basic Information' : 'Step 2: Location & Photo'}
              </Text>

              {/* Step Indicator */}
              <View style={styles.stepIndicator}>
                <View style={[styles.step, currentStep === 1 && styles.activeStep]}>
                  <Text style={[styles.stepText, currentStep === 1 && styles.activeStepText]}>1</Text>
                </View>
                <View style={[styles.stepLine, currentStep === 2 && styles.activeStepLine]} />
                <View style={[styles.step, currentStep === 2 && styles.activeStep]}>
                  <Text style={[styles.stepText, currentStep === 2 && styles.activeStepText]}>2</Text>
                </View>
              </View>
            </View>
          )}

          <View style={[styles.content, isKeyboardVisible && styles.contentWithKeyboard]}>
            <FormBox style={styles.formBox}>
              {currentStep === 1 ? (
                // Step 1: Basic Information
                <>
                  <View style={styles.inputSection}>
                    <FormInput
                      label="Full Name"
                      placeholder="Enter your full name"
                      iconName="person-outline"
                      value={fullname}
                      onChangeText={setFullName}
                    />

                    <FormInput
                      label="Email"
                      placeholder="Enter your email"
                      iconName="mail-outline"
                      value={email}
                      onChangeText={setEmail}
                      autoCapitalize="none"
                      keyboardType="email-address"
                    />

                    <VerificationRow
                      type="email"
                      isVerified={verificationStatus.email}
                      onVerify={handleEmailVerify}
                    />

                    <FormInput
                      label="Phone Number"
                      placeholder="Enter your phone number"
                      iconName="call-outline"
                      value={phone}
                      onChangeText={setPhone}
                      keyboardType="phone-pad"
                    />

                    <VerificationRow
                      type="phone"
                      isVerified={verificationStatus.phone}
                      onVerify={handlePhoneVerify}
                    />

                    <FormInput
                      label="Bio (Optional)"
                      placeholder="Tell us about yourself"
                      iconName="chatbubble-outline"
                      value={bio}
                      onChangeText={setBio}
                      multiline
                      numberOfLines={3}
                    />
                  </View>

                  <AnimatedButton 
                    title="Next Step →" 
                    onPress={nextStep}
                    style={styles.nextButton}
                  />
                </>
              ) : (
                // Step 2: Location & Photo
                <>
                  {/* Profile Photo Section */}
                  <View style={styles.photoSection}>
                    <View style={styles.sectionHeader}>
                      <Text style={styles.sectionTitle}>Profile Photo</Text>
                      <View style={styles.hrLine} />
                    </View>
                    
                    <View style={styles.photoContainer}>
                      <TouchableOpacity style={styles.photoWrapper} onPress={pickImage}>
                        {profileImage ? (
                          <View style={styles.imageContainer}>
                            <Image source={{ uri: profileImage }} style={styles.profileImage} />
                            <View style={styles.editBadge}>
                              <Text style={styles.editIcon}>✏️</Text>
                            </View>
                          </View>
                        ) : (
                          <View style={styles.photoPlaceholder}>
                            <View style={styles.photoIcon}>
                              <Text style={styles.photoIconText}>📷</Text>
                            </View>
                            <Text style={styles.photoPlaceholderText}>Add Photo</Text>
                            <Text style={styles.photoPlaceholderSubtext}>Tap to select from gallery</Text>
                          </View>
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Location Section */}
                  <View style={styles.locationSection}>
                    <View style={styles.sectionHeader}>
                      <Text style={styles.sectionTitle}>Location</Text>
                      <View style={styles.hrLine} />
                    </View>
                    
                    <FormInput
                      label=""
                      placeholder="Enter your location"
                      iconName="location-outline"
                      value={location}
                      onChangeText={setLocation}
                      containerStyle={{marginTop: -30}}
                    />

                    <TouchableOpacity 
                      style={[styles.gpsButton, isLoading && styles.gpsButtonLoading]} 
                      onPress={getCurrentLocation}
                      disabled={isLoading}
                    >
                      <View style={styles.gpsButtonContent}>
                        <Text style={styles.gpsIcon}>📍</Text>
                        <Text style={styles.gpsButtonText}>
                          {isLoading ? 'Getting Location...' : 'Use GPS Location'}
                        </Text>
                      </View>
                    </TouchableOpacity>
                    
                    {verificationStatus.location && (
                      <View style={styles.locationVerified}>
                        <Text style={styles.verifiedIcon}>✅</Text>
                        <Text style={styles.verifiedText}>Location verified</Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.buttonContainer}>
                    <AnimatedButton 
                      title="← Previous" 
                      onPress={prevStep}
                      style={[styles.actionButton, styles.secondaryButton, { width: '100%', marginRight: 60 }]}
                      secondary
                    />
                    <AnimatedButton 
                      title={isLoading ? "Saving..." : "Complete Profile"} 
                      onPress={handleOnboarding}
                      style={[styles.actionButton, styles.primaryButton, { width: '115%',marginLeft: 10 }]}
                      loading={isLoading}
                    />
                  </View>
                </>
              )}
            </FormBox>
          </View>
        </ScrollView>

        <CustomAlert
          visible={alertConfig.visible}
          title={alertConfig.title}
          message={alertConfig.message}
          type={alertConfig.type}
          buttonType={alertConfig.buttonType}
          onClose={alertConfig.onClose}
        />
      </KeyboardAvoidingView>
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
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    position: 'relative',
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '150%',
    backgroundColor: Colors.primary,
    opacity: 0.05,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.neutral1000,
    textAlign: "center",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: Colors.neutral600,
    textAlign: "center",
    marginBottom: 25,
    fontWeight: '500',
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  step: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: Colors.neutral200,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.neutral1000,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activeStep: {
    backgroundColor: Colors.primary,
    transform: [{ scale: 1.1 }],
  },
  stepText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.neutral600,
  },
  activeStepText: {
    color: Colors.neutral0,
  },
  stepLine: {
    width: 80,
    height: 3,
    backgroundColor: Colors.neutral300,
    marginHorizontal: 15,
    borderRadius: 1.5,
  },
  activeStepLine: {
    backgroundColor: Colors.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  contentWithKeyboard: {
    paddingTop: 20,
  },
  formBox: {
    shadowColor: Colors.neutral1000,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  inputSection: {
    marginBottom: 0,
  },
  nextButton: {
    marginTop: 0,
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  sectionHeader: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.neutral1000,
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  hrLine: {
    height: 2,
    backgroundColor: Colors.primary,
    borderRadius: 1,
    opacity: 0.3,
  },
  photoSection: {
    marginBottom: 20,
  },
  photoContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  photoWrapper: {
    position: 'relative',
  },
  imageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 4,
    borderColor: Colors.primary,
    shadowColor: Colors.neutral1000,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  editBadge: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.neutral1000,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  editIcon: {
    fontSize: 16,
  },
  photoPlaceholder: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 3,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.neutral50,
    shadowColor: Colors.neutral1000,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  photoIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    opacity: 0.8,
  },
  photoIconText: {
    fontSize: 20,
  },
  photoPlaceholderText: {
    fontSize: 16,
    color: Colors.neutral700,
    fontWeight: '600',
    marginBottom: 4,
  },
  photoPlaceholderSubtext: {
    fontSize: 12,
    color: Colors.neutral500,
    textAlign: 'center',
  },
  locationSection: {
    marginBottom: 10,
  },
  gpsButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 15,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  gpsButtonLoading: {
    backgroundColor: Colors.neutral400,
  },
  gpsButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gpsIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  gpsButtonText: {
    color: Colors.neutral0,
    fontSize: 16,
    fontWeight: '600',
  },
  locationVerified: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -10,
  },
  verifiedIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  verifiedText: {
    color: Colors.success,
    fontSize: 14,
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    shadowColor: Colors.neutral1000,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  secondaryButton: {
    backgroundColor: Colors.neutral200,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
  },
});

export default OnboardingScreen;