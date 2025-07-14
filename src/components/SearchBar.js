import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '../constants/colors';

const SearchBar = ({
  value,
  onChangeText,
  onFilterPress,
  placeholder = 'Search for items...',
  containerStyle,
  inputStyle,
}) => {
  return (
    <View style={[styles.searchContainer, containerStyle]}>
      <View style={styles.searchWrapper}>
        <View style={styles.searchInputContainer}>
          <Ionicons
            name="search-outline"
            size={20}
            color={Colors.textSecondary}
            style={styles.searchIcon}
          />
          <TextInput
            style={[styles.searchInput, inputStyle]}
            placeholder={placeholder}
            placeholderTextColor={Colors.textSecondary}
            value={value}
            onChangeText={onChangeText}
          />
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={onFilterPress}
          accessibilityLabel="Open filters"
        >
          <Ionicons
            name="filter-outline"
            size={20}
            color={Colors.textSecondary}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    marginRight: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    paddingVertical: 12,
  },
  filterButton: {
    padding: 12,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
});

export default SearchBar;