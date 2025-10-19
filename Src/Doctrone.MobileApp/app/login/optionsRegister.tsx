import { useAddPrescription } from '@/hooks/AddPrescription';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';



export const AddPrescriptionScreen = () => {
  const router = useRouter();
  const [drugName, setDrugName] = useState('');
  const [intake, setIntake] = useState('');
  const [dosage, setDosage] = useState('');

  const { addPrescription, loading, error } = useAddPrescription();

  const handleSubmit = async () => {
    if (!drugName || !intake || !dosage) {
      Alert.alert('Validation', 'Please fill all fields');
      return;
    }

    try {
      const response = await addPrescription(drugName, intake, dosage);
      
      if (response.success) {
        Alert.alert(
          'Success', 
          'Prescription added successfully!',
          [
            {
              text: 'OK',
              onPress: () => {
                // Reset form
                setDrugName('');
                setIntake('');
                setDosage('');
                // Navigate back or to home
                router.back();
              }
            }
          ]
        );
        console.log('API response:', response);
      } else {
        Alert.alert('Error', response.error || 'Failed to add prescription');
      }
    } catch (err) {
      Alert.alert('Error', error || 'Failed to add prescription');
    }
  };

  const PillIcon = () => (
    <Svg width={80} height={80} viewBox="0 0 24 24" fill="none">
      <Path
        d="M10.5 13.5L13.5 10.5M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
        stroke="#13A77C"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M8 8L16 16M8 16L16 8"
        stroke="#13A77C"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => router.back()} 
            style={styles.backButton} 
            disabled={loading}
          >
            <BlurView 
              intensity={20} 
              tint="light" 
              style={StyleSheet.absoluteFillObject} 
            />
            <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
              <Path 
                d="M15 18l-6-6 6-6" 
                stroke="#000" 
                strokeWidth={2} 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
            </Svg>
          </TouchableOpacity>

          <View style={styles.iconContainer}>
            <PillIcon />
          </View>

          <Text style={styles.title}>Add Prescription</Text>
          <Text style={styles.subtitle}>Add a new medication to your profile</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.sectionTitle}>Medication Details</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Drug Name *</Text>
            <TextInput
              style={[styles.input, loading && styles.inputDisabled]}
              placeholder="e.g., Aspirin, Ibuprofen"
              value={drugName}
              onChangeText={setDrugName}
              editable={!loading}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Intake Schedule *</Text>
            <TextInput
              style={[styles.input, loading && styles.inputDisabled]}
              placeholder="e.g., 2x daily, After meals"
              value={intake}
              onChangeText={setIntake}
              editable={!loading}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Dosage *</Text>
            <TextInput
              style={[styles.input, loading && styles.inputDisabled]}
              placeholder="e.g., 500mg, 1 tablet"
              value={dosage}
              onChangeText={setDosage}
              editable={!loading}
              placeholderTextColor="#999"
            />
          </View>

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>❌ {error}</Text>
            </View>
          )}

          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={handleSubmit} 
            disabled={loading}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Adding Prescription...' : 'Add Prescription'}
            </Text>
          </TouchableOpacity>

         
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoIcon}>💡</Text>
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Helpful Tip</Text>
            <Text style={styles.infoText}>
              Make sure to enter the correct dosage and intake schedule. You can always edit this later.
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// --- Styles ---
interface Styles {
  container: ViewStyle;
  scrollContent: ViewStyle;
  header: ViewStyle;
  backButton: ViewStyle;
  iconContainer: ViewStyle;
  title: TextStyle;
  subtitle: TextStyle;
  form: ViewStyle;
  sectionTitle: TextStyle;
  inputContainer: ViewStyle;
  label: TextStyle;
  input: TextStyle;
  inputDisabled: TextStyle;
  errorContainer: ViewStyle;
  errorText: TextStyle;
  button: ViewStyle;
  buttonDisabled: ViewStyle;
  buttonText: TextStyle;
  devButton: ViewStyle;
  devButtonText: TextStyle;
  infoCard: ViewStyle;
  infoIcon: TextStyle;
  infoContent: ViewStyle;
  infoTitle: TextStyle;
  infoText: TextStyle;
}

const styles = StyleSheet.create<Styles>({
  container: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  scrollContent: { 
    flexGrow: 1, 
    padding: 24, 
    paddingTop: 50, 
    paddingBottom: 40 
  },
  header: { 
    marginBottom: 32,
    alignItems: 'center',
  },
  backButton: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    borderWidth: 1, 
    borderColor: '#e0e0e0', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 24,
    alignSelf: 'flex-start',
    overflow: 'hidden',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F0F9F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: { 
    fontSize: 32, 
    fontWeight: 'bold', 
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: { 
    fontSize: 16, 
    color: '#666',
    textAlign: 'center',
  },
  form: { 
    width: '100%' 
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: '700', 
    marginBottom: 16,
    color: '#1F2937',
  },
  inputContainer: { 
    marginBottom: 20 
  },
  label: { 
    fontSize: 14, 
    fontWeight: '600', 
    marginBottom: 8,
    color: '#374151',
  },
  input: { 
    backgroundColor: '#f5f5f5', 
    borderRadius: 12, 
    padding: 14, 
    fontSize: 16, 
    borderWidth: 1, 
    borderColor: '#e0e0e0',
  },
  inputDisabled: { 
    opacity: 0.6 
  },
  errorContainer: {
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
    textAlign: 'center',
  },
  button: { 
    backgroundColor: '#13A77C', 
    paddingVertical: 16, 
    borderRadius: 12, 
    alignItems: 'center',
    shadowColor: '#13A77C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonDisabled: { 
    opacity: 0.6 
  },
  buttonText: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: '600' 
  },
  devButton: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  devButtonText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '500',
  },
  infoCard: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
    padding: 16,
    backgroundColor: '#F0F9F6',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#13A77C',
  },
  infoIcon: {
    fontSize: 24,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#13A77C',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 20,
  },
});

export default AddPrescriptionScreen;