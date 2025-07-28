import React, { useEffect, useRef } from 'react';
import {
    StyleSheet,
    SafeAreaView,
    Animated,
    Platform,
    TouchableWithoutFeedback,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Logo from '../assets/logo_dark_no_bg.png';
import Colors from '../constants/colors';

export default function SplashScreen() {
    const navigation = useNavigation();
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const bounceLoop = useRef(null);

    useEffect(() => {
        // Start infinite bounce animation
        bounceLoop.current = Animated.loop(
            Animated.sequence([
                Animated.spring(scaleAnim, {
                    toValue: 1.2,
                    useNativeDriver: true,
                    friction: 5,
                    tension: 40,
                }),
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    useNativeDriver: true,
                }),
            ])
        );
        bounceLoop.current.start();

        // Clean up loop on unmount
        return () => {
            bounceLoop.current?.stop();
        };
    }, []);

    const handlePress = () => {
        // Stop animation loop
        bounceLoop.current?.stop();

        // Navigate to home
        navigation.replace('LogIn');
    };

    return (
        <SafeAreaView style={styles.container}>
            <TouchableWithoutFeedback onPress={handlePress}>
                <Animated.Image
                    source={Logo}
                    style={[styles.logo, { transform: [{ scale: scaleAnim }] }]}
                    fadeDuration={1000}
                />
            </TouchableWithoutFeedback>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: Platform.OS === 'android' ? 20 : 0,
    },
    logo: {
        width: 250,
        height: 250,
        resizeMode: 'contain',
    },
});
