import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  TouchableOpacity,
  Animated,
  Dimensions,
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

const { width } = Dimensions.get('window');

const MakeOfferScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { ProductId } = route.params; // Only ProductId is passed

  const [offeredItemTitle, setOfferedItemTitle] = useState('');
  const [offeredItemDescription, setOfferedItemDescription] = useState('');
  const [offeredItemImages, setOfferedItemImages] = useState([]); // For now, leave as empty array
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const [alertConfig, setAlertConfig] = useState({
      visible: false,
      title: '',
      message: '',
      type: 'info',
      buttonType: 'none',
      onClose: () => { },
    });
  
    const showAlert = (title, message, type = 'info', buttonType = 'none', onClose = () => { }) => {
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

  const handleSubmitOffer = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        product_id: ProductId,
        offered_item_title,
        offered_item_description,
        offered_item_images, // can be [] for now
        message,
        // buyer_id and seller_id will be set in backend using req.user and product info
      };
      const response = await axios.post(`${BASE_URL}/offers/create`, payload, {
        headers: {
          Authorization: `Bearer ${yourAuthToken}` // if using JWT
        }
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

  const InfoCard = ({ icon, title, description, color }) => (
    <View style={[styles.infoCard, { borderLeftColor: color }]}>
      <View style={[styles.infoIcon, { backgroundColor: color + '15' }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <View style={styles.infoContent}>
        <Text style={styles.infoTitle}>{title}</Text>
        <Text style={styles.infoDescription}>{description}</Text>
      </View>
    </View>
  );

  const ProgressIndicator = ({ steps, currentStep }) => (
    <View style={styles.progressContainer}>
      {steps.map((step, index) => (
        <View key={index} style={styles.progressStep}>
          <View style={[
            styles.progressDot,
            index <= currentStep && styles.progressDotActive
          ]}>
            {index < currentStep && (
              <Ionicons name="checkmark" size={14} color="#FFFFFF" />
            )}
            {index === currentStep && (
              <View style={styles.progressDotCurrent} />
            )}
          </View>
          <Text style={[
            styles.progressLabel,
            index <= currentStep && styles.progressLabelActive
          ]}>
            {step}
          </Text>
          {index < steps.length - 1 && (
            <View style={[
              styles.progressLine,
              index < currentStep && styles.progressLineActive
            ]} />
          )}
        </View>
      ))}
    </View>
  );

  const ImageUploadCard = () => (
    <TouchableOpacity style={styles.imageUploadCard}>
      <View style={styles.imageUploadContent}>
        <View style={styles.imageUploadIcon}>
          <Ionicons name="camera-outline" size={32} color={Colors.primary} />
        </View>
        <Text style={styles.imageUploadTitle}>Add Photos</Text>
        <Text style={styles.imageUploadSubtitle}>
          Help others see what you're offering
        </Text>
        <View style={styles.imageUploadButton}>
          <Ionicons name="add" size={20} color={Colors.primary} />
          <Text style={styles.imageUploadButtonText}>Upload Images</Text>
        </View>
      </View>
    </TouchableOpacity>
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
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <View style={styles.headerSection}>
            <View style={styles.headerContent}>
              <Text style={styles.headerTitle}>Make Your Offer</Text>
              <Text style={styles.headerSubtitle}>
                Propose a swap with something you'd like to trade
              </Text>
            </View>
            <View style={styles.headerIcon}>
              <Ionicons name="swap-horizontal" size={32} color={Colors.primary} />
            </View>
          </View>

          {/* Progress Indicator */}
          <ProgressIndicator 
            steps={['Item Details', 'Photos', 'Message', 'Send']}
            currentStep={1}
          />

          {/* Info Cards */}
          <View style={styles.infoCardsContainer}>
            <InfoCard 
              icon="shield-checkmark"
              title="Safe Trading"
              description="All trades are protected by our secure platform"
              color="#10B981"
            />
            <InfoCard 
              icon="people"
              title="Direct Communication"
              description="Chat directly with the item owner"
              color="#3B82F6"
            />
          </View>

          {/* Main Form */}
          <View style={styles.formContainer}>
            {/* Offered Item Section */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionIconContainer}>
                  <Ionicons name="gift-outline" size={24} color={Colors.primary} />
                </View>
                <View>
                  <Text style={styles.sectionTitle}>Your Offered Item</Text>
                  <Text style={styles.sectionSubtitle}>
                    Tell us about what you'd like to trade
                  </Text>
                </View>
              </View>

              <FormBox style={styles.modernFormBox}>
                <View style={styles.inputContainer}>
                  <FormInput
                    label="Item Title"
                    placeholder="e.g., Used iPhone X"
                    iconName="pricetag-outline"
                    value={offeredItemTitle}
                    onChangeText={setOfferedItemTitle}
                    maxLength={255}
                    onFocus={() => setFocusedField('title')}
                    onBlur={() => setFocusedField(null)}
                    style={[
                      styles.modernInput,
                      focusedField === 'title' && styles.modernInputFocused
                    ]}
                  />
                  <Text style={styles.characterCount}>
                    {offeredItemTitle.length}/255
                  </Text>
                </View>

                <View style={styles.inputContainer}>
                  <FormInput
                    label="Item Description"
                    placeholder="Describe your item's condition, age, features..."
                    iconName="document-text-outline"
                    value={offeredItemDescription}
                    onChangeText={setOfferedItemDescription}
                    multiline
                    numberOfLines={4}
                    onFocus={() => setFocusedField('description')}
                    onBlur={() => setFocusedField(null)}
                    style={[
                      styles.modernInput,
                      styles.modernTextArea,
                      focusedField === 'description' && styles.modernInputFocused
                    ]}
                  />
                </View>

                {/* Image Upload Section */}
                <ImageUploadCard />
              </FormBox>
            </View>

            {/* Message Section */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionIconContainer}>
                  <Ionicons name="chatbubble-ellipses-outline" size={24} color="#8B5CF6" />
                </View>
                <View>
                  <Text style={styles.sectionTitle}>Message to Owner</Text>
                  <Text style={styles.sectionSubtitle}>
                    Add a personal touch to your offer
                  </Text>
                </View>
              </View>

              <FormBox style={styles.modernFormBox}>
                <View style={styles.inputContainer}>
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
                    style={[
                      styles.modernInput,
                      styles.modernTextArea,
                      focusedField === 'message' && styles.modernInputFocused
                    ]}
                  />
                </View>

                {/* Message Templates */}
                <View style={styles.templateContainer}>
                  <Text style={styles.templateTitle}>Quick Templates:</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <TouchableOpacity 
                      style={styles.templateButton}
                      onPress={() => setMessage("Hi! I'm interested in trading my item for yours. Would you like to discuss?")}
                    >
                      <Text style={styles.templateButtonText}>Friendly</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.templateButton}
                      onPress={() => setMessage("Hello! I have a similar item in excellent condition. Would you consider a trade?")}
                    >
                      <Text style={styles.templateButtonText}>Professional</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.templateButton}
                      onPress={() => setMessage("Hey! Love your item! Want to trade? Mine is in great condition too.")}
                    >
                      <Text style={styles.templateButtonText}>Casual</Text>
                    </TouchableOpacity>
                  </ScrollView>
                </View>
              </FormBox>
            </View>

            {/* Summary Card */}
            <View style={styles.summaryCard}>
              <View style={styles.summaryHeader}>
                <Ionicons name="document-text" size={24} color={Colors.primary} />
                <Text style={styles.summaryTitle}>Offer Summary</Text>
              </View>
              <View style={styles.summaryContent}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Offered Item:</Text>
                  <Text style={styles.summaryValue}>
                    {offeredItemTitle || 'Not specified'}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Description:</Text>
                  <Text style={styles.summaryValue}>
                    {offeredItemDescription ? 'Added' : 'Optional'}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Message:</Text>
                  <Text style={styles.summaryValue}>
                    {message ? 'Added' : 'Optional'}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Photos:</Text>
                  <Text style={styles.summaryValue}>
                    {offeredItemImages.length > 0 ? `${offeredItemImages.length} photos` : 'Optional'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Submit Button */}
            <View style={styles.submitContainer}>
              <AnimatedButton
                title={isSubmitting ? "Sending Offer..." : "Send Offer"}
                onPress={handleSubmitOffer}
                style={[
                  styles.sendButton,
                  !isFormValid && styles.sendButtonDisabled
                ]}
                loading={isSubmitting}
                disabled={!isFormValid}
              />
              
              {!isFormValid && (
                <Text style={styles.validationText}>
                  Please add an item title to continue
                </Text>
              )}
            </View>
          </View>

          <View style={styles.bottomSpacing} />
        </ScrollView>
      </KeyboardAvoidingView>
      <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        buttonType={alertConfig.buttonType}
        onClose={alertConfig.onClose}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral50,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },

  // Header Section
  headerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral0,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: Colors.neutral1000,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.neutral800,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.neutral400,
    lineHeight: 22,
  },
  headerIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.neutral50,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Progress Indicator
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.neutral0,
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    borderRadius: 12,
    shadowColor: Colors.neutral1000,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  progressStep: {
    alignItems: 'center',
    flex: 1,
    position: 'relative',
  },
  progressDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.neutral50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  progressDotActive: {
    backgroundColor: Colors.primary,
  },
  progressDotCurrent: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.neutral0,
  },
  progressLabel: {
    fontSize: 12,
    color: Colors.neutral300,
    fontWeight: '500',
  },
  progressLabelActive: {
    color: Colors.primary,
    fontWeight: '600',
  },
  progressLine: {
    position: 'absolute',
    top: 12,
    right: -50,
    width: 100,
    height: 2,
    backgroundColor: Colors.neutral50,
  },
  progressLineActive: {
    backgroundColor: Colors.primary,
  },

  // Info Cards
  infoCardsContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 12,
    gap: 12,
  },
  infoCard: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: Colors.neutral0,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    shadowColor: Colors.neutral1000,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.neutral1000,
    marginBottom: 2,
  },
  infoDescription: {
    fontSize: 12,
    color: Colors.neutral500,
    lineHeight: 16,
  },

  // Form Container
  formContainer: {
    marginTop: 16,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  sectionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.neutral50,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.neutral1000,
    marginBottom: 2,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: Colors.neutral500,
  },

  // Modern Form Styles
  modernFormBox: {
    marginHorizontal: 16,
    backgroundColor: Colors.neutral0,
    borderRadius: 16,
    padding: 20,
    shadowColor: Colors.neutral1000,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  inputContainer: {
    marginBottom: 20,
  },
  modernInput: {
    borderWidth: 2,
    borderColor: Colors.neutral50,
    borderRadius: 12,
    backgroundColor: Colors.neutral0,
  },
  modernInputFocused: {
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  modernTextArea: {
    minHeight: 100,
  },
  characterCount: {
    textAlign: 'right',
    fontSize: 12,
    color: Colors.neutral400,
    marginTop: 4,
  },

  // Image Upload Card
  imageUploadCard: {
    borderWidth: 2,
    borderColor: Colors.neutral50,
    borderStyle: 'dashed',
    borderRadius: 12,
    backgroundColor: Colors.neutral50,
    marginTop: 8,
  },
  imageUploadContent: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  imageUploadIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.neutral50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  imageUploadTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral1000,
    marginBottom: 4,
  },
  imageUploadSubtitle: {
    fontSize: 14,
    color: Colors.neutral500,
    textAlign: 'center',
    marginBottom: 20,
  },
  imageUploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: Colors.neutral0,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  imageUploadButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
    marginLeft: 8,
  },

  // Template Buttons
  templateContainer: {
    marginTop: 16,
  },
  templateTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.neutral700,
    marginBottom: 12,
  },
  templateButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.neutral50,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.neutral50,
  },
  templateButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.neutral500,
  },

  // Summary Card
  summaryCard: {
    backgroundColor: Colors.neutral0,
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.neutral50,
    shadowColor: Colors.neutral1000,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral1000,
    marginLeft: 12,
  },
  summaryContent: {
    gap: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: Colors.neutral600,
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 14,
    color: Colors.neutral1000,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },

  // Submit Section
  submitContainer: {
    marginHorizontal: 16,
  },
  sendButton: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  sendButtonDisabled: {
    backgroundColor: Colors.neutral700,
    shadowOpacity: 0,
    elevation: 0,
  },
  validationText: {
    textAlign: 'center',
    fontSize: 14,
    color: Colors.danger,
    marginTop: 12,
    fontWeight: '500',
  },

  bottomSpacing: {
    height: 20,
  },
});

export default MakeOfferScreen;