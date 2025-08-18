import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '../constants/colors';

const ItemCard = ({ item, onPressFavorite }) => {
  return (
    <View style={styles.itemCard}>
      <View style={styles.itemImageContainer}>
        <Image
          source={item.image}
          style={styles.itemImage}
        />

        {/* {item.isHot && (
          <View style={styles.hotBadge}>
            <Ionicons name="flame-outline" size={12} color={Colors.surface} />
            <Text style={styles.hotBadgeText}>Hot</Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => onPressFavorite?.(item)}
        >
          <Ionicons name="heart-outline" size={16} color={Colors.textSecondary} />
        </TouchableOpacity> */}
      </View>

      <View style={styles.itemContent}>
        <Text style={styles.itemTitle} numberOfLines={1}>
          {item.title}
        </Text>

        <View style={styles.priceContainer}>
          <Text style={styles.price}>{item.price}</Text>
          <Text style={styles.originalPrice}>{item.originalPrice}</Text>
        </View>

        <View style={styles.conditionContainer}>
          <Ionicons name="star-outline" size={12} color={Colors.warning} />
          <Text style={styles.conditionText}>{item.condition}</Text>
        </View>

        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={12} color={Colors.textTertiary} />
          <Text style={styles.locationText} numberOfLines={1}>
            {item.location}
          </Text>
        </View>

        <View style={styles.itemStats}>
          <View style={styles.statsLeft}>
            <View style={styles.statItem}>
              <Ionicons name="heart-outline" size={12} color={Colors.textTertiary} />
              <Text style={styles.statText}>{item.likes}</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="eye-outline" size={12} color={Colors.textTertiary} />
              <Text style={styles.statText}>{item.views}</Text>
            </View>
          </View>

          <View style={styles.timeContainer}>
            <Ionicons name="time-outline" size={12} color={Colors.textTertiary} />
            <Text style={styles.timeText}>{item.timeAgo}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  itemCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  itemImageContainer: {
    position: 'relative',
    width: '100%',
    height: 160, // fixed height ensures consistent card size
    overflow: 'hidden',
  },

  itemImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover', // fill the space but crop overflow
    backgroundColor: Colors.neutral100,
  },
  hotBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: Colors.warning,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  hotBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.surface,
    marginLeft: 2,
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: Colors.surface,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.shadowMedium,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  itemContent: {
    padding: 12,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.price,
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 12,
    color: Colors.textTertiary,
    textDecorationLine: 'line-through',
  },
  conditionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  conditionText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 4,
    flex: 1,
  },
  itemStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statsLeft: {
    flexDirection: 'row',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  statText: {
    fontSize: 11,
    color: Colors.textTertiary,
    marginLeft: 2,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 11,
    color: Colors.textTertiary,
    marginLeft: 2,
  },
});

export default ItemCard;