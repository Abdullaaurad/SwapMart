// AddProductFlow.js - Main container component
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Colors from '../constants/colors';
import { AddProductStep1, AddProductStep2, AddProductStep3, SwapPreview } from './AddProductSteps';
import CustomAlert from '../components/CustomAlert'; // Import your CustomAlert
import axios from 'axios';
import { BASE_URL } from '../API/key';

const AddProductFlow = ({ navigation }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productData, setProductData] = useState({
    // Step 1: Product Details
    title: '',
    description: '',
    category: '',
    categoryName: '',
    condition: '',
    originalPrice: '',
    tags: [],
    
    // Step 2: Images
    images: [],
    
    // Step 3: What you want
    wantedItems: [],
    wantedCategory: '',
    wantedCondition: '',
    wantedPriceRange: '',
    additionalNotes: '',
    
    // Location and preferences
    location: '',
    swapPreference: 'local', // local, shipping, both
    negotiable: true,
  });

  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: '',
    message: '',
    type: 'info',
    buttonType: 'single',
    confirmText: 'OK',
    cancelText: 'Cancel',
    option1Text: 'Option 1',
    option2Text: 'Option 2',
    onClose: () => {},
    onCancel: () => {},
    onOption1: () => {},
    onOption2: () => {},
  });

  // Helper function to show different types of alerts
  const showAlert = (config) => {
    setAlertConfig({
      visible: true,
      title: config.title || '',
      message: config.message || '',
      type: config.type || 'info',
      buttonType: config.buttonType || 'single',
      confirmText: config.confirmText || 'OK',
      cancelText: config.cancelText || 'Cancel',
      option1Text: config.option1Text || 'Option 1',
      option2Text: config.option2Text || 'Option 2',
      onClose: () => {
        setAlertConfig(prev => ({ ...prev, visible: false }));
        config.onClose && config.onClose();
      },
      onCancel: () => {
        setAlertConfig(prev => ({ ...prev, visible: false }));
        config.onCancel && config.onCancel();
      },
      onOption1: () => {
        setAlertConfig(prev => ({ ...prev, visible: false }));
        config.onOption1 && config.onOption1();
      },
      onOption2: () => {
        setAlertConfig(prev => ({ ...prev, visible: false }));
        config.onOption2 && config.onOption2();
      },
    });
  };

  const updateProductData = (newData) => {
    setProductData(prev => ({ ...prev, ...newData }));
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const uploadImages = async (images) => {
    const uploadedImages = [];
    
    for (const image of images) {
      try {
        const formData = new FormData();
        formData.append('folderType', 'Product'); // Specify folder type
        formData.append('image', {
          uri: image.uri,
          type: 'image/jpeg', // or detect from image
          name: `image_${Date.now()}.jpg`,
        });
        
        // Log the FormData contents
        // console.log('Sending FormData:');
        // for (let [key, value] of formData.entries()) {
        //   console.log(key, value);
        // }
        
        // Log the folderType value specifically
        // console.log('folderType value:', formData.get('folderType'));

        const response = await axios.post(`${BASE_URL}/products/upload/image`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.data.success) {
          uploadedImages.push({
            id: image.id,
            url: response.data.filename, // Store just the filename (relative path)
            isMain: uploadedImages.length === 0, // First image is main
          });
        }
      } catch (error) {
        console.error('Image upload failed:', error);
        throw new Error(`Failed to upload image: ${error.message}`);
      }
    }
    
    return uploadedImages;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Upload images first
      let uploadedImages = [];
      if (productData.images.length > 0) {
        try {
          uploadedImages = await uploadImages(productData.images);
        } catch (imageError) {
          showAlert({
            title: 'Upload Error',
            message: 'Failed to upload images. Please try again.',
            type: 'error',
            buttonType: 'single',
            confirmText: 'OK',
          });
          return;
        }
      }

      // Prepare data for backend
      const swapData = {
        // Item details
        title: productData.title,
        description: productData.description,
        category: productData.category,
        condition: productData.condition,
        originalPrice: productData.originalPrice || null,
        tags: productData.tags,
        
        // Images
        images: uploadedImages,
        
        // What user wants
        wantedItems: productData.wantedItems,
        wantedCategory: productData.wantedCategory || null,
        wantedCondition: productData.wantedCondition || null,
        wantedPriceRange: productData.wantedPriceRange || null,
        additionalNotes: productData.additionalNotes || null,
        
        // Preferences
        swapPreference: productData.swapPreference,
        negotiable: productData.negotiable,
        location: productData.location || null,
      };

      // Send data to backend
      const response = await axios.post(`${BASE_URL}/products/create`, swapData);

      if (response.data.success) {
        const { swap } = response.data;

        // Show success alert with 3 buttons
        showAlert({
          title: 'Success!',
          message: 'Your swap listing has been posted successfully!',
          type: 'success',
          buttonType: 'triple',
          cancelText: 'Stay Here',
          option1Text: 'View Listing',
          option2Text: 'Go to Home',
          onCancel: () => {
            // Do nothing, just dismiss the alert
            console.log('User chose to stay on current screen');
          },
          onOption1: () => {
            navigation.navigate('SwapDetails', { swapId: swap.id });
          },
          onOption2: () => {
            navigation.navigate('Home');
          },
        });

      } else {
        const errorMessage = response.data.message || 'Failed to create swap listing';
        showAlert({
          title: 'Error',
          message: errorMessage,
          type: 'error',
          buttonType: 'single',
          confirmText: 'OK',
        });
      }

    } catch (error) {
      console.error('Swap submission error:', error);
      
      if (error.response) {
        // Server responded with error status
        const errorMessage = error.response.data?.message || 'Failed to create listing';
        const statusCode = error.response.status;
        
        if (statusCode === 401) {
          showAlert({
            title: 'Authentication Required',
            message: 'You need to be logged in to create a swap listing. Please log in and try again.',
            type: 'error',
            buttonType: 'double',
            cancelText: 'Cancel',
            confirmText: 'Go to Login',
            onCancel: () => {
              // Just dismiss the alert
            },
            onClose: () => {
              navigation.navigate('Login');
            },
          });
        } else if (statusCode === 413) {
          showAlert({
            title: 'Image Upload Error',
            message: 'One or more images are too large. Please reduce the size and try again.',
            type: 'error',
            buttonType: 'triple',
            cancelText: 'Cancel',
            option1Text: 'Edit Images',
            option2Text: 'Remove Large Images',
            onCancel: () => {
              // Just dismiss
            },
            onOption1: () => {
              setCurrentStep(2); // Go back to image step
            },
            onOption2: () => {
              // Filter out large images (you can implement size checking logic)
              const filteredImages = productData.images.slice(0, 3); // Keep first 3 as example
              updateProductData({ images: filteredImages });
              setCurrentStep(2);
            },
          });
        } else {
          showAlert({
            title: 'Server Error',
            message: errorMessage,
            type: 'error',
            buttonType: 'double',
            cancelText: 'Cancel',
            confirmText: 'Try Again',
            onCancel: () => {
              // Just dismiss
            },
            onClose: () => {
              handleSubmit(); // Retry submission
            },
          });
        }
      } else if (error.request) {
        // Network error
        showAlert({
          title: 'Network Error',
          message: 'Unable to connect to the server. Please check your internet connection and try again.',
          type: 'error',
          buttonType: 'triple',
          cancelText: 'Cancel',
          option1Text: 'Retry',
          option2Text: 'Save Draft',
          onCancel: () => {
            // Just dismiss
          },
          onOption1: () => {
            handleSubmit(); // Retry
          },
          onOption2: () => {
            // Save as draft (implement your draft logic)
            console.log('Saving as draft...');
            navigation.goBack();
          },
        });
      } else {
        // Other error
        showAlert({
          title: 'Unexpected Error',
          message: 'An unexpected error occurred. Please try again later.',
          type: 'error',
          buttonType: 'single',
          confirmText: 'OK',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <AddProductStep1
            data={productData}
            onUpdate={updateProductData}
            onNext={nextStep}
            onBack={() => navigation.goBack()}
            showAlert={showAlert} // Pass showAlert to steps if needed
          />
        );
      case 2:
        return (
          <AddProductStep2
            data={productData}
            onUpdate={updateProductData}
            onNext={nextStep}
            onBack={prevStep}
            showAlert={showAlert}
          />
        );
      case 3:
        return (
          <AddProductStep3
            data={productData}
            onUpdate={updateProductData}
            onNext={nextStep}
            onBack={prevStep}
            showAlert={showAlert}
          />
        );
      case 4:
        return (
          <SwapPreview
            data={productData}
            onSubmit={handleSubmit}
            onBack={prevStep}
            onEdit={(step) => setCurrentStep(step)}
            isSubmitting={isSubmitting}
            showAlert={showAlert}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.surface} />
      {renderCurrentStep()}
      
      <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        buttonType={alertConfig.buttonType}
        confirmText={alertConfig.confirmText}
        cancelText={alertConfig.cancelText}
        option1Text={alertConfig.option1Text}
        option2Text={alertConfig.option2Text}
        onClose={alertConfig.onClose}
        onCancel={alertConfig.onCancel}
        onOption1={alertConfig.onOption1}
        onOption2={alertConfig.onOption2}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});

export default AddProductFlow;