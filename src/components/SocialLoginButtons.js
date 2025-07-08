import React, { useRef } from 'react';
import {
  View,
  TouchableWithoutFeedback,
  Text,
  Image,
  Animated,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../constants/colors';

const SocialLoginButtons = ({ onGoogleLogin, onAppleLogin }) => {
  const googleScale = useRef(new Animated.Value(1)).current;
  const appleScale = useRef(new Animated.Value(1)).current;

  const animateScale = (scaleValue, toValue) => {
    Animated.spring(scaleValue, {
      toValue,
      useNativeDriver: true,
      friction: 4,
    }).start();
  };

  const renderButton = (scaleValue, onPress, content) => (
    <TouchableWithoutFeedback
      onPressIn={() => animateScale(scaleValue, 0.95)}
      onPressOut={() => animateScale(scaleValue, 1)}
      onPress={onPress}
    >
      <Animated.View style={[styles.socialButton, { transform: [{ scale: scaleValue }] }]}>
        {content}
      </Animated.View>
    </TouchableWithoutFeedback>
  );

  return (
    <View style={styles.socialButtonsContainer}>
      {renderButton(
        googleScale,
        onGoogleLogin,
        <>
          <Image
            source={require('../assets/Google.png')}
            style={[styles.socialIcon, { width: 35, height: 35 }]}
          />
          <Text style={styles.socialButtonText}>Google</Text>
        </>
      )}

      {renderButton(
        appleScale,
        onAppleLogin,
        <>
          <Icon
            name="logo-apple"
            size={30}
            color={Colors.neutral1000}
            style={styles.socialIcon}
          />
          <Text style={styles.socialButtonText}>Apple</Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  socialButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 5,
  },
  socialButton: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.neutral300,
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: Colors.neutral500,
    shadowOffset: { width: 20, height: 10 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 4,
  },
  socialIcon: {
    marginRight: 8,
  },
  socialButtonText: {
    fontSize: 18,
    color: Colors.neutral700,
    fontWeight: '500',
  },
});

export default SocialLoginButtons;
