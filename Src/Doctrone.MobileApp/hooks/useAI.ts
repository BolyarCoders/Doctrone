import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useState } from 'react';

interface AIApiRequest {
  message: string;
  user_id: number;
}

interface AIApiResponse {
  response: string;
  // Add other fields your API returns
}

interface UseAIChatReturn {
  sendMessage: (message: string) => Promise<string>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

export const useAIChat = (apiUrl: string): UseAIChatReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(
    async (message: string): Promise<string> => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch user data from AsyncStorage
        const userData = await AsyncStorage.getItem('userData');
        console.log('Raw userData from storage:', userData); // Debug
        
        if (!userData) {
          throw new Error('User not authenticated. Please log in.');
        }
        
const parsed = JSON.parse(userData);
const user = Array.isArray(parsed) ? parsed[0] : parsed;        
console.log('Parsed user object:', user); // Debug
        
        // Get the user ID (should be numeric from auth)
        const userId = user.id || user.userId || user.user_id;
        console.log('Extracted userId:', userId); // Debug
        
        if (!userId) {
          console.error('User object structure:', Object.keys(user)); // Debug
          throw new Error('User ID not found. Please log in again.');
        }

        // Convert to number if it's a string
        const numericUserId = typeof userId === 'number' ? userId : parseInt(userId);
        
        if (isNaN(numericUserId)) {
          throw new Error('Invalid user ID. Please log in again.');
        }

        const requestBody: AIApiRequest = {
          message,
          user_id: numericUserId,
        };

        console.log('Sending AI message:', { message, user_id: numericUserId }); // Debug log

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        console.log('AI Response status:', response.status); // Debug log

        if (!response.ok) {
          const errorText = await response.text();
          console.error('AI API Error:', errorText);
          throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const data: AIApiResponse = await response.json();
        console.log('AI Response data:', data); // Debug log
        
        // Assuming the API returns a 'response' field with the AI's message
        return data.response || 'No response from AI';
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
        console.error('AI Chat Error:', err);
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [apiUrl]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    sendMessage,
    isLoading,
    error,
    clearError,
  };
};