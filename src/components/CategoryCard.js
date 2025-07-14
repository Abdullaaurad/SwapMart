import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '../constants/colors'; // adjust path if needed

const CategoryCard = ({ category, onPress }) => (
  <TouchableOpacity
    style={styles.categoryCard}
    onPress={() => onPress?.(category)}
  >
    <View style={[styles.categoryIcon, { backgroundColor: `${category.color}15` }]}>
      <Text style={styles.categoryEmoji}>{category.icon}</Text>
    </View>

    <View style={styles.categoryInfo}>
      <Text style={styles.categoryName}>{category.name}</Text>
      <Text style={styles.categoryCount}>{category.itemCount} items</Text>
    </View>

    <Ionicons name="chevron-forward" size={16} color={Colors.textSecondary} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral50,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  categoryEmoji: {
    fontSize: 24,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
});

export default CategoryCard;