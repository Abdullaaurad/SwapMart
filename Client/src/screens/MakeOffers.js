import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Colors from '../constants/colors';
import FormBox from '../components/FormBox';
import FormInput from '../components/FormInput';
import AnimatedButton from '../components/AnimatedButton';
import { useNavigation, useRoute } from '@react-navigation/native';
import Header from '../components/Header';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { BASE_URL } from '../API/key';
import CustomAlert from '../components/CustomAlert';
import { launchImageLibrary, launchCamera, MediaType } from 'react-native-image-picker';

const MakeOfferScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { ProductId } = route.params;
  console.log('ProductId:', ProductId);

  const [offeredItemTitle, setOfferedItemTitle] = useState('');
  const [offeredItemDescription, setOfferedItemDescription] = useState('');
  const [offeredItemImages, setOfferedItemImages] = useState([]);
  const [imageUploadProgress, setImageUploadProgress] = useState({});
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);

  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: '',
    message: '',
    type: 'info',
    buttonType: 'none',
    onClose: () => {},
  });

  const showAlert = (title, message, type = 'info', buttonType = 'none', onClose = () => {}) => {
    setAlertConfig({
      visible: true,
      title,
      message,
      type,
      buttonType,
      onClose: () => {
        setAlertConfig(prev => ({ ...prev, visible: false }));
        onClose();
      },
    });
  };

  // Progress indicator update logic
  useEffect(() => {
    if (offeredItemTitle.trim().length === 0) {
      setCurrentStep(0);
    } else if (offeredItemDescription.trim().length === 0 && offeredItemImages.length === 0) {
      setCurrentStep(1);
    } else if (message.trim().length === 0) {
      setCurrentStep(2);
    } else {
      setCurrentStep(3);
    }
  }, [offeredItemTitle, offeredItemDescription, offeredItemImages, message]);

  const handleSubmitOffer = async () => {
    if (!isFormValid) return;
    
    setIsSubmitting(true);
    try {

      // Create FormData for multipart upload
      const formData = new FormData();
      formData.append('product_id', ProductId);
      formData.append('offered_item_title', offeredItemTitle);
      formData.append('offered_item_description', offeredItemDescription);
      formData.append('message', message);

      const response = await axios.post(`${BASE_URL}/offers/create`, formData);

      if (response.data.success) {
        showAlert('Success', 'Offer sent successfully!', 'success', 'none', () => {
          navigation.goBack();
        });
      } else {
        showAlert('Error', response.data.message || 'Failed to send offer', 'error');
      }
    } catch (err) {
      console.error('Submit offer error:', err);
      let errorMessage = 'Failed to send offer. Please try again.';
      
      if (err.code === 'NETWORK_ERROR') {
        errorMessage = 'Network error. Please check your connection.';
      } else if (err.response?.status === 401) {
        errorMessage = 'Session expired. Please login again.';
      } else if (err.response?.status === 413) {
        errorMessage = 'Images are too large. Please use smaller images.';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      showAlert('Error', errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const showImagePickerOptions = () => {
    Alert.alert(
      'Select Image',
      'Choose an option',
      [
        { text: 'Camera', onPress: () => openCamera() },
        { text: 'Gallery', onPress: () => openGallery() },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  const openCamera = () => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 1024,
      maxHeight: 1024,
    };

    launchCamera(options, (response) => {
      handleImageResponse(response);
    });
  };

  const openGallery = () => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 1024,
      maxHeight: 1024,
      selectionLimit: 3 - offeredItemImages.length, // Remaining slots
    };

    launchImageLibrary(options, (response) => {
      handleImageResponse(response);
    });
  };

  const handleImageResponse = async (response) => {
    if (response.didCancel || response.errorMessage) {
      if (response.errorMessage) {
        showAlert('Error', response.errorMessage, 'error');
      }
      return;
    }

    if (response.assets && response.assets.length > 0) {
      const uploadedFilenames = [];
      for (const asset of response.assets) {
        const formData = new FormData();
        formData.append('image', {
          uri: asset.uri,
          type: asset.type,
          name: asset.fileName || `image_${Date.now()}.jpg`,
        });

        try {
          const res = await axios.post(`${BASE_URL}/offers/upload-image`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          if (res.data.success && res.data.filename) {
            uploadedFilenames.push(res.data.filename);
          }
        } catch (err) {
          showAlert('Error', 'Failed to upload image', 'error');
        }
      }
      setOfferedItemImages(prev => [...prev, ...uploadedFilenames]);
    }
  };

  const handleImagePick = () => {
    if (offeredItemImages.length >= 3) {
      showAlert('Info', 'You can only upload up to 3 images.', 'info');
      return;
    }
    showImagePickerOptions();
  };

  const removeImage = (index) => {
    setOfferedItemImages(prev => prev.filter((_, i) => i !== index));
  };

  // Progress Indicator component
  const ProgressIndicator = ({ steps, currentStep }) => (
    <View style={styles.progressContainer}>
      {steps.map((step, index) => (
        <View key={index} style={styles.progressStep}>
          <View style={[styles.progressDot, index <= currentStep && styles.progressDotActive]}>
            {index < currentStep && <Ionicons name="checkmark" size={12} color="#FFFFFF" />}
            {index === currentStep && <View style={styles.progressDotCurrent} />}
          </View>
          <Text style={[styles.progressLabel, index <= currentStep && styles.progressLabelActive]}>
            {step}
          </Text>
          {index < steps.length - 1 && (
            <View style={[styles.progressLine, index < currentStep && styles.progressLineActive]} />
          )}
        </View>
      ))}
    </View>
  );

  const isFormValid = offeredItemTitle.trim().length > 0;

  return (
    <SafeAreaView style={styles.container}>
      <Header
        icon="arrow-back"
        name="Make an Offer"
        onIconPress={() => navigation.goBack()}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.headerSection}>
            <View style={styles.headerContent}>
              <Text style={styles.headerTitle}>Make Your Offer</Text>
              <Text style={styles.headerSubtitle}>Propose a swap with something you'd like to trade</Text>
            </View>
            <View style={styles.headerIcon}>
              <Ionicons name="swap-horizontal" size={28} color={Colors.primary} />
            </View>
          </View>

          {/* Progress Indicator */}
          <ProgressIndicator steps={['Item', 'Details', 'Message', 'Send']} currentStep={currentStep} />

          {/* Form */}
          <View style={styles.formContainer}>
            {/* Item Details Section */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Ionicons name="cube-outline" size={20} color={Colors.primary} />
                <Text style={styles.sectionTitle}>Item Details</Text>
              </View>
              
                <FormInput
                  label="What are you offering?"
                  placeholder="e.g., iPhone 12 Pro, Guitar, Books..."
                  value={offeredItemTitle}
                  onChangeText={setOfferedItemTitle}
                  maxLength={255}
                  onFocus={() => setFocusedField('title')}
                  onBlur={() => setFocusedField(null)}
                />
                <Text style={styles.characterCount}>{offeredItemTitle.length}/255</Text>

                <FormInput
                  label="Description"
                  placeholder="Describe condition, age, features, why it's special..."
                  value={offeredItemDescription}
                  onChangeText={setOfferedItemDescription}
                  multiline
                  numberOfLines={4}
                  onFocus={() => setFocusedField('description')}
                  onBlur={() => setFocusedField(null)}
                  style={styles.textAreaInput}
                  containerStyle={{ marginTop: -20 }}
                />

              {/* Image Upload Section */}
              <View style={styles.imageSection}>
                <Text style={styles.imageLabel}>Photos (Optional)</Text>
                <TouchableOpacity 
                  style={[
                    styles.imageUploadButton,
                    offeredItemImages.length >= 3 && styles.imageUploadButtonDisabled
                  ]} 
                  onPress={handleImagePick}
                  disabled={offeredItemImages.length >= 3 || isUploadingImages}
                >
                  {isUploadingImages ? (
                    <ActivityIndicator size="small" color={Colors.primary} />
                  ) : (
                    <Ionicons name="camera" size={24} color={Colors.primary} />
                  )}
                  <Text style={styles.imageUploadText}>
                    {isUploadingImages ? 'Uploading...' : 'Add Photos'}
                  </Text>
                  <Text style={styles.imageUploadSubtext}>
                    {offeredItemImages.length}/3 images
                  </Text>
                </TouchableOpacity>

                {/* Preview Images */}
                {offeredItemImages.length > 0 && (
                  <View style={styles.imagePreviewSection}>
                    <Text style={styles.imagePreviewTitle}>Selected Images</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imagePreviewContainer}>
                      {offeredItemImages.map((image, index) => (
                        <View key={index} style={styles.imagePreviewWrapper}>
                          <Image source={{ uri: image.uri }} style={styles.imagePreview} />
                          <TouchableOpacity 
                            style={styles.removeImageButton} 
                            onPress={() => removeImage(index)}
                          >
                            <Ionicons name="close" size={14} color="#fff" />
                          </TouchableOpacity>
                          <View style={styles.imageInfo}>
                            <Text style={styles.imageSize}>
                              {image.fileSize ? `${(image.fileSize / 1024 / 1024).toFixed(1)}MB` : ''}
                            </Text>
                          </View>
                        </View>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>
            </View>

            {/* Message Section */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Ionicons name="chatbubble-outline" size={20} color={Colors.primary} />
                <Text style={styles.sectionTitle}>Personal Message</Text>
              </View>
              
              <View style={styles.inputGroup}>
                <FormInput
                  label="Message (Optional)"
                  placeholder="Hi! I'd love to trade my item for yours because..."
                  value={message}
                  onChangeText={setMessage}
                  multiline
                  numberOfLines={4}
                  onFocus={() => setFocusedField('message')}
                  onBlur={() => setFocusedField(null)}
                  style={styles.textAreaInput}
                />
                <Text style={styles.helperText}>A personal message can increase your chances!</Text>
              </View>
            </View>

            {/* Offer Preview */}
            <View style={styles.previewContainer}>
              <Text style={styles.previewTitle}>Offer Preview</Text>
              <View style={styles.previewCard}>
                <View style={styles.previewRow}>
                  <Ionicons name="pricetag" size={16} color={Colors.textSecondary} />
                  <Text style={styles.previewLabel}>Item:</Text>
                  <Text style={styles.previewValue}>{offeredItemTitle || 'Not specified'}</Text>
                </View>
                <View style={styles.previewRow}>
                  <Ionicons name="image" size={16} color={Colors.textSecondary} />
                  <Text style={styles.previewLabel}>Photos:</Text>
                  <Text style={styles.previewValue}>
                    {offeredItemImages.length > 0 ? `${offeredItemImages.length} selected` : 'None'}
                  </Text>
                </View>
                <View style={styles.previewRow}>
                  <Ionicons name="document-text" size={16} color={Colors.textSecondary} />
                  <Text style={styles.previewLabel}>Description:</Text>
                  <Text style={styles.previewValue}>
                    {offeredItemDescription ? 'Added' : 'None'}
                  </Text>
                </View>
                <View style={styles.previewRow}>
                  <Ionicons name="chatbubble" size={16} color={Colors.textSecondary} />
                  <Text style={styles.previewLabel}>Message:</Text>
                  <Text style={styles.previewValue}>
                    {message ? 'Added' : 'None'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Submit Button */}
            <View style={styles.submitContainer}>
              <AnimatedButton
                title={isSubmitting ? 'Sending Offer...' : 'Send Offer'}
                onPress={handleSubmitOffer}
                style={[styles.sendButton, !isFormValid && styles.sendButtonDisabled]}
                loading={isSubmitting}
                disabled={!isFormValid}
              />
              {!isFormValid && (
                <View style={styles.validationContainer}>
                  <Ionicons name="information-circle-outline" size={16} color={Colors.warning} />
                  <Text style={styles.validationText}>Please add an item title to continue</Text>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <CustomAlert {...alertConfig} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: Colors.background || '#f8f9fa'
  },
  scrollContent: { 
    flexGrow: 1, 
    paddingBottom: 40 
  },

  // Header
  headerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface || 'white',
    margin: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  headerContent: { 
    flex: 1 
  },
  headerTitle: { 
    fontSize: 22, 
    fontWeight: '700', 
    color: Colors.text,
    marginBottom: 4 
  },
  headerSubtitle: { 
    fontSize: 14, 
    color: Colors.textSecondary,
    lineHeight: 20
  },
  headerIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary + '10',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Progress
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 32,
    marginVertical: 16,
    paddingHorizontal: 8,
  },
  progressStep: { 
    alignItems: 'center', 
    flex: 1, 
    position: 'relative' 
  },
  progressDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.neutral200 || '#e9ecef',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  progressDotActive: { 
    backgroundColor: Colors.primary 
  },
  progressDotCurrent: { 
    width: 6, 
    height: 6, 
    borderRadius: 3, 
    backgroundColor: 'white' 
  },
  progressLabel: { 
    fontSize: 10, 
    color: Colors.textSecondary,
    textAlign: 'center'
  },
  progressLabelActive: { 
    color: Colors.primary, 
    fontWeight: '600' 
  },
  progressLine: {
    position: 'absolute',
    top: 10,
    left: '60%',
    right: '-60%',
    height: 1,
    backgroundColor: Colors.neutral200 || '#e9ecef',
  },
  progressLineActive: { 
    backgroundColor: Colors.primary 
  },

  // Form
  formContainer: { 
    marginTop: 8 
  },
  sectionContainer: {
    backgroundColor: Colors.surface || 'white',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginLeft: 8,
  },

  // Inputs
  inputGroup: {
    marginBottom: 16,
  },
  cleanInput: {
    backgroundColor: Colors.neutral50 || '#f8f9fa',
    borderWidth: 0,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.text,
  },
  textAreaInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  characterCount: {
    textAlign: 'right',
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  helperText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
    fontStyle: 'italic',
  },

  // Image Section
  imageSection: {
    marginTop: 0,
  },
  imageLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
  },
  imageUploadButton: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary + '08',
    borderWidth: 2,
    borderColor: Colors.primary + '20',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 24,
    marginBottom: 16,
  },
  imageUploadButtonDisabled: {
    backgroundColor: Colors.neutral100 || '#f8f9fa',
    borderColor: Colors.neutral300 || '#dee2e6',
    opacity: 0.6,
  },
  imageUploadText: {
    color: Colors.primary,
    fontWeight: '600',
    fontSize: 16,
    marginTop: 8,
  },
  imageUploadSubtext: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  imagePreviewSection: {
    marginTop: 8,
  },
  imagePreviewTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 8,
  },
  imagePreviewContainer: {
    marginTop: 8,
  },
  imagePreviewWrapper: {
    marginRight: 12,
    position: 'relative',
  },
  imagePreview: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: Colors.neutral100,
  },
  removeImageButton: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: Colors.error || '#dc3545',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageInfo: {
    position: 'absolute',
    bottom: 2,
    left: 2,
    right: 2,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  imageSize: {
    fontSize: 8,
    color: 'white',
    textAlign: 'center',
  },

  // Preview
  previewContainer: {
    backgroundColor: Colors.surface || 'white',
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  previewCard: {
    backgroundColor: Colors.neutral50 || '#f8f9fa',
    borderRadius: 12,
    padding: 16,
  },
  previewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  previewLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 8,
    minWidth: 80,
  },
  previewValue: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
    flex: 1,
  },

  // Submit
  submitContainer: { 
    marginHorizontal: 16 
  },
  sendButton: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingVertical: 18,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  sendButtonDisabled: { 
    backgroundColor: Colors.neutral300 || '#adb5bd', 
    shadowOpacity: 0,
    elevation: 0,
  },
  validationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  validationText: { 
    color: Colors.warning || '#ffc107',
    fontSize: 14,
    marginLeft: 6,
  },
});

export default MakeOfferScreen;