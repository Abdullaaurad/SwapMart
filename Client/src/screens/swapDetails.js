import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from 'react-native';
import Colors from '../constants/colors';
import Header from '../components/Header';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { BASE_URL } from '../API/key';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const SwapDetailsPage = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { swapId } = route.params;
  console.log('Navigated to SwapDetails with swapId:', swapId);

  const [swapDetails, setSwapDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSwapDetails();
  }, []);

  const fetchSwapDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/swaps/${swapId}`);
      if (response.data.success) {
        setSwapDetails(response.data.swap);
      }
    } catch (err) {
      setSwapDetails(null);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return 'Invalid Date';
    return dateObj.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const SafeImage = ({ source, style, alt }) => {
    const [imageError, setImageError] = useState(false);
    if (!source || imageError) {
      return (
        <View style={[style, styles.imagePlaceholder]}>
          <Ionicons name="image-outline" size={32} color={Colors.textSecondary} />
          <Text style={styles.placeholderText}>{alt || "No Image"}</Text>
        </View>
      );
    }
    return (
      <Image
        source={{ uri: source }}
        style={style}
        onError={() => setImageError(true)}
        resizeMode="cover"
      />
    );
  };

  const ImageCarousel = ({ images, title }) => {
    if (!images || images.length === 0) {
      return (
        <View style={styles.noImagesContainer}>
          <Ionicons name="image-outline" size={48} color={Colors.textSecondary} />
          <Text style={styles.noImagesText}>No images available</Text>
        </View>
      );
    }

    const renderImage = ({ item, index }) => (
      <View style={styles.imageContainer}>
        <SafeImage
          source={item}
          style={styles.carouselImage}
          alt={`${title} ${index + 1}`}
        />
      </View>
    );

    return (
      <FlatList
        data={images}
        renderItem={renderImage}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        contentContainerStyle={styles.imageCarousel}
      />
    );
  };

  const StatusBadge = ({ status, swaped }) => {
    const getStatusColor = () => {
      if (swaped) return Colors.success || '#28a745';
      switch (status?.toLowerCase()) {
        case 'completed': return Colors.success || '#28a745';
        case 'pending': return Colors.warning || '#ffc107';
        case 'cancelled': return Colors.error || '#dc3545';
        default: return Colors.textSecondary || '#6c757d';
      }
    };

    const getStatusText = () => {
      if (swaped) return 'Completed';
      return status || 'Pending';
    };

    return (
      <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
        <Ionicons 
          name={swaped ? 'checkmark-circle' : 'time'} 
          size={16} 
          color="white" 
        />
        <Text style={styles.statusText}>{getStatusText()}</Text>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header icon="back" name="Swap Details" onIconPress={() => navigation.goBack()} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading swap details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!swapDetails) {
    return (
      <SafeAreaView style={styles.container}>
        <Header icon="back" name="Swap Details" onIconPress={() => navigation.goBack()} />
        <View style={styles.errorContainer}>
          <Ionicons name="warning-outline" size={64} color={Colors.textSecondary} />
          <Text style={styles.errorTitle}>Swap Not Found</Text>
          <Text style={styles.errorText}>The swap details could not be loaded.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const {
    product_title,
    offered_item_title,
    created_at,
    updated_at,
    swaped,
    user_accepted,
    buyer_accepted,
    product_images = [],
    offered_item_images = [],
    product_condition,
    offered_item_condition,
    product_description,
    offered_item_description,
    owner_name,
    buyer_name,
    owner_avatar,
    buyer_avatar,
    status,
  } = swapDetails;

  return (
    <SafeAreaView style={styles.container}>
      <Header icon="back" name="Swap Details" onIconPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.swapMetaContainer}>
            <View style={styles.dateContainer}>
              <Ionicons name="calendar-outline" size={18} color={Colors.primary} />
              <Text style={styles.swapDate}>{formatDate(updated_at || created_at)}</Text>
            </View>
            <StatusBadge status={status} swaped={swaped} />
          </View>
          <Text style={styles.swapTitle}>Swap Transaction Details</Text>
        </View>

        {/* Swap Overview */}
        <View style={styles.overviewCard}>
          <View style={styles.overviewHeader}>
            <Ionicons name="swap-horizontal" size={24} color={Colors.primary} />
            <Text style={styles.overviewTitle}>Exchange Summary</Text>
          </View>
          <View style={styles.exchangeFlow}>
            <View style={styles.exchangeItem}>
              <Text style={styles.exchangeLabel}>You Gave</Text>
              <Text style={styles.exchangeValue}>{product_title}</Text>
            </View>
            <Ionicons name="arrow-forward" size={20} color={Colors.primary} />
            <View style={styles.exchangeItem}>
              <Text style={styles.exchangeLabel}>You Received</Text>
              <Text style={styles.exchangeValue}>{offered_item_title}</Text>
            </View>
          </View>
        </View>

        {/* Items Detail Section */}
        <View style={styles.itemsSection}>
          {/* Your Item */}
          <View style={styles.itemCard}>
            <View style={styles.itemHeader}>
              <View style={styles.itemHeaderLeft}>
                <Ionicons name="cube-outline" size={20} color={Colors.primary} />
                <Text style={styles.itemHeaderTitle}>Your Item</Text>
              </View>
              <View style={styles.conditionBadge}>
                <Text style={styles.conditionText}>{product_condition || 'N/A'}</Text>
              </View>
            </View>
            
            <ImageCarousel images={product_images} title={product_title} />
            
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{product_title}</Text>
              <Text style={styles.itemDescription}>{product_description}</Text>
            </View>
            
            <View style={styles.userSection}>
              <Text style={styles.userLabel}>Listed by</Text>
              <View style={styles.userInfo}>
                {owner_avatar ? (
                  <Image source={{ uri: owner_avatar }} style={styles.userAvatar} />
                ) : (
                  <View style={styles.userAvatarPlaceholder}>
                    <Text style={styles.userAvatarText}>{owner_name?.charAt(0) || '?'}</Text>
                  </View>
                )}
                <Text style={styles.userName}>{owner_name || 'Owner'}</Text>
              </View>
            </View>
          </View>

          {/* Received Item */}
          <View style={styles.itemCard}>
            <View style={styles.itemHeader}>
              <View style={styles.itemHeaderLeft}>
                <Ionicons name="gift-outline" size={20} color={Colors.success} />
                <Text style={[styles.itemHeaderTitle, { color: Colors.success }]}>Received Item</Text>
              </View>
              <View style={[styles.conditionBadge, { backgroundColor: Colors.success }]}>
                <Text style={styles.conditionText}>{offered_item_condition || 'N/A'}</Text>
              </View>
            </View>
            
            <ImageCarousel images={offered_item_images} title={offered_item_title} />
            
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{offered_item_title}</Text>
              <Text style={styles.itemDescription}>{offered_item_description}</Text>
            </View>
            
            <View style={styles.userSection}>
              <Text style={styles.userLabel}>Offered by</Text>
              <View style={styles.userInfo}>
                {buyer_avatar ? (
                  <Image source={{ uri: buyer_avatar }} style={styles.userAvatar} />
                ) : (
                  <View style={styles.userAvatarPlaceholder}>
                    <Text style={styles.userAvatarText}>{buyer_name?.charAt(0) || '?'}</Text>
                  </View>
                )}
                <Text style={styles.userName}>{buyer_name || 'Buyer'}</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background || '#f8f9fa',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  
  // Header Section
  headerSection: {
    marginBottom: 20,
  },
  swapMetaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  swapDate: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 6,
    fontWeight: '500',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  swapTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
  },

  // Overview Card
  overviewCard: {
    backgroundColor: Colors.surface || 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  overviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  overviewTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginLeft: 8,
  },
  exchangeFlow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  exchangeItem: {
    flex: 1,
    alignItems: 'center',
  },
  exchangeLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  exchangeValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
  },

  // Items Section
  itemsSection: {
    marginBottom: 24,
  },
  itemCard: {
    backgroundColor: Colors.surface || 'white',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 12,
  },
  itemHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemHeaderTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
    marginLeft: 8,
  },
  conditionBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  conditionText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '500',
  },

  // Image Carousel
  imageCarousel: {
    paddingHorizontal: 8,
  },
  imageContainer: {
    marginHorizontal: 4,
  },
  carouselImage: {
    width: width - 48,
    height: 200,
    borderRadius: 12,
  },
  noImagesContainer: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.neutral100 || '#f5f5f5',
    marginHorizontal: 8,
    borderRadius: 12,
  },
  noImagesText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 8,
  },

  // Item Info
  itemInfo: {
    padding: 16,
    paddingTop: 12,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  itemDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },

  // User Section
  userSection: {
    padding: 16,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.border || '#e9ecef',
  },
  userLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  userAvatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  userAvatarText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '700',
  },
  userName: {
    fontSize: 15,
    color: Colors.text,
    fontWeight: '500',
  },

  // Action Section
  actionSection: {
    marginTop: 8,
  },
  primaryActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  primaryActionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  secondaryActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  secondaryActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface || 'white',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border || '#e9ecef',
    flex: 0.48,
  },
  secondaryActionText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary,
    marginLeft: 6,
  },

  // Image Placeholder
  imagePlaceholder: {
    backgroundColor: Colors.neutral100 || '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border || '#e0e0e0',
    borderStyle: 'dashed',
  },
  placeholderText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 6,
    textAlign: 'center',
  },
});

export default SwapDetailsPage;