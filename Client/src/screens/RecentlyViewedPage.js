// RecentlyViewedPage.js - Browse history
import React from 'react';
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

const RecentlyViewedPage = () => {
  const navigation = useNavigation();

  const recentlyViewed = [
    {
      id: 1,
      title: 'Wireless Headphones',
      price: '$180',
      condition: 'Like New',
      image: require('../assets/headphones.jpeg'),
      seller: 'Audio Expert',
      viewedDate: new Date(Date.now() - 30 * 60 * 1000),
      category: 'Electronics',
      isAvailable: true
    },
    {
      id: 2,
      title: 'Gaming Keyboard',
      price: '$120',
      condition: 'Excellent',
      image: require('../assets/keyboard.jpeg'),
      seller: 'Gamer Pro',
      viewedDate: new Date(Date.now() - 2 * 60 * 60 * 1000),
      category: 'Electronics',
      isAvailable: true
    },
    {
      id: 3,
      title: 'Yoga Mat Set',
      price: '$45',
      condition: 'Good',
      image: require('../assets/yoga.jpeg'),
      seller: 'Fitness Enthusiast',
      viewedDate: new Date(Date.now() - 6 * 60 * 60 * 1000),
      category: 'Sports',
      isAvailable: false
    },
    {
      id: 4,
      title: 'Coffee Machine',
      price: '$250',
      condition: 'Excellent',
      image: require('../assets/coffee.jpeg'),
      seller: 'Coffee Lover',
      viewedDate: new Date(Date.now() - 12 * 60 * 60 * 1000),
      category: 'Home',
      isAvailable: true
    }
  ];

  const formatViewTime = (date) => {
    const now = new Date();
    const diffInMinutes = (now - date) / (1000 * 60);
    
    if (diffInMinutes < 60) {
      return `${Math.floor(diffInMinutes)}m ago`;
    } else if (diffInMinutes < 24 * 60) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / (24 * 60))}d ago`;
    }
  };

  const clearHistory = () => {
    // Clear history logic here
    console.log('Clearing history');
  };

  const renderRecentItem = ({ item }) => (
    <TouchableOpacity style={styles.recentItemCard}>
      <Image source={item.image} style={styles.recentItemImage} />
      
      <View style={styles.recentItemContent}>
        <View style={styles.recentItemHeader}>
          <Text style={styles.recentItemTitle}>{item.title}</Text>
          <Text style={styles.recentItemTime}>{formatViewTime(item.viewedDate)}</Text>
        </View>
        
        <Text style={styles.recentItemPrice}>{item.price}</Text>
        <Text style={styles.recentItemCondition}>Condition: {item.condition}</Text>
        <Text style={styles.recentItemSeller}>by {item.seller}</Text>
        
        <View style={styles.recentItemFooter}>
          <View style={[styles.availabilityBadge, { 
            backgroundColor: item.isAvailable ? `${Colors.success}15` : `${Colors.danger}15` 
          }]}>
            <Text style={[styles.availabilityText, { 
              color: item.isAvailable ? Colors.success : Colors.danger 
            }]}>
              {item.isAvailable ? 'Available' : 'Unavailable'}
            </Text>
          </View>
          <TouchableOpacity style={styles.viewAgainButton}>
            <Text style={styles.viewAgainText}>View</Text>
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
        name="Recently Viewed"
        onIconPress={() => navigation.goBack()}
      />

      <View style={styles.recentHeader}>
        <Text style={styles.recentTitle}>Your browsing history</Text>
        <TouchableOpacity style={styles.clearButton} onPress={clearHistory}>
          <Text style={styles.clearButtonText}>Clear All</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={recentlyViewed}
        renderItem={renderRecentItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.recentItemsList}
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
  listContent: {
    padding: 16,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  recentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: Colors.danger,
  },
  clearButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.surface,
  },
  recentItemsList: {
    flex: 1,
  },
  recentItemCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
  },
  recentItemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  recentItemContent: {
    flex: 1,
  },
  recentItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  recentItemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
  },
  recentItemTime: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  recentItemPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 2,
  },
  recentItemCondition: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  recentItemSeller: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  recentItemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  availabilityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  availabilityText: {
    fontSize: 10,
    fontWeight: '600',
  },
  viewAgainButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  viewAgainText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.surface,
  },
});

export default RecentlyViewedPage;