import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../constants/colors';
import FormBox from '../components/FormBox';
import Header from '../components/Header';
import { useNavigation } from '@react-navigation/native';

const PolicySection = ({ section, isExpanded, toggle }) => (
    <FormBox style={styles.sectionCard}>
        <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => toggle(section.id)}
            activeOpacity={0.7}
        >
            <View style={styles.sectionHeaderContent}>
                <View style={styles.sectionIcon}>
                    <Icon name={section.icon} size={20} color={Colors.primary} />
                </View>
                <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>
            <Icon
                name={isExpanded ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={Colors.neutral600}
            />
        </TouchableOpacity>

        {isExpanded && (
            <View style={styles.sectionContent}>
                <Text style={styles.sectionText}>{section.content}</Text>
            </View>
        )}
    </FormBox>
);

const PrivacyPolicyScreen = () => {
    const navigation = useNavigation();
    const [expandedSections, setExpandedSections] = useState({});

    const toggleSection = (id) => {
        setExpandedSections((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const lastUpdated = 'January 15, 2025';

    const privacySections = [
        {
            id: '1',
            title: 'Information We Collect',
            icon: 'document-text-outline',
            content:
                'We collect info you provide when using Swapmart, such as when you list items, message others, or complete a purchase. This includes profile data, messages, device info, and transaction records.',
        },
        {
            id: '2',
            title: 'How We Use Your Information',
            icon: 'construct-outline',
            content:
                'We use your data to operate the marketplace, facilitate listings and transactions, prevent fraud, provide support, and improve your experience with personalized recommendations.',
        },
        {
            id: '3',
            title: 'Sharing and Disclosure',
            icon: 'share-social-outline',
            content:
                'We only share data with third parties (e.g., payment processors, analytics providers) to deliver services. Limited profile data is shared with other users when interacting in the marketplace.',
        },
        {
            id: '4',
            title: 'Data Retention',
            icon: 'time-outline',
            content:
                'We retain account and transaction info for as long as needed to fulfill services or meet legal obligations. You may request deletion of your account and data unless we’re required to retain it.',
        },
        {
            id: '5',
            title: 'Your Rights and Choices',
            icon: 'person-circle-outline',
            content:
                'You can access, update, or delete your data at any time via your account settings. You may also contact us for assistance with your privacy rights.',
        },
        {
            id: '6',
            title: 'Security',
            icon: 'lock-closed-outline',
            content:
                'We use industry-standard security practices including encryption and secure authentication to protect your data. No system is 100% secure, so we encourage strong password practices.',
        },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <Header
                icon="back"
                name="Privacy Policy"
                onIconPress={() => navigation.navigate('Home')}
            />

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <FormBox style={styles.headerCard}>
                    <View style={styles.headerContent}>
                        <Icon name="shield-checkmark-outline" size={48} color={Colors.success} />
                        <Text style={styles.headerTitle}>Your Privacy Matters</Text>
                        <Text style={styles.headerSubtitle}>
                            Swapmart is committed to protecting your personal data and being transparent about our practices.
                        </Text>
                        <View style={styles.lastUpdated}>
                            <Icon name="calendar-outline" size={16} color={Colors.neutral500} />
                            <Text style={styles.lastUpdatedText}>Last updated: {lastUpdated}</Text>
                        </View>
                    </View>
                </FormBox>

                <FormBox style={styles.summaryCard}>
                    <View style={styles.summaryHeader}>
                        <Icon name="flash-outline" size={20} color={Colors.warning} />
                        <Text style={styles.summaryTitle}>Privacy at a Glance</Text>
                    </View>
                    <View style={styles.summaryPoints}>
                        {[
                            'We never sell your personal information',
                            'You control your data and privacy settings',
                            'Secure in-app transactions and messaging',
                            'Fraud monitoring and moderation in place',
                        ].map((point, index) => (
                            <View key={index} style={styles.summaryPoint}>
                                <Icon name="checkmark-circle" size={16} color={Colors.success} />
                                <Text style={styles.summaryPointText}>{point}</Text>
                            </View>
                        ))}
                    </View>
                </FormBox>

                <View style={styles.sectionsContainer}>
                    {privacySections.map((section) => (
                        <PolicySection
                            key={section.id}
                            section={section}
                            isExpanded={!!expandedSections[section.id]}
                            toggle={toggleSection}
                        />
                    ))}
                </View>

                <FormBox style={styles.contactCard}>
                    <View style={styles.contactHeader}>
                        <Icon name="mail-outline" size={20} color={Colors.primary} />
                        <Text style={styles.contactTitle}>Questions About Privacy?</Text>
                    </View>
                    <Text style={styles.contactText}>
                        If you have any questions about this Privacy Policy or our data practices, feel free to contact us.
                    </Text>
                    <View style={styles.contactMethods}>
                        <TouchableOpacity style={styles.contactMethod} activeOpacity={0.7}>
                            <Icon name="mail" size={16} color={Colors.primary} />
                            <Text style={styles.contactMethodText}>privacy@swapmart.app</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.contactMethod} activeOpacity={0.7}>
                            <Icon name="chatbubble" size={16} color={Colors.primary} />
                            <Text style={styles.contactMethodText}>In-app support chat</Text>
                        </TouchableOpacity>
                    </View>
                </FormBox>

                <View style={styles.bottomSpacer} />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: Colors.background 
    },
    content: { 
        paddingHorizontal: 16 
    },
    headerCard: { 
        marginVertical: 12, 
        padding: 20 
    },
    headerContent: { 
        alignItems: 'center' 
    },
    headerTitle: { 
        fontSize: 20, 
        fontWeight: 'bold', 
        marginTop: 10 
    },
    headerSubtitle: { 
        textAlign: 'center', 
        marginTop: 8, 
        color: Colors.neutral700 
    },
    lastUpdated: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        marginTop: 12 
    },
    lastUpdatedText: { 
        marginLeft: 6, 
        color: Colors.neutral500 
    },
    summaryCard: { 
        marginBottom: 16, 
        padding: 16
    },
    summaryHeader: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        marginBottom: 10 
    },
    summaryTitle: { 
        marginLeft: 8, 
        fontWeight: '600', 
        fontSize: 16 
    },
    summaryPoints: { 
        gap: 10 
    },
    summaryPoint: { 
        flexDirection: 'row', 
        alignItems: 'center' 
    },
    summaryPointText: {
        marginLeft: 8 
    },
    sectionsContainer: { 
        marginTop: 10 
    },
    sectionCard: { 
        marginBottom: 10 
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    sectionHeaderContent: { 
        flexDirection: 'row', 
        alignItems: 'center' 
    },
    sectionIcon: { 
        marginRight: 10 
    },
    sectionTitle: { 
        fontWeight: '600', 
        fontSize: 16 
    },
    sectionContent: { 
        marginTop: 10 
    },
    sectionText: { 
        color: Colors.neutral800 
    },
    contactCard: {
        marginTop: 20, 
        padding: 16 
    },
    contactHeader: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        marginBottom: 10 
    },
    contactTitle: { 
        marginLeft: 8, 
        fontWeight: '600', 
        fontSize: 16 
    },
    contactText: { 
        color: Colors.neutral700, 
        marginBottom: 12 
    },
    contactMethods: { 
        gap: 10 
    },
    contactMethod: {
        flexDirection: 'row', 
        alignItems: 'center' 
    },
    contactMethodText: { 
        marginLeft: 8, 
        color: Colors.primary 
    },
    bottomSpacer: { 
        height: 30 
    },
});

export default PrivacyPolicyScreen;
