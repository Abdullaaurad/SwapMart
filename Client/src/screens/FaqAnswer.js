import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../constants/colors'; // Adjust path if needed
import Header from '../components/Header'; // Assumes you have a custom Header component

const FAQFullAnswerScreen = ({ navigation, route }) => {
    // Dummy data for now (you can replace this with route.params later)
    const faqItem = {
        question: 'How do I reset my password?',
        answer:
            "To reset your password:\n\n1. Go to the login screen\n2. Tap \"Forgot Password?\"\n3. Enter your email address\n4. Check your email for reset instructions\n5. Follow the link to create a new password\n\nIf you don't receive the email, check your spam folder or contact support.",
        category: 'Account',
    };

    return (
        <SafeAreaView style={styles.container}>
            <Header
                name="FAQ Detail"
                icon="back"
                onIconPress={() => navigation.goBack()}
            />

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.categoryTag}>
                    <Text style={styles.categoryText}>{faqItem.category}</Text>
                </View>

                <Text style={styles.question}>{faqItem.question}</Text>

                <Text style={styles.answer}>{faqItem.answer}</Text>

                <View style={styles.actions}>
                    <TouchableOpacity style={styles.helpfulButton} activeOpacity={0.7}>
                        <Icon name="thumbs-up-outline" size={18} color={Colors.primary} />
                        <Text style={styles.helpfulText}>Helpful</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.helpfulButton} activeOpacity={0.7}>
                        <Icon name="thumbs-down-outline" size={18} color={Colors.neutral400} />
                        <Text style={styles.notHelpfulText}>Not Helpful</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.neutral100,
    },
    content: {
        padding: 20,
    },
    categoryTag: {
        alignSelf: 'flex-start',
        backgroundColor: Colors.neutral200,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
        marginBottom: 10,
    },
    categoryText: {
        fontSize: 13,
        color: Colors.neutral600,
        fontWeight: '500',
    },
    question: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.neutral900,
        marginBottom: 20,
    },
    answer: {
        fontSize: 16,
        color: Colors.neutral700,
        lineHeight: 24,
        marginBottom: 30,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    helpfulButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 25,
    },
    helpfulText: {
        marginLeft: 8,
        fontSize: 15,
        fontWeight: '600',
        color: Colors.primary,
    },
    notHelpfulText: {
        marginLeft: 8,
        fontSize: 15,
        fontWeight: '600',
        color: Colors.neutral400,
    },
});

export default FAQFullAnswerScreen;