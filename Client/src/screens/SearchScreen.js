import React, { useState, useEffect } from 'react';
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
import SearchBar from '../components/SearchBar';

const { width } = Dimensions.get('window');

const SearchPage = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCondition, setSelectedCondition] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [location, setLocation] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [showFilters, setShowFilters] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);

  // Recent searches (would be stored in local storage in real app)
  const [recentSearches, setRecentSearches] = useState([
    'iPhone 14',
    'MacBook',
    'Gaming Chair',
    'Vintage Jacket',
    'Wireless Headphones',
  ]);

  // Trending searches
  const trendingSearches = [
    '📱 iPhone 14 Pro',
    '💻 MacBook Air',
    '🎮 Gaming Setup',
    '👕 Vintage Clothing',
    '🎧 AirPods Pro',
    '⌚ Apple Watch',
  ];

  // Quick filter categories
  const quickCategories = [
    { id: 'all', name: 'All', icon: '🔍' },
    { id: 'electronics', name: 'Electronics', icon: '📱' },
    { id: 'fashion', name: 'Fashion', icon: '👕' },
    { id: 'home', name: 'Home', icon: '🏠' },
    { id: 'books', name: 'Books', icon: '📚' },
    { id: 'sports', name: 'Sports', icon: '⚽' },
  ];

  // Sample search results
  const searchResults = [
    {
      id: 1,
      title: 'iPhone 14 Pro Max',
      price: '$950',
      originalPrice: '$1099',
      condition: 'Like New',
      location: 'New York, NY',
      image: require('../assets/IPhone14.jpeg'),
      likes: 67,
      views: 342,
      timeAgo: '3h ago',
      isHot: true,
      category: 'electronics',
    },
    {
      id: 2,
      title: 'MacBook Pro 16"',
      price: '$1200',
      originalPrice: '$1499',
      condition: 'Excellent',
      location: 'San Francisco, CA',
      image: require('../assets/Mac.jpeg'),
      likes: 89,
      views: 456,
      timeAgo: '1h ago',
      isHot: true,
      category: 'electronics',
    },
    {
      id: 3,
      title: 'Designer Leather Jacket',
      price: '$180',
      originalPrice: '$350',
      condition: 'Good',
      location: 'Chicago, IL',
      image: require('../assets/Leather-Jacket.jpeg'),
      likes: 34,
      views: 198,
      timeAgo: '5h ago',
      isHot: false,
      category: 'fashion',
    },
    {
      id: 4,
      title: 'Luxury Handbag',
      price: '$420',
      originalPrice: '$650',
      condition: 'Excellent',
      location: 'Miami, FL',
      image: require('../assets/Handbag.jpeg'),
      likes: 52,
      views: 287,
      timeAgo: '2h ago',
      isHot: false,
      category: 'fashion',
    },
  ];

  const conditionOptions = [
    { id: 'all', label: 'All Conditions' },
    { id: 'new', label: 'New' },
    { id: 'like-new', label: 'Like New' },
    { id: 'excellent', label: 'Excellent' },
    { id: 'good', label: 'Good' },
    { id: 'fair', label: 'Fair' },
  ];

  const priceRanges = [
    { id: 'all', label: 'All Prices' },
    { id: '0-50', label: 'Under $50' },
    { id: '50-100', label: '$50 - $100' },
    { id: '100-250', label: '$100 - $250' },
    { id: '250-500', label: '$250 - $500' },
    { id: '500+', label: 'Over $500' },
  ];

  const sortOptions = [
    { id: 'relevance', label: 'Relevance' },
    { id: 'newest', label: 'Newest First' },
    { id: 'price-low', label: 'Price: Low to High' },
    { id: 'price-high', label: 'Price: High to Low' },
    { id: 'popular', label: 'Most Popular' },
    { id: 'distance', label: 'Distance' },
  ];

  const handleSearch = (query) => {
    setSearchQuery(query);
    setIsSearchActive(true);
    
    // Add to recent searches if not already there
    if (query && !recentSearches.includes(query)) {
      setRecentSearches([query, ...recentSearches.slice(0, 4)]);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setIsSearchActive(false);
  };

  const clearAllFilters = () => {
    setSelectedCategory('all');
    setSelectedCondition('all');
    setPriceRange('all');
    setLocation('');
    setSortBy('relevance');
  };

  const FilterChip = ({ id, label, isSelected, onPress }) => (
    <TouchableOpacity
      style={[styles.filterChip, isSelected && styles.filterChipSelected]}
      onPress={onPress}
    >
      <Text style={[styles.filterChipText, isSelected && styles.filterChipTextSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const CategoryChip = ({ category, isSelected, onPress }) => (
    <TouchableOpacity
      style={[styles.categoryChip, isSelected && styles.categoryChipSelected]}
      onPress={onPress}
    >
      <Text style={styles.categoryEmoji}>{category.icon}</Text>
      <Text style={[styles.categoryChipText, isSelected && styles.categoryChipTextSelected]}>
        {category.name}
      </Text>
    </TouchableOpacity>
  );

  const RecentSearchItem = ({ search, onPress, onRemove }) => (
    <TouchableOpacity style={styles.recentSearchItem} onPress={onPress}>
      <Ionicons name="time-outline" size={16} color={Colors.textSecondary} />
      <Text style={styles.recentSearchText}>{search}</Text>
      <TouchableOpacity onPress={onRemove} style={styles.removeSearchButton}>
        <Ionicons name="close" size={16} color={Colors.textSecondary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const TrendingSearchItem = ({ search, onPress }) => (
    <TouchableOpacity style={styles.trendingSearchItem} onPress={onPress}>
      <Ionicons name="trending-up" size={16} color={Colors.primary} />
      <Text style={styles.trendingSearchText}>{search}</Text>
    </TouchableOpacity>
  );

  const renderSearchResult = ({ item, index }) => (
    <View style={[styles.searchResultWrapper, { marginRight: index % 2 === 0 ? 8 : 0 }]}>
      <ItemCard item={item} />
    </View>
  );

  const removeRecentSearch = (searchToRemove) => {
    setRecentSearches(recentSearches.filter(search => search !== searchToRemove));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.surface} />
      
      <Header 
        icon="arrow-back"
        name="Search"
        onIconPress={() => navigation?.goBack()}
        rightIcon="filter"
        onRightIconPress={() => setShowFilters(!showFilters)}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <SearchBar 
            placeholder='Serach for items...'
        />

        {/* Quick Categories */}
        <View style={styles.quickCategoriesSection}>
          <FlatList
            data={quickCategories}
            renderItem={({ item }) => (
              <CategoryChip
                category={item}
                isSelected={selectedCategory === item.id}
                onPress={() => setSelectedCategory(item.id)}
              />
            )}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickCategoriesList}
          />
        </View>

        {/* Filters Section */}
        {showFilters && (
          <View style={styles.filtersSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Filters</Text>
              <TouchableOpacity onPress={clearAllFilters}>
                <Text style={styles.clearFiltersText}>Clear All</Text>
              </TouchableOpacity>
            </View>

            {/* Condition Filter */}
            <View style={styles.filterGroup}>
              <Text style={styles.filterTitle}>Condition</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.filterRow}>
                  {conditionOptions.map((condition) => (
                    <FilterChip
                      key={condition.id}
                      id={condition.id}
                      label={condition.label}
                      isSelected={selectedCondition === condition.id}
                      onPress={() => setSelectedCondition(condition.id)}
                    />
                  ))}
                </View>
              </ScrollView>
            </View>

            {/* Price Range Filter */}
            <View style={styles.filterGroup}>
              <Text style={styles.filterTitle}>Price Range</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.filterRow}>
                  {priceRanges.map((range) => (
                    <FilterChip
                      key={range.id}
                      id={range.id}
                      label={range.label}
                      isSelected={priceRange === range.id}
                      onPress={() => setPriceRange(range.id)}
                    />
                  ))}
                </View>
              </ScrollView>
            </View>

            {/* Location Filter */}
            <View style={styles.filterGroup}>
              <Text style={styles.filterTitle}>Location</Text>
              <View style={styles.locationInputContainer}>
                <Ionicons name="location-outline" size={20} color={Colors.textSecondary} />
                <TextInput
                  style={styles.locationInput}
                  placeholder="Enter city or ZIP code"
                  placeholderTextColor={Colors.textSecondary}
                  value={location}
                  onChangeText={setLocation}
                />
              </View>
            </View>

            {/* Sort Options */}
            <View style={styles.filterGroup}>
              <Text style={styles.filterTitle}>Sort By</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.filterRow}>
                  {sortOptions.map((option) => (
                    <FilterChip
                      key={option.id}
                      id={option.id}
                      label={option.label}
                      isSelected={sortBy === option.id}
                      onPress={() => setSortBy(option.id)}
                    />
                  ))}
                </View>
              </ScrollView>
            </View>
          </View>
        )}

        {/* Search Results or Discovery Content */}
        {isSearchActive && searchQuery ? (
          <View style={styles.resultsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                Results for "{searchQuery}"
              </Text>
              <Text style={styles.resultCount}>
                {searchResults.length} items
              </Text>
            </View>
            <FlatList
              data={searchResults}
              renderItem={renderSearchResult}
              keyExtractor={(item) => item.id.toString()}
              numColumns={2}
              scrollEnabled={false}
              columnWrapperStyle={styles.resultsRow}
              showsVerticalScrollIndicator={false}
            />
          </View>
        ) : (
          <>
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Recent Searches</Text>
                  <TouchableOpacity onPress={() => setRecentSearches([])}>
                    <Text style={styles.clearText}>Clear All</Text>
                  </TouchableOpacity>
                </View>
                {recentSearches.map((search, index) => (
                  <RecentSearchItem
                    key={index}
                    search={search}
                    onPress={() => handleSearch(search)}
                    onRemove={() => removeRecentSearch(search)}
                  />
                ))}
              </View>
            )}

            {/* Trending Searches */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Trending Now</Text>
                <View style={styles.trendingBadge}>
                  <Text style={styles.trendingBadgeText}>HOT</Text>
                </View>
              </View>
              {trendingSearches.map((search, index) => (
                <TrendingSearchItem
                  key={index}
                  search={search}
                  onPress={() => handleSearch(search.replace(/^..\s/, ''))}
                />
              ))}
            </View>

            {/* Search Tips */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Search Tips</Text>
              <View style={styles.tipsList}>
                <View style={styles.tipItem}>
                  <Ionicons name="bulb-outline" size={16} color={Colors.primary} />
                  <Text style={styles.tipText}>
                    Use specific keywords like "iPhone 14 Pro" for better results
                  </Text>
                </View>
                <View style={styles.tipItem}>
                  <Ionicons name="location-outline" size={16} color={Colors.primary} />
                  <Text style={styles.tipText}>
                    Add your location to find items nearby
                  </Text>
                </View>
                <View style={styles.tipItem}>
                  <Ionicons name="pricetag-outline" size={16} color={Colors.primary} />
                  <Text style={styles.tipText}>
                    Set price filters to find items within your budget
                  </Text>
                </View>
              </View>
            </View>
          </>
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>

      <BottomNavigation activeTab={'Search'} onTabPress={setActiveTab} />
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

  // Quick Categories
  quickCategoriesSection: {
    backgroundColor: Colors.surface,
    paddingVertical: 8,
    marginBottom: 8,
  },
  quickCategoriesList: {
    paddingHorizontal: 16,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral50,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  categoryChipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryEmoji: {
    fontSize: 14,
    marginRight: 4,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  categoryChipTextSelected: {
    color: Colors.surface,
  },

  // Filters Section
  filtersSection: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 8,
  },
  filterGroup: {
    marginBottom: 16,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  filterRow: {
    flexDirection: 'row',
    paddingRight: 16,
  },
  filterChip: {
    backgroundColor: Colors.neutral50,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterChipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.text,
  },
  filterChipTextSelected: {
    color: Colors.surface,
  },
  locationInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral50,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  locationInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
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
  clearText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  clearFiltersText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  resultCount: {
    fontSize: 14,
    color: Colors.textSecondary,
  },

  // Recent Searches
  recentSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  recentSearchText: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
    marginLeft: 12,
  },
  removeSearchButton: {
    padding: 4,
  },

  // Trending Searches
  trendingBadge: {
    backgroundColor: Colors.danger,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  trendingBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.surface,
  },
  trendingSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  trendingSearchText: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
    marginLeft: 12,
  },

  // Search Results
  resultsSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  resultsRow: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  searchResultWrapper: {
    flex: 1,
  },

  // Search Tips
  tipsList: {
    marginTop: 8,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 12,
    lineHeight: 20,
  },

  bottomSpacing: {
    height: 20,
  },
});

export default SearchPage;