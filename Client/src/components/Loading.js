import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Animated, Text } from 'react-native';
import Colors from '../constants/colors';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function LoadingComponent({ 
  size = 'large', 
  showText = true, 
  loadingText = 'Loading',
  style 
}) {
  const cog1Rotation = useRef(new Animated.Value(0)).current;
  const cog2Rotation = useRef(new Animated.Value(0)).current;
  const [dotCount, setDotCount] = useState(0);

  useEffect(() => {
    const cog1Animation = Animated.loop(
      Animated.timing(cog1Rotation, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    );

    const cog2Animation = Animated.loop(
      Animated.timing(cog2Rotation, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    );

    cog1Animation.start();
    cog2Animation.start();

    return () => {
      cog1Animation.stop();
      cog2Animation.stop();
    };
  }, []);

  useEffect(() => {
    const dotInterval = setInterval(() => {
      setDotCount(prev => (prev + 1) % 6);
    }, 500);

    return () => clearInterval(dotInterval);
  }, []);

  const cog1RotationDegrees = cog1Rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const cog2RotationDegrees = cog2Rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-360deg'],
  });

  const generateDots = () => '.'.repeat(dotCount);

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          cogSize: 50,
          fontSize: 18,
          dotsWidth: 25,
          cog2Offset: { marginTop: 43, marginLeft: -9 }
        };
      case 'medium':
        return {
          cogSize: 75,
          fontSize: 22,
          dotsWidth: 35,
          cog2Offset: { marginTop: 65, marginLeft: -14 }
        };
      case 'large':
      default:
        return {
          cogSize: 100,
          fontSize: 28,
          dotsWidth: 45,
          cog2Offset: { marginTop: 87, marginLeft: -18 }
        };
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <View style={[styles.container, style]}>
      <View style={styles.icons}>
        <Animated.View
          style={[
            styles.cogContainer,
            { transform: [{ rotate: cog1RotationDegrees }] },
          ]}
        >
          <Icon name="cog" style={styles.cog1} size={sizeStyles.cogSize} />
        </Animated.View>

        <Animated.View
          style={[
            styles.cogContainer,
            sizeStyles.cog2Offset,
            { transform: [{ rotate: cog2RotationDegrees }] },
          ]}
        >
          <Icon name="cog" style={styles.cog2} size={sizeStyles.cogSize} />
        </Animated.View>
      </View>

      {showText && (
        <View style={styles.loadingContainer}>
          <View style={styles.loadingTextContainer}>
            <Text style={[styles.loading, { fontSize: sizeStyles.fontSize }]}>
              {loadingText}
            </Text>
            <Text style={[
              styles.dots, 
              { 
                fontSize: sizeStyles.fontSize, 
                width: sizeStyles.dotsWidth 
              }
            ]}>
              {generateDots()}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  icons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  cogContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cog1: {
    color: Colors.primary,
  },
  cog2: {
    color: Colors.neutral500,
  },
  loadingContainer: {
    minHeight: 40,
    justifyContent: 'center',
  },
  loadingTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loading: {
    fontWeight: '500',
    color: Colors.neutral1000,
  },
  dots: {
    fontWeight: '500',
    color: Colors.neutral1000,
    textAlign: 'left',
  },
});