import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Image,
  ScrollView,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Colors from "../constants/colors";
import FormBox from "../components/FormBox";
import Header from "../components/Header";
import FormInput from "../components/FormInput";
import VerificationRow from "../components/Verification";
import CustomAlert from "../components/CustomAlert";
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { BASE_URL } from '../API/key';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Linking from 'expo-linking';
// Add these imports for camera and gallery functionality
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';

const EditProfileScreen = () => {
  const navigation = useNavigation();
  const [profileData, setProfileData] = useState({
    username: "",
    email: "",
    fullname: "",
    phoneNumber: "",
    profileImage: "",
    bio: "",
    location: '',
    latitude: null,
    longitude: null,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [verificationStatus, setVerificationStatus] = useState({
    email: true,
    contact: true,
  });

  useEffect(() => {
    const ProfileData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/users/Profile`);
        if (response.data.success) {
          const userData = response.data.user;
          setProfileData({
            username: userData.username || '',
            email: userData.email || '',
            fullname: userData.fullname || '',
            phoneNumber: userData.phone || '',
            profileImage: userData.profile_image || '',
            bio: userData.bio || '',
            location: userData.location || '',
            latitude: userData.latitude,
            longitude: userData.longitude,
          });
          setEmail(userData.email || '');
          setContact(userData.phone || '');
        } else {
          console.error('Failed to fetch profile data:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
        showAlert(
          'Error',
          'Failed to load profile data. Please try again.',
          'error',
          'none',
        );
      }
    }

    ProfileData();
  }, []);

  // Request permissions on component mount
  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    try {
      // Request camera permission
      const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
      
      // Request media library permission
      const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (cameraStatus !== 'granted') {
        console.warn('Camera permission not granted');
      }
      
      if (mediaStatus !== 'granted') {
        console.warn('Media library permission not granted');
      }
    } catch (error) {
      console.error('Error requesting permissions:', error);
    }
  };

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

  const handleEmailVerify = () => {
    if (verificationStatus.email) {
      setVerificationStatus((prev) => ({ ...prev, email: false }));
      showAlert(
        'Email Reset',
        'You can now enter a new email address and verify it.',
        'info',
        'none',
      )
      return;
    }

    if (!email.trim()) {
      showAlert(
        'Email Required',
        'Please enter your email address first.',
        'warning',
        'none',
      );
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      showAlert(
        'Invalid Email',
        'Please enter a valid email address.',
        'warning',
        'none',
      );
      return;
    }

    setTimeout(() => {
      setVerificationStatus((prev) => ({ ...prev, email: true }));
      showAlert(
        'Email Verified',
        'Your email address has been successfully verified.',
        'success',
        'none',
      );
    }, 1000);
  };

  const handleContactVerify = () => {
    if (verificationStatus.contact) {
      setVerificationStatus((prev) => ({ ...prev, contact: false }));
      showAlert(
        'Contact Reset',
        'You can now enter a new contact number and verify it.',
        'info',
        'none',
      );
      return;
    }

    if (!contact.trim()) {
      showAlert(
        'Contact Required',
        'Please enter your contact number first.',
        'warning',
        'none',
      );
      return;
    }

    if (contact.length < 10) {
      showAlert(
        'Invalid Contact',
        'Please enter a valid contact number.',
        'warning',
        'none',
      );
      return;
    }

    setTimeout(() => {
      setVerificationStatus((prev) => ({ ...prev, contact: true }));
      showAlert(
        'Contact Verified',
        'Your contact number has been successfully verified.',
        'success',
        'none',
      );
    }, 1000);
  };

  const handleInputChange = (field, value) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setHasChanges(true);
  };

  const handleLocationChange = (location) => {
    handleInputChange('location', location);
  };

  const openMapForLocation = () => {
    if (profileData.latitude && profileData.longitude) {
      const url = `https://www.google.com/maps?q=${profileData.latitude},${profileData.longitude}`;
      Linking.openURL(url);
    } else {
      showAlert(
        'No Location',
        'No location coordinates available to view on map.',
        'warning',
        'none',
      );
    }
  };

  // Updated function with actual camera and gallery functionality
  const handleChangeProfilePicture = () => {
    Alert.alert("Change Profile Picture", "Choose an option", [
      {
        text: "Camera",
        onPress: openCamera,
      },
      {
        text: "Gallery",
        onPress: openGallery,
      },
      {
        text: "Remove Photo",
        style: "destructive",
        onPress: () => handleInputChange("profileImage", ""),
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const openCamera = async () => {
    try {
      // Check camera permission
      const { status } = await Camera.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        showAlert(
          'Permission Required',
          'Camera permission is required to take photos. Please enable it in your device settings.',
          'warning',
          'none',
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;
        handleInputChange("profileImage", imageUri);
        showAlert(
          'Success',
          'Profile picture updated successfully!',
          'success',
          'none',
        );
      }
    } catch (error) {
      console.error('Error opening camera:', error);
      showAlert(
        'Error',
        'Failed to open camera. Please try again.',
        'error',
        'none',
      );
    }
  };

  const openGallery = async () => {
    try {
      // Check media library permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        showAlert(
          'Permission Required',
          'Gallery access permission is required to select photos. Please enable it in your device settings.',
          'warning',
          'none',
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;
        handleInputChange("profileImage", imageUri);
        showAlert(
          'Success',
          'Profile picture updated successfully!',
          'success',
          'none',
        );
      }
    } catch (error) {
      console.error('Error opening gallery:', error);
      showAlert(
        'Error',
        'Failed to open gallery. Please try again.',
        'error',
        'none',
      );
    }
  };

  const handleSave = async () => {
    if (!hasChanges) {
      showAlert(
        'No Changes',
        'No changes were made to your profile.',
        'info',
        'none',
      );
      return;
    }

    if (!profileData.fullname.trim()) {
      showAlert(
        'Full Name Required',
        'Please enter your full name.',
        'warning',
        'none',
      );
      return;
    }

    if (!email.trim()) {
      showAlert(
        'Email Required',
        'Please enter your email address.',
        'warning',
        'none',
      );
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showAlert(
        'Invalid Email',
        'Please enter a valid email address.',
        'warning',
        'none',
      );
      return;
    }

    if (!verificationStatus.email || !verificationStatus.contact) {
      showAlert(
        'Verification Required',
        'Please verify your email and contact number before saving.',
        'warning',
        'none',
      );
      return;
    }

    setIsLoading(true);

    try {
      const updateData = {
        email: email,
        phone: contact,
        profile_image: profileData.profileImage,
        bio: profileData.bio,
        location: profileData.location,
        latitude: profileData.latitude,
        longitude: profileData.longitude,
      };

      const response = await axios.put(`${BASE_URL}/users/update-profile`, updateData);
      
      if (response.data.success) {
        showAlert(
          'Success',
          'Profile updated successfully!',
          'success',
          'none',
          () => {
            setHasChanges(false);
            navigation.navigate('Profile');
          }
        );
      } else {
        showAlert(
          'Error',
          response.data.message || 'Failed to update profile.',
          'error',
          'none',
        );
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      showAlert(
        'Error',
        'Failed to update profile. Please try again.',
        'error',
        'none',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      Alert.alert("Discard Changes", "You have unsaved changes. Are you sure you want to go back?", [
        { text: "Stay", style: "cancel" },
        {
          text: "Discard",
          style: "destructive",
          onPress: () => navigation.navigate('Profile'),
        },
      ]);
    } else {
      navigation.navigate('Profile');
    }
  };

  const renderProfileImage = () => {
    if (profileData.profileImage) {
      return <Image source={{ uri: profileData.profileImage }} style={styles.profileImage} />;
    } else {
      return (
        <View style={styles.profileImagePlaceholder}>
          <Icon name="person" size={50} color={Colors.primary} />
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header icon="back" name="Edit Profile" onIconPress={() => navigation.navigate('Profile')} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.imageSection}>
          <TouchableOpacity style={styles.imageContainer} onPress={handleChangeProfilePicture} activeOpacity={0.8}>
            {renderProfileImage()}
            <View style={styles.changeImageOverlay}>
              <Icon name="camera" size={20} color={Colors.neutral0} />
            </View>
          </TouchableOpacity>
          <Text style={styles.imageHint}>Tap to change profile picture</Text>
        </View>

        <FormBox style={styles.formCard}>
          <View style={styles.cardHeader}>
            <Icon name="person-outline" size={20} color={Colors.primary} />
            <Text style={styles.cardTitle}>Personal Information</Text>
          </View>

          <FormInput
            label="Full Name"
            placeholder="Enter your full name"
            iconName="person-outline"
            value={profileData.fullname}
            onChangeText={(text) => handleInputChange("fullname", text)}
          />

          <FormInput
            label="Username"
            value={profileData.username}
            onChangeText={(text) =>
              handleInputChange("username", text.toLowerCase().replace(/[^a-z0-9_]/g, ""))
            }
            placeholder="Enter your username"
            iconName="at-outline"
            maxLength={30}
          />

          <FormInput
            label="Email"
            placeholder="Enter your email"
            iconName="mail-outline"
            value={email}
            onChangeText={(text) => setEmail(text)}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <VerificationRow type="email" isVerified={verificationStatus.email} onVerify={handleEmailVerify} />

          <FormInput
            label="Contact Number"
            placeholder="Enter your contact"
            iconName="call-outline"
            value={contact}
            onChangeText={(text) => setContact(text)}
            keyboardType="phone-pad"
          />
          <VerificationRow
            type="contact"
            isVerified={verificationStatus.contact}
            onVerify={handleContactVerify}
            style={{ marginBottom: 10 }}
          />

          <FormInput
            label="Bio"
            placeholder="Tell us about yourself"
            iconName="document-text-outline"
            value={profileData.bio}
            onChangeText={(text) => handleInputChange("bio", text)}
            multiline={true}
            numberOfLines={3}
          />
        </FormBox>

        <FormBox style={styles.locationCard}>
          <View style={styles.cardHeader}>
            <Icon name="location-outline" size={20} color={Colors.primary} />
            <Text style={styles.cardTitle}>Location</Text>
          </View>

          <FormInput
            label="Address"
            placeholder="Enter your address"
            iconName="location-outline"
            value={profileData.location}
            onChangeText={(text) => handleLocationChange(text)}
          />

          {profileData.latitude && profileData.longitude && (
            <TouchableOpacity 
              style={styles.mapButton}
              onPress={openMapForLocation}
            >
              <Text style={styles.mapButtonText}>View Current Location on Map</Text>
            </TouchableOpacity>
          )}
        </FormBox>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel} disabled={isLoading}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.saveButton, (!hasChanges || isLoading) && styles.disabledButton]}
            onPress={handleSave}
            disabled={!hasChanges || isLoading}
          >
            <Text style={styles.saveButtonText}>{isLoading ? "Saving..." : "Save Changes"}</Text>
          </TouchableOpacity>
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
    paddingHorizontal: 20,
  },
  imageSection: {
    alignItems: "center",
    paddingVertical: 20,
    paddingBottom: 15,
  },
  imageContainer: {
    position: "relative",
    marginBottom: 6,
    elevation: 15,
  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: Colors.neutral0,
  },
  profileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.neutral100,
    borderWidth: 4,
    borderColor: Colors.neutral0,
    alignItems: "center",
    justifyContent: "center",
  },
  changeImageOverlay: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: Colors.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: Colors.neutral0,
    elevation: 3,
  },
  imageHint: {
    fontSize: 14,
    color: Colors.neutral500,
    fontStyle: "italic",
  },
  formCard: {
    marginBottom: 16,
  },
  locationCard: {
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral200,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.neutral1000,
    marginLeft: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: Colors.neutral100,
    borderWidth: 1,
    borderColor: Colors.neutral200,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.neutral600,
  },
  saveButton: {
    backgroundColor: Colors.primary,
  },
  disabledButton: {
    backgroundColor: Colors.neutral200,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.neutral0,
  },
  mapButton: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  mapButtonText: {
    color: Colors.neutral0,
    fontSize: 16,
    fontWeight: "600",
  },
});

export default EditProfileScreen;