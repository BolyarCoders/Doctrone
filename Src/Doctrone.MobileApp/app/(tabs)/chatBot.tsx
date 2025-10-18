import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useEffect, useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { Bubble, Composer, GiftedChat, IMessage, InputToolbar, Send } from 'react-native-gifted-chat';
import { moderateScale } from 'react-native-size-matters';

export default function ChatBot() {
  const [messages, setMessages] = useState<IMessage[]>([]);

  useEffect(() => {
    setMessages([]);
  }, []);

  const onSend = useCallback((newMessages: IMessage[] = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, newMessages)
    );

    setTimeout(() => {
      const aiResponse: IMessage = {
        _id: Math.random().toString(),
        text: 'This is a simulated response. In a real implementation, this would connect to an AI API.',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Doctrone AI',
        },
      };
      setMessages((prev) => GiftedChat.append(prev, [aiResponse]));
    }, 1000);
  }, []);

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
    <Send {...props} containerStyle={styles.sendContainer}>
      <View style={styles.sendButton}>
        <Text style={styles.sendText}>➤</Text>
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
      {messages.length === 0 && (
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Welcome to Doctrone</Text>
        </View>
      )}
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
        bottomOffset={Platform.OS === 'ios' ? 34 : 0}
        keyboardShouldPersistTaps="never"
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  welcomeContainer: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
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
    paddingBottom: moderateScale(5), //TODO: add Model choosing button
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
  sendText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 2,
  },
});