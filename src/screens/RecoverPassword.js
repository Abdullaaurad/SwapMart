import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import Colors from "../constants/colors";
import CircularBackButton from "../components/Back";
import AnimatedButton from "../components/AnimatedButton";
import OTPBox from "../components/OtpBox"; // or any OTP input package you use
import { useNavigation } from "@react-navigation/native";


const RecoverPasswordScreen = () => {
  const navigation = useNavigation();
  const { method, value } = route.params ?? { method: "email", value: "abdullaaurad@gmail.com" };

  const [otp, setOtp] = useState("");

  const isOTPValid = otp.length === 6;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <CircularBackButton onPress={() => navigation.goBack()} />

        <Text style={styles.title}>Enter Verification Code</Text>
        <Text style={styles.subtitle}>
          We've sent a 6-digit code to your {method === "email" ? "email" : "phone"}:
        </Text>

        <Text style={styles.contactValue}>{value}</Text>

        {/* OTP Input */}
        <OTPBox length={6} value={otp} onChange={handleOtpChange} />

        {/* Verify Button */}
        <AnimatedButton
          title="Verify Code"
          onPress={handleVerify}
          disabled={!isOTPValid}
        />

        {/* Resend */}
        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Didn't receive the code?</Text>
          <TouchableOpacity>
            <Text style={styles.resendLink}> Resend</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primarybg,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.neutral1000,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.neutral500,
    textAlign: "center",
    marginBottom: 8,
    lineHeight: 22,
  },
  contactValue: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.primary,
    textAlign: "center",
    marginBottom: 24,
  },
  otpContainer: {
    width: "100%",
    height: 60,
    alignSelf: "center",
    marginBottom: 30,
  },
  otpBox: {
    width: 45,
    height: 55,
    borderWidth: 2,
    borderRadius: 8,
    borderColor: Colors.neutral300,
    color: Colors.neutral1000,
    fontSize: 20,
    textAlign: "center",
  },
  otpBoxFocused: {
    borderColor: Colors.primary,
  },
  resendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  resendText: {
    fontSize: 15,
    color: Colors.neutral600,
  },
  resendLink: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.primary,
  },
});

export default RecoverPasswordScreen;