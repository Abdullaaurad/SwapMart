import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
} from 'react-native';
import Colors from '../constants/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import BottomNavigation from '../components/BottomNav';

const ActivityPage = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('Activity');

  // Sample stats data
  const userStats = {
    totalSwaps: 12,
    activeListings: 8,
    pendingOffers: 3,
    savedItems: 24,
    rating: 4.8,
    reviewCount: 15
  };

  // Activity menu items
  const activityMenuItems = [
    {
      id: 1,
      title: 'Swap History',
      subtitle: 'View all your completed swaps',
      icon: 'swap-horizontal',
      color: Colors.primary,
      count: userStats.totalSwaps,
      screen: 'SwapHistory'
    },
    {
      id: 2,
      title: 'My Listings',
      subtitle: 'Items you\'re offering for swap',
      icon: 'list',
      color: Colors.success,
      count: userStats.activeListings,
      screen: 'MyListings'
    },
    {
      id: 3,
      title: 'My Offers',
      subtitle: 'Offers you\'ve made to others',
      icon: 'paper-plane',
      color: Colors.warning,
      count: userStats.pendingOffers,
      screen: 'MyOffers'
    },
    {
      id: 4,
      title: 'Saved Items',
      subtitle: 'Your favorite and saved items',
      icon: 'heart',
      color: Colors.danger,
      count: userStats.savedItems,
      screen: 'SavedItems'
    },
    {
      id: 5,
      title: 'Recently Viewed',
      subtitle: 'Items you\'ve recently browsed',
      icon: 'time',
      color: Colors.textSecondary,
      count: null,
      screen: 'RecentlyViewed'
    },
    {
      id: 6,
      title: 'Reviews & Ratings',
      subtitle: 'Your reviews and feedback',
      icon: 'star',
      color: Colors.premiumText,
      count: userStats.reviewCount,
      screen: 'ReviewsRatings'
    }
  ];

  const quickActions = [
    {
      id: 1,
      title: 'List New Item',
      icon: 'add-circle',
      color: Colors.primary,
      screen: 'AddItem'
    },
    {
      id: 2,
      title: 'Browse Items',
      icon: 'search',
      color: Colors.success,
      screen: 'Browse'
    },
    {
      id: 3,
      title: 'Messages',
      icon: 'chatbubble',
      color: Colors.warning,
      screen: 'ChatList'
    },
    {
      id: 4,
      title: 'Settings',
      icon: 'settings',
      color: Colors.textSecondary,
      screen: 'Settings'
    }
  ];

  const navigateToScreen = (screenName) => {
    navigation.navigate(screenName);
  };

  const StatCard = ({ title, value, subtitle }) => (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </View>
  );

  const ActivityMenuItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.menuItem}
      onPress={() => navigateToScreen(item.screen)}
    >
      <View style={styles.menuItemLeft}>
        <View style={[styles.menuIcon, { backgroundColor: `${item.color}15` }]}>
          <Ionicons name={item.icon} size={24} color={item.color} />
        </View>
        <View style={styles.menuTextContainer}>
          <Text style={styles.menuTitle}>{item.title}</Text>
          <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
        </View>
      </View>
      <View style={styles.menuItemRight}>
        {item.count !== null && (
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{item.count}</Text>
          </View>
        )}
        <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
      </View>
    </TouchableOpacity>
  );

  const QuickActionButton = ({ item }) => (
    <TouchableOpacity 
      style={styles.quickActionButton}
      onPress={() => navigateToScreen(item.screen)}
    >
      <View style={[styles.quickActionIcon, { backgroundColor: item.color }]}>
        <Ionicons name={item.icon} size={20} color={Colors.surface} />
      </View>
      <Text style={styles.quickActionText}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.surface} />
      
      <Header 
        icon=""
        name="Abdulla"
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

        {/* Stats Section */}
        <View style={[styles.section, {marginTop: 20} ]}>
          <Text style={styles.sectionTitle}>Your Activity</Text>
          <View style={styles.statsContainer}>
            <StatCard 
              title="Total Swaps" 
              value={userStats.totalSwaps} 
              subtitle="Completed"
            />
            <StatCard 
              title="Active Listings" 
              value={userStats.activeListings} 
              subtitle="Available"
            />
            <StatCard 
              title="Pending Offers" 
              value={userStats.pendingOffers} 
              subtitle="Waiting"
            />
          </View>
        </View>

        {/* Activity Menu */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Manage Your Activity</Text>
          <View style={styles.menuContainer}>
            {activityMenuItems.map(item => (
              <ActivityMenuItem key={item.id} item={item} />
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map(item => (
              <QuickActionButton key={item.id} item={item} />
            ))}
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
      <BottomNavigation activeTab={'Activity'} onTabPress={setActiveTab} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },

  // Section Styles
  section: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },

  // Stats Section
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.neutral50,
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
  },
  statSubtitle: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 2,
  },

  // Menu Section
  menuContainer: {
    backgroundColor: Colors.neutral50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countBadge: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    marginRight: 12,
  },
  countText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.surface,
  },

  // Quick Actions
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    width: '48%',
    backgroundColor: Colors.neutral50,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
  },

  bottomSpacing: {
    height: 20,
  },
});

export default ActivityPage;