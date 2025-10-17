import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, View, Text, Platform, TextInput } from 'react-native';
import { GiftedChat, IMessage, Bubble, Send, InputToolbar, Composer } from 'react-native-gifted-chat';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Index() {
  const [messages, setMessages] = useState<IMessage[]>([]);

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hello! I\'m ChatGPT, a large language model trained by OpenAI. How can I help you today?',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'ChatGPT',
        },
      },
    ]);
  }, []);

  const onSend = useCallback((newMessages: IMessage[] = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, newMessages)
    );

    // Simulate AI response after a delay
    setTimeout(() => {
      const aiResponse: IMessage = {
        _id: Math.random().toString(),
        text: 'This is a simulated response. In a real implementation, this would connect to an AI API.',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'ChatGPT',
        },
      };
      setMessages((prev) => GiftedChat.append(prev, [aiResponse]));
    }, 1000);
  }, []);

  const renderBubble = (props: any) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: '#f7f7f8',
            borderRadius: 18,
            padding: 4,
            marginVertical: 4,
            marginHorizontal: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 2,
          },
          right: {
            backgroundColor: '#e5e5ea',
            borderRadius: 18,
            padding: 4,
            marginVertical: 4,
            marginHorizontal: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 2,
          },
        }}
        textStyle={{
          left: {
            color: '#0d0d0d',
            fontSize: 15,
            lineHeight: 20,
          },
          right: {
            color: '#0d0d0d',
            fontSize: 15,
            lineHeight: 20,
          },
        }}
        containerStyle={{
          left: {
            marginLeft: 8,
          },
          right: {
            marginRight: 8,
          },
        }}
      />
    );
  };

  const renderSend = (props: any) => {
    return (
      <Send {...props} containerStyle={styles.sendContainer}>
        <View style={styles.sendButton}>
          <Text style={styles.sendText}>➤</Text>
        </View>
      </Send>
    );
  };

  const renderComposer = (props: any) => {
    return (
      <View style={styles.composerContainer}>
        <Composer
          {...props}
          textInputStyle={styles.composerTextInput}
        />
      </View>
    );
  };

  const renderInputToolbar = (props: any) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={styles.inputToolbar}
        primaryStyle={styles.primaryStyle}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ChatGPT</Text>
      </View>
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: 1,
        }}
        renderBubble={renderBubble}
        renderSend={renderSend}
        renderComposer={renderComposer}
        renderInputToolbar={renderInputToolbar}
        placeholder="Message ChatGPT..."
        alwaysShowSend
        
        renderAvatar={null}
        minInputToolbarHeight={60}
        bottomOffset={Platform.OS === 'ios' ? 34 : 0}
        keyboardShouldPersistTaps="never"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: 60,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0d0d0d',
  },
  inputToolbar: {
    backgroundColor: '#fff',
    borderTopWidth: 0,
    paddingHorizontal: 12,
    paddingVertical: 12,
    minHeight: 50,
  },
  composerContainer: {
    backgroundColor: '#f4f4f4',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,

    width: '100%',
    minHeight: 60,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  composerTextInput: {
    color: '#0d0d0d',
    fontSize: 15,
    lineHeight: 20,
    paddingTop: 8,
    paddingBottom: 8,
  },
  primaryStyle: {
    alignItems: 'center',
  },
  sendContainer: {
        position:'absolute',
    bottom:0,
    right:10,
    
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginRight: 8,
    marginBottom: 4,
  },
  sendButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#0d0d0d',
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