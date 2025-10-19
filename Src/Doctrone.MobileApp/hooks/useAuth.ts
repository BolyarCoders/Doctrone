import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';

const API_BASE_URL = 'https://doctroneapi.onrender.com/Doctrone';

// --- Types ---
interface LoginResponse {
  success?: boolean;
  data?: any;
  error?: string;
  token?: string;
  user?: any;
  message?: string;
  name?: string;
  email?: string;
  pass?: string;
  blood_type?: string;
  age?: number;
  gender?: string;
  special_diagnosis?: string;
}

export interface RegisterData {
  name: string;
  email: string;
  pass?: string;
  bloodType?: string;
  age?: number;
  gender?: string;
  specialDiagnosis?: string;
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

// --- Hook ---
export function useAuth(): UseAuthReturn {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);



  
  // Helper to fetch numeric user ID
  const fetchUserIdByEmail = async (email: string): Promise<number | null> => {
    try {
      const url = `${API_BASE_URL}/GetUserIdByEmail?email=${encodeURIComponent(email)}`;
      const response = await fetch(url);
      if (!response.ok) return null;

      const text = await response.text();
      let userId: number | null = null;

      try {
        let data = JSON.parse(text);
        if (Array.isArray(data)) data = data[0];
        userId = data.id || data.userId || data.user_id || null;
      } catch {
        userId = parseInt(text);
      }

      if (!userId || isNaN(userId)) return null;
      return userId;
    } catch (err) {
      console.error('Error fetching user ID:', err);
      return null;
    }
  };

  // --- LOGIN ---
  const login = async (email: string, password: string): Promise<AuthResult> => {
    setLoading(true);
    setError(null);

    try {
      const url = `${API_BASE_URL}/Login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;
      const response = await fetch(url, { method: 'POST' });
      const text = await response.text();
      const data: LoginResponse = JSON.parse(text);

      if (!response.ok) throw new Error(data.message || 'Login failed');

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

      // Fetch numeric userId
      const numericUserId = await fetchUserIdByEmail(userDataToStore.email);
      
      // ✅ Store BOTH id and userId for compatibility
      if (numericUserId) {
        userDataToStore.id = numericUserId;
        userDataToStore.userId = numericUserId;
      } else {
        // Fallback: use email as identifier
        console.warn('⚠️ Could not fetch numeric userId, using email as fallback');
        userDataToStore.id = userDataToStore.email;
        userDataToStore.userId = 0; // API might need a number
      }

      console.log('✅ Storing user data:', JSON.stringify(userDataToStore, null, 2));

      await AsyncStorage.setItem('userToken', tokenToStore);
      await AsyncStorage.setItem('userData', JSON.stringify(userDataToStore));

      setLoading(false);
      return { success: true, data: userDataToStore };
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'An error occurred';
      setError(msg);
      setLoading(false);
      return { success: false, error: msg };
    }
  };

  // --- REGISTER ---
  const register = async (userData: RegisterData): Promise<AuthResult> => {
    setLoading(true);
    setError(null);
    
    try {
      const body = { ...userData };
      const response = await fetch(`${API_BASE_URL}/Register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const text = await response.text();
      let data: any;

      try { 
        data = JSON.parse(text); 
      } catch { 
        data = { message: text };
      }

      if (response.status < 200 || response.status >= 300) {
        throw new Error(data.message || 'Registration failed');
      }

      console.log('✅ Registration successful');

      // Option 1: Check if registration response includes userId
      let numericUserId = data.userId || data.id || data.user_id;

      // Option 2: Try to fetch userId with retries and longer delays
      if (!numericUserId) {
        console.log('⏳ Waiting for user to be created in database...');
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds

        for (let attempt = 1; attempt <= 5; attempt++) {
          console.log(`🔄 Attempt ${attempt}/5: Fetching userId...`);
          numericUserId = await fetchUserIdByEmail(userData.email);
          
          if (numericUserId) {
            console.log(`✅ Found userId: ${numericUserId}`);
            break;
          }
          
          if (attempt < 5) {
            await new Promise(resolve => setTimeout(resolve, 1500)); // Wait 1.5s between attempts
          }
        }
      }

      // Option 3: If still no userId, automatically log the user in
      if (!numericUserId) {
        console.log('⚠️ Could not fetch userId, attempting automatic login...');
        
        if (!userData.pass) {
          throw new Error('Registration succeeded but could not log in automatically. Please log in manually.');
        }

        // Automatically log in the user
        const loginResult = await login(userData.email, userData.pass);
        
        if (loginResult.success) {
          setLoading(false);
          return loginResult;
        } else {
          throw new Error('Registration succeeded but automatic login failed. Please log in manually.');
        }
      }

      // Store user with valid userId
      const userToStore = {
        ...userData,
        id: numericUserId,
        userId: numericUserId,
      };
      
      const token = data.token || `session_${userData.email}_${Date.now()}`;

      console.log('✅ Storing user data after registration:', JSON.stringify(userToStore, null, 2));

      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userData', JSON.stringify(userToStore));

      setLoading(false);
      return { success: true, data: userToStore };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  };

  // --- LOGOUT ---
  const logout = async (): Promise<AuthResult> => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');
      return { success: true };
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'An error occurred';
      return { success: false, error: msg };
    }
  };

  // --- GET TOKEN ---
  const getToken = async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem('userToken');
    } catch (err) {
      console.error('Error getting token:', err);
      return null;
    }
  };

  // --- GET USER DATA ---
  const getUserData = async (): Promise<any | null> => {
    try {
      const data = await AsyncStorage.getItem('userData');
      return data ? JSON.parse(data) : null;
    } catch (err) {
      console.error('Error getting user data:', err);
      return null;
    }
  };
  

  return { login, register, logout, getToken, getUserData, loading, error };
}

export default useAuth;