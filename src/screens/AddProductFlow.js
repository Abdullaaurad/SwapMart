// AddProductFlow.js - Main container component
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Colors from '../constants/colors';
import {AddProductStep1, AddProductStep2, AddProductStep3, SwapPreview} from './AddProductSteps'

const AddProductFlow = ({ navigation }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [productData, setProductData] = useState({
    // Step 1: Product Details
    title: '',
    description: '',
    category: '',
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

  const handleSubmit = () => {
    // Handle the swap listing submission
    console.log('Swap listing submitted:', productData);
    navigation.navigate('Home'); // Navigate back to home or success page
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
          />
        );
      case 2:
        return (
          <AddProductStep2
            data={productData}
            onUpdate={updateProductData}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 3:
        return (
          <AddProductStep3
            data={productData}
            onUpdate={updateProductData}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 4:
        return (
          <SwapPreview
            data={productData}
            onSubmit={handleSubmit}
            onBack={prevStep}
            onEdit={(step) => setCurrentStep(step)}
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