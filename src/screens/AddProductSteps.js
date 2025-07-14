import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  Dimensions,
  Image,
  Switch,
  ActivityIndicator
} from 'react-native';
import Colors from '../constants/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Header from '../components/Header';

const AddProductStep1 = ({ data, onUpdate, onNext, onBack }) => {
  const [errors, setErrors] = useState({});

  const categories = [
    { id: 'electronics', name: 'Electronics', icon: 'phone-portrait-outline' },
    { id: 'fashion', name: 'Fashion & Accessories', icon: 'shirt-outline' },
    { id: 'home', name: 'Home & Garden', icon: 'home-outline' },
    { id: 'books', name: 'Books & Media', icon: 'book-outline' },
    { id: 'sports', name: 'Sports & Outdoors', icon: 'basketball-outline' },
    { id: 'toys', name: 'Toys & Games', icon: 'game-controller-outline' },
    { id: 'vehicles', name: 'Vehicles & Parts', icon: 'car-outline' },
    { id: 'collectibles', name: 'Collectibles & Art', icon: 'diamond-outline' },
    { id: 'music', name: 'Musical Instruments', icon: 'musical-notes-outline' },
    { id: 'other', name: 'Other', icon: 'ellipsis-horizontal-outline' },
  ];

  const conditions = [
    { id: 'new', name: 'New/Unused', desc: 'Never used, in original packaging' },
    { id: 'like-new', name: 'Like New', desc: 'Minimal use, excellent condition' },
    { id: 'excellent', name: 'Excellent', desc: 'Minor wear, works perfectly' },
    { id: 'good', name: 'Good', desc: 'Some wear, fully functional' },
    { id: 'fair', name: 'Fair', desc: 'Significant wear, some issues' },
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!data.title.trim()) newErrors.title = 'Title is required';
    if (!data.description.trim()) newErrors.description = 'Description is required';
    if (!data.category) newErrors.category = 'Please select a category';
    if (!data.condition) newErrors.condition = 'Please select condition';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext();
    }
  };

  const addTag = (tag) => {
    if (tag.trim() && !data.tags.includes(tag.trim())) {
      onUpdate({ tags: [...data.tags, tag.trim()] });
    }
  };

  const removeTag = (tagToRemove) => {
    onUpdate({ tags: data.tags.filter(tag => tag !== tagToRemove) });
  };

  return (
    <View style={styles.container}>
      <Header 
        icon="arrow-back"
        name="Add Your Item"
        onIconPress={onBack}
        rightIcon="help-circle-outline"
        onRightIconPress={() => Alert.alert('Help', 'Fill in details about the item you want to swap')}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '25%' }]} />
          </View>
          <Text style={styles.progressText}>Step 1 of 4: Item Details</Text>
        </View>

        {/* Item Title */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What are you offering?</Text>
          <TextInput
            style={[styles.input, errors.title && styles.inputError]}
            placeholder="e.g., iPhone 14 Pro Max 256GB"
            value={data.title}
            onChangeText={(text) => onUpdate({ title: text })}
            maxLength={80}
          />
          {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
          <Text style={styles.helperText}>{data.title.length}/80 characters</Text>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <TextInput
            style={[styles.textArea, errors.description && styles.inputError]}
            placeholder="Describe your item in detail. Include brand, model, age, any flaws, etc."
            value={data.description}
            onChangeText={(text) => onUpdate({ description: text })}
            multiline
            numberOfLines={4}
            maxLength={500}
          />
          {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
          <Text style={styles.helperText}>{data.description.length}/500 characters</Text>
        </View>

        {/* Category Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Category</Text>
          <View style={styles.categoryGrid}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryItem,
                  data.category === category.id && styles.categoryItemSelected
                ]}
                onPress={() => onUpdate({ category: category.id })}
              >
                <Ionicons
                  name={category.icon}
                  size={24}
                  color={data.category === category.id ? Colors.neutral0 : Colors.textSecondary}
                />
                <Text style={[
                  styles.categoryText,
                  data.category === category.id && styles.categoryTextSelected
                ]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}
        </View>

        {/* Condition */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Condition</Text>
          {conditions.map((condition) => (
            <TouchableOpacity
              key={condition.id}
              style={[
                styles.conditionItem,
                data.condition === condition.id && styles.conditionItemSelected
              ]}
              onPress={() => onUpdate({ condition: condition.id })}
            >
              <View style={styles.conditionContent}>
                <Text style={[
                  styles.conditionName,
                  data.condition === condition.id && styles.conditionNameSelected
                ]}>
                  {condition.name}
                </Text>
                <Text style={styles.conditionDesc}>{condition.desc}</Text>
              </View>
              <View style={[
                styles.radioButton,
                data.condition === condition.id && styles.radioButtonSelected
              ]}>
                {data.condition === condition.id && (
                  <View style={styles.radioButtonInner} />
                )}
              </View>
            </TouchableOpacity>
          ))}
          {errors.condition && <Text style={styles.errorText}>{errors.condition}</Text>}
        </View>

        {/* Original Price (Optional) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Original Price (Optional)</Text>
          <Text style={styles.sectionSubtitle}>
            This helps others understand the value of your item
          </Text>
          <TextInput
            style={styles.input}
            placeholder="$0.00"
            value={data.originalPrice}
            onChangeText={(text) => onUpdate({ originalPrice: text })}
            keyboardType="numeric"
          />
        </View>

        {/* Tags */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tags (Optional)</Text>
          <Text style={styles.sectionSubtitle}>
            Add keywords to help others find your item
          </Text>
          <View style={styles.tagsContainer}>
            {data.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
                <TouchableOpacity onPress={() => removeTag(tag)}>
                  <Ionicons name="close" size={16} color={Colors.primary} />
                </TouchableOpacity>
              </View>
            ))}
            <TextInput
              style={styles.tagInput}
              placeholder="Add a tag..."
              onSubmitEditing={(e) => {
                addTag(e.nativeEvent.text);
                e.target.clear();
              }}
              blurOnSubmit={false}
            />
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Next Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>Next: Add Photos</Text>
          <Ionicons name="arrow-forward" size={20} color={Colors.surface} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// AddProductStep2.js - Images

const { width } = Dimensions.get('window');
const imageSize = (width - 48) / 3;

const AddProductStep2 = ({ data, onUpdate, onNext, onBack }) => {
  const maxImages = 8;

  const openImagePicker = () => {
    Alert.alert(
      'Add Photo',
      'Choose how you want to add a photo',
      [
        { text: 'Camera', onPress: () => pickFromCamera() },
        { text: 'Gallery', onPress: () => pickFromGallery() },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const pickFromCamera = () => {
    // Implement camera picker
    // For demo, adding a placeholder image
    const newImage = {
      id: Date.now(),
      uri: 'https://via.placeholder.com/300x300/e0e0e0/666666?text=Camera+Photo',
      type: 'camera'
    };
    onUpdate({ images: [...data.images, newImage] });
  };

  const pickFromGallery = () => {
    // Implement gallery picker
    // For demo, adding a placeholder image
    const newImage = {
      id: Date.now(),
      uri: 'https://via.placeholder.com/300x300/e0e0e0/666666?text=Gallery+Photo',
      type: 'gallery'
    };
    onUpdate({ images: [...data.images, newImage] });
  };

  const removeImage = (imageId) => {
    onUpdate({ images: data.images.filter(img => img.id !== imageId) });
  };

  const reorderImages = (fromIndex, toIndex) => {
    const newImages = [...data.images];
    const movedImage = newImages.splice(fromIndex, 1)[0];
    newImages.splice(toIndex, 0, movedImage);
    onUpdate({ images: newImages });
  };

  const handleNext = () => {
    if (data.images.length === 0) {
      Alert.alert('Photos Required', 'Please add at least one photo of your item');
      return;
    }
    onNext();
  };

  return (
    <View style={styles.container}>
      <Header 
        icon="arrow-back"
        name="Add Photos"
        onIconPress={onBack}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '50%' }]} />
          </View>
          <Text style={styles.progressText}>Step 2 of 4: Photos</Text>
        </View>

        {/* Photo Instructions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Add Photos of Your Item</Text>
          <Text style={styles.sectionSubtitle}>
            Great photos help your item get noticed! Add up to {maxImages} photos.
          </Text>
          
          <View style={styles.tipsContainer}>
            <Text style={styles.tipsTitle}>📸 Photo Tips:</Text>
            <Text style={styles.tipText}>• Use natural lighting</Text>
            <Text style={styles.tipText}>• Show all angles and any flaws</Text>
            <Text style={styles.tipText}>• Include original packaging if available</Text>
            <Text style={styles.tipText}>• First photo will be your main image</Text>
          </View>
        </View>

        {/* Photo Grid */}
        <View style={styles.section}>
          <View style={styles.photoGrid}>
            {/* Add Photo Button */}
            {data.images.length < maxImages && (
              <TouchableOpacity style={styles.addPhotoButton} onPress={openImagePicker}>
                <Ionicons name="camera" size={32} color={Colors.primary} />
                <Text style={styles.addPhotoText}>Add Photo</Text>
              </TouchableOpacity>
            )}

            {/* Existing Photos */}
            {data.images.map((image, index) => (
              <View key={image.id} style={styles.photoItem}>
                <Image source={{ uri: image.uri }} style={styles.photoImage} />
                
                {/* Main Photo Badge */}
                {index === 0 && (
                  <View style={styles.mainPhotoBadge}>
                    <Text style={styles.mainPhotoText}>MAIN</Text>
                  </View>
                )}

                {/* Remove Button */}
                <TouchableOpacity
                  style={styles.removePhotoButton}
                  onPress={() => removeImage(image.id)}
                >
                  <Ionicons name="close" size={16} color={Colors.surface} />
                </TouchableOpacity>

                {/* Reorder Buttons */}
                <View style={styles.reorderButtons}>
                  {index > 0 && (
                    <TouchableOpacity
                      style={styles.reorderButton}
                      onPress={() => reorderImages(index, index - 1)}
                    >
                      <Ionicons name="arrow-up" size={12} color={Colors.surface} />
                    </TouchableOpacity>
                  )}
                  {index < data.images.length - 1 && (
                    <TouchableOpacity
                      style={styles.reorderButton}
                      onPress={() => reorderImages(index, index + 1)}
                    >
                      <Ionicons name="arrow-down" size={12} color={Colors.surface} />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}
          </View>

          {data.images.length > 0 && (
            <Text style={styles.photoCountText}>
              {data.images.length} of {maxImages} photos added
            </Text>
          )}
        </View>

        {/* Photo Requirements */}
        <View style={styles.section}>
          <View style={styles.requirementsContainer}>
            <Text style={styles.requirementsTitle}>Photo Requirements:</Text>
            <Text style={styles.requirementText}>✓ At least 1 photo required</Text>
            <Text style={styles.requirementText}>✓ Maximum {maxImages} photos</Text>
            <Text style={styles.requirementText}>✓ Clear, well-lit images</Text>
            <Text style={styles.requirementText}>✓ Show actual item condition</Text>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={20} color={Colors.primary} />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>Next: What You Want</Text>
          <Ionicons name="arrow-forward" size={20} color={Colors.surface} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// AddProductStep3.js - What You Want

const AddProductStep3 = ({ data, onUpdate, onNext, onBack }) => {
  const [errors, setErrors] = useState({});
  const [newWantedItem, setNewWantedItem] = useState('');

  const categories = [
    { id: 'electronics', name: 'Electronics', icon: 'phone-portrait-outline' },
    { id: 'fashion', name: 'Fashion & Accessories', icon: 'shirt-outline' },
    { id: 'home', name: 'Home & Garden', icon: 'home-outline' },
    { id: 'books', name: 'Books & Media', icon: 'book-outline' },
    { id: 'sports', name: 'Sports & Outdoors', icon: 'basketball-outline' },
    { id: 'toys', name: 'Toys & Games', icon: 'game-controller-outline' },
    { id: 'vehicles', name: 'Vehicles & Parts', icon: 'car-outline' },
    { id: 'collectibles', name: 'Collectibles & Art', icon: 'diamond-outline' },
    { id: 'music', name: 'Musical Instruments', icon: 'musical-notes-outline' },
    { id: 'anything', name: 'Open to Anything', icon: 'gift-outline' },
  ];

  const conditions = [
    { id: 'any', name: 'Any Condition', desc: 'I\'m flexible with condition' },
    { id: 'new', name: 'New/Unused Only', desc: 'Must be in original packaging' },
    { id: 'like-new', name: 'Like New or Better', desc: 'Minimal use acceptable' },
    { id: 'excellent', name: 'Excellent or Better', desc: 'Minor wear acceptable' },
    { id: 'good', name: 'Good or Better', desc: 'Some wear acceptable' },
  ];

  const priceRanges = [
    { id: 'any', name: 'Any Value', desc: 'Open to all price ranges' },
    { id: 'under-50', name: 'Under $50', desc: 'Budget-friendly items' },
    { id: '50-100', name: '$50 - $100', desc: 'Mid-range items' },
    { id: '100-250', name: '$100 - $250', desc: 'Higher value items' },
    { id: '250-500', name: '$250 - $500', desc: 'Premium items' },
    { id: 'over-500', name: 'Over $500', desc: 'High-end items' },
  ];

  const swapPreferences = [
    { id: 'local', name: 'Local Only', desc: 'Meet in person', icon: 'location-outline' },
    { id: 'shipping', name: 'Shipping Only', desc: 'Mail exchange', icon: 'mail-outline' },
    { id: 'both', name: 'Local or Shipping', desc: 'Either option works', icon: 'swap-horizontal-outline' },
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (data.wantedItems.length === 0) {
      newErrors.wantedItems = 'Please add at least one item you want';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext();
    }
  };

  const addWantedItem = () => {
    if (newWantedItem.trim() && !data.wantedItems.includes(newWantedItem.trim())) {
      onUpdate({ wantedItems: [...data.wantedItems, newWantedItem.trim()] });
      setNewWantedItem('');
    }
  };

  const removeWantedItem = (itemToRemove) => {
    onUpdate({ wantedItems: data.wantedItems.filter(item => item !== itemToRemove) });
  };

  return (
    <View style={styles.container}>
      <Header 
        icon="arrow-back"
        name="What You Want"
        onIconPress={onBack}
        rightIcon="help-circle-outline"
        onRightIconPress={() => Alert.alert('Help', 'Specify what you\'re looking for in exchange')}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '75%' }]} />
          </View>
          <Text style={styles.progressText}>Step 3 of 4: What You Want</Text>
        </View>

        {/* What You Want */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What are you looking for?</Text>
          <Text style={styles.sectionSubtitle}>
            Add specific items you'd like to swap for, or categories you're interested in
          </Text>
          
          <View style={styles.wantedItemsContainer}>
            <View style={styles.addItemContainer}>
              <TextInput
                style={styles.addItemInput}
                placeholder="e.g., iPad, Guitar, Mountain Bike..."
                value={newWantedItem}
                onChangeText={setNewWantedItem}
                onSubmitEditing={addWantedItem}
                returnKeyType="done"
              />
              <TouchableOpacity style={styles.addItemButton} onPress={addWantedItem}>
                <Ionicons name="add" size={24} color={Colors.surface} />
              </TouchableOpacity>
            </View>

            {data.wantedItems.map((item, index) => (
              <View key={index} style={styles.wantedItem}>
                <Text style={styles.wantedItemText}>{item}</Text>
                <TouchableOpacity onPress={() => removeWantedItem(item)}>
                  <Ionicons name="close" size={20} color={Colors.danger} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
          {errors.wantedItems && <Text style={styles.errorText}>{errors.wantedItems}</Text>}
        </View>

        {/* Preferred Category */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferred Category (Optional)</Text>
          <Text style={styles.sectionSubtitle}>
            Help narrow down what type of items you're most interested in
          </Text>
          <View style={styles.categoryGrid}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryItem,
                  data.wantedCategory === category.id && styles.categoryItemSelected
                ]}
                onPress={() => onUpdate({ wantedCategory: category.id })}
              >
                <Ionicons
                  name={category.icon}
                  size={20}
                  color={data.wantedCategory === category.id ? Colors.neutral0 : Colors.textSecondary}
                />
                <Text style={[
                  styles.categoryText,
                  data.wantedCategory === category.id && styles.categoryTextSelected
                ]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Minimum Condition */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Minimum Condition (Optional)</Text>
          <Text style={styles.sectionSubtitle}>
            What's the minimum condition you'd accept?
          </Text>
          {conditions.map((condition) => (
            <TouchableOpacity
              key={condition.id}
              style={[
                styles.conditionItem,
                data.wantedCondition === condition.id && styles.conditionItemSelected
              ]}
              onPress={() => onUpdate({ wantedCondition: condition.id })}
            >
              <View style={styles.conditionContent}>
                <Text style={[
                  styles.conditionName,
                  data.wantedCondition === condition.id && styles.conditionNameSelected
                ]}>
                  {condition.name}
                </Text>
                <Text style={styles.conditionDesc}>{condition.desc}</Text>
              </View>
              <View style={[
                styles.radioButton,
                data.wantedCondition === condition.id && styles.radioButtonSelected
              ]}>
                {data.wantedCondition === condition.id && (
                  <View style={styles.radioButtonInner} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Value Range */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Value Range (Optional)</Text>
          <Text style={styles.sectionSubtitle}>
            What value range are you targeting for the swap?
          </Text>
          {priceRanges.map((range) => (
            <TouchableOpacity
              key={range.id}
              style={[
                styles.conditionItem,
                data.wantedPriceRange === range.id && styles.conditionItemSelected
              ]}
              onPress={() => onUpdate({ wantedPriceRange: range.id })}
            >
              <View style={styles.conditionContent}>
                <Text style={[
                  styles.conditionName,
                  data.wantedPriceRange === range.id && styles.conditionNameSelected
                ]}>
                  {range.name}
                </Text>
                <Text style={styles.conditionDesc}>{range.desc}</Text>
              </View>
              <View style={[
                styles.radioButton,
                data.wantedPriceRange === range.id && styles.radioButtonSelected
              ]}>
                {data.wantedPriceRange === range.id && (
                  <View style={styles.radioButtonInner} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Swap Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Swap Preference</Text>
          <Text style={styles.sectionSubtitle}>
            How would you like to complete the swap?
          </Text>
          <View style={styles.swapPreferencesGrid}>
            {swapPreferences.map((pref) => (
              <TouchableOpacity
                key={pref.id}
                style={[
                  styles.swapPreferenceItem,
                  data.swapPreference === pref.id && styles.swapPreferenceItemSelected
                ]}
                onPress={() => onUpdate({ swapPreference: pref.id })}
              >
                <Ionicons
                  name={pref.icon}
                  size={24}
                  color={data.swapPreference === pref.id ? Colors.primary : Colors.textSecondary}
                />
                <Text style={[
                  styles.swapPreferenceName,
                  data.swapPreference === pref.id && styles.swapPreferenceNameSelected
                ]}>
                  {pref.name}
                </Text>
                <Text style={styles.swapPreferenceDesc}>{pref.desc}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Negotiable Toggle */}
        <View style={styles.section}>
          <View style={styles.toggleContainer}>
            <View style={styles.toggleContent}>
              <Text style={styles.toggleTitle}>Open to Negotiation</Text>
              <Text style={styles.toggleSubtitle}>
                Are you open to discussing different swap options?
              </Text>
            </View>
            <Switch
              value={data.negotiable}
              onValueChange={(value) => onUpdate({ negotiable: value })}
              trackColor={{ false: Colors.neutral200, true: Colors.primaryLight }}
              thumbColor={data.negotiable ? Colors.primary : Colors.neutral400}
            />
          </View>
        </View>

        {/* Additional Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Notes (Optional)</Text>
          <Text style={styles.sectionSubtitle}>
            Any other details about what you're looking for?
          </Text>
          <TextInput
            style={styles.textArea}
            placeholder="e.g., Prefer local pickup, looking for vintage items, interested in bundles..."
            value={data.additionalNotes}
            onChangeText={(text) => onUpdate({ additionalNotes: text })}
            multiline
            numberOfLines={3}
            maxLength={300}
          />
          <Text style={styles.helperText}>{data.additionalNotes.length}/300 characters</Text>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={20} color={Colors.primary} />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>Review & Post</Text>
          <Ionicons name="arrow-forward" size={20} color={Colors.surface} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// SwapPreview.js - Final Review and Submit

const SwapPreview = ({ data, onSubmit, onBack, onEdit }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getCategoryName = (categoryId) => {
    const categories = {
      electronics: 'Electronics',
      fashion: 'Fashion & Accessories',
      home: 'Home & Garden',
      books: 'Books & Media',
      sports: 'Sports & Outdoors',
      toys: 'Toys & Games',
      vehicles: 'Vehicles & Parts',
      collectibles: 'Collectibles & Art',
      music: 'Musical Instruments',
      other: 'Other',
      anything: 'Open to Anything',
    };
    return categories[categoryId] || categoryId;
  };

  const getConditionName = (conditionId) => {
    const conditions = {
      new: 'New/Unused',
      'like-new': 'Like New',
      excellent: 'Excellent',
      good: 'Good',
      fair: 'Fair',
      any: 'Any Condition',
    };
    return conditions[conditionId] || conditionId;
  };

  const getPriceRangeName = (rangeId) => {
    const ranges = {
      any: 'Any Value',
      'under-50': 'Under $50',
      '50-100': '$50 - $100',
      '100-250': '$100 - $250',
      '250-500': '$250 - $500',
      'over-500': 'Over $500',
    };
    return ranges[rangeId] || rangeId;
  };

  const getSwapPreferenceName = (prefId) => {
    const prefs = {
      local: 'Local Only',
      shipping: 'Shipping Only',
      both: 'Local or Shipping',
    };
    return prefs[prefId] || prefId;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Success!',
        'Your swap listing has been posted successfully!',
        [
          {
            text: 'OK',
            onPress: () => onSubmit(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to post your listing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmSubmit = () => {
    Alert.alert(
      'Post Your Swap',
      'Are you ready to post your swap listing?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Post It!', onPress: handleSubmit },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Header 
        icon="arrow-back"
        name="Review Your Swap"
        onIconPress={onBack}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '100%' }]} />
          </View>
          <Text style={styles.progressText}>Step 4 of 4: Review & Post</Text>
        </View>

        {/* What You're Offering */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>What You're Offering</Text>
            <TouchableOpacity onPress={() => onEdit(1)}>
              <Text style={styles.editLink}>Edit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.previewCard}>
            <Text style={styles.itemTitle}>{data.title}</Text>
            <Text style={styles.itemCategory}>{getCategoryName(data.category)}</Text>
            <Text style={styles.itemCondition}>Condition: {getConditionName(data.condition)}</Text>
            {data.originalPrice && (
              <Text style={styles.itemPrice}>Original Price: {data.originalPrice}</Text>
            )}
            <Text style={styles.itemDescription}>{data.description}</Text>
            
            {data.tags.length > 0 && (
              <View style={styles.tagsContainer}>
                {data.tags.map((tag, index) => (
                  <View key={index} style={styles.previewTag}>
                    <Text style={styles.previewTagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* Photos */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Photos ({data.images.length})</Text>
            <TouchableOpacity onPress={() => onEdit(2)}>
              <Text style={styles.editLink}>Edit</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photoScroll}>
            {data.images.map((image, index) => (
              <View key={image.id} style={styles.previewPhoto}>
                <Image source={{ uri: image.uri }} style={styles.previewPhotoImage} />
                {index === 0 && (
                  <View style={styles.mainPhotoBadge}>
                    <Text style={styles.mainPhotoText}>MAIN</Text>
                  </View>
                )}
              </View>
            ))}
          </ScrollView>
        </View>

        {/* What You Want */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>What You Want</Text>
            <TouchableOpacity onPress={() => onEdit(3)}>
              <Text style={styles.editLink}>Edit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.previewCard}>
            <Text style={styles.wantedTitle}>Looking for:</Text>
            {data.wantedItems.map((item, index) => (
              <Text key={index} style={styles.wantedItem}>• {item}</Text>
            ))}

            {data.wantedCategory && (
              <Text style={styles.wantedDetail}>
                Preferred Category: {getCategoryName(data.wantedCategory)}
              </Text>
            )}

            {data.wantedCondition && (
              <Text style={styles.wantedDetail}>
                Minimum Condition: {getConditionName(data.wantedCondition)}
              </Text>
            )}

            {data.wantedPriceRange && (
              <Text style={styles.wantedDetail}>
                Value Range: {getPriceRangeName(data.wantedPriceRange)}
              </Text>
            )}

            <Text style={styles.wantedDetail}>
              Swap Preference: {getSwapPreferenceName(data.swapPreference)}
            </Text>

            <Text style={styles.wantedDetail}>
              Negotiable: {data.negotiable ? 'Yes' : 'No'}
            </Text>

            {data.additionalNotes && (
              <Text style={styles.wantedNotes}>
                Additional Notes: {data.additionalNotes}
              </Text>
            )}
          </View>
        </View>

        {/* Posting Guidelines */}
        <View style={styles.section}>
          <View style={styles.guidelinesContainer}>
            <Text style={styles.guidelinesTitle}>📋 Before You Post</Text>
            <Text style={styles.guidelineText}>✓ All information is accurate</Text>
            <Text style={styles.guidelineText}>✓ Photos clearly show item condition</Text>
            <Text style={styles.guidelineText}>✓ You're ready to respond to messages</Text>
            <Text style={styles.guidelineText}>✓ Item is available for swap</Text>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={20} color={Colors.primary} />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]} 
          onPress={confirmSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color={Colors.surface} />
          ) : (
            <Ionicons name="checkmark" size={20} color={Colors.surface} />
          )}
          <Text style={styles.submitButtonText}>
            {isSubmitting ? 'Posting...' : 'Post My Swap'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  
  // Progress
  progressContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: Colors.surface,
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.neutral200,
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  progressText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },

  // Sections
  section: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 10,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },

  // Form Elements
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.text,
    backgroundColor: Colors.neutral50,
  },
  inputError: {
    borderColor: Colors.danger,
  },
  textArea: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.text,
    backgroundColor: Colors.neutral50,
    height: 100,
    textAlignVertical: 'top',
  },
  helperText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
    textAlign: 'right',
  },
  errorText: {
    fontSize: 12,
    color: Colors.danger,
    marginTop: 4,
  },

  // Categories
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral50,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 8,
  },
  categoryItemSelected: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  categoryText: {
    marginLeft: 8,
    fontSize: 14,
    color: Colors.text,
  },
  categoryTextSelected: {
    color: Colors.primary,
    fontWeight: '500',
  },

  // Conditions
  conditionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.neutral50,
    marginBottom: 8,
  },
  conditionItemSelected: {
    backgroundColor: Colors.neutral0,
    borderColor: Colors.primary,
  },
  conditionContent: {
    flex: 1,
  },
  conditionName: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
  },
  conditionNameSelected: {
    color: Colors.primary,
  },
  conditionDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    borderColor: Colors.primary,
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },

  // Tags
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  tagText: {
    fontSize: 12,
    color: Colors.primary,
    marginRight: 4,
  },
  tagInput: {
    minWidth: 100,
    fontSize: 14,
    color: Colors.text,
    paddingVertical: 4,
  },

  // Photos
  tipsContainer: {
    backgroundColor: Colors.infoLight,
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.info,
    marginBottom: 8,
  },
  tipText: {
    fontSize: 12,
    color: Colors.info,
    marginBottom: 2,
  },
  
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  addPhotoButton: {
    width: imageSize,
    height: imageSize,
    backgroundColor: Colors.neutral50,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPhotoText: {
    fontSize: 12,
    color: Colors.primary,
    marginTop: 4,
    textAlign: 'center',
  },
  photoItem: {
    position: 'relative',
    width: imageSize,
    height: imageSize,
  },
  photoImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    backgroundColor: Colors.neutral200,
  },
  mainPhotoBadge: {
    position: 'absolute',
    top: 4,
    left: 4,
    backgroundColor: Colors.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  mainPhotoText: {
    fontSize: 10,
    color: Colors.surface,
    fontWeight: '600',
  },
  removePhotoButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    backgroundColor: Colors.danger,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reorderButtons: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    flexDirection: 'column',
  },
  reorderButton: {
    width: 20,
    height: 20,
    backgroundColor: Colors.neutral800,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  photoCountText: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
  
  requirementsContainer: {
    backgroundColor: Colors.successLight,
    padding: 12,
    borderRadius: 8,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.success,
    marginBottom: 8,
  },
  requirementText: {
    fontSize: 12,
    color: Colors.success,
    marginBottom: 2,
  },

  // Footer
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  backButtonText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '500',
    marginLeft: 8,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  nextButtonText: {
    fontSize: 16,
    color: Colors.surface,
    fontWeight: '600',
    marginRight: 8,
  },

  bottomSpacing: {
    height: 20,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  
  // Progress
  progressContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: Colors.surface,
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.neutral200,
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  progressText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },

  // Sections
  section: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  editLink: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },

  // Form Elements
  addItemContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  addItemInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.text,
    backgroundColor: Colors.neutral50,
    marginRight: 8,
  },
  addItemButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wantedItemsContainer: {
    marginBottom: 8,
  },
  wantedItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.neutral50,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  wantedItemText: {
    fontSize: 14,
    color: Colors.text,
    flex: 1,
  },
  textArea: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.text,
    backgroundColor: Colors.neutral50,
    height: 80,
    textAlignVertical: 'top',
  },
  helperText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
    textAlign: 'right',
  },
  errorText: {
    fontSize: 12,
    color: Colors.danger,
    marginTop: 4,
  },

  // Categories
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral50,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 8,
  },
  categoryItemSelected: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  categoryText: {
    marginLeft: 8,
    fontSize: 14,
    color: Colors.text,
  },
  categoryTextSelected: {
    color: Colors.neutral0,
    fontWeight: '500',
  },

  conditionContent: {
    flex: 1,
  },
  conditionName: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
  },
  conditionNameSelected: {
    color: Colors.primary,
  },
  conditionDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    borderColor: Colors.primary,
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },

  // Swap Preferences
  swapPreferencesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  swapPreferenceItem: {
    flex: 1,
    backgroundColor: Colors.neutral50,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  swapPreferenceItemSelected: {
    backgroundColor: Colors.neutral0,
    borderColor: Colors.primary,
  },
  swapPreferenceName: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
    marginTop: 8,
    textAlign: 'center',
  },
  swapPreferenceNameSelected: {
    color: Colors.primary,
  },
  swapPreferenceDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },

  // Toggle
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleContent: {
    flex: 1,
    marginRight: 16,
  },
  toggleTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
  },
  toggleSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    color: Colors.surface,
    fontWeight: '600',
    marginRight: 8,
  },
});

export { AddProductStep1, AddProductStep2, AddProductStep3, SwapPreview };