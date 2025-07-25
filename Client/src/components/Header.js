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
import { Platform } from 'react-native';

const Header = ({
  icon = 'back',
  onIconPress,
  showNotification = true,
  style,
  name,
  image,
}) => {
  const navigation = useNavigation();

  const renderLeftIcon = () => {
    if (icon !== 'back') return null;

    return (
      <TouchableOpacity onPress={onIconPress} style={styles.iconButton}>
        <Icon name="chevron-back" size={24} color={Colors.text} />
      </TouchableOpacity>
    );
  };

  const renderNotificationIcon = () => {
    if (!showNotification) return null;

    return (
      <TouchableOpacity style={styles.iconButton}>
        <Icon name="notifications-outline" size={24} color={Colors.textSecondary} />
      </TouchableOpacity>
    );
  };

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
        <View style={styles.headerLeft}>
          {renderLeftIcon()}
          <Text style={styles.headerTitle}>SwapMart</Text>
        </View>

        <View style={styles.headerRight}>
          {renderNotificationIcon()}
          {renderProfile()}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: Platform.OS === 'ios' ? 0 : 30,
    paddingBottom: 10,
    shadowColor: Colors.shadowMd,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 10,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginLeft: 12,
  },
  iconButton: {
    padding: 4,
  },
  profileImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginLeft: 16,
  },
  profilePlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 16,
  },
  profileInitial: {
    color: Colors.surface,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Header;