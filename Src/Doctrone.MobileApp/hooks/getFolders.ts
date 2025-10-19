import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useEffect, useState } from 'react';

interface Folder {
  id: number;
  user_id: number;
  name: string;
  created_at: string;
}

// Helper to extract userId from AsyncStorage
const getUserId = async (): Promise<number | null> => {
  try {
    const userData = await AsyncStorage.getItem('userData');
    if (!userData) return null;

    const parsed = JSON.parse(userData);
    const userIdRaw = parsed.id || parsed.userId || parsed.Id || parsed.UserId || parsed.user_id;
    const numericUserId = Number(userIdRaw);

    if (!numericUserId || isNaN(numericUserId)) return null;
    return numericUserId;
  } catch (err) {
    console.error('Error getting userId:', err);
    return null;
  }
};

export const useFolders = () => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFolders = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get userId from AsyncStorage
      const userId = await getUserId();
      
      if (!userId) {
        setError('User not authenticated');
        setLoading(false);
        return;
      }

      console.log('🔍 Fetching folders for userId:', userId);

      // Fetch folders with userId parameter
      const response = await axios.get<Folder[]>(
        `https://doctroneapi.onrender.com/Doctrone/GetFoldersOfUser?userId=${userId}`
      );

      console.log('✅ Folders fetched:', response.data);
      setFolders(response.data);
    } catch (err: any) {
      console.error('❌ Error fetching folders:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch folders');
    } finally {
      setLoading(false);
    }
  };

  // Fetch on mount
  useEffect(() => {
    fetchFolders();
  }, []);

  // Return refetch function so components can refresh the list
  return { folders, loading, error, refetch: fetchFolders };
};