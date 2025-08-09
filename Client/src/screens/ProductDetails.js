import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Image,
  ActivityIndicator,
  Dimensions,
  Modal,
} from 'react-native';
import Colors from '../constants/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import Header from '../components/Header';
import axios from 'axios';
import { BASE_URL } from '../API/key';
import CustomAlert from '../components/CustomAlert';

const { width } = Dimensions.get('window');

const MyProductDetailsPage = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { productId } = route.params;
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const flatListRef = useRef(null);

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

  useEffect(() => {
    console.log("Product Id: ", productId)
    fetchProductDetails();
  }, [productId]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/products/product/${productId}`);
      console.log(response.data.products)
      if (response.data.success) {
        setProduct(response.data.products);
      } else {
        showAlert('Error', 'Failed to fetch product details', 'error');
      }
    } catch (error) {
      console.error('Error fetching product details:', error);
      showAlert('Error', error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const getConditionColor = (condition) => {
    switch (condition?.toLowerCase()) {
      case 'new':
        return Colors.success;
      case 'like-new':
        return '#10B981';
      case 'excellent':
        return Colors.primary;
      case 'good':
        return Colors.warning;
      case 'fair':
        return '#F59E0B';
      default:
        return Colors.textSecondary;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return Colors.success;
      case 'completed':
        return Colors.primary;
      case 'cancelled':
        return Colors.danger;
      case 'expired':
        return Colors.warning;
      default:
        return Colors.textSecondary;
    }
  };

  const formatPriceRange = (range) => {
    if (!range || range === 'any') return 'Any price';
    return range.replace('-', ' - $').replace('under-', 'Under $').replace('over-', 'Over $');
  };

  const renderImageCarousel = () => {
    if (!product?.images || product.images.length === 0) {
      return (
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: 'https://via.placeholder.com/400x300' }}
            style={styles.mainImage}
          />
        </View>
      );
    }

    return (
      <View style={styles.imageContainer}>
        <FlatList
          ref={flatListRef}
          data={product.images}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(event) => {
            const index = Math.round(event.nativeEvent.contentOffset.x / width);
            setCurrentImageIndex(index);
          }}
          renderItem={({ item, index }) => (
            <TouchableOpacity 
              activeOpacity={0.8}
              onPress={() => setImageModalVisible(true)}
            >
              <Image 
                source={{ 
                  uri: typeof item === 'object' ? item.url : item 
                }}
                style={styles.mainImage}
                defaultSource={{ uri: 'https://via.placeholder.com/400x300' }}
              />
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
        
        {/* Image indicators */}
        {product.images.length > 1 && (
          <View style={styles.imageIndicators}>
            {product.images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  index === currentImageIndex && styles.activeIndicator
                ]}
              />
            ))}
          </View>
        )}
        
        {/* Image counter */}
        <View style={styles.imageCounter}>
          <Text style={styles.imageCounterText}>
            {currentImageIndex + 1} / {product.images.length}
          </Text>
        </View>
      </View>
    );
  };

  const renderImageModal = () => (
    <Modal
      visible={imageModalVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setImageModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <TouchableOpacity
          style={styles.modalCloseButton}
          onPress={() => setImageModalVisible(false)}
        >
          <Ionicons name="close" size={24} color="white" />
        </TouchableOpacity>
        
        <FlatList
          data={product?.images || []}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          initialScrollIndex={currentImageIndex}
          getItemLayout={(data, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
          renderItem={({ item }) => (
            <Image
              source={{ 
                uri: typeof item === 'object' ? item.url : item 
              }}
              style={styles.modalImage}
              resizeMode="contain"
            />
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </Modal>
  );

  const renderWantedItems = () => {
    if (!product?.wanted_items || product.wanted_items.length === 0) {
      return null;
    }

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Looking for these items</Text>
        {product.wanted_items.map((item, index) => (
          <View key={item.id || index} style={styles.wantedItem}>
            <View style={styles.wantedItemHeader}>
              <Text style={styles.wantedItemName}>{item.item_name}</Text>
              <View style={[
                styles.priorityBadge,
                { backgroundColor: item.priority === 1 ? Colors.danger : item.priority === 2 ? Colors.warning : Colors.textSecondary }
              ]}>
                <Text style={styles.priorityText}>
                  {item.priority === 1 ? 'High' : item.priority === 2 ? 'Medium' : 'Low'}
                </Text>
              </View>
            </View>
            {item.description && (
              <Text style={styles.wantedItemDescription}>{item.description}</Text>
            )}
          </View>
        ))}
      </View>
    );
  };

  const renderTags = () => {
    if (!product?.tags || product.tags.length === 0) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tags</Text>
        <View style={styles.tagsContainer}>
          {product.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header 
          icon="back"
          name="Product Details"
          onIconPress={() => navigation.goBack()}
        />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading product details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView style={styles.container}>
        <Header 
          icon="back"
          name="Product Details"
          onIconPress={() => navigation.goBack()}
        />
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle" size={48} color={Colors.danger} />
          <Text style={styles.errorText}>Product not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        icon="back"
        name="Product Details"
        onIconPress={() => navigation.goBack()}
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Image Carousel */}
        {renderImageCarousel()}
        
        <View style={styles.content}>
          {/* Title and Status */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>{product.title}</Text>
            <View style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(product.status) }
            ]}>
              <Text style={styles.statusText}>{product.status}</Text>
            </View>
          </View>

          {/* Price and Condition */}
          <View style={styles.priceConditionSection}>
            {product.original_price && (
              <Text style={styles.price}>${product.original_price}</Text>
            )}
            <View style={[
              styles.conditionBadge,
              { backgroundColor: getConditionColor(product.condition) }
            ]}>
              <Text style={styles.conditionText}>{product.condition}</Text>
            </View>
          </View>

          {/* Quick Info */}
          <View style={styles.quickInfo}>
            <View style={styles.infoItem}>
              <Ionicons name="location" size={16} color={Colors.primary} />
              <Text style={styles.infoText}>{product.location}</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="eye" size={16} color={Colors.textSecondary} />
              <Text style={styles.infoText}>{product.view_count} views</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="time" size={16} color={Colors.textSecondary} />
              <Text style={styles.infoText}>
                {new Date(product.created_at).toLocaleDateString()}
              </Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>

          {/* Swap Preferences */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Swap Preferences</Text>
            <View style={styles.preferenceItem}>
              <Text style={styles.preferenceLabel}>Preferred method:</Text>
              <Text style={styles.preferenceValue}>
                {product.swap_preference === 'local' ? 'Local meetup' : 
                 product.swap_preference === 'shipping' ? 'Shipping' : 'Both options'}
              </Text>
            </View>
            <View style={styles.preferenceItem}>
              <Text style={styles.preferenceLabel}>Negotiable:</Text>
              <Text style={[
                styles.preferenceValue,
                { color: product.negotiable ? Colors.success : Colors.danger }
              ]}>
                {product.negotiable ? 'Yes' : 'No'}
              </Text>
            </View>
            {product.wanted_category_id && (
              <View style={styles.preferenceItem}>
                <Text style={styles.preferenceLabel}>Wanted condition:</Text>
                <Text style={styles.preferenceValue}>
                  {product.wanted_condition || 'Any condition'}
                </Text>
              </View>
            )}
            {product.wanted_price_range && (
              <View style={styles.preferenceItem}>
                <Text style={styles.preferenceLabel}>Wanted price range:</Text>
                <Text style={styles.preferenceValue}>
                  {formatPriceRange(product.wanted_price_range)}
                </Text>
              </View>
            )}
          </View>

          {/* Additional Notes */}
          {product.additional_notes && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Additional Notes</Text>
              <Text style={styles.description}>{product.additional_notes}</Text>
            </View>
          )}

          {/* Tags */}
          {renderTags()}

          {/* Wanted Items */}
          {renderWantedItems()}

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.contactButton}
              onPress={() => {
                // Navigate to chat or contact owner
                navigation.navigate('Chat', { 
                  productId: product.id,
                  ownerId: product.user_id 
                });
              }}
            >
              <Ionicons name="chatbubble" size={20} color="white" />
              <Text style={styles.contactButtonText}>Contact Owner</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.offerButton}
              onPress={() => {
                navigation.navigate('MakeOffer', { 
                  productId: product.id 
                });
              }}
            >
              <Ionicons name="swap-horizontal" size={20} color="white" />
              <Text style={styles.offerButtonText}>Make Offer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Image Modal */}
      {renderImageModal()}

      {/* Custom Alert */}
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
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
    height: 300,
    backgroundColor: Colors.neutral50,
  },
  mainImage: {
    width: width,
    height: 300,
    backgroundColor: Colors.neutral50,
  },
  imageIndicators: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: 'white',
  },
  imageCounter: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  imageCounterText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: width,
    height: '100%',
  },
  content: {
    padding: 16,
  },
  titleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    flex: 1,
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
    textTransform: 'capitalize',
  },
  priceConditionSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  conditionBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  conditionText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
    textTransform: 'capitalize',
  },
  quickInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 6,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  preferenceLabel: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '500',
  },
  preferenceValue: {
    fontSize: 16,
    color: Colors.textSecondary,
    textTransform: 'capitalize',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: Colors.neutral100,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  wantedItem: {
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  wantedItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  wantedItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '600',
    color: 'white',
    textTransform: 'uppercase',
  },
  wantedItemDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 5,
    paddingBottom: 20,
  },
  contactButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.textSecondary,
    paddingVertical: 16,
    borderRadius: 12,
  },
  contactButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  offerButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
  },
  offerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default MyProductDetailsPage;