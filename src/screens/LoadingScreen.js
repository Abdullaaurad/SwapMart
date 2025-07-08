import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Animated, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../constants/colors';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function LoadingScreen() {
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.icons}>
        <Animated.View
          style={[
            styles.cogContainer,
            { transform: [{ rotate: cog1RotationDegrees }] },
          ]}
        >
          <Icon name="cog" style={styles.cog1} size={100} />
        </Animated.View>

        <Animated.View
          style={[
            styles.cogContainer,
            styles.cog2Container,
            { transform: [{ rotate: cog2RotationDegrees }] },
          ]}
        >
          <Icon name="cog" style={styles.cog2} size={100} />
        </Animated.View>
      </View>

      <View style={styles.loadingContainer}>
        <View style={styles.loadingTextContainer}>
          <Text style={styles.loading}>Loading</Text>
          <Text style={styles.dots}>{generateDots()}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primarybg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  icons: {
    marginTop: -100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  cogContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cog2Container: {
    marginTop: 87,
    marginLeft: -18,
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
    fontSize: 28,
    color: Colors.neutral1000,
  },
  dots: {
    fontWeight: '500',
    fontSize: 28,
    color: Colors.neutral1000,
    width: 45,
    textAlign: 'left',
  },
});
