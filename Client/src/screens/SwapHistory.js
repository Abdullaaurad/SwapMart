// SwapHistoryPage.js - All completed swaps
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
import SearchBar from '../components/SearchBar';

const SwapHistoryPage = () => {
  const navigation = useNavigation();
  const [activeFilter, setActiveFilter] = useState('all');

  const swapHistory = [
    {
      id: 1,
      swapPartner: 'John Doe',
      partnerAvatar: require('../assets/avatar.jpeg'),
      myItem: {
        name: 'iPhone 14 Pro',
        image: require('../assets/IPhone14.jpeg'),
        condition: 'Excellent'
      },
      receivedItem: {
        name: 'MacBook Air M1',
        image: require('../assets/Mac.jpeg'),
        condition: 'Like New'
      },
      completedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      status: 'completed',
      rating: 5,
      swapId: '#SW001'
    },
    {
      id: 2,
      swapPartner: 'Sarah Wilson',
      partnerAvatar: require('../assets/avatar.jpeg'),
      myItem: {
        name: 'Designer Handbag',
        image: require('../assets/Handbag.jpeg'),
        condition: 'Good'
      },
      receivedItem: {
        name: 'Nike Air Jordans',
        image: require('../assets/shoes.jpeg'),
        condition: 'Excellent'
      },
      completedDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
      status: 'completed',
      rating: 4,
      swapId: '#SW002'
    },
    {
      id: 3,
      swapPartner: 'Mike Johnson',
      partnerAvatar: null,
      myItem: {
        name: 'Vintage Watch',
        image: require('../assets/watch.jpeg'),
        condition: 'Good'
      },
      receivedItem: {
        name: 'Wireless Headphones',
        image: require('../assets/headphones.jpeg'),
        condition: 'Like New'
      },
      completedDate: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000),
      status: 'completed',
      rating: 5,
      swapId: '#SW003'
    }
  ];

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderSwapItem = ({ item }) => (
    <TouchableOpacity style={styles.swapCard}>
      <View style={styles.swapHeader}>
        <View style={styles.partnerInfo}>
          {item.partnerAvatar ? (
            <Image source={item.partnerAvatar} style={styles.partnerAvatar} />
          ) : (
            <View style={styles.partnerAvatarPlaceholder}>
              <Text style={styles.partnerAvatarText}>{item.swapPartner.charAt(0)}</Text>
            </View>
          )}
          <View style={styles.partnerDetails}>
            <Text style={styles.partnerName}>{item.swapPartner}</Text>
            <Text style={styles.swapId}>{item.swapId}</Text>
          </View>
        </View>
        <View style={styles.swapMeta}>
          <Text style={styles.swapDate}>{formatDate(item.completedDate)}</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color={Colors.warning} />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
        </View>
      </View>

      <View style={styles.swapDetails}>
        <View style={styles.itemContainer}>
          <Image source={item.myItem.image} style={styles.itemImage} />
          <View style={styles.itemInfo}>
            <Text style={styles.itemName}>{item.myItem.name}</Text>
            <Text style={styles.itemCondition}>Condition: {item.myItem.condition}</Text>
            <Text style={styles.itemLabel}>You gave</Text>
          </View>
        </View>

        <View style={styles.swapArrow}>
          <Ionicons name="swap-horizontal" size={24} color={Colors.primary} />
        </View>

        <View style={styles.itemContainer}>
          <Image source={item.receivedItem.image} style={styles.itemImage} />
          <View style={styles.itemInfo}>
            <Text style={styles.itemName}>{item.receivedItem.name}</Text>
            <Text style={styles.itemCondition}>Condition: {item.receivedItem.condition}</Text>
            <Text style={styles.itemLabel}>You received</Text>
          </View>
        </View>
      </View>

      <View style={styles.swapActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="chatbubble-outline" size={16} color={Colors.primary} />
          <Text style={styles.actionText}>Contact</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
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
          <Text style={styles.statNumber}>{swapHistory.length}</Text>
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
        data={swapHistory}
        renderItem={renderSwapItem}
        keyExtractor={(item) => item.id.toString()}
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
});

export default SwapHistoryPage;