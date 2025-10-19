import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

interface ChatMessage {
  id: number;
  title: string | null;
  started_at: string;
  user_id: number;
  folder_id?: number | null;
}

const ActivePrescription = () => {
  const params = useLocalSearchParams();
  const folderId = params.folderId as string;
  const folderName = params.folderName as string;

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Fetch chats for logged-in user ---
  useEffect(() => {
    const fetchUserChats = async () => {
      try {
        setLoading(true);

        // Get logged-in user data
        const storedUserData = await AsyncStorage.getItem('userData');
        if (!storedUserData) throw new Error('No logged in user found');

        const user = JSON.parse(storedUserData);
        const userId = user.id || user.userId;
        if (!userId) throw new Error('Invalid user ID');

        // Fetch all chats from API
        const response = await fetch('https://doctroneapi.onrender.com/Doctrone/GetChats');
        if (!response.ok) throw new Error('Failed to fetch chats');

        const data: ChatMessage[] = await response.json();

        // Filter chats only for this user
        const userChats = data.filter((chat) => chat.user_id === userId);

        // Optional: sort newest first
        userChats.sort(
          (a, b) => new Date(b.started_at).getTime() - new Date(a.started_at).getTime()
        );

        setChatHistory(userChats);
      } catch (err: any) {
        console.error('Error fetching chats:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserChats();
  }, []);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diff < 60) return `${diff} seconds ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
    return `${Math.floor(diff / 604800)} week(s) ago`;
  };

  // --- Icons (Folder, Chat, Plus, Chevron) remain unchanged ---
  const FolderIcon = ({ size = 24, color = "#fff" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 6C3 4.89543 3.89543 4 5 4H9.58579C9.851 4 10.1054 4.10536 10.2929 4.29289L12 6H19C20.1046 6 21 6.89543 21 8V18C21 19.1046 20.1046 20 19 20H5C3.89543 20 3 19.1046 3 18V6Z"
        fill={color}
        fillOpacity="0.3"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );

  const ChatIcon = ({ size = 20, color = "#13A77C" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04346 16.4525C3.22094 16.8088 3.28001 17.2161 3.17712 17.6006L2.58151 19.8267C2.32295 20.793 3.20701 21.677 4.17335 21.4185L6.39939 20.8229C6.78393 20.72 7.19121 20.7791 7.54753 20.9565C8.88837 21.6244 10.4003 22 12 22Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );

  const PlusIcon = ({ size = 22, color = "#fff" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 5V19M5 12H19"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );

  const ChevronIcon = ({ size = 20, color = "#9CA3AF" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 18L15 12L9 6"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );

  const handleNewChat = () => {
    router.push('../home');
  };

  const handleChatSelect = (chatId: number) => {
    console.log('Opening chat:', chatId);
 router.push('../chatBot');  };

  return (
    <LinearGradient colors={['#13A77C', '#074131']} style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.iconWrapper}>
              <FolderIcon size={32} color="#fff" />
            </View>
            <View style={styles.headerTextContainer}>
              <Text style={styles.title}>{folderName || 'Prescription'}</Text>
              <Text style={styles.subtitle}>
                {folderId ? `Folder ID: ${folderId}` : 'Medication details'}
              </Text>
            </View>
          </View>
        </View>

        {/* Content Section */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* New Chat Button */}
          <TouchableOpacity
            style={styles.newChatButton}
            activeOpacity={0.8}
            onPress={handleNewChat}
          >
            <PlusIcon size={20} color="#fff" />
            <Text style={styles.newChatText}>Start New Conversation</Text>
          </TouchableOpacity>

          {/* Chat History Section */}
          <View style={styles.historySection}>
            <Text style={styles.historyTitle}>Chat History</Text>
            <Text style={styles.historySubtitle}>
              Continue previous conversations
            </Text>

            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#13A77C" />
                <Text style={styles.loadingText}>Loading chat history...</Text>
              </View>
            ) : error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>❌ {error}</Text>
              </View>
            ) : chatHistory.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyIcon}>💬</Text>
                <Text style={styles.emptyText}>No conversations yet</Text>
                <Text style={styles.emptySubtext}>
                  Start a new conversation to ask questions about {folderName}
                </Text>
              </View>
            ) : (
              <View style={styles.chatList}>
                {chatHistory.map((chat) => (
                  <TouchableOpacity
                    key={chat.id}
                    style={styles.chatItem}
                    activeOpacity={0.7}
                    onPress={() => handleChatSelect(chat.id)}
                  >
                    <View style={styles.chatIconWrapper}>
                      <ChatIcon size={18} color="#13A77C" />
                    </View>
                    <View style={styles.chatContent}>
                      <Text style={styles.chatTitle}>
                        {chat.title || 'Untitled Chat'}
                      </Text>
                      <Text style={styles.chatDate}>
                        {formatTimeAgo(chat.started_at)}
                      </Text>
                    </View>
                    <ChevronIcon size={20} color="#9CA3AF" />
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Info Card */}
          <View style={styles.infoCard}>
            <Text style={styles.infoIcon}>💡</Text>
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Ask anything about this medication</Text>
              <Text style={styles.infoText}>
                Side effects, dosage, interactions, alternatives, and more
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default ActivePrescription;

// --- ORIGINAL STYLES (unchanged) ---
const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 100, paddingBottom: 40 },
  headerContent: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  iconWrapper: {
    width: 64,
    height: 64,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTextContainer: { flex: 1 },
  title: { fontSize: 28, fontWeight: '700', color: '#fff', letterSpacing: 0.3 },
  subtitle: { fontSize: 15, color: 'rgba(255, 255, 255, 0.85)', marginTop: 4 },
  scrollView: { flex: 1, backgroundColor: '#F8FAFB', borderTopLeftRadius: 32, borderTopRightRadius: 32 },
  content: { padding: 24, paddingBottom: 40 },
  newChatButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, backgroundColor: '#13A77C', paddingVertical: 16, paddingHorizontal: 24, borderRadius: 16, shadowColor: '#13A77C', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 },
  newChatText: { fontSize: 16, fontWeight: '600', color: '#fff', letterSpacing: 0.3 },
  historySection: { marginTop: 32 },
  historyTitle: { fontSize: 18, fontWeight: '700', color: '#1F2937', marginBottom: 4 },
  historySubtitle: { fontSize: 14, color: '#6B7280', marginBottom: 16 },
  loadingContainer: { padding: 40, alignItems: 'center', gap: 12 },
  loadingText: { fontSize: 14, color: '#6B7280' },
  errorContainer: { padding: 24, backgroundColor: '#FEF2F2', borderRadius: 12, borderWidth: 1, borderColor: '#FEE2E2' },
  errorText: { fontSize: 14, color: '#DC2626', textAlign: 'center' },
  emptyContainer: { padding: 40, alignItems: 'center', gap: 8 },
  emptyIcon: { fontSize: 48, marginBottom: 8 },
  emptyText: { fontSize: 16, fontWeight: '600', color: '#6B7280' },
  emptySubtext: { fontSize: 14, color: '#9CA3AF', textAlign: 'center', marginTop: 4 },
  chatList: { gap: 8 },
  chatItem: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 8 },
  chatIconWrapper: { width: 40, height: 40, backgroundColor: '#F0F9F6', borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  chatContent: { flex: 1 },
  chatTitle: { fontSize: 15, fontWeight: '600', color: '#1F2937', marginBottom: 4 },
  chatDate: { fontSize: 13, color: '#9CA3AF' },
  infoCard: { flexDirection: 'row', gap: 12, marginTop: 24, padding: 16, backgroundColor: '#13A77C', borderRadius: 12, borderWidth: 1, borderColor: '#19E4AB' },
  infoIcon: { fontSize: 24 },
  infoContent: { flex: 1 },
  infoTitle: { fontSize: 14, fontWeight: '600', color: '#FFF', marginBottom: 4 },
  infoText: { fontSize: 13, color: '#EAFDF7', lineHeight: 20 },
});
