// SavedItemsPage.js - Favorited/bookmarked items
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import Colors from '../constants/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import axios from 'axios';
import {BASE_URL} from '../API/key';
import CustomAlert from '../components/CustomAlert';

const SavedItemsPage = () => {
  const navigation = useNavigation();
  const [activeFilter, setActiveFilter] = useState('all');
  const [savedItems, setSavedItems] = useState([]);
  const [categories, setCategories] = useState(['all']); // Initialize with 'all'
  const [loading, setLoading] = useState(true);

  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: '',
    message: '',
    type: 'info',
    buttonType: 'none',
    onClose: () => { },
    onCancel: () => { },
    confirmText: 'OK',
    cancelText: 'Cancel',
  });

  const showAlert = (title, message, type = 'info', buttonType = 'none', onConfirm = () => { }, onCancel = () => { }) => {
    setAlertConfig({
      visible: true,
      title,
      message,
      type,
      buttonType,
      confirmText: buttonType === 'double' ? 'Remove' : 'OK',
      cancelText: 'Cancel',
      onClose: () => {
        setAlertConfig(prev => ({ ...prev, visible: false }));
        if (buttonType === 'double') {
          onConfirm(); // Only call onConfirm when confirm button is pressed
        }
      },
      onCancel: () => {
        setAlertConfig(prev => ({ ...prev, visible: false }));
        onCancel(); // Call onCancel when cancel button is pressed
      },
    });
  };

  // Fetch all categories from API
  const getAllCategories = async () => {
    try {
      const results = await axios.get(`${BASE_URL}/category/findall`);
      if (results.data && results.data.success) {
        // Add 'all' to the beginning of the categories array
        const fetchedCategories = results.data.categories || [];
        setCategories(['all', ...fetchedCategories]);
        
        // Ensure activeFilter is set to 'all' if it's not already set
        if (!activeFilter) {
          setActiveFilter('all');
        }
      } else {
        setCategories(['all']);
        setActiveFilter('all');
        showAlert('Error', results.data?.message || 'Failed to fetch categories', 'error');
      }
    }
    catch (error) {
      setCategories(['all']);
      setActiveFilter('all');
      console.error('Error fetching categories:', error);
      showAlert('Error', error.message, 'error');
    }
  };

  // Fetch saved items from API
  const fetchSavedItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/like/my-likes`);
      if(response.data.success){
        console.log('Fetched saved items:', response.data.likes);
        // Transform API data to match UI expectations
        const transformedItems = response.data.likes.map(like => ({
          id: like.product_id,
          likeId: like.id,
          title: like.title,
          price: `$${like.original_price}`,
          originalPrice: like.original_price,
          condition: like.condition,
          location: like.location,
          images: like.images || [],
          seller: like.owner_username,
          savedDate: new Date(like.liked_at),
          category: like.category_name,
          isAvailable: like.is_available,
          distance: '2.5 miles', // You might want to calculate this based on user location
          description: like.description,
          status: like.status,
        }));
        
        setSavedItems(transformedItems || []);
      } else {
        showAlert('Error', 'Failed to fetch saved items', 'error');
        setSavedItems([]); // Set empty array on failure
      }
    } catch (error) {
      console.error('Error fetching saved items:', error);
      showAlert('Error', error.message, 'error');
      setSavedItems([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const removeSavedItem = async (likeId) => {
    try{
      console.log('Removing saved item with like ID:', likeId);
      const response = await axios.delete(`${BASE_URL}/like/${likeId}`);
      if(response.data.success){
        // Filter out the removed item from savedItems using likeId
        setSavedItems(prevItems => prevItems.filter(item => item.likeId !== likeId));
        showAlert('Success', 'Item removed from saved list successfully', 'success', 'single');
      } else {
        showAlert('Error', 'Failed to remove item from saved list', 'error');
      }
    }
    catch (error) {
      console.error('Error removing saved item:', error);
      showAlert('Error', error.response?.data?.message || error.message, 'error');
    } 
  }

  const removeItemPopup = (likeId) => {
    showAlert(
      'Remove Item',
      'Are you sure you want to remove this item from your saved list?',
      'error',
      'double',
      () => {
        // This will be called only when confirm/remove button is pressed
        removeSavedItem(likeId);
      },
      () => {
        // This will be called when cancel button is pressed
        console.log('Remove cancelled');
      }
    );
  }

  // Optional: Add a function to refresh all saved items if needed
  const refreshSavedItems = async () => {
    console.log('Refreshing saved items...');
    await fetchSavedItems();
  }; 

  useEffect(() => {
    // Fetch both categories and saved items on component mount
    const initializeData = async () => {
      await getAllCategories();
      await fetchSavedItems();
    };
    
    initializeData();
  }, []);

  // Filter saved items based on active filter
  const getFilteredItems = () => {
    // Ensure savedItems is always an array before filtering
    const items = Array.isArray(savedItems) ? savedItems : [];
    
    // If activeFilter is undefined or null, return all items
    if (!activeFilter || activeFilter === 'all') return items;
    
    return items.filter(item => {
      if (!item.category || !activeFilter) return false;
      
      // Handle both string categories and object categories
      const itemCategory = typeof item.category === 'string' 
        ? item.category 
        : item.category.name || '';
      
      const filterValue = typeof activeFilter === 'string'
        ? activeFilter
        : activeFilter.name || '';
        
      return itemCategory.toLowerCase() === filterValue.toLowerCase();
    });
  };

  const filteredItems = getFilteredItems();

  // Ensure savedItems is an array before using filter/length methods
  const safeItems = Array.isArray(savedItems) ? savedItems : [];

  // Function to get the first image from the images array
  const getImageSource = (images) => {
    if (images && images.length > 0) {
      // If images is an array of objects with url property
      if (typeof images[0] === 'object' && images[0].url) {
        return { uri: images[0].url };
      }
      // If images is an array of strings
      if (typeof images[0] === 'string') {
        return { uri: images[0] };
      }
    }
    // Return a placeholder image if no images available
    return { uri: 'https://via.placeholder.com/150' };
  };

  const formatSavedDate = (date) => {
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1d ago';
    return `${diffDays}d ago`;
  };

  const renderSavedItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.savedItemCard}
      onPress={() => navigation.navigate('ProductDetails', { productId: item.id })}
    >
      <View style={styles.savedItemImageContainer}>
        <Image 
          source={getImageSource(item.images)} 
          style={styles.savedItemImage}
          defaultSource={{ uri: 'https://via.placeholder.com/150' }}
        />
        {!item.isAvailable && (
          <View style={styles.unavailableOverlay}>
            <Text style={styles.unavailableText}>Not Available</Text>
          </View>
        )}
        <TouchableOpacity 
          style={styles.removeButton}
          onPress={() => removeItemPopup(item.likeId)}
        >
          <Ionicons name="heart" size={20} color={Colors.danger} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.savedItemContent}>
        <Text style={styles.savedItemTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.savedItemPrice}>{item.price}</Text>
        <Text style={styles.savedItemCondition}>Condition: {item.condition}</Text>
        <Text style={styles.savedItemLocation} numberOfLines={1}>{item.location} • {item.distance}</Text>
        <Text style={styles.savedItemSeller}>by {item.seller}</Text>
        
        <View style={styles.savedItemFooter}>
          <Text style={styles.savedDate}>
            Saved {formatSavedDate(item.savedDate)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Empty state component for better reusability
  const EmptyState = ({ title, subtitle, showBrowseButton = false }) => (
    <View style={styles.centerContainer}>
      <Ionicons name="heart-outline" size={64} color={Colors.textSecondary} />
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptySubtitle}>{subtitle}</Text>
      {showBrowseButton && (
        <TouchableOpacity 
          style={styles.browseButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Ionicons name="search" size={20} color={Colors.surface} style={styles.browseButtonIcon} />
          <Text style={styles.browseButtonText}>Browse Products</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  // Show loading state
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header 
          icon="back"
          name="Saved Items"
          onIconPress={() => navigation.goBack()}
        />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading saved items...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.surface} />
      
      <Header 
        icon="back"
        name="Saved Items"
        onIconPress={() => navigation.goBack()}
      />

      <SearchBar />

      {/* Only show filters if there are saved items */}
      {safeItems.length > 0 && (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filtersContainer}
          contentContainerStyle={styles.filtersContent}
        >
          {categories.map((category, index) => {
            // Handle both string categories and object categories
            const categoryValue = typeof category === 'string' ? category : category.name || 'Unknown';
            const categoryId = typeof category === 'string' ? category : category.id || index;
            
            return (
              <TouchableOpacity
                key={`${categoryId}-${index}`}
                style={[styles.filterButton, activeFilter === categoryValue && styles.activeFilter]}
                onPress={() => setActiveFilter(categoryValue)}
              >
                <Text style={[styles.filterText, activeFilter === categoryValue && styles.activeFilterText]}>
                  {categoryValue.charAt(0).toUpperCase() + categoryValue.slice(1)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      {/* Main content area */}
      {safeItems.length === 0 ? (
        // Show empty state when no saved items at all
        <EmptyState 
          title="No Saved Items"
          subtitle="You haven't saved any items yet. Start browsing to find products you love!"
          showBrowseButton={true}
        />
      ) : filteredItems.length === 0 ? (
        // Show filtered empty state when saved items exist but filter returns empty
        <EmptyState 
          title={`No ${activeFilter === 'all' ? '' : activeFilter} saved items`}
          subtitle={`You don't have any ${activeFilter === 'all' ? '' : activeFilter} saved items at the moment.`}
          showBrowseButton={false}
        />
      ) : (
        // Show saved items in 2-column grid
        <FlatList
          data={filteredItems}
          renderItem={renderSavedItem}
          keyExtractor={(item) => item.id.toString()}
          style={styles.savedItemsList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          numColumns={2}
          columnWrapperStyle={styles.savedItemRow}
        />
      )}

      <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        buttonType={alertConfig.buttonType}
        confirmText={alertConfig.confirmText}
        cancelText={alertConfig.cancelText}
        onClose={alertConfig.onClose}
        onCancel={alertConfig.onCancel}
      />

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: Colors.textSecondary,
  },
  emptyTitle: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
  },
  emptySubtitle: {
    marginTop: 8,
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  browseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  browseButtonIcon: {
    marginRight: 8,
  },
  browseButtonText: {
    color: Colors.surface,
    fontSize: 16,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
  },
  filtersContainer: {
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    maxHeight: 76,
    minHeight: 75,
  },
  filtersContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: Colors.background,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    maxHeight: 46,
    minHeight: 45,
  },
  activeFilter: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  activeFilterText: {
    color: Colors.surface,
  },
  savedItemsList: {
    flex: 1,
  },
  savedItemRow: {
    justifyContent: 'space-between',
  },
  savedItemCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  savedItemImageContainer: {
    position: 'relative',
  },
  savedItemImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    resizeMode: 'cover',
    backgroundColor: Colors.neutral50,
  },
  unavailableOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  unavailableText: {
    color: Colors.surface,
    fontSize: 12,
    fontWeight: '600',
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  savedItemContent: {
    padding: 12,
  },
  savedItemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  savedItemPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 4,
  },
  savedItemCondition: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginBottom: 2,
    textTransform: 'capitalize',
  },
  savedItemLocation: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  savedItemSeller: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  savedItemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  savedDate: {
    fontSize: 10,
    color: Colors.textSecondary,
  },
  contactButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  contactButtonText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.surface,
  },
});

export default SavedItemsPage;