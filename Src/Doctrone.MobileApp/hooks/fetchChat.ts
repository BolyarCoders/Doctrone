import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

const API_BASE_URL = 'https://doctroneapi.onrender.com/Doctrone';

interface Chat {
  id: number;
  user_id: number;
  started_at: string;
  title: string | null;
  folder_id: number | null;
}

export function useUserChats(folderId?: number) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchChats = async () => {
    setLoading(true);
    setError(null);

    try {
      const userDataStr = await AsyncStorage.getItem('userData');
      if (!userDataStr) throw new Error('No user data found.');
      const userData = JSON.parse(userDataStr);
      const userId = userData?.id;
      if (!userId || isNaN(userId)) throw new Error('Invalid user ID.');

      const response = await fetch(`${API_BASE_URL}/GetChats`);
      if (!response.ok) throw new Error(`Failed to fetch chats: ${response.status}`);
      const data: Chat[] = await response.json();

      // Filter by user_id and optionally folder_id
      const userChats = data.filter(chat => 
        chat.user_id === userId && chat.folder_id === folderId
      );

      setChats(userChats);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      console.error('Error fetching chats:', msg);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, [folderId]);

  return { chats, loading, error, refetch: fetchChats };
}

