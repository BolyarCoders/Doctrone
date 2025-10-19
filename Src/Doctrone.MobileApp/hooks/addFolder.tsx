import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';

const API_BASE = 'https://doctroneapi.onrender.com/Doctrone';

interface AddFolderResult {
  success: boolean;
  data?: any;
  error?: string;
}

// Helper to extract nested values from API responses
const extractValue = (obj: any, possibleKeys: string[]): any => {
  for (const key of possibleKeys) {
    if (obj?.[key] !== undefined && obj[key] !== null) {
      return obj[key];
    }
  }
  return null;
};

// Helper to get userId from AsyncStorage
const getUserId = async (): Promise<number> => {
  const userData = await AsyncStorage.getItem('userData');
  if (!userData) {
    throw new Error('User not authenticated. Please log in.');
  }

  const parsed = JSON.parse(userData);
  const userIdRaw = extractValue(parsed, ['id', 'userId', 'Id', 'UserId', 'user_id']);

  // Check if it's a temp ID (from registration without login)
  if (typeof userIdRaw === 'string' && userIdRaw.startsWith('temp_')) {
    throw new Error('Please log in with your account to create folders.');
  }

  const numericUserId = Number(userIdRaw);

  if (!numericUserId || isNaN(numericUserId)) {
    throw new Error(`Invalid userId. Please log in again.`);
  }

  return numericUserId;
};

export const useFolder = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addFolder = async (folderName: string): Promise<AddFolderResult> => {
    setLoading(true);
    setError(null);

    try {
      // Get authenticated user ID
      const numericUserId = await getUserId();
      console.log('🔑 Using userId for folder:', numericUserId);

      // Create folder payload
      const folderPayload = {
        userId: numericUserId,
        name: folderName,
      };

      console.log('📤 Creating folder with payload:', folderPayload);

      const response = await fetch(`${API_BASE}/AddFolder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(folderPayload),
      });

      const text = await response.text();
      let data: any;

      try {
        data = JSON.parse(text);
      } catch {
        // If response is plain text (like "Success"), treat as success
        data = { message: text };
      }

      if (!response.ok) {
        throw new Error(
          data.message || 
          data.error || 
          'Failed to create folder'
        );
      }

      console.log('✅ Folder created:', data);

      setLoading(false);
      return { success: true, data };

    } catch (err: any) {
      const errorMessage = err.message || 'Something went wrong creating folder';
      console.error('❌ Error creating folder:', errorMessage);

      setLoading(false);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const clearError = () => setError(null);

  return { addFolder, loading, error, clearError };
};