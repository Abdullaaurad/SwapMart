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
import ItemCard from '../components/ItemCard';

const { width } = Dimensions.get('window');

const ViewAllFeaturedItemsPage = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Extended featured items data
  const allFeaturedItems = [
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
      category: 'Electronics',
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
      category: 'Fashion',
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
      category: 'Electronics',
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
      category: 'Fashion',
    },
    {
      id: 5,
      title: 'Gaming Chair Pro',
      price: '$280',
      originalPrice: '$399',
      condition: 'Like New',
      location: 'Austin, TX',
      image: require('../assets/IPhone14.jpeg'), // Replace with actual image
      likes: 52,
      views: 312,
      timeAgo: '4h ago',
      isHot: true,
      category: 'Furniture',
    },
    {
      id: 6,
      title: 'Wireless Headphones',
      price: '$180',
      originalPrice: '$249',
      condition: 'Excellent',
      location: 'Seattle, WA',
      image: require('../assets/Mac.jpeg'), // Replace with actual image
      likes: 41,
      views: 278,
      timeAgo: '6h ago',
      isHot: false,
      category: 'Electronics',
    },
    {
      id: 7,
      title: 'Vintage Watch',
      price: '$420',
      originalPrice: '$650',
      condition: 'Good',
      location: 'Boston, MA',
      image: require('../assets/Handbag.jpeg'), // Replace with actual image
      likes: 63,
      views: 187,
      timeAgo: '8h ago',
      isHot: true,
      category: 'Jewelry',
    },
    {
      id: 8,
      title: 'Nike Air Jordans',
      price: '$220',
      originalPrice: '$320',
      condition: 'Excellent',
      location: 'Denver, CO',
      image: require('../assets/Leather-Jacket.jpeg'), // Replace with actual image
      likes: 38,
      views: 156,
      timeAgo: '10h ago',
      isHot: false,
      category: 'Fashion',
    },
    {
      id: 9,
      title: 'Coffee Machine',
      price: '$150',
      originalPrice: '$250',
      condition: 'Like New',
      location: 'Portland, OR',
      image: require('../assets/IPhone14.jpeg'), // Replace with actual image
      likes: 29,
      views: 143,
      timeAgo: '12h ago',
      isHot: false,
      category: 'Kitchen',
    },
    {
      id: 10,
      title: 'Electric Guitar',
      price: '$380',
      originalPrice: '$599',
      condition: 'Good',
      location: 'Nashville, TN',
      image: require('../assets/Mac.jpeg'), // Replace with actual image
      likes: 71,
      views: 234,
      timeAgo: '1d ago',
      isHot: true,
      category: 'Music',
    },
  ];

  const filterOptions = [
    { id: 'all', label: 'All Items', count: allFeaturedItems.length },
    { id: 'hot', label: 'Hot Items', count: allFeaturedItems.filter(item => item.isHot).length },
    { id: 'electronics', label: 'Electronics', count: allFeaturedItems.filter(item => item.category === 'Electronics').length },
    { id: 'fashion', label: 'Fashion', count: allFeaturedItems.filter(item => item.category === 'Fashion').length },
  ];

  const sortOptions = [
    { id: 'newest', label: 'Newest First' },
    { id: 'oldest', label: 'Oldest First' },
    { id: 'price-low', label: 'Price: Low to High' },
    { id: 'price-high', label: 'Price: High to Low' },
    { id: 'popular', label: 'Most Popular' },
  ];

  // Filter and sort items
  const getFilteredAndSortedItems = () => {
    let filtered = allFeaturedItems;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedFilter !== 'all') {
      if (selectedFilter === 'hot') {
        filtered = filtered.filter(item => item.isHot);
      } else {
        filtered = filtered.filter(item => item.category.toLowerCase() === selectedFilter);
      }
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.timeAgo) - new Date(a.timeAgo);
        case 'oldest':
          return new Date(a.timeAgo) - new Date(b.timeAgo);
        case 'price-low':
          return parseInt(a.price.replace('$', '')) - parseInt(b.price.replace('$', ''));
        case 'price-high':
          return parseInt(b.price.replace('$', '')) - parseInt(a.price.replace('$', ''));
        case 'popular':
          return b.likes - a.likes;
        default:
          return 0;
      }
    });

    return filtered;
  };

  const filteredItems = getFilteredAndSortedItems();

  const FilterChip = ({ filter, isSelected, onPress }) => (
    <TouchableOpacity
      style={[
        styles.filterChip,
        isSelected && styles.filterChipSelected
      ]}
      onPress={onPress}
    >
      <Text style={[
        styles.filterChipText,
        isSelected && styles.filterChipTextSelected
      ]}>
        {filter.label}
      </Text>
      {filter.count && (
        <Text style={[
          styles.filterChipCount,
          isSelected && styles.filterChipCountSelected
        ]}>
          {filter.count}
        </Text>
      )}
    </TouchableOpacity>
  );

  const SortOption = ({ option, isSelected, onPress }) => (
    <TouchableOpacity
      style={[
        styles.sortOption,
        isSelected && styles.sortOptionSelected
      ]}
      onPress={onPress}
    >
      <Text style={[
        styles.sortOptionText,
        isSelected && styles.sortOptionTextSelected
      ]}>
        {option.label}
      </Text>
      {isSelected && (
        <Ionicons name="checkmark" size={16} color={Colors.primary} />
      )}
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
        icon="back"
        name="Featured Items"
        onIconPress={() => navigation?.goBack()}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color={Colors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search items..."
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

        {/* Filters */}
        <View style={styles.filtersSection}>
          <FlatList
            data={filterOptions}
            renderItem={({ item }) => (
              <FilterChip
                filter={item}
                isSelected={selectedFilter === item.id}
                onPress={() => setSelectedFilter(item.id)}
              />
            )}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersList}
          />
        </View>

        {/* Sort Options */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Sort By</Text>
            <Text style={styles.resultCount}>
              {filteredItems.length} items
            </Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.sortContainer}>
              {sortOptions.map((option) => (
                <SortOption
                  key={option.id}
                  option={option}
                  isSelected={sortBy === option.id}
                  onPress={() => setSortBy(option.id)}
                />
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Featured Items Grid */}
        <View style={styles.itemsSection}>
          {filteredItems.length > 0 ? (
            <FlatList
              data={filteredItems}
              renderItem={renderFeaturedItem}
              keyExtractor={(item) => item.id.toString()}
              numColumns={2}
              scrollEnabled={false}
              columnWrapperStyle={styles.featuredRow}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="search" size={48} color={Colors.textSecondary} />
              <Text style={styles.emptyStateTitle}>No items found</Text>
              <Text style={styles.emptyStateSubtitle}>
                Try adjusting your search or filters
              </Text>
              <TouchableOpacity
                style={styles.clearFiltersButton}
                onPress={() => {
                  setSearchQuery('');
                  setSelectedFilter('all');
                  setSortBy('newest');
                }}
              >
                <Text style={styles.clearFiltersText}>Clear All Filters</Text>
              </TouchableOpacity>
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

  // Filters Section
  filtersSection: {
    backgroundColor: Colors.surface,
    paddingVertical: 8,
    marginBottom: 8,
  },
  filtersList: {
    paddingHorizontal: 16,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral50,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterChipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  filterChipTextSelected: {
    color: Colors.surface,
  },
  filterChipCount: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  filterChipCountSelected: {
    color: Colors.surface,
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
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  resultCount: {
    fontSize: 14,
    color: Colors.textSecondary,
  },

  // Sort Options
  sortContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral50,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sortOptionSelected: {
    backgroundColor: `${Colors.primary}15`,
    borderColor: Colors.primary,
  },
  sortOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
    marginRight: 4,
  },
  sortOptionTextSelected: {
    color: Colors.primary,
  },

  // Items Section
  itemsSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  featuredRow: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  featuredItemWrapper: {
    flex: 1,
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
    marginBottom: 24,
  },
  clearFiltersButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  clearFiltersText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.surface,
  },

  bottomSpacing: {
    height: 20,
  },
});

export default ViewAllFeaturedItemsPage;