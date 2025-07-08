import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../constants/colors';
import { useNavigation } from '@react-navigation/native';

const Header = ({ icon = 'back', style, name, image, onIconPress }) => {
  const navigation = useNavigation();

  const renderProfile = () => {
    if (image) {
      return (
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Image source={{ uri: image }} style={styles.profileImage} />
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          style={styles.profilePlaceholder}
          onPress={() => navigation.navigate('Profile')}
        >
          <Text style={styles.profileInitial}>
            {name?.charAt(0).toUpperCase()}
          </Text>
        </TouchableOpacity>
      );
    }
  };

  return (
    <View style={[styles.header, style]}>
      <View style={styles.headerContent}>
        {icon !== '' && (
          <TouchableOpacity onPress={onIconPress} style={styles.backButton}>
            <Icon
              name={icon === 'back' ? 'chevron-back' : 'menu'}
              size={28}
              color={Colors.neutral0}
            />
          </TouchableOpacity>
        )}

        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/logo_light_no_bg_no_name.png')}
            style={styles.logoImage}
          />
          <View style={styles.logoTextContainer}>
            <Text style={styles.logoLineTop}>Motor</Text>
            <Text style={styles.logoLineBottom}>Trace</Text>
          </View>
        </View>

        <View style={styles.spacer} />
        {renderProfile()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: 45,
    paddingBottom: 10,
    shadowColor: Colors.shadowMd,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 10,
    backgroundColor: Colors.primary,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -10,
  },
  spacer: {
    flex: 1,
  },
  profileImage: {
    width: 45,
    height: 45,
    borderRadius: 20,
  },
  profilePlaceholder: {
    width: 45,
    height: 45,
    borderRadius: 30,
    backgroundColor: Colors.neutral300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    color: Colors.neutral900,
    fontSize: 20,
    fontWeight: '600',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoImage: {
    width: 50,
    height: 50,
    marginRight: 2,
  },
  logoTextContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  logoLineTop: {
    color: Colors.neutral0,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 18,
  },
  logoLineBottom: {
    color: Colors.neutral0,
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 18,
  },
});

export default Header;