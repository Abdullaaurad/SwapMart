import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
  Animated,
  Alert,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/colors';
import Header from '../components/Header';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

// Example notification data
const initialNotificationsData = [
  {
    id: 1,
    title: 'Offer Accepted',
    message: 'Your offer for "iPhone 14" was accepted!',
    date: '2025-08-24',
    time: '10:30 AM',
    details: 'You can now proceed to swap and chat with the owner. The transaction will expire in 48 hours.',
    read: false,
    type: 'success',
    icon: 'checkmark-circle',
  },
  {
    id: 2,
    title: 'New Message',
    message: 'You have a new message from John.',
    date: '2025-08-23',
    time: '3:45 PM',
    details: 'John: "Is the guitar still available? I\'m really interested in making a deal."',
    read: true,
    type: 'message',
    icon: 'chatbubble',
  },
  {
    id: 3,
    title: 'Swap Reminder',
    message: 'Don\'t forget your swap appointment tomorrow',
    date: '2025-08-22',
    time: '9:15 AM',
    details: 'Meeting with Sarah at Central Park at 2:00 PM for iPhone swap.',
    read: false,
    type: 'reminder',
    icon: 'alarm',
  },
  {
    id: 4,
    title: 'Profile View',
    message: 'Someone viewed your profile',
    date: '2025-08-21',
    time: '7:22 PM',
    details: 'A user interested in your MacBook Pro listing checked out your profile.',
    read: true,
    type: 'info',
    icon: 'eye',
  },
];

const NotificationsPage = () => {
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState(initialNotificationsData);
  const [expandedId, setExpandedId] = useState(null);

  const handleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleDelete = (id, title) => {
    Alert.alert(
      'Delete Notification',
      `Are you sure you want to delete "${title}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setNotifications(prev => prev.filter(notification => notification.id !== id));
            if (expandedId === id) {
              setExpandedId(null);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const clearAllNotifications = () => {
    Alert.alert(
      'Clear All Notifications',
      'Are you sure you want to delete all notifications? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => {
            setNotifications([]);
            setExpandedId(null);
          },
        },
      ],
      { cancelable: true }
    );
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'success':
        return '#10B981';
      case 'message':
        return '#3B82F6';
      case 'reminder':
        return '#F59E0B';
      case 'info':
        return '#8B5CF6';
      default:
        return Colors.primary;
    }
  };

  const renderNotification = ({ item, index }) => {
    const typeColor = getTypeColor(item.type);
    
    return (
      <Animated.View style={styles.notificationContainer}>
        <TouchableOpacity
          style={[
            styles.notificationCard,
            !item.read && styles.unreadCard,
            expandedId === item.id && styles.expandedCard,
          ]}
          onPress={() => {
            handleExpand(item.id);
            if (!item.read) {
              markAsRead(item.id);
            }
          }}
          activeOpacity={0.8}
        >
          {/* Unread indicator */}
          {!item.read && <View style={[styles.unreadIndicator, { backgroundColor: typeColor }]} />}
          
          <View style={styles.notificationContent}>
            {/* Icon and Header */}
            <View style={styles.notificationHeader}>
              <View style={styles.headerLeft}>
                <View style={[styles.iconContainer, { backgroundColor: `${typeColor}15` }]}>
                  <Ionicons 
                    name={item.icon} 
                    size={20} 
                    color={typeColor} 
                  />
                </View>
                <View style={styles.headerText}>
                  <Text style={[styles.notificationTitle, { color: typeColor }]}>
                    {item.title}
                  </Text>
                  <Text style={styles.dateTime}>
                    {item.date} • {item.time}
                  </Text>
                </View>
              </View>
              
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(item.id, item.title)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons 
                  name="trash-outline" 
                  size={16} 
                  color="#DC2626" 
                />
              </TouchableOpacity>
            </View>

            {/* Message */}
            <Text style={styles.notificationMessage}>{item.message}</Text>

            {/* Expanded Details */}
            {expandedId === item.id && (
              <Animated.View style={styles.notificationDetails}>
                <Text style={styles.detailsText}>{item.details}</Text>
                <View style={styles.actionButtons}>
                  <TouchableOpacity style={[styles.actionButton, styles.primaryAction]}>
                    <Text style={styles.actionButtonText}>View Details</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.actionButton, styles.secondaryAction]}>
                    <Text style={styles.secondaryActionText}>Dismiss</Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            )}
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Ionicons 
          name="notifications-outline" 
          size={64} 
          color={Colors.textSecondary}
          style={styles.emptyIcon}
        />
        <View style={styles.emptyIconBadge}>
          <Text style={styles.emptyIconBadgeText}>0</Text>
        </View>
      </View>
      <Text style={styles.emptyTitle}>No Notifications</Text>
      <Text style={styles.emptySubtitle}>
        You're all caught up! New notifications will appear here.
      </Text>
      <TouchableOpacity style={styles.refreshButton} onPress={() => {}}>
        <Ionicons 
          name="refresh-outline" 
          size={16} 
          color="white" 
          style={{ marginRight: 6 }}
        />
        <Text style={styles.refreshButtonText}>Refresh</Text>
      </TouchableOpacity>
    </View>
  );

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.surface} />
      <Header 
        icon="back" 
        name={`Notifications ${unreadCount > 0 ? `(${unreadCount})` : ''}`}
        onIconPress={() => navigation.goBack()} 
      />
      
      {/* Clear All Button */}
      {notifications.length > 0 && (
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.clearAllButton} onPress={clearAllNotifications}>
            <Ionicons 
              name="trash-outline" 
              size={12} 
              color="#DC2626" 
              style={{ marginRight: 4 }}
            />
            <Text style={styles.clearAllText}>Clear All</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={[
          styles.listContent,
          notifications.length === 0 && styles.emptyListContent
        ]}
        ListEmptyComponent={<EmptyState />}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerActions: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    alignItems: 'flex-end',
  },
  clearAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#FEE2E2',
    flexDirection: 'row',
    alignItems: 'center',
  },
  clearAllText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  separator: {
    height: 8,
  },
  notificationContainer: {
    marginBottom: 4,
  },
  notificationCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  unreadCard: {
    borderColor: Colors.primary,
    backgroundColor: Colors.surface,
    elevation: 4,
  },
  expandedCard: {
    backgroundColor: Colors.surface,
    borderColor: Colors.primary,
    elevation: 6,
  },
  unreadIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 4,
    height: '100%',
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  notificationContent: {
    paddingLeft: 8,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  dateTime: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  notificationMessage: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
    marginBottom: 4,
  },
  notificationDetails: {
    marginTop: 12,
    padding: 12,
    backgroundColor: Colors.neutral50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  detailsText: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryAction: {
    backgroundColor: Colors.primary,
  },
  secondaryAction: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  secondaryActionText: {
    color: Colors.text,
    fontSize: 12,
    fontWeight: '600',
  },
  // Empty State Styles
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyIconContainer: {
    position: 'relative',
    marginBottom: 24,
  },
  emptyIcon: {
    opacity: 0.3,
  },
  emptyIconBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#EF4444',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.background,
  },
  emptyIconBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  refreshButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  refreshButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default NotificationsPage;