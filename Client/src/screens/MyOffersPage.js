// MyOffersPage.js - Offers made to other users
import React,{useEffect, useState} from 'react';
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
import axios from 'axios';
import { BASE_URL } from '../API/key';

const MyOffersPage = () => {
  const navigation = useNavigation();
  const [myOffers, setMyOffers] = useState([]);
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/offers/my-offers`);
        if (response.data.success) {
          setMyOffers(response.data.offers); // <-- use setMyOffers
        }
      } catch (error) {
        console.error('Error fetching offers:', error);
      }
    };
    fetchOffers();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return Colors.warning;
      case 'accepted': return Colors.success;
      case 'declined': return Colors.danger;
      default: return Colors.textSecondary;
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const renderOfferItem = ({ item }) => (
    <TouchableOpacity style={styles.offerCard}>
      <View style={styles.offerHeader}>
        <Text style={styles.offerTarget}>Offer for: {item.product_title}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      <Text style={styles.offerOwner}>Owner: {item.seller_name}</Text>
      <View style={styles.offerItems}>
        <View style={styles.offerItemContainer}>
          <Image
            source={
              item.product_images && item.product_images.length > 0
                ? { uri: item.product_images[0] }
                : require('../assets/placeholder.png')
            }
            style={styles.offerItemImage}
          />
          <Text style={styles.offerItemName}>{item.product_title}</Text>
          <Text style={styles.offerItemLabel}>Wanted</Text>
        </View>
        <View style={styles.offerArrow}>
          <Ionicons name="arrow-forward" size={20} color={Colors.primary} />
        </View>
        <View style={styles.offerItemContainer}>
          <Image
            source={
              item.offered_item_images && item.offered_item_images.length > 0
                ? { uri: item.offered_item_images[0] }
                : require('../assets/placeholder.png')
            }
            style={styles.offerItemImage}
          />
          <Text style={styles.offerItemName}>{item.offered_item_title}</Text>
          <Text style={styles.offerItemLabel}>Your offer</Text>
        </View>
      </View>
      <View style={styles.offerMessage}>
        <Text style={styles.messageLabel}>Your message:</Text>
        <Text style={styles.messageText}>{item.message}</Text>
      </View>
      <View style={styles.offerFooter}>
        <Text style={styles.offerDate}>{item.created_at ? new Date(item.created_at).toLocaleDateString() : ''}</Text>
        <TouchableOpacity style={styles.chatButton}>
          <Ionicons name="chatbubble" size={16} color={Colors.primary} />
          <Text style={styles.chatButtonText}>Chat</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.surface} />
      
      <Header 
        icon="back"
        name="My Offers"
        onIconPress={() => navigation.goBack()}
      />

      <View style={styles.offersStats}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{myOffers.filter(o => o.status === 'pending').length}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{myOffers.filter(o => o.status === 'accepted').length}</Text>
          <Text style={styles.statLabel}>Accepted</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{myOffers.filter(o => o.status === 'declined').length}</Text>
          <Text style={styles.statLabel}>Declined</Text>
        </View>
      </View>

      <FlatList
        data={myOffers}
        renderItem={renderOfferItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.offersList}
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
  offersStats: {
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
  offersList: {
    flex: 1,
  },
  offerCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  offerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  offerTarget: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
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
  offerOwner: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  offerItems: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  offerItemContainer: {
    flex: 1,
    alignItems: 'center',
  },
  offerItemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginBottom: 6,
  },
  offerItemName: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 2,
  },
  offerItemLabel: {
    fontSize: 10,
    color: Colors.primary,
    fontWeight: '500',
  },
  offerArrow: {
    marginHorizontal: 16,
  },
  offerMessage: {
    backgroundColor: Colors.neutral50,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  messageLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  messageText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  offerResponse: {
    backgroundColor: `${Colors.success}10`,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: Colors.success,
  },
  responseLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.success,
    marginBottom: 4,
  },
  responseText: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 18,
  },
  offerFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 12,
  },
  offerDate: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: `${Colors.primary}15`,
  },
  chatButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
    marginLeft: 4,
  },
});

export default MyOffersPage;