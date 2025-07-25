import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '../constants/colors';
import { useNavigation } from '@react-navigation/native';

const BottomNavigation = ({ activeTab, onTabPress }) => {
  const navigation = useNavigation();
  const tabs = [
    { id: 'Home', icon: 'home', label: 'Home' },
    { id: 'Search', icon: 'search', label: 'Search' },
    { id: 'AddProduct', icon: 'add-circle-outline', label: 'Add' },
    { id: 'ChatList', icon: 'chatbubble-outline', label: 'Message' },
    { id: 'Activity', icon: 'person-outline', label: 'Profile' },
  ];

  return (
    <View style={styles.bottomNav}>
      <View style={styles.bottomNavContent}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.bottomNavItem,
              activeTab === tab.id && styles.bottomNavItemActive,
            ]}
            onPress={() => navigation.navigate(tab.id) }
          >
            <Ionicons
              name={tab.icon}
              size={tab.id === 'add' ? 28 : 24}
              color={activeTab === tab.id ? Colors.primary : Colors.textSecondary}
            />
            <Text
              style={[
                styles.bottomNavLabel,
                { color: activeTab === tab.id ? Colors.primary : Colors.textSecondary },
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingBottom: 12,
    marginBottom: Platform.OS === 'ios' ? -20 : 10,
  },
  bottomNavContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 8,
  },
  bottomNavItem: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  bottomNavItemActive: {
    backgroundColor: `${Colors.primary}10`,
  },
  bottomNavLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
});

export default BottomNavigation;