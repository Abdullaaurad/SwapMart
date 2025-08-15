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
  RefreshControl
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
      console.log(result);
      
      if (result.data && result.data.success) {
        const newProducts = result.data.products || [];
        
        if (isLoadMore) {
          setFeaturedItems(prev => [...prev, ...newProducts]);
        } else {
          setFeaturedItems(newProducts);
        }
        
        setHasMoreData(newProducts.length === params.limit);
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

  const renderFeaturedItem = ({ item, index }) => (
    <View style={[styles.featuredItemWrapper, { marginRight: index % 2 === 0 ? 8 : 0 }]}>
      <ItemCard item={item} onPress={() => navigation.navigate('ProductDetails')} />
    </View>
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
      <Ionicons name="search-outline" size={64} color={Colors.neutral400} />
      <Text style={styles.emptyStateTitle}>
        {searchQuery ? 'No items found' : 'No products available'}
      </Text>
      <Text style={styles.emptyStateSubtitle}>
        {searchQuery 
          ? `Try adjusting your search "${searchQuery}"` 
          : 'Check back later for new items'
        }
      </Text>
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
            renderItem={({ item }) => <CategoryCard category={item} />}
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
    backgroundColor: Platform.OS === 'ios' ? Colors.neutral0 : Colors.background,
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
    flex: 1,
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
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    // Shadow for Android
    elevation: 3,
  },
  categoryCardSelected: {
    borderColor: '#3B82F6',
    borderWidth: 2.5,
    backgroundColor: '#F8FAFC',
    transform: [{ scale: 1.05 }],
    // Enhanced shadow when selected
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

  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
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