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

const MyListingsPage = () => {
  const navigation = useNavigation();
  const [activeFilter, setActiveFilter] = useState('all');
  const [myListings, setMyListings] = useState([]);
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
      confirmText: buttonType === 'double' ? 'Delete' : 'OK',
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

  // Move fetchListings function outside useEffect so it can be reused
  const fetchListings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/products/my-listings`);
      if(response.data.success){
        // console.log('Fetched listings:', response.data.products);
        // Ensure we always set an array, even if the response is null/undefined
        setMyListings(response.data.products || []);
      } else {
        showAlert('Error', 'Failed to fetch listings', 'error');
        setMyListings([]); // Set empty array on failure
      }
    }
    catch (error) {
      console.error('Error fetching listings:', error);
      showAlert('Error', error.message, 'error');
      setMyListings([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const deletproduct = async (id) => {
    try{
      console.log('Deleting product with ID:', id);
      const response = await axios.delete(`${BASE_URL}/products/${id}`);
      if(response.data.success){
        // Filter out the deleted product from myListings
        setMyListings(prevListings => prevListings.filter(item => item.id !== id));
        showAlert('Success', 'Listing deleted successfully', 'success', 'single');
      } else {
        showAlert('Error', 'Failed to delete listing', 'error');
      }
    }
    catch (error) {
      console.error('Error deleting listing:', error);
      showAlert('Error', error.message, 'error');
    } 
  }

  const deletepopup = (id) => {
    showAlert(
      'Delete Listing',
      'Are you sure you want to delete this listing? This action cannot be undone.',
      'error',
      'double',
      () => {
        // This will be called only when confirm/delete button is pressed
        deletproduct(id);
      },
      () => {
        // This will be called when cancel button is pressed
        console.log('Delete cancelled');
      }
    );
  } 

  useEffect(() => {
    fetchListings();
  }, []);

  // Filter listings based on active filter
  const getFilteredListings = () => {
    // Ensure myListings is always an array before filtering
    const listings = Array.isArray(myListings) ? myListings : [];
    
    switch (activeFilter) {
      case 'active':
        return listings.filter(item => item.status === 'active');
      case 'pending':
        return listings.filter(item => item.status === 'pending');
      case 'swaped':
        return listings.filter(item => item.status === 'swaped');
      default:
        return listings;
    }
  };

  const filteredListings = getFilteredListings();

  // Ensure myListings is an array before using filter/length methods
  const safeListings = Array.isArray(myListings) ? myListings : [];

  const filterOptions = [
    { key: 'all', label: 'All', count: safeListings.length },
    { key: 'active', label: 'Active', count: safeListings.filter(item => item.status === 'active').length },
    { key: 'pending', label: 'Pending', count: safeListings.filter(item => item.status === 'pending').length },
    { key: 'swaped', label: 'Swaped', count: safeListings.filter(item => item.status === 'swaped').length }
  ];

  // Function to get the first image from the images array
  const getImageSource = (images) => {
    if (images && images.length > 0) {
      // If images is an array of objects with url property
      // console.log('Images:', images);
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

  const renderListingItem = ({ item }) => (
    <TouchableOpacity style={styles.listingCard}>
      <Image 
        source={getImageSource(item.images)} 
        style={styles.listingImage}
        defaultSource={{ uri: 'https://via.placeholder.com/150' }}
      />
      
      <View style={styles.listingContent}>
        <View style={styles.listingHeader}>
          <Text style={styles.listingTitle} numberOfLines={2}>{item.title}</Text>
          <View style={[
            styles.statusBadge, 
            { backgroundColor: item.status === 'active' ? Colors.success : Colors.warning }
          ]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>
        
        <Text style={styles.listingPrice}>${item.original_price}</Text>
        <Text style={styles.listingCondition}>Condition: {item.condition}</Text>
        <Text style={styles.listingLocation} numberOfLines={1}>📍 {item.location}</Text>
        
        <View style={styles.listingStats}>
          <View style={styles.statGroup}>
            <Ionicons name="eye" size={14} color={Colors.textSecondary} />
            <Text style={styles.statText}>{item.view_count || 0}</Text>
          </View>
          <View style={styles.statGroup}>
            <Ionicons name="pricetag" size={14} color={Colors.primary} />
            <Text style={styles.statText}>{item.category_name}</Text>
          </View>
          <View style={styles.statGroup}>
            <Ionicons name="time" size={14} color={Colors.textSecondary} />
            <Text style={styles.statText}>
              {new Date(item.created_at).toLocaleDateString()}
            </Text>
          </View>
        </View>
        
        <View style={styles.listingActions}>
          {item.status === 'active' && (
            <TouchableOpacity 
              style={[styles.actionBtn, styles.deleteBtn]}
              onPress={() => deletepopup(item.id)}
            >
              <Text style={styles.deleteBtnText}>Delete</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity 
            style={[styles.actionBtn, styles.viewBtn]}
            onPress={() => {
              // Navigate to offers screen
              navigation.navigate('MyProductDetails', { productId: item.id });
            }}
          >
            <Text style={styles.viewBtnText}>View Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Empty state component for better reusability
  const EmptyState = ({ title, subtitle, showCreateButton = false }) => (
    <View style={styles.centerContainer}>
      <Ionicons name="list-outline" size={64} color={Colors.textSecondary} />
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptySubtitle}>{subtitle}</Text>
      {showCreateButton && (
        <TouchableOpacity 
          style={styles.createButton}
          onPress={() => navigation.navigate('AddProduct')}
        >
          <Ionicons name="add" size={20} color={Colors.surface} style={styles.createButtonIcon} />
          <Text style={styles.createButtonText}>Create Your First Listing</Text>
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
          name="My Listings"
          onIconPress={() => navigation.goBack()}
        />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading your listings...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        icon="back"
        name="My Listings"
        onIconPress={() => navigation.goBack()}
      />

      <SearchBar/>

      {/* Only show filters if there are listings */}
      {safeListings.length > 0 && (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filtersContainer}
          contentContainerStyle={styles.filtersContent}
        >
          {filterOptions.map(filter => (
            <TouchableOpacity
              key={filter.key}
              style={[styles.filterButton, activeFilter === filter.key && styles.activeFilter]}
              onPress={() => setActiveFilter(filter.key)}
            >
              <Text style={[styles.filterText, activeFilter === filter.key && styles.activeFilterText]}>
                {filter.label}
              </Text>
              <View style={[styles.filterBadge, activeFilter === filter.key && styles.activeFilterBadge]}>
                <Text style={[styles.filterBadgeText, activeFilter === filter.key && styles.activeFilterBadgeText]}>
                  {filter.count}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Main content area */}
      {safeListings.length === 0 ? (
        // Show empty state when no listings at all
        <EmptyState 
          title="No Listings Available"
          subtitle="You haven't created any listings yet. Start by creating your first listing to begin swapping!"
          showCreateButton={true}
        />
      ) : filteredListings.length === 0 ? (
        // Show filtered empty state when listings exist but filter returns empty
        <EmptyState 
          title={`No ${activeFilter === 'all' ? '' : activeFilter} listings`}
          subtitle={`You don't have any ${activeFilter === 'all' ? '' : activeFilter} listings at the moment.`}
          showCreateButton={false}
        />
      ) : (
        // Show listings
        <FlatList
          data={filteredListings}
          renderItem={renderListingItem}
          keyExtractor={(item) => item.id.toString()}
          style={styles.listingsList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.chatListContent}
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
  errorText: {
    marginTop: 12,
    fontSize: 16,
    color: Colors.danger,
    textAlign: 'center',
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
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: Colors.primary,
    borderRadius: 8,
  },
  retryButtonText: {
    color: Colors.surface,
    fontSize: 16,
    fontWeight: '600',
  },
  createButton: {
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
  createButtonIcon: {
    marginRight: 8,
  },
  createButtonText: {
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
  filterBadge: {
    backgroundColor: Colors.danger,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  activeFilterBadge: {
    backgroundColor: Colors.surface,
  },
  filterBadgeText: {
    fontSize: 10,
    color: Colors.surface,
    fontWeight: '600',
  },
  activeFilterBadgeText: {
    color: Colors.primary,
  },
  listingsList: {
    flex: 1,
    paddingHorizontalVertical: 16,
  },
  chatListContent: {
    flexGrow: 1,
    paddingVertical: 16,
  },
  listingCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  listingImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
    backgroundColor: Colors.neutral50,
  },
  listingContent: {
    flex: 1,
  },
  listingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  listingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.surface,
    textTransform: 'uppercase',
  },
  listingPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 4,
  },
  listingCondition: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  listingLocation: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  listingStats: {
    flexDirection: 'row',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  statGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 4,
  },
  statText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  listingActions: {
    flexDirection: 'row',
  },
  actionBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 8,
  },
  deleteBtn: {
    backgroundColor: Colors.danger,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  viewBtn: {
    backgroundColor: Colors.primary,
  },
  deleteBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.neutral0,
  },
  viewBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.surface,
  },
});

export default MyListingsPage;