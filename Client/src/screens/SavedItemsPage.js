// SavedItemsPage.js - Favorited/bookmarked items
import React, { useState } from 'react';
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
} from 'react-native';
import Colors from '../constants/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';

const SavedItemsPage = () => {
  const navigation = useNavigation();
  const [activeFilter, setActiveFilter] = useState('all');

  const savedItems = [
    {
      id: 1,
      title: 'MacBook Pro 16"',
      price: '$1,200',
      originalPrice: '$1,500',
      condition: 'Like New',
      location: 'San Francisco, CA',
      image: require('../assets/Mac.jpeg'),
      seller: 'Tech Enthusiast',
      savedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      category: 'Electronics',
      isAvailable: true,
      distance: '2.5 miles'
    },
    {
      id: 2,
      title: 'Vintage Camera',
      price: '$350',
      originalPrice: '$450',
      condition: 'Good',
      location: 'Los Angeles, CA',
      image: require('../assets/camera.jpeg'),
      seller: 'Photography Pro',
      savedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      category: 'Electronics',
      isAvailable: false,
      distance: '5.2 miles'
    },
    {
      id: 3,
      title: 'Designer Sneakers',
      price: '$220',
      originalPrice: '$300',
      condition: 'Excellent',
      location: 'Miami, FL',
      image: require('../assets/sneakers.jpeg'),
      seller: 'Fashion Lover',
      savedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      category: 'Fashion',
      isAvailable: true,
      distance: '1.8 miles'
    }
  ];

  const categories = ['all', 'Electronics', 'Fashion', 'Home', 'Sports'];

  const getFilteredItems = () => {
    if (activeFilter === 'all') return savedItems;
    return savedItems.filter(item => item.category === activeFilter);
  };

  const removeSavedItem = (itemId) => {
    // Remove item logic here
    console.log('Removing item:', itemId);
  };

  const renderSavedItem = ({ item }) => (
    <TouchableOpacity style={styles.savedItemCard}>
      <View style={styles.savedItemImageContainer}>
        <Image source={item.image} style={styles.savedItemImage} />
        {!item.isAvailable && (
          <View style={styles.unavailableOverlay}>
            <Text style={styles.unavailableText}>Not Available</Text>
          </View>
        )}
        <TouchableOpacity 
          style={styles.removeButton}
          onPress={() => removeSavedItem(item.id)}
        >
          <Ionicons name="heart" size={20} color={Colors.danger} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.savedItemContent}>
        <Text style={styles.savedItemTitle}>{item.title}</Text>
        <Text style={styles.savedItemPrice}>{item.price}</Text>
        <Text style={styles.savedItemCondition}>Condition: {item.condition}</Text>
        <Text style={styles.savedItemLocation}>{item.location} • {item.distance}</Text>
        <Text style={styles.savedItemSeller}>by {item.seller}</Text>
        
        <View style={styles.savedItemFooter}>
          <Text style={styles.savedDate}>
            Saved {Math.floor((Date.now() - item.savedDate) / (1000 * 60 * 60 * 24))}d ago
          </Text>
          <TouchableOpacity style={styles.contactButton}>
            <Text style={styles.contactButtonText}>Contact</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.surface} />
      
      <Header 
        icon="back"
        name="Saved Items"
        onIconPress={() => navigation.goBack()}
      />

      <SearchBar />

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
        contentContainerStyle={styles.filtersContent}
      >
        {categories.map(category => (
          <TouchableOpacity
            key={category}
            style={[styles.filterButton, activeFilter === category && styles.activeFilter]}
            onPress={() => setActiveFilter(category)}
          >
            <Text style={[styles.filterText, activeFilter === category && styles.activeFilterText]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={getFilteredItems()}
        renderItem={renderSavedItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.savedItemsList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        numColumns={2}
        columnWrapperStyle={styles.savedItemRow}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
  savedItemsList: {
    flex: 1,
  },
  savedItemRow: {
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  savedItemCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    width: '48%',
  },
  savedItemImageContainer: {
    position: 'relative',
  },
  savedItemImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
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