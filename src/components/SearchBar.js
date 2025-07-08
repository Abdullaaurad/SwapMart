import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../constants/colors';

const SearchBar = ({
  placeholder,
  value,
  onChangeText,
  containerStyle,
  inputStyle,
  isLoading = false,
  autoFocus = false,
  onSubmitEditing,
  editable = true,
}) => {
  return (
    <View style={[styles.overlayContainer, containerStyle]}>
      <View style={styles.searchBar}>
        {isLoading ? (
          <ActivityIndicator 
            size="small" 
            color={Colors.neutral500} 
            style={styles.icon} 
          />
        ) : (
          <Icon name="search" size={20} color={Colors.neutral500} style={styles.icon} />
        )}
        <TextInput
          style={[styles.input, inputStyle]}
          placeholder={placeholder}
          placeholderTextColor={Colors.neutral500}
          value={value}
          onChangeText={onChangeText}
          returnKeyType="search"
          autoFocus={autoFocus}
          onSubmitEditing={onSubmitEditing}
          editable={editable}
          accessibilityLabel="Search input"
          accessibilityHint="Enter text to search for products"
          blurOnSubmit={false}
        />
        <TouchableOpacity 
          onPress={() => onChangeText && onChangeText('')}
          style={styles.clearButton}
          accessibilityLabel="Clear search"
          accessibilityRole="button"
        >
          <Icon name="close-circle" size={25} color={Colors.neutral500} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlayContainer: {
    position: 'relative',
    zIndex: 10,
    padding: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral50,
    borderRadius: 24,
    paddingHorizontal: 16,
    height: 48,
    borderWidth: 1,
    borderColor: Colors.neutral200,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.neutral900,
    paddingVertical: 0,
  },
  clearButton: {
    padding: 4,
    marginLeft: 4,
  },
});

export default SearchBar;
