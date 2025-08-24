// SwapHistoryPage.js - All completed swaps
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
  Image,
} from 'react-native';
import Colors from '../constants/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import axios from 'axios';
import { BASE_URL } from '../API/key';

const ProductHistoryPage = () => {
  const navigation = useNavigation();
  const [activeFilter, setActiveFilter] = useState('all');
  const [productHistory, setProductHistory] = useState([]);

  useEffect(() => {
    const fetchProductHistory = async () => {
      try{
        const response = await axios.get(`${BASE_URL}/products/listing-history`);
        if(response.data.success){
          console.log('Fetched product history:', response.data.products[0]?.myItem?.image?.[0]?.url);
          setProductHistory(response.data.products)
        }
      }
      catch (error) {
        console.error('Error fetching product history:', error);
      }
    }
    fetchProductHistory();
  }, [] );

  const formatDate = (date) => {
    // Convert string to Date object
    const dateObj = new Date(date);
    
    // Check if conversion was successful
    if (isNaN(dateObj.getTime())) {
      return 'Invalid Date';
    }
    
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Image placeholder component
  const ImagePlaceholder = ({ style, text = "No Image" }) => (
    <View style={[style, styles.imagePlaceholder]}>
      <Ionicons name="image-outline" size={24} color={Colors.textSecondary} />
      <Text style={styles.placeholderText}>{text}</Text>
    </View>
  );

  // Safe image component with fallback
  const SafeImage = ({ source, style, alt }) => {
    const [imageError, setImageError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    if (!source || imageError) {
      return <ImagePlaceholder style={style} text={alt || "No Image"} />;
    }

    return (
      <Image 
        source={{ uri: source }}
        style={style}
        onError={() => {
          setImageError(true);
          setIsLoading(false);
        }}
        onLoad={() => setIsLoading(false)}
      />
    );
  };

  const renderProductItem = ({ item }) => (
    <TouchableOpacity style={styles.swapCard}>
      <View style={styles.swapHeader}>
        <View style={styles.partnerInfo}>
          {item.partnerAvatar ? (
            <Image source={{ uri: item.partnerAvatar }} style={styles.partnerAvatar} />
          ) : (
            <View style={styles.partnerAvatarPlaceholder}>
              <Text style={styles.partnerAvatarText}>{item.swapPartner?.charAt(0) || '?'}</Text>
            </View>
          )}
          <View style={styles.partnerDetails}>
            <Text style={styles.partnerName}>{item.swapPartner || 'Unknown Partner'}</Text>
          </View>
        </View>
        <View style={styles.swapMeta}>
          <Text style={styles.swapDate}>{formatDate(item.completedDate)}</Text>
        </View>
      </View>

      <View style={styles.swapDetails}>
        <View style={styles.itemContainer}>
          <SafeImage 
            source={item?.myItem?.image[0]} 
            style={styles.itemImage} 
            alt="Received Item"
          />
          <View style={styles.itemInfo}>
            <Text style={styles.itemName}>{item?.myItem?.name || 'Unknown Item'}</Text>
            <Text style={styles.itemLabel}>You gave</Text>
          </View>
        </View>

        <View style={styles.swapArrow}>
          <Ionicons name="swap-horizontal" size={24} color={Colors.primary} />
        </View>

        <View style={styles.itemContainer}>
          <SafeImage 
            source={item?.receivedItem?.image[0]} 
            style={styles.itemImage} 
            alt="Received Item"
          />
          <View style={styles.itemInfo}>
            <Text style={styles.itemName}>{item?.receivedItem?.name || 'Unknown Item'}</Text>
            <Text style={styles.itemLabel}>You received</Text>
          </View>
        </View>
      </View>

      <View style={styles.swapActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="chatbubble-outline" size={16} color={Colors.primary} />
          <Text style={styles.actionText}>Contact</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('SwapDetails', { swapId: item.id })}
        >
          <Ionicons name="receipt-outline" size={16} color={Colors.textSecondary} />
          <Text style={styles.actionText}>Details</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        icon="back"
        name="Swap History"
        onIconPress={() => navigation.goBack()}
      />

      <SearchBar />

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{productHistory.length}</Text>
          <Text style={styles.statLabel}>Total Swaps</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>4.7</Text>
          <Text style={styles.statLabel}>Avg Rating</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>$2,450</Text>
          <Text style={styles.statLabel}>Est. Value</Text>
        </View>
      </View>

      <FlatList
        data={productHistory}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        style={styles.swapList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  listContent: {
    padding: 16,
  },
  swapList: {
    flex: 1,
  },
  swapCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  swapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  partnerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  partnerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  partnerAvatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  partnerAvatarText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.surface,
  },
  partnerDetails: {
    flex: 1,
  },
  partnerName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  swapId: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  swapMeta: {
    alignItems: 'flex-end',
  },
  swapDate: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text,
    marginLeft: 4,
  },
  swapDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  itemContainer: {
    flex: 1,
    alignItems: 'center',
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginBottom: 8,
  },
  itemInfo: {
    alignItems: 'center',
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 2,
  },
  itemCondition: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  itemLabel: {
    fontSize: 10,
    color: Colors.primary,
    fontWeight: '500',
  },
  swapArrow: {
    marginHorizontal: 16,
  },
  swapActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: Colors.neutral50,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
    marginLeft: 6,
  },
  // New styles for placeholder
  imagePlaceholder: {
    backgroundColor: Colors.neutral100 || '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border || '#e0e0e0',
    borderStyle: 'dashed',
  },
  placeholderText: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
});

export default ProductHistoryPage;