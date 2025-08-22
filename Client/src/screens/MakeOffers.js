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
import { launchImageLibrary } from 'react-native-image-picker';

const MakeOfferScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { ProductId } = route.params;

  const [offeredItemTitle, setOfferedItemTitle] = useState('');
  const [offeredItemDescription, setOfferedItemDescription] = useState('');
  const [offeredItemImages, setOfferedItemImages] = useState([]);
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
    setIsSubmitting(true);
    try {
      const payload = {
        product_id: ProductId,
        offered_item_title: offeredItemTitle,
        offered_item_description: offeredItemDescription,
        offered_item_images: offeredItemImages,
        message,
      };
      const response = await axios.post(`${BASE_URL}/offers/create`, payload, {
        headers: {
          Authorization: `Bearer ${yourAuthToken}`,
        },
      });
      if (response.data.success) {
        showAlert('Success', 'Offer sent successfully!', 'success');
        navigation.goBack();
      } else {
        showAlert('Error', response.data.message || 'Failed to send offer', 'error');
      }
    } catch (err) {
      showAlert('Error', err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImagePick = async () => {
    launchImageLibrary({ mediaType: 'photo', selectionLimit: 3 }, response => {
      if (response.didCancel || response.errorCode) return;
      const newImages = response.assets.map(asset => asset.uri);
      setOfferedItemImages([...offeredItemImages, ...newImages]);
    });
  };

  const removeImage = uri => {
    setOfferedItemImages(prev => prev.filter(img => img !== uri));
  };

  // Progress Indicator component
  const ProgressIndicator = ({ steps, currentStep }) => (
    <View style={styles.progressContainer}>
      {steps.map((step, index) => (
        <View key={index} style={styles.progressStep}>
          <View style={[styles.progressDot, index <= currentStep && styles.progressDotActive]}>
            {index < currentStep && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
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
              <Ionicons name="swap-horizontal" size={32} color={Colors.primary} />
            </View>
          </View>

          {/* Progress Indicator */}
          <ProgressIndicator steps={['Item Details', 'Photos', 'Message', 'Send']} currentStep={currentStep} />

          {/* Form */}
          <View style={styles.formContainer}>
            {/* Offered Item */}
            <FormBox style={styles.modernFormBox}>
              <FormInput
                label="Item Title"
                placeholder="e.g., Used iPhone X"
                iconName="pricetag-outline"
                value={offeredItemTitle}
                onChangeText={setOfferedItemTitle}
                maxLength={255}
                onFocus={() => setFocusedField('title')}
                onBlur={() => setFocusedField(null)}
                style={[styles.modernInput, focusedField === 'title' && styles.modernInputFocused]}
              />
              <Text style={styles.characterCount}>{offeredItemTitle.length}/255</Text>

              <FormInput
                label="Item Description"
                placeholder="Describe condition, age, features..."
                iconName="document-text-outline"
                value={offeredItemDescription}
                onChangeText={setOfferedItemDescription}
                multiline
                numberOfLines={4}
                onFocus={() => setFocusedField('description')}
                onBlur={() => setFocusedField(null)}
                style={[styles.modernInput, styles.modernTextArea, focusedField === 'description' && styles.modernInputFocused]}
              />

              {/* Image Upload */}
              <TouchableOpacity style={styles.imageUploadCard} onPress={handleImagePick}>
                <Ionicons name="camera-outline" size={32} color={Colors.primary} />
                <Text style={styles.imageUploadText}>Upload Images</Text>
              </TouchableOpacity>

              {/* Preview Images */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 12 }}>
                {offeredItemImages.map(uri => (
                  <View key={uri} style={styles.imagePreviewWrapper}>
                    <Image source={{ uri }} style={styles.imagePreview} />
                    <TouchableOpacity style={styles.removeImageButton} onPress={() => removeImage(uri)}>
                      <Ionicons name="close" size={16} color="#fff" />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </FormBox>

            {/* Message */}
            <FormBox style={styles.modernFormBox}>
              <FormInput
                label="Your Message"
                placeholder="Hi! I'd love to trade my item for yours because..."
                iconName="chatbubble-outline"
                value={message}
                onChangeText={setMessage}
                multiline
                numberOfLines={4}
                onFocus={() => setFocusedField('message')}
                onBlur={() => setFocusedField(null)}
                style={[styles.modernInput, styles.modernTextArea, focusedField === 'message' && styles.modernInputFocused]}
              />
            </FormBox>

            {/* Summary */}
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Offer Summary</Text>
              <Text style={styles.summaryText}>Item: {offeredItemTitle || 'Not specified'}</Text>
              <Text style={styles.summaryText}>Description: {offeredItemDescription ? 'Added' : 'Optional'}</Text>
              <Text style={styles.summaryText}>Message: {message ? 'Added' : 'Optional'}</Text>
              <Text style={styles.summaryText}>Photos: {offeredItemImages.length > 0 ? `${offeredItemImages.length} selected` : 'Optional'}</Text>
            </View>

            {/* Submit */}
            <View style={styles.submitContainer}>
              <AnimatedButton
                title={isSubmitting ? 'Sending Offer...' : 'Send Offer'}
                onPress={handleSubmitOffer}
                style={[styles.sendButton, !isFormValid && styles.sendButtonDisabled]}
                loading={isSubmitting}
                disabled={!isFormValid}
              />
              {!isFormValid && <Text style={styles.validationText}>Please add an item title to continue</Text>}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <CustomAlert {...alertConfig} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.neutral50 },
  scrollContent: { flexGrow: 1, paddingBottom: 40 },

  headerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral0,
    margin: 16,
    padding: 20,
    borderRadius: 16,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerContent: { flex: 1 },
  headerTitle: { fontSize: 24, fontWeight: '700', marginBottom: 4 },
  headerSubtitle: { fontSize: 16, color: Colors.neutral400 },
  headerIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.neutral50,
    alignItems: 'center',
    justifyContent: 'center',
  },

  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    backgroundColor: Colors.neutral0,
    borderRadius: 12,
  },
  progressStep: { alignItems: 'center', flex: 1, position: 'relative' },
  progressDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.neutral50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  progressDotActive: { backgroundColor: Colors.primary },
  progressDotCurrent: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.neutral0 },
  progressLabel: { fontSize: 12, color: Colors.neutral300 },
  progressLabelActive: { color: Colors.primary, fontWeight: '600' },
  progressLine: {
    position: 'absolute',
    top: 12,
    right: -50,
    width: 100,
    height: 2,
    backgroundColor: Colors.neutral50,
  },
  progressLineActive: { backgroundColor: Colors.primary },

  formContainer: { marginTop: 16 },
  modernFormBox: {
    marginHorizontal: 16,
    backgroundColor: Colors.neutral0,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
  },
  modernInput: {
    borderWidth: 1,
    borderColor: Colors.neutral200,
    borderRadius: 12,
    backgroundColor: Colors.neutral0,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  modernInputFocused: { borderColor: Colors.primary, elevation: 2 },
  modernTextArea: { minHeight: 100 },
  characterCount: { textAlign: 'right', fontSize: 12, color: Colors.neutral400 },

  imageUploadCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 12,
    marginTop: 8,
  },
  imageUploadText: { marginLeft: 8, color: Colors.primary, fontWeight: '600' },

  imagePreviewWrapper: {
    marginRight: 10,
    position: 'relative',
  },
  imagePreview: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    padding: 2,
  },

  summaryCard: {
    marginHorizontal: 16,
    padding: 20,
    borderRadius: 12,
    backgroundColor: Colors.neutral0,
    elevation: 2,
    marginBottom: 20,
  },
  summaryTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  summaryText: { fontSize: 14, marginBottom: 6, color: Colors.neutral700 },

  submitContainer: { marginHorizontal: 16 },
  sendButton: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    elevation: 4,
  },
  sendButtonDisabled: { backgroundColor: Colors.neutral400, elevation: 0 },
  validationText: { textAlign: 'center', marginTop: 8, color: Colors.danger },
});

export default MakeOfferScreen;