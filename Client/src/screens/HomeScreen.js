import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
  Platform,
  RefreshControl,
  Dimensions,
  Animated
} from 'react-native';
import Colors from '../constants/colors'
import Ionicons from 'react-native-vector-icons/Ionicons';
import Header from '../components/Header'
import BottomNavigation from '../components/BottomNav';
import SearchBar from '../components/SearchBar';
import ItemCard from '../components/ItemCard';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { BASE_URL } from '../API/key';
import LoadingComponent from '../components/Loading';
import CustomAlert from '../components/CustomAlert';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2; // Account for padding and gap

const SwapMartHomePage = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  
  // Product state
  const [featuredItems, setFeaturedItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [categories, setCategories] = useState([]);

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

  const getAllCategories = async () => {
    try {
      const results = await axios.get(`${BASE_URL}/category/findall`);
      if (results.data && results.data.success) {
        setCategories(results.data.categories || []);
      } else {
        setCategories([]);
        showAlert('Error', results.data?.message || 'Failed to fetch categories', 'error');
      }
    }
    catch (error) {
      setCategories([]);
      console.error('Error fetching categories:', error);
      showAlert('Error', error.message, 'error');
    }
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  // API Functions
  const getProducts = async (offset = 0, categoryId = null, search = '', isLoadMore = false) => {
    if (!isLoadMore) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const params = {
        offset: offset,
        limit: 10 // Adjust as needed
      };
      
      if (categoryId) params.categoryId = categoryId;
      if (search.trim()) params.search = search.trim();

      console.log(params);
      const result = await axios.get(`${BASE_URL}/products/home`, { params });
      console.log(result.data.products[0]);
      
      
      if (result.data && result.data.success) {
        const newProducts = result.data.products || [];
        const totalCount = result.data.totalCount || 0;
        
        if (isLoadMore) {
          setFeaturedItems(prev => [...prev, ...newProducts]);
        } else {
          setFeaturedItems(newProducts);
        }
        
        // Check if we've loaded all products
        setHasMoreData(offset + newProducts.length < totalCount);
        setCurrentPage(offset);
      } else {
        console.error('API Error:', result.data?.message || 'Unknown error');
        if (!isLoadMore) {
          setFeaturedItems([]);
        }
      }
    } catch (error) {
      console.error('Network Error:', error);
      if (!isLoadMore) {
        setFeaturedItems([]);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  };

  // Load initial data
  useEffect(() => {
    getProducts(0, selectedCategory, searchQuery);
  }, []);

  // Handle search with debounce
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setCurrentPage(0);
      getProducts(0, selectedCategory, searchQuery);
    }, 500); // 500ms debounce

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, selectedCategory]);

  // Handle category selection

  // Handle search input
  const handleSearchChange = (text) => {
    setSearchQuery(text);
  };

  // Handle pull to refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setCurrentPage(0);
    getProducts(0, selectedCategory, searchQuery);
  }, [selectedCategory, searchQuery]);

  // Handle load more
  const loadMoreProducts = () => {
    if (!loadingMore && hasMoreData) {
      const nextPage = currentPage + 10;
      getProducts(nextPage, selectedCategory, searchQuery, true);
    }
  };

  const CategoryCard = ({ category, selectedCategory}) => {

    const handleCategoryPress = (categoryId) => {
      setSelectedCategory(categoryId);
      setCurrentPage(0);
    };
    const isSelected = selectedCategory === category.id;
    
    return (
      <TouchableOpacity 
        style={[
          styles.categoryCard,
          isSelected && styles.categoryCardSelected
        ]}
        onPress={() => handleCategoryPress(category.id)}
        activeOpacity={0.8}
      >
        <View style={[
          styles.categoryIcon,
          { backgroundColor: Colors.neutral50 },
          isSelected && { 
            backgroundColor: Colors.primary,
            transform: [{ scale: 1.1 }]
          }
        ]}>
          <Ionicons 
            name={category.icon} 
            size={24}
            color={isSelected ? Colors.primary : Colors.neutral1000}
          />
        </View>
        <Text style={[
          styles.categoryName,
          isSelected && styles.categoryNameSelected
        ]}>
          {category.name}
        </Text>
      </TouchableOpacity>
    );
  };

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

  // Beautiful Product Card Component
  const BeautifulProductCard = ({ item, index }) => {
    const [scaleValue] = useState(new Animated.Value(1));

    const handlePressIn = () => {
      Animated.spring(scaleValue, {
        toValue: 0.95,
        useNativeDriver: true,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(scaleValue, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    };

    const formatPrice = (price) => {
      return price ? `$${parseFloat(price).toFixed(2)}` : 'Price not set';
    };

    const getConditionColor = (condition) => {
      switch (condition?.toLowerCase()) {
        case 'new': return '#10B981';
        case 'like new': return '#059669';
        case 'good': return '#F59E0B';
        case 'fair': return '#EF4444';
        default: return '#6B7280';
      }
    };

    const firstImageUrl = item.images && item.images.length > 0 ? item.images[0].url : null;

    const itemForCard = {
      ...item,
      image: firstImageUrl ? { uri: firstImageUrl } : require('../assets/logo_light.png'), // fallback if no image
      price: item.original_price,
      originalPrice: item.original_price,
      // add other props as needed
    };

    return (
      <Animated.View style={[
        styles.cardContainer,
        { transform: [{ scale: scaleValue }] }
      ]}>
        <TouchableOpacity
          style={styles.modernCard}
          onPress={() => navigation.navigate('ProductDetails', { productId: item.id })}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={1}
        >
          {/* Image Container */}
          <View style={styles.modernImageContainer}>
            <ItemCard item={itemForCard} />
            
            {/* Favorite Button */}
            <TouchableOpacity style={styles.favoriteButton}>
              <Ionicons name="heart-outline" size={20} color="#FFFFFF" />
            </TouchableOpacity>
            
            {/* Condition Badge */}
            {item.condition && (
              <View style={[
                styles.conditionBadge,
                { backgroundColor: getConditionColor(item.condition) }
              ]}>
                <Text style={styles.conditionText}>
                  {item.condition}
                </Text>
              </View>
            )}  
          </View>

          {/* Content Container */}
          <View style={styles.modernCardContent}>
            {/* Title and Category */}
            <View style={styles.titleSection}>
              <Text style={styles.modernCardTitle} numberOfLines={2}>
                {item.title}
              </Text>
              <View style={styles.categoryBadge}>
                <Text style={styles.modernCardCategory} numberOfLines={1}>
                  {item.category_name}
                </Text>
              </View>
            </View>

            {/* Price Section */}
            <View style={styles.priceSection}>
              <Text style={styles.modernCardPrice}>
                {formatPrice(item.original_price)}
              </Text>
              {item.discounted_price && item.discounted_price < item.original_price && (
                <Text style={styles.originalPrice}>
                  ${parseFloat(item.original_price).toFixed(2)}
                </Text>
              )}
            </View>

            {/* Seller Info */}
            <View style={styles.sellerSection}>
              <View style={styles.sellerInfo}>
                <View style={styles.sellerAvatar}>
                  <Ionicons name="person" size={14} color={Colors.primary} />
                </View>
                <Text style={styles.modernSellerName} numberOfLines={1}>
                  {item.seller_name || 'Unknown Seller'}
                </Text>
              </View>
              
              {/* Rating or Status */}
              <View style={styles.statusContainer}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>Available</Text>

              </View>
            </View>

          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderFeaturedItem = ({ item, index }) => (
    <BeautifulProductCard item={item} index={index} />
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <LoadingComponent size="small" showText={false} />
      </View>
    );
  };

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyStateIconContainer}>
        <Ionicons name="search-outline" size={64} color={Colors.neutral400} />
      </View>
      <Text style={styles.emptyStateTitle}>
        {searchQuery ? 'No items found' : 'No products available'}
      </Text>
      <Text style={styles.emptyStateSubtitle}>
        {searchQuery 
          ? `Try adjusting your search "${searchQuery}"` 
          : 'Check back later for new items'
        }
      </Text>
      {!searchQuery && (
        <TouchableOpacity style={styles.emptyStateButton}>
          <Text style={styles.emptyStateButtonText}>Browse Categories</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.container}>
        <Header icon="" />
        <LoadingComponent />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.surface} />
      
      <Header icon="" />

      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
      >
        <SearchBar 
          value={searchQuery}
          onChangeText={handleSearchChange}
          placeholder="Search for items..."
        />

        {/* Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <TouchableOpacity>
              <Text 
                style={styles.viewAllText} 
                onPress={() => navigation.navigate('ViewAllCategories')}
              >
                View All
              </Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={categories}
            renderItem={({ item }) => <CategoryCard category={item} selectedCategory={selectedCategory} />}
            keyExtractor={(item) => (item.id || 'all').toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </View>

        {/* Featured Items */}
        <View style={styles.featuredSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {searchQuery 
                ? `Search Results${selectedCategory ? ` in ${categories.find(c => c.id === selectedCategory)?.name}` : ''}`
                : selectedCategory 
                  ? `${categories.find(c => c.id === selectedCategory)?.name} Items`
                  : 'Featured Items'
              }
            </Text>
            {featuredItems.length > 0 && (
              <TouchableOpacity>
                <Text 
                  style={styles.viewAllText} 
                  onPress={() => navigation.navigate('ViewAllFeaturedItems')}
                >
                  View All
                </Text>
              </TouchableOpacity>
            )}
          </View>
          
          {featuredItems.length === 0 ? (
            <EmptyState />
          ) : (
            <FlatList
              data={featuredItems}
              renderItem={renderFeaturedItem}
              keyExtractor={(item) => item.id.toString()}
              numColumns={2}
              scrollEnabled={false}
              columnWrapperStyle={styles.featuredRow}
              onEndReached={loadMoreProducts}
              onEndReachedThreshold={0.1}
              ListFooterComponent={renderFooter}
            />
          )}
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
    backgroundColor: Platform.OS === 'ios' ? '#F8FAFC' : '#F1F5F9',
  },
  scrollView: {
    flex: 1,
  },
  featuredRow: {
    justifyContent: 'space-between',
    marginBottom: 16,
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
    backgroundColor: '#F8FAFC',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    flex: 1,
  },
  viewAllText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },

  // Category Styles (keeping original)
  categoriesList: {
    paddingRight: 16,
  },
  categoryCard: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    marginBottom: 12,
    width: 80,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  categoryCardSelected: {
    borderColor: '#3B82F6',
    borderWidth: 2.5,
    backgroundColor: '#F8FAFC',
    transform: [{ scale: 1.05 }],
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    color: Colors.primary,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 16,
  },
  categoryNameSelected: {
    color: '#1F2937',
    fontWeight: '600',
  },

  // Modern Card Styles
  cardContainer: {
    width: CARD_WIDTH,
    marginBottom: 8,
  },
  modernCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  modernImageContainer: {
    height: 160,
    backgroundColor: '#F1F5F9',
    position: 'relative',
    overflow: 'hidden',
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(10px)',
  },
  conditionBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  conditionText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  modernCardContent: {
    padding: 16,
  },
  titleSection: {
    marginBottom: 12,
  },
  modernCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    lineHeight: 22,
    marginBottom: 6,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  modernCardCategory: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500',
  },
  priceSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  modernCardPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#059669',
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 14,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  sellerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sellerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sellerAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  modernSellerName: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
    flex: 1,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginRight: 4,
  },
  statusText: {
    fontSize: 11,
    color: '#10B981',
    fontWeight: '500',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  chatButtonText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '600',
    marginLeft: 4,
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.primary,
  },
  viewButtonText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
    marginRight: 4,
  },

  // Quick Actions Styles (keeping original)
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

  // Enhanced Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyStateIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  emptyStateButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: Colors.primary,
    borderRadius: 25,
  },
  emptyStateButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  // Footer loader
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  bottomSpacing: {
    height: 20,
  },
});

export default SwapMartHomePage;