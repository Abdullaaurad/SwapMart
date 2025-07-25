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
  Dimensions,
} from 'react-native';
import Colors from '../constants/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Header from '../components/Header';
import BottomNavigation from '../components/BottomNav';
import { useNavigation } from '@react-navigation/native';
import CategoryCard from '../components/CategoryCard';

const { width } = Dimensions.get('window');

const ViewAllCategoriesPage = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');

  // Extended categories data
  const allCategories = [
    { id: 1, name: 'Electronics', icon: '📱', color: Colors.primary, itemCount: 1247 },
    { id: 2, name: 'Fashion', icon: '👕', color: Colors.secondary, itemCount: 892 },
    { id: 3, name: 'Home & Garden', icon: '🏠', color: Colors.success, itemCount: 634 },
    { id: 4, name: 'Books', icon: '📚', color: Colors.warning, itemCount: 456 },
    { id: 5, name: 'Sports', icon: '⚽', color: Colors.danger, itemCount: 789 },
    { id: 6, name: 'Toys', icon: '🧸', color: Colors.premiumText, itemCount: 345 },
    { id: 7, name: 'Automotive', icon: '🚗', color: Colors.primary, itemCount: 567 },
    { id: 8, name: 'Beauty', icon: '💄', color: Colors.secondary, itemCount: 423 },
    { id: 9, name: 'Music', icon: '🎵', color: Colors.success, itemCount: 234 },
    { id: 10, name: 'Art & Crafts', icon: '🎨', color: Colors.warning, itemCount: 178 },
    { id: 11, name: 'Pet Supplies', icon: '🐕', color: Colors.danger, itemCount: 298 },
    { id: 12, name: 'Health', icon: '💊', color: Colors.premiumText, itemCount: 156 },
    { id: 13, name: 'Kitchen', icon: '🍳', color: Colors.primary, itemCount: 389 },
    { id: 14, name: 'Gaming', icon: '🎮', color: Colors.secondary, itemCount: 567 },
    { id: 15, name: 'Jewelry', icon: '💍', color: Colors.success, itemCount: 234 },
    { id: 16, name: 'Baby Items', icon: '🍼', color: Colors.warning, itemCount: 145 },
    { id: 17, name: 'Furniture', icon: '🛋️', color: Colors.danger, itemCount: 467 },
    { id: 18, name: 'Outdoor', icon: '🏕️', color: Colors.premiumText, itemCount: 289 },
  ];

  // Filter categories based on search query
  const filteredCategories = allCategories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const PopularCategoryCard = ({ category }) => (
    <TouchableOpacity style={styles.popularCategoryCard}>
      <View style={[styles.popularCategoryIcon, { backgroundColor: category.color }]}>
        <Text style={styles.popularCategoryEmoji}>{category.icon}</Text>
      </View>
      <Text style={styles.popularCategoryName}>{category.name}</Text>
      <Text style={styles.popularCategoryCount}>{category.itemCount}</Text>
    </TouchableOpacity>
  );

  // Get top 6 categories by item count for popular section
  const popularCategories = [...allCategories]
    .sort((a, b) => b.itemCount - a.itemCount)
    .slice(0, 6);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.surface} />
      
      <Header 
        icon="back"
        name="All Categories"
        onIconPress={() => navigation?.goBack()}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color={Colors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search categories..."
              placeholderTextColor={Colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color={Colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Popular Categories */}
        {!searchQuery && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Popular Categories</Text>
              <View style={styles.popularBadge}>
                <Text style={styles.popularBadgeText}>HOT</Text>
              </View>
            </View>
            <FlatList
              data={popularCategories}
              renderItem={({ item }) => <PopularCategoryCard category={item} />}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.popularCategoriesList}
            />
          </View>
        )}

        {/* All Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {searchQuery ? `Results for "${searchQuery}"` : 'All Categories'}
            </Text>
            <Text style={styles.countText}>
              {filteredCategories.length} categories
            </Text>
          </View>
          
          {filteredCategories.length > 0 ? (
            <FlatList
              data={filteredCategories}
              renderItem={({ item }) => <CategoryCard category={item} />}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="search" size={48} color={Colors.textSecondary} />
              <Text style={styles.emptyStateTitle}>No categories found</Text>
              <Text style={styles.emptyStateSubtitle}>
                Try searching with different keywords
              </Text>
            </View>
          )}
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      <BottomNavigation activeTab={activeTab} onTabPress={setActiveTab} />
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

  // Search Section
  searchSection: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    marginBottom: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral50,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: Colors.text,
  },

  // Section Styles
  section: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 8,
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
  countText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },

  // Popular Categories
  popularBadge: {
    backgroundColor: Colors.danger,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  popularBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.surface,
  },
  popularCategoriesList: {
    paddingRight: 16,
  },
  popularCategoryCard: {
    alignItems: 'center',
    marginRight: 16,
    width: 100,
    backgroundColor: Colors.neutral50,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  popularCategoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  popularCategoryEmoji: {
    fontSize: 24,
  },
  popularCategoryName: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  popularCategoryCount: {
    fontSize: 10,
    color: Colors.textSecondary,
    textAlign: 'center',
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },

  bottomSpacing: {
    height: 20,
  },
});

export default ViewAllCategoriesPage;