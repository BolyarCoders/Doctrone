import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
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

const API_BASE_URL = 'https://doctroneapi.onrender.com/Doctrone';

interface RegisterData {
  name: string;
  email: string;
  pass: string;
  bloodType: string;
  age: number;
  gender: string;
  specialDiagnosis: string;
}

interface AuthResult {
  success: boolean;
  data?: any;
  error?: string;
}

const Register: React.FC = () => {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [bloodType, setBloodType] = useState('A+');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [specialDiagnosis, setSpecialDiagnosis] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const register = async (userData: RegisterData): Promise<AuthResult> => {
    setLoading(true);
    try {
      const body = { ...userData };
      const response = await fetch(`${API_BASE_URL}/Register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const text = await response.text();
      let data: any;
      try { data = JSON.parse(text); } 
      catch { data = { message: text }; }

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      const token = data.token || `session_${userData.email}_${Date.now()}`;
      const userToStore = data.user || { ...userData, id: `temp_${Date.now()}` };

      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userData', JSON.stringify(userToStore));

      setLoading(false);
      return { success: true, data: userToStore };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  };

  const handleRegister = async () => {
    if (!name || !email || !pass || !confirmPass || !age) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    if (pass !== confirmPass) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 1 || ageNum > 150) {
      Alert.alert('Error', 'Enter a valid age (1-150)');
      return;
    }

    if (!acceptTerms) {
      Alert.alert('Error', 'Please accept the terms of use');
      return;
    }

    const data: RegisterData = {
      name: name.trim(),
      email: email.trim(),
      pass: pass.trim(),
      bloodType,
      age: ageNum,
      gender,
      specialDiagnosis: specialDiagnosis.trim() || 'None',
    };

    const result = await register(data);

    if (result.success) {
      Alert.alert('Success', 'Registration successful!', [
        { text: 'OK', onPress: () => router.push('/(login)/login') },
      ]);

      // Reset form
      setName('');
      setEmail('');
      setPass('');
      setConfirmPass('');
      setBloodType('A+');
      setAge('');
      setGender('Male');
      setSpecialDiagnosis('');
      setAcceptTerms(false);
    } else {
      Alert.alert('Error', result.error || 'Registration failed');
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton} disabled={loading}>
            <BlurView intensity={20} tint="light" style={StyleSheet.absoluteFillObject} />
            <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
              <Path d="M15 18l-6-6 6-6" stroke="#000" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </TouchableOpacity>
          <Text style={styles.title}>Register</Text>
          <Text style={styles.subtitle}>Create a new account</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.sectionTitle}>Basic Information</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Name *</Text>
            <TextInput style={[styles.input, loading && styles.inputDisabled]} placeholder="Full Name" value={name} onChangeText={setName} editable={!loading} />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email *</Text>
            <TextInput style={[styles.input, loading && styles.inputDisabled]} placeholder="Email" keyboardType="email-address" value={email} onChangeText={setEmail} editable={!loading} />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password *</Text>
            <TextInput style={[styles.input, loading && styles.inputDisabled]} placeholder="Password" secureTextEntry value={pass} onChangeText={setPass} editable={!loading} />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirm Password *</Text>
            <TextInput style={[styles.input, loading && styles.inputDisabled]} placeholder="Confirm Password" secureTextEntry value={confirmPass} onChangeText={setConfirmPass} editable={!loading} />
          </View>

          <Text style={styles.sectionTitle}>Medical Information</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Age *</Text>
            <TextInput style={[styles.input, loading && styles.inputDisabled]} placeholder="Age" keyboardType="numeric" value={age} onChangeText={setAge} editable={!loading} />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Gender *</Text>
            <View style={styles.pickerContainer}>
              <Picker selectedValue={gender} onValueChange={setGender} enabled={!loading}>
                <Picker.Item label="Male" value="Male" />
                <Picker.Item label="Female" value="Female" />
                <Picker.Item label="Other" value="Other" />
              </Picker>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Blood Type *</Text>
            <View style={styles.pickerContainer}>
              <Picker selectedValue={bloodType} onValueChange={setBloodType} enabled={!loading}>
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(type => (
                  <Picker.Item key={type} label={type} value={type} />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Special Diagnosis (Optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea, loading && styles.inputDisabled]}
              placeholder="Any medical condition"
              value={specialDiagnosis}
              onChangeText={setSpecialDiagnosis}
              multiline
              numberOfLines={3}
              editable={!loading}
            />
          </View>

          <TouchableOpacity style={styles.checkboxContainer} onPress={() => setAcceptTerms(!acceptTerms)} disabled={loading}>
            <View style={[styles.checkbox, acceptTerms && styles.checkboxChecked]}>
              {acceptTerms && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.checkboxText}>
              I accept the <Text style={styles.link}>Terms of Use</Text> and <Text style={styles.link}>Privacy Policy</Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handleRegister} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? 'Registering...' : 'Register'}</Text>
          </TouchableOpacity>
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
  title: TextStyle;
  subtitle: TextStyle;
  form: ViewStyle;
  sectionTitle: TextStyle;
  inputContainer: ViewStyle;
  label: TextStyle;
  input: TextStyle;
  inputDisabled: TextStyle;
  textArea: TextStyle;
  pickerContainer: ViewStyle;
  checkboxContainer: ViewStyle;
  checkbox: ViewStyle;
  checkboxChecked: ViewStyle;
  checkmark: TextStyle;
  checkboxText: TextStyle;
  link: TextStyle;
  button: ViewStyle;
  buttonDisabled: ViewStyle;
  buttonText: TextStyle;
}

const styles = StyleSheet.create<Styles>({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { flexGrow: 1, padding: 24, paddingTop: 50, paddingBottom: 40 },
  header: { marginBottom: 32 },
  backButton: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: 'gray', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#666' },
  form: { width: '100%' },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 16 },
  inputContainer: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  input: { backgroundColor: '#f5f5f5', borderRadius: 12, padding: 14, fontSize: 16, borderWidth: 1, borderColor: '#e0e0e0' },
  inputDisabled: { opacity: 0.6 },
  textArea: { height: 80, textAlignVertical: 'top', paddingTop: 14 },
  pickerContainer: { backgroundColor: '#f5f5f5', borderRadius: 12, borderWidth: 1, borderColor: '#e0e0e0', overflow: 'hidden' },
  checkboxContainer: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 24, marginTop: 8 },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: '#e0e0e0', marginRight: 12, justifyContent: 'center', alignItems: 'center' },
  checkboxChecked: { backgroundColor: '#13A77C', borderColor: '#13A77C' },
  checkmark: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  checkboxText: { flex: 1, fontSize: 14, lineHeight: 20 },
  link: { color: '#13A77C', fontWeight: '500' },
  button: { backgroundColor: '#13A77C', paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

export default Register;
