import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Platform, StyleSheet, Text, View } from 'react-native';
import { Bubble, Composer, GiftedChat, IMessage, InputToolbar, Send } from 'react-native-gifted-chat';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale } from 'react-native-size-matters';
import { useAIChat } from '../../hooks/useAI';

const API_URL = 'https://doctrone.onrender.com/new_chat'; 

export default function Home() {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const { sendMessage, isLoading, error } = useAIChat(API_URL);
useEffect(() => {
  const checkAuth = async () => {
    const token = await AsyncStorage.getItem('userToken');
    const userData = await AsyncStorage.getItem('userData');
    console.log('Stored token:', token);
    console.log('Stored userData:', userData);
  };
  checkAuth();
}, []);
  useEffect(() => {
    setMessages([]);
  }, []);

  // Show error alert if API call fails
  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
    }
  }, [error]);

  const onSend = useCallback(async (newMessages: IMessage[] = []) => {
    // Add user message to chat immediately
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, newMessages)
    );

    const userMessage = newMessages[0];
    
    try {
      // Call the AI API - user_id is automatically retrieved from AsyncStorage
      const aiResponseText = await sendMessage(userMessage.text);
      
      // Add AI response to chat
      const aiResponse: IMessage = {
        _id: Math.random().toString(),
        text: aiResponseText,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Doctrone AI',
        },
      };
      
      setMessages((prev) => GiftedChat.append(prev, [aiResponse]));
    } catch (err) {
      // Error is already handled in the hook, but you can add fallback message
      const errorResponse: IMessage = {
        _id: Math.random().toString(),
        text: "I'm sorry, I'm having trouble connecting right now. Please try again.",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Doctrone AI',
        },
      };
      setMessages((prev) => GiftedChat.append(prev, [errorResponse]));
    }
  }, [sendMessage]);

  const renderBubble = (props: any) => (
    <Bubble
      {...props}
      wrapperStyle={{
        left: styles.bubbleLeft,
        right: styles.bubbleRight,
      }}
      textStyle={{
        left: styles.bubbleText,
        right: styles.bubbleText,
      }}
    />
  );

  const renderSend = (props: any) => (
    <Send {...props} containerStyle={styles.sendContainer} disabled={isLoading}>
      <View style={[styles.sendButton, isLoading && styles.sendButtonDisabled]}>
        <Text style={styles.sendText}>{isLoading ? '...' : '➤'}</Text>
      </View>
    </Send>
  );

  const renderComposer = (props: any) => (
    <View style={styles.composerContainer}>
      <Composer {...props} textInputStyle={styles.composerTextInput} />
    </View>
  );

  const renderInputToolbar = (props: any) => (
    <InputToolbar {...props} containerStyle={styles.inputToolbar} primaryStyle={styles.primaryStyle} />
  );

  return (
    <LinearGradient colors={['#13A77C', '#074131']} style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        {messages.length === 0 && (
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeText}>Welcome to Doctrone</Text>
          </View>
        )}
        <View style={styles.chatContainer}>
          <GiftedChat
            messages={messages}
            onSend={(messages) => onSend(messages)}
            user={{ _id: 1 }}
            renderBubble={renderBubble}
            renderSend={renderSend}
            renderComposer={renderComposer}
            renderInputToolbar={renderInputToolbar}
            placeholder="Message Doctrone AI..."
            textInputProps={{
              placeholderTextColor: '#fff',
            }}
            alwaysShowSend
            renderAvatar={null}
            minInputToolbarHeight={60}
            bottomOffset={0}
            keyboardShouldPersistTaps="never"
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  safeArea: {
    flex: 1,
  },

  chatContainer: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? moderateScale(80) : moderateScale(70),
  },

  welcomeContainer: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 0,
  },
  welcomeText: {
    fontSize: moderateScale(32),
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },

  bubbleLeft: {
    backgroundColor: '#1A2420',
    borderRadius: moderateScale(16),
    padding: moderateScale(3),
    marginVertical: moderateScale(3),
    marginHorizontal: moderateScale(7),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  bubbleRight: {
    backgroundColor: '#1A2420',
    borderRadius: moderateScale(16),
    padding: moderateScale(3),
    marginVertical: moderateScale(3),
    marginHorizontal: moderateScale(7),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  bubbleText: {
    color: '#fff',
    fontSize: moderateScale(14.5),
    lineHeight: 20,
  },

  inputToolbar: {
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    paddingHorizontal: moderateScale(8),
    paddingVertical: moderateScale(10),
    minHeight: moderateScale(50),
  },
  composerContainer: {
    backgroundColor: '#1A2420',
    borderRadius: moderateScale(34),
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(6),
    width: '100%',
    minHeight: moderateScale(50),
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 7,
  },
  composerTextInput: {
    color: '#ffff',
    fontSize: moderateScale(15),
    lineHeight: 20,
    paddingBottom: moderateScale(5),
  },
  primaryStyle: { alignItems: 'center' },
  sendContainer: {
    position: 'absolute',
    bottom: moderateScale(4),
    right: moderateScale(10),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  sendButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#A15C3E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 2,
  },
});