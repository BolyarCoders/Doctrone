import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useState } from 'react';

export interface Msg {
  id: number;
  chat_id: number;
  sender: string;
  content: string;
  created_at: string;
}

const API_BASE_URL = 'https://doctroneapi.onrender.com/Doctrone';

export const useMessages = () => {
  const [fetchedMessages, setFetchedMessages] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = useCallback(async (chatId: number) => {
    if (!chatId) return;

    setLoading(true);
    setError(null);

    try {
      // 1️⃣ Get token from AsyncStorage
      const token = await AsyncStorage.getItem('userToken');
      if (!token) throw new Error('No user token found');

      // 2️⃣ Fetch messages from backend
      const response = await fetch(
        `${API_BASE_URL}/GetMessagesOfUser?chat_id=${chatId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const text = await response.text();
      console.log('API response text:', text); // log raw response

      if (!response.ok) {
        throw new Error(`Failed to fetch messages: ${response.status} ${text}`);
      }

      const data: Msg[] = JSON.parse(text);
      setFetchedMessages(data || []);
    } catch (err: any) {
      console.error('❌ Error fetching messages:', err);
      setError(err.message || 'Unknown error');
      setFetchedMessages([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return { fetchedMessages, fetchMessages, loading, error };
};
