import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
  Image,
  Modal,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Colors from '../constants/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const ChatPage = ({ route }) => {
  const navigation = useNavigation();
  const scrollViewRef = useRef();
  const { chatUser = { name: 'John Doe', avatar: null, status: 'online' } } = route?.params || {};
  
  const [message, setMessage] = useState('');
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [swapRequest, setSwapRequest] = useState({
    requestedItem: '',
    offeredItem: '',
    condition: 'Good',
    description: '',
    estimatedValue: '',
  });

  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm interested in your iPhone 14 Pro. Is it still available?",
      sender: 'other',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      type: 'text'
    },
    {
      id: 2,
      text: "Yes, it's still available! What are you looking to swap for it?",
      sender: 'me',
      timestamp: new Date(Date.now() - 25 * 60 * 1000),
      type: 'text'
    },
    {
      id: 3,
      text: "I have a MacBook Air M1 in excellent condition. Would you be interested?",
      sender: 'other',
      timestamp: new Date(Date.now() - 20 * 60 * 1000),
      type: 'text'
    },
    {
      id: 4,
      requestedItem: 'iPhone 14 Pro',
      offeredItem: 'MacBook Air M1 (2020)',
      condition: 'Excellent',
      description: '13-inch, 8GB RAM, 256GB SSD. Barely used, comes with original charger and box.',
      estimatedValue: '$800',
      sender: 'other',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      type: 'swap_request',
      status: 'pending'
    }
  ]);

  const conditionOptions = ['Excellent', 'Good', 'Fair', 'Poor'];

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: message,
        sender: 'me',
        timestamp: new Date(),
        type: 'text'
      };
      setMessages([...messages, newMessage]);
      setMessage('');
      
      // Auto scroll to bottom
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  };

  const sendSwapRequest = () => {
    if (!swapRequest.requestedItem || !swapRequest.offeredItem) {
      Alert.alert('Error', 'Please fill in both requested and offered items.');
      return;
    }

    const newSwapMessage = {
      id: messages.length + 1,
      ...swapRequest,
      sender: 'me',
      timestamp: new Date(),
      type: 'swap_request',
      status: 'pending'
    };

    setMessages([...messages, newSwapMessage]);
    setShowSwapModal(false);
    setSwapRequest({
      requestedItem: '',
      offeredItem: '',
      condition: 'Good',
      description: '',
      estimatedValue: '',
    });

    setTimeout(() => {
      scrollToBottom();
    }, 100);
  };

  const scrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const diffInHours = (now - timestamp) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      const minutes = Math.floor((now - timestamp) / (1000 * 60));
      return `${minutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return timestamp.toLocaleDateString();
    }
  };

  const handleSwapResponse = (messageId, response) => {
    setMessages(messages.map(msg => 
      msg.id === messageId 
        ? { ...msg, status: response }
        : msg
    ));
    
    const responseText = response === 'accepted' 
      ? "Great! I accept your swap proposal. Let's arrange the details."
      : "Thanks for the offer, but I'll have to pass on this one.";
    
    const responseMessage = {
      id: messages.length + 1,
      text: responseText,
      sender: 'me',
      timestamp: new Date(),
      type: 'text'
    };
    
    setMessages(prev => [...prev, responseMessage]);
  };

  const renderMessage = ({ item }) => {
    if (item.type === 'swap_request') {
      return (
        <View style={[
          styles.messageContainer,
          item.sender === 'me' ? styles.myMessage : styles.otherMessage
        ]}>
          <View style={styles.swapRequestCard}>
            <View style={styles.swapRequestHeader}>
              <Ionicons name="swap-horizontal" size={20} color={Colors.primary} />
              <Text style={styles.swapRequestTitle}>Swap Request</Text>
            </View>
            
            <View style={styles.swapDetails}>
              <View style={styles.swapItem}>
                <Text style={styles.swapLabel}>Requested:</Text>
                <Text style={styles.swapValue}>{item.requestedItem}</Text>
              </View>
              
              <Ionicons name="arrow-down" size={16} color={Colors.textSecondary} style={styles.swapArrow} />
              
              <View style={styles.swapItem}>
                <Text style={styles.swapLabel}>Offered:</Text>
                <Text style={styles.swapValue}>{item.offeredItem}</Text>
              </View>
              
              <View style={styles.swapItem}>
                <Text style={styles.swapLabel}>Condition:</Text>
                <Text style={styles.swapValue}>{item.condition}</Text>
              </View>
              
              {item.estimatedValue && (
                <View style={styles.swapItem}>
                  <Text style={styles.swapLabel}>Est. Value:</Text>
                  <Text style={styles.swapValue}>{item.estimatedValue}</Text>
                </View>
              )}
              
              {item.description && (
                <View style={styles.swapItem}>
                  <Text style={styles.swapLabel}>Description:</Text>
                  <Text style={styles.swapDescription}>{item.description}</Text>
                </View>
              )}
            </View>
            
            {item.sender === 'other' && item.status === 'pending' && (
              <View style={styles.swapActions}>
                <TouchableOpacity 
                  style={[styles.swapActionButton, styles.acceptButton]}
                  onPress={() => handleSwapResponse(item.id, 'accepted')}
                >
                  <Text style={styles.acceptButtonText}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.swapActionButton, styles.declineButton]}
                  onPress={() => handleSwapResponse(item.id, 'declined')}
                >
                  <Text style={styles.declineButtonText}>Decline</Text>
                </TouchableOpacity>
              </View>
            )}
            
            {item.status !== 'pending' && (
              <View style={styles.swapStatus}>
                <Text style={[
                  styles.swapStatusText,
                  { color: item.status === 'accepted' ? Colors.success : Colors.danger }
                ]}>
                  {item.status === 'accepted' ? '✓ Accepted' : '✗ Declined'}
                </Text>
              </View>
            )}
          </View>
          
          <Text style={[
            styles.messageTime,
            item.sender === 'me' ? styles.myMessageTime : styles.otherMessageTime
          ]}>
            {formatTime(item.timestamp)}
          </Text>
        </View>
      );
    }

    return (
      <View style={[
        styles.messageContainer,
        item.sender === 'me' ? styles.myMessage : styles.otherMessage
      ]}>
        <View style={[
          styles.messageBubble,
          item.sender === 'me' ? styles.myMessageBubble : styles.otherMessageBubble
        ]}>
          <Text style={[
            styles.messageText,
            item.sender === 'me' ? styles.myMessageText : styles.otherMessageText
          ]}>
            {item.text}
          </Text>
        </View>
        <Text style={[
          styles.messageTime,
          item.sender === 'me' ? styles.myMessageTime : styles.otherMessageTime
        ]}>
          {formatTime(item.timestamp)}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.surface} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            {chatUser.avatar ? (
              <Image source={chatUser.avatar} style={styles.avatarImage} />
            ) : (
              <Text style={styles.avatarText}>{chatUser.name.charAt(0)}</Text>
            )}
            <View style={[
              styles.statusIndicator,
              { backgroundColor: chatUser.status === 'online' ? Colors.success : Colors.textSecondary }
            ]} />
          </View>
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{chatUser.name}</Text>
            <Text style={styles.userStatus}>{chatUser.status}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-vertical" size={20} color={Colors.text} />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => scrollToBottom()}
      >
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={false}
          contentContainerStyle={styles.messagesList}
        />
      </ScrollView>

      {/* Input Area */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputContainer}
      >
        <View style={styles.inputRow}>
          <TouchableOpacity
            style={styles.swapButton}
            onPress={() => setShowSwapModal(true)}
          >
            <Ionicons name="swap-horizontal" size={20} color={Colors.primary} />
          </TouchableOpacity>
          
          <TextInput
            style={styles.textInput}
            value={message}
            onChangeText={setMessage}
            placeholder="Type a message..."
            placeholderTextColor={Colors.textSecondary}
            multiline
            maxLength={500}
          />
          
          <TouchableOpacity
            style={[styles.sendButton, { opacity: message.trim() ? 1 : 0.5 }]}
            onPress={sendMessage}
            disabled={!message.trim()}
          >
            <Ionicons name="send" size={20} color={Colors.surface} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Swap Request Modal */}
      <Modal
        visible={showSwapModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowSwapModal(false)}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Create Swap Request</Text>
            <TouchableOpacity onPress={sendSwapRequest}>
              <Text style={styles.modalSendText}>Send</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>What do you want?</Text>
              <TextInput
                style={styles.modalInput}
                value={swapRequest.requestedItem}
                onChangeText={(text) => setSwapRequest({...swapRequest, requestedItem: text})}
                placeholder="e.g., iPhone 14 Pro"
                placeholderTextColor={Colors.textSecondary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>What are you offering?</Text>
              <TextInput
                style={styles.modalInput}
                value={swapRequest.offeredItem}
                onChangeText={(text) => setSwapRequest({...swapRequest, offeredItem: text})}
                placeholder="e.g., MacBook Air M1"
                placeholderTextColor={Colors.textSecondary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Condition of your item</Text>
              <View style={styles.conditionContainer}>
                {conditionOptions.map((condition) => (
                  <TouchableOpacity
                    key={condition}
                    style={[
                      styles.conditionOption,
                      swapRequest.condition === condition && styles.selectedCondition
                    ]}
                    onPress={() => setSwapRequest({...swapRequest, condition})}
                  >
                    <Text style={[
                      styles.conditionText,
                      swapRequest.condition === condition && styles.selectedConditionText
                    ]}>
                      {condition}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Estimated Value (Optional)</Text>
              <TextInput
                style={styles.modalInput}
                value={swapRequest.estimatedValue}
                onChangeText={(text) => setSwapRequest({...swapRequest, estimatedValue: text})}
                placeholder="e.g., $800"
                placeholderTextColor={Colors.textSecondary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Description (Optional)</Text>
              <TextInput
                style={[styles.modalInput, styles.descriptionInput]}
                value={swapRequest.description}
                onChangeText={(text) => setSwapRequest({...swapRequest, description: text})}
                placeholder="Describe your item's condition, include any accessories..."
                placeholderTextColor={Colors.textSecondary}
                multiline
                numberOfLines={4}
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  
  // Header Styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginTop: 25,
  },
  backButton: {
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    position: 'relative',
    marginRight: 12,
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarText: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    color: Colors.surface,
    textAlign: 'center',
    lineHeight: 40,
    fontSize: 16,
    fontWeight: '600',
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.surface,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  userStatus: {
    fontSize: 12,
    color: Colors.textSecondary,
    textTransform: 'capitalize',
  },
  moreButton: {
    padding: 8,
  },

  // Messages Styles
  messagesContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  messageContainer: {
    marginVertical: 4,
  },
  myMessage: {
    alignItems: 'flex-end',
  },
  otherMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 18,
  },
  myMessageBubble: {
    backgroundColor: Colors.primary,
  },
  otherMessageBubble: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  myMessageText: {
    color: Colors.surface,
  },
  otherMessageText: {
    color: Colors.text,
  },
  messageTime: {
    fontSize: 11,
    marginTop: 4,
    marginHorizontal: 8,
  },
  myMessageTime: {
    color: Colors.textSecondary,
    textAlign: 'right',
  },
  otherMessageTime: {
    color: Colors.textSecondary,
    textAlign: 'left',
  },

  // Swap Request Styles
  swapRequestCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.primary,
    maxWidth: '90%',
  },
  swapRequestHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  swapRequestTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
    marginLeft: 8,
  },
  swapDetails: {
    marginBottom: 12,
  },
  swapItem: {
    marginBottom: 8,
  },
  swapLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
    marginBottom: 2,
  },
  swapValue: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '600',
  },
  swapDescription: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 18,
  },
  swapArrow: {
    alignSelf: 'center',
    marginVertical: 4,
  },
  swapActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  swapActionButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  acceptButton: {
    backgroundColor: Colors.success,
  },
  declineButton: {
    backgroundColor: Colors.neutral50,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  acceptButtonText: {
    color: Colors.surface,
    fontWeight: '600',
    fontSize: 14,
  },
  declineButtonText: {
    color: Colors.textSecondary,
    fontWeight: '600',
    fontSize: 14,
  },
  swapStatus: {
    alignItems: 'center',
    marginTop: 8,
  },
  swapStatusText: {
    fontSize: 14,
    fontWeight: '600',
  },

  // Input Styles
  inputContainer: {
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    marginBottom: 15,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  swapButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.neutral50,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 12,
    maxHeight: 100,
    fontSize: 15,
    color: Colors.text,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalCancelText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  modalSendText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.text,
    backgroundColor: Colors.surface,
  },
  descriptionInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  conditionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  conditionOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: Colors.surface,
  },
  selectedCondition: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  conditionText: {
    fontSize: 14,
    color: Colors.text,
  },
  selectedConditionText: {
    color: Colors.surface,
    fontWeight: '600',
  },
});

export default ChatPage;