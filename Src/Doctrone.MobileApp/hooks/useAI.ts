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
  sendMessage: (message: string, userId: number) => Promise<string>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

export const useAIChat = (apiUrl: string): UseAIChatReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(
    async (message: string, userId: number): Promise<string> => {
      setIsLoading(true);
      setError(null);

      try {
        const requestBody: AIApiRequest = {
          message,
          user_id: userId,
        };

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Add any additional headers like authentication
            // 'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const data: AIApiResponse = await response.json();
        
        // Assuming the API returns a 'response' field with the AI's message
        return data.response || 'No response from AI';
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
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