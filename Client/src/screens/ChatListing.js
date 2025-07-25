import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
  Image,
  TextInput,
} from 'react-native';
import Colors from '../constants/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header'
import SearchBar from '../components/SearchBar';
import BottomNavigation from '../components/BottomNav';

const ChatListPage = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('AddProducts');

  // Sample chat data
  const [chats, setChats] = useState([
    {
      id: 1,
      user: {
        name: 'John Doe',
        avatar: require('../assets/avatar.jpeg'),
        status: 'online'
      },
      lastMessage: {
        text: 'Great! I accept your swap proposal. Let\'s arrange the details.',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        sender: 'other',
        type: 'text'
      },
      unreadCount: 2,
      hasSwapRequest: true,
      itemDiscussed: 'iPhone 14 Pro',
      isActive: true
    },
    {
      id: 2,
      user: {
        name: 'Sarah Wilson',
        avatar: require('../assets/avatar.jpeg'),
        status: 'offline'
      },
      lastMessage: {
        text: 'Is the MacBook still available for swap?',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        sender: 'other',
        type: 'text'
      },
      unreadCount: 1,
      hasSwapRequest: false,
      itemDiscussed: 'MacBook Air M2',
      isActive: false
    },
    {
      id: 3,
      user: {
        name: 'Mike Johnson',
        avatar: null,
        status: 'online'
      },
      lastMessage: {
        text: 'Swap request sent',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        sender: 'me',
        type: 'swap_request'
      },
      unreadCount: 0,
      hasSwapRequest: true,
      itemDiscussed: 'Designer Handbag',
      isActive: false
    },
    {
      id: 4,
      user: {
        name: 'Emma Davis',
        avatar: require('../assets/avatar.jpeg'),
        status: 'offline'
      },
      lastMessage: {
        text: 'Thanks for the quick response! The vintage jacket looks perfect.',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        sender: 'other',
        type: 'text'
      },
      unreadCount: 0,
      hasSwapRequest: false,
      itemDiscussed: 'Vintage Leather Jacket',
      isActive: false
    },
    {
      id: 5,
      user: {
        name: 'Alex Thompson',
        avatar: null,
        status: 'online'
      },
      lastMessage: {
        text: 'Could you send more photos of the watch?',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
        sender: 'other',
        type: 'text'
      },
      unreadCount: 3,
      hasSwapRequest: false,
      itemDiscussed: 'Apple Watch Series 8',
      isActive: true
    },
    {
      id: 6,
      user: {
        name: 'Lisa Chen',
        avatar: require('../assets/avatar.jpeg'),
        status: 'offline'
      },
      lastMessage: {
        text: 'Sorry, I found another option. Thanks anyway!',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
        sender: 'other',
        type: 'text'
      },
      unreadCount: 0,
      hasSwapRequest: false,
      itemDiscussed: 'Gaming Console',
      isActive: false
    },
    {
      id: 7,
      user: {
        name: 'David Martinez',
        avatar: null,
        status: 'online'
      },
      lastMessage: {
        text: 'The camera quality on this phone is amazing! Would you consider my laptop?',
        timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000),
        sender: 'other',
        type: 'text'
      },
      unreadCount: 4,
      hasSwapRequest: true,
      itemDiscussed: 'Samsung Galaxy S23',
      isActive: true
    },
    {
      id: 8,
      user: {
        name: 'Rachel Green',
        avatar: require('../assets/avatar.jpeg'),
        status: 'offline'
      },
      lastMessage: {
        text: 'You: Perfect! When can we meet for the exchange?',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        sender: 'me',
        type: 'text'
      },
      unreadCount: 0,
      hasSwapRequest: false,
      itemDiscussed: 'Nike Air Jordans',
      isActive: false
    }
  ]);

  const filterOptions = [
    { key: 'all', label: 'All', count: chats.length },
    { key: 'unread', label: 'Unread', count: chats.filter(chat => chat.unreadCount > 0).length },
    { key: 'swap_requests', label: 'Swap Requests', count: chats.filter(chat => chat.hasSwapRequest).length },
    { key: 'active', label: 'Active', count: chats.filter(chat => chat.isActive).length }
  ];

  const formatTime = (timestamp) => {
    const now = new Date();
    const diffInMinutes = (now - timestamp) / (1000 * 60);
    
    if (diffInMinutes < 60) {
      return `${Math.floor(diffInMinutes)}m`;
    } else if (diffInMinutes < 24 * 60) {
      return `${Math.floor(diffInMinutes / 60)}h`;
    } else if (diffInMinutes < 7 * 24 * 60) {
      return `${Math.floor(diffInMinutes / (24 * 60))}d`;
    } else {
      return timestamp.toLocaleDateString();
    }
  };

  const getFilteredChats = () => {
    let filteredChats = chats;

    // Apply search filter
    if (searchQuery.trim()) {
      filteredChats = filteredChats.filter(chat =>
        chat.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.itemDiscussed.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply active filter
    switch (activeFilter) {
      case 'unread':
        return filteredChats.filter(chat => chat.unreadCount > 0);
      case 'swap_requests':
        return filteredChats.filter(chat => chat.hasSwapRequest);
      case 'active':
        return filteredChats.filter(chat => chat.isActive);
      default:
        return filteredChats;
    }
  };

  const openChat = (chat) => {
    // Mark as read
    setChats(prevChats =>
      prevChats.map(c =>
        c.id === chat.id ? { ...c, unreadCount: 0 } : c
      )
    );

    navigation.navigate('ChatDetails')
  };

  const renderChatItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.chatItem, item.unreadCount > 0 && styles.unreadChatItem]}
      onPress={() => openChat(item)}
    >
      <View style={styles.avatarContainer}>
        {item.user.avatar ? (
          <Image source={item.user.avatar} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>{item.user.name.charAt(0)}</Text>
          </View>
        )}
        <View style={[
          styles.statusDot,
          { backgroundColor: item.user.status === 'online' ? Colors.success : Colors.textSecondary }
        ]} />
      </View>

      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <Text style={[styles.userName, item.unreadCount > 0 && styles.unreadUserName]}>
            {item.user.name}
          </Text>
          <View style={styles.chatMeta}>
            <Text style={styles.timestamp}>{formatTime(item.lastMessage.timestamp)}</Text>
            {item.unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadCount}>
                  {item.unreadCount > 99 ? '99+' : item.unreadCount}
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.messagePreview}>
          <View style={styles.itemTag}>
            <Ionicons name="pricetag" size={12} color={Colors.primary} />
            <Text style={styles.itemText}>{item.itemDiscussed}</Text>
          </View>
          
          <View style={styles.lastMessageContainer}>
            {item.lastMessage.type === 'swap_request' && (
              <Ionicons name="swap-horizontal" size={14} color={Colors.primary} style={styles.messageIcon} />
            )}
            <Text style={[
              styles.lastMessage, 
              item.unreadCount > 0 && styles.unreadLastMessage,
              item.lastMessage.sender === 'me' && styles.myLastMessage
            ]}>
              {item.lastMessage.sender === 'me' ? 'You: ' : ''}
              {item.lastMessage.text}
            </Text>
          </View>
        </View>

        <View style={styles.chatIndicators}>
          {item.hasSwapRequest && (
            <View style={styles.swapIndicator}>
              <Ionicons name="swap-horizontal" size={12} color={Colors.primary} />
              <Text style={styles.swapText}>Swap</Text>
            </View>
          )}
          {item.isActive && (
            <View style={styles.activeIndicator}>
              <Text style={styles.activeText}>Active</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const FilterButton = ({ filter }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        activeFilter === filter.key && styles.activeFilter
      ]}
      onPress={() => setActiveFilter(filter.key)}
    >
      <Text style={[
        styles.filterText,
        activeFilter === filter.key && styles.activeFilterText
      ]}>
        {filter.label}
      </Text>
      {filter.count > 0 && (
        <View style={[
          styles.filterBadge,
          activeFilter === filter.key && styles.activeFilterBadge
        ]}>
          <Text style={[
            styles.filterBadgeText,
            activeFilter === filter.key && styles.activeFilterBadgeText
          ]}>
            {filter.count}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        icon=""
        name="Abdulla"
      />

      <SearchBar />

      {/* Filter Tabs */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
        contentContainerStyle={styles.filtersContent}
      >
        {filterOptions.map(filter => (
          <FilterButton key={filter.key} filter={filter} />
        ))}
      </ScrollView>

      {/* Chat List */}
      <FlatList
        data={getFilteredChats()}
        renderItem={renderChatItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.chatList}
        contentContainerStyle={styles.chatListContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="chatbubble-outline" size={48} color={Colors.textSecondary} />
            <Text style={styles.emptyTitle}>No conversations found</Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery ? 'Try adjusting your search' : 'Start a new conversation'}
            </Text>
          </View>
        }
      />
      <BottomNavigation activeTab={'ChatList'} onTabPress={setActiveTab} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  // Filter Styles
  filtersContainer: {
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    maxHeight: 70,
    minHeight: 71,
  },
  filtersContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: Colors.background,
    marginRight: 8,
    borderWidth: 1,
    maxHeight: 46,
    minHeight: 45,
    borderColor: Colors.border,
  },
  activeFilter: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  activeFilterText: {
    color: Colors.surface,
  },
  filterBadge: {
    backgroundColor: Colors.danger,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  activeFilterBadge: {
    backgroundColor: Colors.surface,
  },
  filterBadgeText: {
    fontSize: 10,
    color: Colors.surface,
    fontWeight: '600',
  },
  activeFilterBadgeText: {
    color: Colors.primary,
  },

  // Chat List Styles
  chatList: {
    flex: 1,
  },
  chatListContent: {
    flexGrow: 1,
  },
  chatItem: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  unreadChatItem: {
    backgroundColor: `${Colors.primary}05`,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.surface,
  },
  statusDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: Colors.surface,
  },

  // Chat Content Styles
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
  },
  unreadUserName: {
    fontWeight: '600',
  },
  chatMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timestamp: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginRight: 8,
  },
  unreadBadge: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadCount: {
    fontSize: 11,
    color: Colors.surface,
    fontWeight: '600',
  },

  // Message Preview Styles
  messagePreview: {
    marginBottom: 6,
  },
  itemTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${Colors.primary}10`,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  itemText: {
    fontSize: 11,
    color: Colors.primary,
    fontWeight: '500',
    marginLeft: 4,
  },
  lastMessageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  messageIcon: {
    marginRight: 4,
  },
  lastMessage: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 18,
    flex: 1,
  },
  unreadLastMessage: {
    color: Colors.text,
    fontWeight: '500',
  },
  myLastMessage: {
    fontStyle: 'italic',
  },

  // Chat Indicators
  chatIndicators: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  swapIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${Colors.primary}15`,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: 6,
  },
  swapText: {
    fontSize: 10,
    color: Colors.primary,
    fontWeight: '500',
    marginLeft: 2,
  },
  activeIndicator: {
    backgroundColor: `${Colors.success}15`,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  activeText: {
    fontSize: 10,
    color: Colors.success,
    fontWeight: '500',
  },

  // Empty State
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
});

export default ChatListPage;