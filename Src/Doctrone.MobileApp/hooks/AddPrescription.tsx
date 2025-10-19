import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';

const API_BASE = 'https://doctroneapi.onrender.com/Doctrone';

interface AddPrescriptionResult {
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
  
  // 🔍 DEBUG: Log the entire userData object
  console.log('🔍 FULL userData from AsyncStorage:', JSON.stringify(parsed, null, 2));
  
  const userIdRaw = extractValue(parsed, ['id', 'userId', 'Id', 'UserId', 'user_id']);
  
  console.log('🔍 Extracted userIdRaw:', userIdRaw);
  console.log('🔍 Type of userIdRaw:', typeof userIdRaw);
  
  // Check if it's a temp ID (from registration without login)
  if (typeof userIdRaw === 'string' && userIdRaw.startsWith('temp_')) {
    console.error('❌ Temporary userId detected - user needs to log in');
    throw new Error('Please log in with your account to add prescriptions.');
  }
  
  const numericUserId = Number(userIdRaw);

  if (!numericUserId || isNaN(numericUserId)) {
    console.error('❌ Failed to convert to numeric userId');
    console.error('❌ Available keys in userData:', Object.keys(parsed));
    throw new Error(`Invalid userId. Please log in again.`);
  }

  return numericUserId;
};

// Helper to create a folder
const createFolder = async (userId: number, folderName: string): Promise<boolean> => {
  try {
    const folderPayload = {
      userId: userId,
      name: folderName,
    };

    console.log('📁 Creating folder:', folderPayload);

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
      data = { message: text };
    }

    if (!response.ok) {
      console.warn('⚠️ Folder creation failed:', data.message || data.error);
      return false;
    }

    console.log('✅ Folder created successfully');
    return true;
  } catch (err: any) {
    console.warn('⚠️ Error creating folder:', err.message);
    return false;
  }
};

export const useAddPrescription = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addPrescription = async (
    drugName: string,
    intake: string,
    dosage: string
  ): Promise<AddPrescriptionResult> => {
    setLoading(true);
    setError(null);

    try {
      // Get authenticated user ID
      const numericUserId = await getUserId();
      console.log('🔑 Using userId:', numericUserId);

      // Step 1: Create the drug
      const drugResponse = await fetch(`${API_BASE}/AddDrugs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: drugName }),
      });

      const drugText = await drugResponse.text();
      let drugData: any;

      try {
        drugData = JSON.parse(drugText);
      } catch {
        throw new Error('Invalid response from drug creation endpoint');
      }

      if (!drugResponse.ok) {
        throw new Error(drugData.message || drugData.error || 'Failed to create drug');
      }

      console.log('🔍 Drug API response:', drugData);

      // ✅ Handle array responses - API returns [{"id":1026,"name":"Figi"}]
      let responseData = drugData;
      if (Array.isArray(drugData) && drugData.length > 0) {
        console.log('🔍 Response is an array, taking first element');
        responseData = drugData[0];
      }

      // Extract drugId from response - check all possible locations
      let drugId = extractValue(responseData, ['id', 'drugId', 'Id', 'DrugId']);
      
      // Check nested data objects
      if (!drugId && responseData.data) {
        const nestedData = Array.isArray(responseData.data) ? responseData.data[0] : responseData.data;
        drugId = extractValue(nestedData, ['id', 'drugId', 'Id', 'DrugId']);
      }
      
      // Check nested drug objects
      if (!drugId && responseData.drug) {
        const nestedDrug = Array.isArray(responseData.drug) ? responseData.drug[0] : responseData.drug;
        drugId = extractValue(nestedDrug, ['id', 'drugId', 'Id', 'DrugId']);
      }

      console.log('🔍 Extracted drugId:', drugId);

      if (!drugId) {
        throw new Error(
          `Server did not return a drug ID. Response: ${JSON.stringify(drugData)}`
        );
      }

      // Step 2: Create the prescription
      // ⚠️ API expects flat structure, not nested in "prescription"
      const prescriptionPayload = {
        userId: numericUserId,
        drugId: Number(drugId),
        intake: intake,
        dosage: dosage,
      };

      console.log('📤 Prescription payload:', prescriptionPayload);

      const prescriptionResponse = await fetch(`${API_BASE}/AddPrescription`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prescriptionPayload),
      });

      const prescriptionText = await prescriptionResponse.text();
      let prescriptionData: any;

      try {
        prescriptionData = JSON.parse(prescriptionText);
      } catch {
        // If response is plain text (like "Success"), treat as success
        prescriptionData = { message: prescriptionText };
      }

      if (!prescriptionResponse.ok) {
        throw new Error(
          prescriptionData.message || 
          prescriptionData.error || 
          'Failed to create prescription'
        );
      }

      console.log('✅ Prescription created:', prescriptionData);

      // Step 3: Create a folder with the drug name
      const folderCreated = await createFolder(numericUserId, drugName);
      
      if (folderCreated) {
        console.log('✅ Folder created for prescription:', drugName);
      } else {
        console.log('⚠️ Prescription created but folder creation failed');
      }

      setLoading(false);
      return { 
        success: true, 
        data: {
          prescription: prescriptionData,
          folderCreated: folderCreated,
        }
      };

    } catch (err: any) {
      const errorMessage = err.message || 'Something went wrong';
      console.error('❌ Error adding prescription:', errorMessage);

      setLoading(false);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const clearError = () => setError(null);

  return { addPrescription, loading, error, clearError };
};