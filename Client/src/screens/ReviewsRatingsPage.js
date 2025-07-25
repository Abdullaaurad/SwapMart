// ReviewsRatingsPage.js - User feedback and ratings
import React, { useState } from 'react';
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

const ReviewsRatingsPage = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('received');

  const receivedReviews = [
    {
      id: 1,
      reviewer: 'John Doe',
      reviewerAvatar: require('../assets/avatar.jpeg'),
      rating: 5,
      comment: 'Excellent swap partner! Item was exactly as described and the exchange was smooth.',
      swapItem: 'iPhone 14 Pro',
      reviewDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      swapId: '#SW001'
    },
    {
      id: 2,
      reviewer: 'Sarah Wilson',
      reviewerAvatar: require('../assets/avatar.jpeg'),
      rating: 4,
      comment: 'Great communication and item was in good condition. Would swap again!',
      swapItem: 'MacBook Air',
      reviewDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      swapId: '#SW002'
    },
    {
      id: 3,
      reviewer: 'Mike Johnson',
      reviewerAvatar: null,
      rating: 5,
      comment: 'Perfect transaction. Fast response and honest about item condition.',
      swapItem: 'Gaming Console',
      reviewDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      swapId: '#SW003'
    }
  ];

  const givenReviews = [
    {
      id: 1,
      reviewee: 'Alice Brown',
      revieweeAvatar: require('../assets/avatar.jpeg'),
      rating: 5,
      comment: 'Amazing swap partner! Very professional and item was perfect.',
      swapItem: 'Designer Handbag',
      reviewDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      swapId: '#SW004'
    },
    {
      id: 2,
      reviewee: 'David Lee',
      revieweeAvatar: null,
      rating: 4,
      comment: 'Smooth transaction, good communication throughout the process.',
      swapItem: 'Vintage Watch',
      reviewDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
      swapId: '#SW005'
    }
  ];

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Ionicons
        key={index}
        name={index < rating ? 'star' : 'star-outline'}
        size={16}
        color={Colors.warning}
      />
    ));
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const renderReviewItem = ({ item }) => {
    const isReceived = activeTab === 'received';
    const person = isReceived ? item.reviewer : item.reviewee;
    const personAvatar = isReceived ? item.reviewerAvatar : item.revieweeAvatar;

    return (
      <View style={styles.reviewCard}>
        <View style={styles.reviewHeader}>
          <View style={styles.reviewerInfo}>
            {personAvatar ? (
              <Image source={personAvatar} style={styles.reviewerAvatar} />
            ) : (
              <View style={styles.reviewerAvatarPlaceholder}>
                <Text style={styles.reviewerAvatarText}>{person.charAt(0)}</Text>
              </View>
            )}
            <View style={styles.reviewerDetails}>
              <Text style={styles.reviewerName}>{person}</Text>
              <Text style={styles.reviewSwapId}>{item.swapId}</Text>
            </View>
          </View>
          <View style={styles.reviewMeta}>
            <View style={styles.ratingStars}>{renderStars(item.rating)}</View>
            <Text style={styles.reviewDate}>{formatDate(item.reviewDate)}</Text>
          </View>
        </View>
        
        <Text style={styles.reviewSwapItem}>Swap: {item.swapItem}</Text>
        <Text style={styles.reviewComment}>{item.comment}</Text>
      </View>
    );
  };

  const TabButton = ({ title, isActive, onPress }) => (
    <TouchableOpacity
      style={[styles.tabButton, isActive && styles.activeTabButton]}
      onPress={onPress}
    >
      <Text style={[styles.tabButtonText, isActive && styles.activeTabButtonText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const currentReviews = activeTab === 'received' ? receivedReviews : givenReviews;
  const avgRating = receivedReviews.reduce((sum, review) => sum + review.rating, 0) / receivedReviews.length;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.surface} />
      
      <Header 
        icon="back"
        name="Reviews & Ratings"
        onIconPress={() => navigation.goBack()}
      />

      <View style={styles.ratingSummary}>
        <View style={styles.ratingOverview}>
          <Text style={styles.avgRatingNumber}>{avgRating.toFixed(1)}</Text>
          <View style={styles.avgRatingStars}>{renderStars(Math.floor(avgRating))}</View>
          <Text style={styles.totalReviews}>Based on {receivedReviews.length} reviews</Text>
        </View>
      </View>

      <View style={styles.tabContainer}>
        <TabButton
          title={`Received (${receivedReviews.length})`}
          isActive={activeTab === 'received'}
          onPress={() => setActiveTab('received')}
        />
        <TabButton
          title={`Given (${givenReviews.length})`}
          isActive={activeTab === 'given'}
          onPress={() => setActiveTab('given')}
        />
      </View>

      <FlatList
        data={currentReviews}
        renderItem={renderReviewItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.reviewsList}
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
  ratingSummary: {
    backgroundColor: Colors.surface,
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  ratingOverview: {
    alignItems: 'center',
  },
  avgRatingNumber: {
    fontSize: 48,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 8,
  },
  avgRatingStars: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  totalReviews: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTabButton: {
    borderBottomColor: Colors.primary,
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  activeTabButtonText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  reviewsList: {
    flex: 1,
  },
  reviewCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  reviewerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  reviewerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  reviewerAvatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  reviewerAvatarText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.surface,
  },
  reviewerDetails: {
    flex: 1,
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  reviewSwapId: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  reviewMeta: {
    alignItems: 'flex-end',
  },
  ratingStars: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  reviewDate: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  reviewSwapItem: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500',
    marginBottom: 8,
  },
  reviewComment: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 18,
  },
});

export default ReviewsRatingsPage;