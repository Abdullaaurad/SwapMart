import React, { useState, useEffect, use } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../constants/colors';
import FormBox from '../components/FormBox';
import Header from '../components/Header';
import { useNavigation } from '@react-navigation/native';
import ProfileField from '../components/ProfileField';
import CustomAlert from '../components/CustomAlert';
import * as Linking from 'expo-linking';
import axios from 'axios';
import { BASE_URL } from '../API/key';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserProfileScreen = () => {
  const navigation = useNavigation();
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    fullname: '',
    phoneNumber: '',
    profileImage: '', // Empty string means no image
    bio: '',
    location: '',
    latitude: null,
    longitude: null,
  });

  const logout = async () => {
    try{
      const response = await axios.post(`${BASE_URL}/users/Logout`)
      if(response.data.success) {
        AsyncStorage.removeItem('token');
        showAlert(
          'Logout',
          'Logout successful',
          'success',
          'none',
        );
        setTimeout(() => {
          navigation.navigate('LogIn');
        }, 1000);
      }
    }
    catch (error) {
      console.error('Logout error:', error);
      showAlert(
        'Logout Error',
        'An error occurred while logging out. Please try again.',
        'error',
        'none',
      );
    }
  }

  useEffect(() => {
    const ProfileData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/users/Profile`);
        // console.log('Profile Data:', response.data);
        if (response.data.success) {
          setProfileData({
            email: response.data.user.email,
            fullname: response.data.user.fullname,
            phoneNumber: response.data.user.phone,
            profileImage: response.data.user.profile_image || '',
            bio: response.data.user.bio,
            location: response.data.user.location,
            latitude: response.data.user.latitude,
            longitude: response.data.user.longitude,
          });
        } else {
          console.error('Failed to fetch profile data:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    }

    ProfileData();
  }, []);

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

  const handleLogout = () => {
    showAlert(
      'Logout',
      'Are you sure you want to logout?',
      'error',
      'double',
      () => {
        // Handle logout logic here
        setTimeout(() => {
          logout();
        }, 1000);
        navigation.navigate('LogIn'); // Navigate to Login screen after logout
      }
    );
  };

  const renderProfileImage = () => {
    if (profileData.profileImage) {
      return (
        <Image 
          source={{ uri: profileData.profileImage }} 
          style={styles.profileImage} 
        />
      );
    } else {
      return (
        <View style={styles.profileImagePlaceholder}>
          <Icon 
            name="person" 
            size={50} 
            color={Colors.primary} 
          />
        </View>
      );
    }
  };

  const openMap = () => {
    const url = `https://www.google.com/maps?q=${profileData.latitude},${profileData.longitude}`;
    Linking.openURL(url);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        icon="back"
        name="Profile"
        onIconPress={() => navigation.navigate('Home')}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.imageSection}>
          <TouchableOpacity 
            style={styles.imageContainer}
            activeOpacity={0.8}
          >
            {renderProfileImage()}
          </TouchableOpacity>
          
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{profileData.fullname}</Text>
            <Text style={styles.userEmail}>{profileData.email}</Text>
          </View>
        </View>

        <FormBox style={styles.profileCard}>
          <View style={styles.cardHeader}>
            <Icon name="information-circle-outline" size={20} color={Colors.primary} />
            <Text style={styles.cardTitle}>Personal Information</Text>
          </View>

          <ProfileField
            label="Full Name"
            value={profileData.fullname}
            iconName="person"
          />
          <ProfileField
            label="Email Address"
            value={profileData.email}
            iconName="mail"
          />
          <ProfileField
            label="Phone Number"
            value={profileData.phoneNumber}
            iconName="call"
          />
          <ProfileField
            label="Bio"
            value={profileData.bio || "No bio added yet"}
            iconName="document-text"
            isLast={true}
          />

          <TouchableOpacity 
            onPress={() => navigation.navigate('EditProfile')}
            style={styles.editButtonContainer}
            activeOpacity={0.7}
          >
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </FormBox>

        <FormBox style={styles.locationCard}>
          <View style={styles.cardHeader}>
            <Icon name="location-outline" size={20} color={Colors.primary} />
            <Text style={styles.cardTitle}>Location</Text>
          </View>
          
          <ProfileField
            label="Address"
            value={profileData.location || "No location set"}
            iconName="location"
          />
          
          {profileData.latitude && profileData.longitude && (
            <TouchableOpacity 
              style={styles.mapButton}
              onPress={() => openMap()}
            >
              <Text style={styles.mapButtonText}>View on Map</Text>
            </TouchableOpacity>
          )}
        </FormBox>

        <FormBox style={styles.settingsCard}>
          <View style={styles.cardHeader}>
            <Icon name="settings-outline" size={20} color={Colors.primary} />
            <Text style={styles.cardTitle}>Account Settings</Text>
          </View>

          <TouchableOpacity style={styles.actionRow} onPress={()=> navigation.navigate('ResetPassword')}>
            <View style={styles.actionLeft}>
              <View style={styles.actionIconContainer}>
                <Icon name="lock-closed-outline" size={18} color={Colors.primary} />
              </View>
              <View>
                <Text style={styles.actionText}>Change Password</Text>
                <Text style={styles.actionSubtext}>Update your password</Text>
              </View>
            </View>
            <Icon name="chevron-forward" size={20} color={Colors.neutral400} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity 
            style={styles.actionRow}
            onPress={() => navigation.navigate('PrivacySettings')}
          >
            <View style={styles.actionLeft}>
              <View style={styles.actionIconContainer}>
                <Icon name="shield-outline" size={18} color={Colors.primary} />
              </View>
              <View>
                <Text style={styles.actionText}>Privacy Settings</Text>
                <Text style={styles.actionSubtext}>Manage your privacy</Text>
              </View>
            </View>
            <Icon name="chevron-forward" size={20} color={Colors.neutral400} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity 
            style={styles.actionRow}
            onPress={() => navigation.navigate('Help')}
          >
            <View style={styles.actionLeft}>
              <View style={styles.actionIconContainer}>
                <Icon name="help-circle-outline" size={18} color={Colors.primary} />
              </View>
              <View>
                <Text style={styles.actionText}>Help & Support</Text>
                <Text style={styles.actionSubtext}>Get help when you need it</Text>
              </View>
            </View>
            <Icon name="chevron-forward" size={20} color={Colors.neutral400} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionRow}
            onPress={() => navigation.navigate('PrivacyPolicy')}
          >
            <View style={styles.actionLeft}>
              <View style={styles.actionIconContainer}>
                <Icon name="shield-checkmark-outline" size={18} color={Colors.primary} />
              </View>
              <View>
                <Text style={styles.actionText}>Privacy Policy</Text>
                <Text style={styles.actionSubtext}>Get to know how we protect your data</Text>
              </View>
            </View>
            <Icon name="chevron-forward" size={20} color={Colors.neutral400} />
          </TouchableOpacity>
        </FormBox>

        <FormBox style={styles.logoutCard}>
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Icon name="log-out-outline" size={30} color={Colors.danger} />
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>
        </FormBox>

        <View style={styles.bottomSpacing} />
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
    alignItems: 'center',
    paddingVertical: 12,
    paddingBottom: 40,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  profileImage: {
    width: 120,
    height: 120,
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfo: {
    alignItems: 'center',
    marginTop: -5,
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.neutral1000,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: Colors.neutral600,
    marginBottom: 4,
  },
  joinDate: {
    fontSize: 14,
    color: Colors.neutral500,
    fontStyle: 'italic',
  },
  profileCard: {
    marginBottom: 16,
    marginTop: -30,
  },
  settingsCard: {
    marginBottom: 16,
  },
  logoutCard: {
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 0,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral200,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral1000,
    marginLeft: 10,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  actionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${Colors.primary}10`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  actionText: {
    fontSize: 16,
    color: Colors.neutral1000,
    fontWeight: '500',
    marginBottom: 2,
  },
  actionSubtext: {
    fontSize: 13,
    color: Colors.neutral500,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.neutral200,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 0,
  },
  logoutIconContainer: {
    width: 10,
    height: 10,
    borderRadius: 16,
    backgroundColor: `${Colors.danger}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  logoutText: {
    fontSize: 22,
    fontWeight: '600',
    color: Colors.danger,
  },
  bottomSpacing: {
    height: 10,
  },
  editButtonContainer: {
    marginTop: -0,
    alignSelf: 'flex-end',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: Colors.primary,
    borderRadius: 6,
    marginBottom: -10,
  },
  editButtonText: {
    color: Colors.neutral0,
    fontSize: 16,
    fontWeight: '600',
  },
  locationCard: {
    marginBottom: 16,
  },
  
  // ADD THIS STYLE FOR THE MAP BUTTON
  mapButton: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  mapButtonText: {
    color: Colors.neutral0,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default UserProfileScreen;
