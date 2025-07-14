import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
  Image,
  Dimensions,
} from 'react-native';
import Colors from '../constants/colors'
import Ionicons from 'react-native-vector-icons/Ionicons';
import Header from '../components/Header'
import BottomNavigation from '../components/BottomNav';
import SearchBar from '../components/SearchBar';
import ItemCard from '../components/ItemCard';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const SwapMartHomePage = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');

  // Sample data
  const categories = [
    { id: 1, name: 'Electronics', icon: '📱', color: Colors.primary },
    { id: 2, name: 'Fashion', icon: '👕', color: Colors.secondary },
    { id: 3, name: 'Home & Garden', icon: '🏠', color: Colors.success },
    { id: 4, name: 'Books', icon: '📚', color: Colors.warning },
    { id: 5, name: 'Sports', icon: '⚽', color: Colors.danger },
    { id: 6, name: 'Toys', icon: '🧸', color: Colors.premiumText },
  ];

  const featuredItems = [
    {
      id: 1,
      title: 'iPhone 14 Pro',
      price: '$850',
      originalPrice: '$999',
      condition: 'Excellent',
      location: 'New York, NY',
      image: require('../assets/IPhone14.jpeg'),
      likes: 45,
      views: 230,
      timeAgo: '2h ago',
      isHot: true,
    },
    {
      id: 2,
      title: 'Vintage Leather Jacket',
      price: '$120',
      originalPrice: '$200',
      condition: 'Good',
      location: 'Los Angeles, CA',
      image: require('../assets/Leather-Jacket.jpeg'),
      likes: 28,
      views: 156,
      timeAgo: '5h ago',
      isHot: false,
    },
    {
      id: 3,
      title: 'MacBook Air M2',
      price: '$950',
      originalPrice: '$1199',
      condition: 'Like New',
      location: 'Chicago, IL',
      image: require('../assets/Mac.jpeg'),
      likes: 67,
      views: 445,
      timeAgo: '1d ago',
      isHot: true,
    },
    {
      id: 4,
      title: 'Designer Handbag',
      price: '$350',
      originalPrice: '$580',
      condition: 'Excellent',
      location: 'Miami, FL',
      image: require('../assets/Handbag.jpeg'),
      likes: 34,
      views: 189,
      timeAgo: '3h ago',
      isHot: false,
    },
  ];

  const CategoryCard = ({ category }) => (
    <TouchableOpacity style={styles.categoryCard}>
      <View style={[styles.categoryIcon, { backgroundColor: `${category.color}15` }]}>
        <Text style={styles.categoryEmoji}>{category.icon}</Text>
      </View>
      <Text style={styles.categoryName}>{category.name}</Text>
    </TouchableOpacity>
  );

  const QuickActionButton = ({ icon: Icon, title, subtitle, color, onPress }) => (
    <TouchableOpacity style={styles.quickActionButton} onPress={onPress}>
      <View style={[styles.quickActionIcon, { backgroundColor: color }]}>
        <Ionicons name={Icon} size={20} color={Colors.surface} />
      </View>
      <View style={styles.quickActionContent}>
        <Text style={styles.quickActionTitle}>{title}</Text>
        <Text style={styles.quickActionSubtitle}>{subtitle}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderFeaturedItem = ({ item, index }) => (
    <View style={[styles.featuredItemWrapper, { marginRight: index % 2 === 0 ? 8 : 0 }]}>
      <ItemCard item={item} />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.surface} />
      
      <Header 
        icon=""
        name="Abdulla"
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <SearchBar />

        {/* Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText} onPress={() =>navigation.navigate('ViewAllCategories')}>View All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={categories}
            renderItem={({ item }) => <CategoryCard category={item} />}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </View>

        {/* Featured Items */}
        <View style={styles.featuredSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Items</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText} onPress={() => navigation.navigate('ViewAllFeaturedItems')}>View All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={featuredItems}
            renderItem={renderFeaturedItem}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            scrollEnabled={false}
            columnWrapperStyle={styles.featuredRow}
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsContainer}>
            <QuickActionButton
              icon="add-circle-outline"
              title="Sell Item"
              subtitle="List something"
              color={Colors.primary}
              onPress={() => setActiveTab('add')}
            />
            <QuickActionButton
              icon="search"
              title="Browse"
              subtitle="Find deals"
              color={Colors.success}
              onPress={() => setActiveTab('search')}
            />
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      <BottomNavigation activeTab={'Home'} onTabPress={setActiveTab} />
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
  featuredRow: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  featuredItemWrapper: {
    flex: 1,
  },

  // Section Styles
  section: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 8,
  },
  featuredSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  viewAllText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },

  // Category Styles
  categoriesList: {
    paddingRight: 16,
  },
  categoryCard: {
    alignItems: 'center',
    marginRight: 16,
    width: 80,
  },
  categoryIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  categoryEmoji: {
    fontSize: 32,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.text,
    textAlign: 'center',
  },

  // Quick Actions Styles
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral50,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  quickActionContent: {
    flex: 1,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  quickActionSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
  },

  bottomNav: {
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingBottom: 12,
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
  bottomSpacing: {
    height: 20,
  },
});

export default SwapMartHomePage;