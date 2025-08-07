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

const MyListingsPage = () => {
  const navigation = useNavigation();
  const [activeFilter, setActiveFilter] = useState('all');
  const [myListings, setMyListings] = useState([]); // Use state instead of constant
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}/products/my-listings`);
        if(response.data.success){
          console.log('Fetched listings:', response.data.swaps);
          setMyListings(response.data.swaps); // Set state properly
        } else {
          setError('Failed to fetch listings');
        }
      }
      catch (error) {
        console.error('Error fetching listings:', error);
        setError('Error fetching listings');
      } finally {
        setLoading(false);
      }
    }
    fetchListings();
  }, []);

  // Filter listings based on active filter
  const getFilteredListings = () => {
    switch (activeFilter) {
      case 'active':
        return myListings.filter(item => item.status === 'active');
      case 'pending':
        return myListings.filter(item => item.status === 'pending');
      default:
        return myListings;
    }
  };

  const filteredListings = getFilteredListings();

  const filterOptions = [
    { key: 'all', label: 'All', count: myListings.length },
    { key: 'active', label: 'Active', count: myListings.filter(item => item.status === 'active').length },
    { key: 'pending', label: 'Pending', count: myListings.filter(item => item.status === 'pending').length }
  ];

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
          <TouchableOpacity 
            style={[styles.actionBtn, styles.editBtn]}
            onPress={() => {
              // Navigate to edit screen with item data
              navigation.navigate('EditListing', { listingId: item.id });
            }}
          >
            <Text style={styles.editBtnText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionBtn, styles.viewBtn]}
            onPress={() => {
              // Navigate to offers screen
              navigation.navigate('ViewOffers', { listingId: item.id });
            }}
          >
            <Text style={styles.viewBtnText}>View Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
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

  // Show error state
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Header 
          icon="back"
          name="My Listings"
          onIconPress={() => navigation.goBack()}
        />
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle" size={48} color={Colors.danger} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => {
              setError(null);
              fetchListings();
            }}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
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

      <SearchBar />

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

      {filteredListings.length > 0 ? (
        <FlatList
          data={filteredListings}
          renderItem={renderListingItem}
          keyExtractor={(item) => item.id.toString()}
          style={styles.listingsList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.chatListContent}
        />
      ) : (
        <View style={styles.centerContainer}>
          <Ionicons name="list" size={48} color={Colors.textSecondary} />
          <Text style={styles.emptyText}>
            {activeFilter === 'all' ? 'No listings found' : `No ${activeFilter} listings`}
          </Text>
          <TouchableOpacity 
            style={styles.createButton}
            onPress={() => navigation.navigate('CreateListing')}
          >
            <Text style={styles.createButtonText}>Create Your First Listing</Text>
          </TouchableOpacity>
        </View>
      )}
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
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
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
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: Colors.primary,
    borderRadius: 8,
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
    paddingHorizontal: 16,
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
  editBtn: {
    backgroundColor: Colors.neutral50,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  viewBtn: {
    backgroundColor: Colors.primary,
  },
  editBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text,
  },
  viewBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.surface,
  },
});

export default MyListingsPage;