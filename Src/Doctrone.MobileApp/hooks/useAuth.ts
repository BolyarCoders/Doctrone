import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';

const API_BASE_URL: string = 'https://doctroneapi.onrender.com/Doctrone';

interface LoginResponse {
  success?: boolean;
  data?: any;
  error?: string;
  token?: string;
  user?: any;
  message?: string;
  // Direct user fields (for when API returns user data directly)
  name?: string;
  email?: string;
  pass?: string;
  blood_type?: string;
  age?: number;
  gender?: string;
  special_diagnosis?: string;
}

interface RegisterData {
  name: string;
  email: string;
  password?: string;
  blood_type?: string;
  age?: number;
  gender?: string;
  special_diagnosis?: string;
}

interface AuthResult {
  success: boolean;
  data?: any;
  error?: string;
}

interface UseAuthReturn {
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (userData: RegisterData) => Promise<AuthResult>;
  logout: () => Promise<AuthResult>;
  getToken: () => Promise<string | null>;
  getUserData: () => Promise<any | null>;
  loading: boolean;
  error: string | null;
}

export function useAuth(): UseAuthReturn {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Helper function to fetch user ID by email
const fetchUserIdByEmail = async (email: string): Promise<number | null> => {
  try {
    const url = `${API_BASE_URL}/GetUserIdByEmail?email=${encodeURIComponent(email)}`;
    const response = await fetch(url, { method: 'GET' });
    if (!response.ok) return null;

    const responseText = await response.text();
    let userId: number | null = null;

    try {
      let userData = JSON.parse(responseText);

      // ✅ If API returned array, pick first element
      if (Array.isArray(userData)) userData = userData[0];

      userId = userData.id || userData.userId || userData.user_id || null;
    } catch {
      userId = parseInt(responseText);
    }

    if (!userId || isNaN(userId)) {
      console.error('Invalid user ID received');
      return null;
    }

    return userId;
  } catch (err) {
    console.error('Error fetching user ID:', err);
    return null;
  }
};


  // Login function
  const login = async (email: string, password: string): Promise<AuthResult> => {
    setLoading(true);
    setError(null);

    try {
      const url: string = `${API_BASE_URL}/Login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;
      
      console.log('Login URL:', url);
      
      const response: Response = await fetch(url, {
        method: 'POST',
      });

      console.log('Response status:', response.status);

      const responseText: string = await response.text();
      console.log('Response text:', responseText);

      let data: LoginResponse;
      try {
        data = JSON.parse(responseText) as LoginResponse;
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        throw new Error('Server returned invalid response. Please check the API endpoint.');
      }

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Handle different API response formats
      let userDataToStore: any;
      let tokenToStore: string | null = null;

      // Case 1: API returns { token, user } structure
      if (data.token && data.user) {
        tokenToStore = data.token;
        userDataToStore = data.user;
      }
      // Case 2: API returns user data directly (your current API)
      else if (data.email) {
        userDataToStore = data;
        tokenToStore = `session_${data.email}_${Date.now()}`;
      }
      // Case 3: Nested in data property
      else if (data.data) {
        userDataToStore = data.data;
        tokenToStore = data.token || `session_${data.data.email}_${Date.now()}`;
      }
      else {
        throw new Error('Unexpected API response format');
      }

      // Fetch the numeric user ID from the other API
      const userId = await fetchUserIdByEmail(userDataToStore.email);
      
      if (userId) {
        // Add the numeric user ID to the stored data
        userDataToStore.id = userId;
        userDataToStore.userId = userId; // Also store as userId for compatibility
      } else {
        console.warn('Could not fetch user ID, using email as fallback');
        userDataToStore.id = userDataToStore.email;
      }

      // Store user data and token
      await AsyncStorage.setItem('userToken', tokenToStore);
      await AsyncStorage.setItem('userData', JSON.stringify(userDataToStore));
      
      console.log('Stored userData:', JSON.stringify(userDataToStore));

      setLoading(false);
      return { success: true, data: userDataToStore };
    } catch (err) {
      const errorMessage: string = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  };

  // Register function
  const register = async (userData: RegisterData): Promise<AuthResult> => {
    setLoading(true);
    setError(null);

    try {
      const params: URLSearchParams = new URLSearchParams({
        name: userData.name,
        email: userData.email,
        ...(userData.password && { password: userData.password }),
        ...(userData.blood_type && { blood_type: userData.blood_type }),
        ...(userData.age && { age: userData.age.toString() }),
        ...(userData.gender && { gender: userData.gender }),
        ...(userData.special_diagnosis && { special_diagnosis: userData.special_diagnosis }),
      });

      const url: string = `${API_BASE_URL}/Register?${params.toString()}`;
      
      console.log('Register URL:', url);
      
      const response: Response = await fetch(url, {
        method: 'POST',
      });

      console.log('Response status:', response.status);

      const responseText: string = await response.text();
      console.log('Response text:', responseText);

      let data: LoginResponse;
      try {
        data = JSON.parse(responseText) as LoginResponse;
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        throw new Error('Server returned invalid response. Please check the API endpoint.');
      }

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Handle different API response formats
      let userDataToStore: any;
      let tokenToStore: string | null = null;

      if (data.token && data.user) {
        tokenToStore = data.token;
        userDataToStore = data.user;
      } else if (data.email) {
        userDataToStore = data;
        tokenToStore = `session_${data.email}_${Date.now()}`;
      } else if (data.data) {
        userDataToStore = data.data;
        tokenToStore = data.token || `session_${data.data.email}_${Date.now()}`;
      } else {
        throw new Error('Unexpected API response format');
      }

      // Fetch the numeric user ID from the other API
      const userId = await fetchUserIdByEmail(userDataToStore.email);
      
      if (userId) {
        userDataToStore.id = userId;
        userDataToStore.userId = userId;
      } else {
        console.warn('Could not fetch user ID, using email as fallback');
        userDataToStore.id = userDataToStore.email;
      }

      await AsyncStorage.setItem('userToken', tokenToStore);
      await AsyncStorage.setItem('userData', JSON.stringify(userDataToStore));
      
      console.log('Stored userData:', JSON.stringify(userDataToStore));

      setLoading(false);
      return { success: true, data: userDataToStore };
    } catch (err) {
      const errorMessage: string = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  };

  // Logout function
  const logout = async (): Promise<AuthResult> => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');
      return { success: true };
    } catch (err) {
      const errorMessage: string = err instanceof Error ? err.message : 'An error occurred';
      return { success: false, error: errorMessage };
    }
  };

  // Get stored token
  const getToken = async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem('userToken');
    } catch (err) {
      console.error('Error getting token:', err);
      return null;
    }
  };

  // Get stored user data
  const getUserData = async (): Promise<any | null> => {
    try {
      const userData: string | null = await AsyncStorage.getItem('userData');
      return userData ? JSON.parse(userData) : null;
    } catch (err) {
      console.error('Error getting user data:', err);
      return null;
    }
  };

  return {
    login,
    register,
    logout,
    getToken,
    getUserData,
    loading,
    error,
  };
}

// Explicit default export for compatibility
export default useAuth;