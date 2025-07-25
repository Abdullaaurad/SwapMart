// MyListingsPage.js - Items currently listed for swap
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

const MyListingsPage = () => {
  const navigation = useNavigation();
  const [activeFilter, setActiveFilter] = useState('all');

  const myListings = [
    {
      id: 1,
      title: 'Samsung Galaxy S23',
      price: '$750',
      originalPrice: '$899',
      condition: 'Excellent',
      image: require('../assets/phone.jpeg'),
      views: 245,
      likes: 18,
      offers: 5,
      status: 'active',
      listedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      category: 'Electronics'
    },
    {
      id: 2,
      title: 'Vintage Leather Jacket',
      price: '$180',
      originalPrice: '$250',
      condition: 'Good',
      image: require('../assets/Leather-Jacket.jpeg'),
      views: 89,
      likes: 12,
      offers: 2,
      status: 'active',
      listedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      category: 'Fashion'
    },
    {
      id: 3,
      title: 'Gaming Console',
      price: '$450',
      originalPrice: '$500',
      condition: 'Like New',
      image: require('../assets/console.jpeg'),
      views: 156,
      likes: 24,
      offers: 8,
      status: 'pending',
      listedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      category: 'Electronics'
    }
  ];

  const filterOptions = [
    { key: 'all', label: 'All', count: myListings.length },
    { key: 'active', label: 'Active', count: myListings.filter(item => item.status === 'active').length },
    { key: 'pending', label: 'Pending', count: myListings.filter(item => item.status === 'pending').length }
  ];

  const renderListingItem = ({ item }) => (
    <TouchableOpacity style={styles.listingCard}>
      <Image source={item.image} style={styles.listingImage} />
      
      <View style={styles.listingContent}>
        <View style={styles.listingHeader}>
          <Text style={styles.listingTitle}>{item.title}</Text>
          <View style={[styles.statusBadge, { backgroundColor: item.status === 'active' ? Colors.success : Colors.warning }]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>
        
        <Text style={styles.listingPrice}>{item.price}</Text>
        <Text style={styles.listingCondition}>Condition: {item.condition}</Text>
        
        <View style={styles.listingStats}>
          <View style={styles.statGroup}>
            <Ionicons name="eye" size={14} color={Colors.textSecondary} />
            <Text style={styles.statText}>{item.views}</Text>
          </View>
          <View style={styles.statGroup}>
            <Ionicons name="heart" size={14} color={Colors.danger} />
            <Text style={styles.statText}>{item.likes}</Text>
          </View>
          <View style={styles.statGroup}>
            <Ionicons name="mail" size={14} color={Colors.primary} />
            <Text style={styles.statText}>{item.offers} offers</Text>
          </View>
        </View>
        
        <View style={styles.listingActions}>
          <TouchableOpacity style={[styles.actionBtn, styles.editBtn]}>
            <Text style={styles.editBtnText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.viewBtn]}>
            <Text style={styles.viewBtnText}>View Offers</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

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

      <FlatList
        data={myListings}
        renderItem={renderListingItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.listingsList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.chatListContent}
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
  },
  chatListContent: {
    flexGrow: 1,
  },
  listingCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
  },
  listingImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
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
    marginBottom: 8,
  },
  listingStats: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  statGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
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