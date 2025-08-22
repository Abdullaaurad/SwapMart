import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
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
import axios from 'axios';
import { BASE_URL } from '../API/key';

const RecentlyViewedPage = () => {
  const navigation = useNavigation();
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentViews();
  }, []);

  const fetchRecentViews = async () => {
    try {
      setLoading(true);
      console.log('Fetching recent views from:', `${BASE_URL}/recent/my-views`);
      const response = await axios.get(`${BASE_URL}/recent/my-views`);
      if (response.data.success && Array.isArray(response.data.recents)) {
        setRecentlyViewed(response.data.recents);
      } else {
        setRecentlyViewed([]);
      }
    } catch (err) {
      setRecentlyViewed([]);
    } finally {
      setLoading(false);
    }
  };

  const formatViewTime = (dateString) => {
    const date = new Date(dateString);
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

  const clearHistory = async () => {
    try {
      setLoading(true);
      const response = await axios.delete(`${BASE_URL}/recent/all`);
    } catch (err) {
      setRecentlyViewed([]);
    } finally {
      setLoading(false);
    }
    setRecentlyViewed([]);
  };

  const renderRecentItem = ({ item }) => (
    <TouchableOpacity style={styles.recentItemCard}>
      <Image
        source={
          item.images && Array.isArray(item.images) && item.images.length > 0
            ? { uri: typeof item.images[0] === 'string' ? item.images[0] : item.images[0].url }
            : require('../assets/placeholder.png')
        }
        style={styles.recentItemImage}
      />

      <View style={styles.recentItemContent}>
        <View style={styles.recentItemHeader}>
          <Text style={styles.recentItemTitle}>{item.title}</Text>
          <Text style={styles.recentItemTime}>{formatViewTime(item.viewed_at)}</Text>
        </View>

        <Text style={styles.recentItemPrice}>${item.original_price}</Text>
        <Text style={styles.recentItemCondition}>Condition: {item.condition}</Text>
        <Text style={styles.recentItemSeller}>by {item.owner_username}</Text>

        <View style={styles.recentItemFooter}>
          <View style={[
            styles.availabilityBadge,
            { backgroundColor: item.is_available ? `${Colors.success}15` : `${Colors.danger}15` }
          ]}>
            <Text style={[
              styles.availabilityText,
              { color: item.is_available ? Colors.success : Colors.danger }
            ]}>
              {item.is_available ? 'Available' : 'Unavailable'}
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

      {loading ? (
        <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={recentlyViewed}
          renderItem={renderRecentItem}
          keyExtractor={(item) => item.id.toString()}
          style={styles.recentItemsList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', marginTop: 40 }}>
              <Text style={{ color: Colors.textSecondary }}>No recently viewed products.</Text>
            </View>
          }
        />
      )}
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