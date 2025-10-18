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
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

const OptionsRegister = () => {
  const router = useRouter();

  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [bloodType, setBloodType] = useState('');
  const [diagnoses, setDiagnoses] = useState('');
  const [prescriptions, setPrescriptions] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    if (!gender || !age || !bloodType) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    const data = {
      gender,
      age,
      bloodType,
      specialDiagnoses: diagnoses.split(',').map(item => item.trim()).filter(Boolean),
      prescriptions: prescriptions.split(',').map(item => item.trim()).filter(Boolean),
    };

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      console.log('Saved:', data);
      Alert.alert('Success', 'Your information has been saved!', [
        { text: 'OK', onPress: () => router.push('/home') },
      ]);
    }, 800);
  };

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
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <BlurView
              intensity={20}
              tint={'light'}
              experimentalBlurMethod="dimezisBlurView"
              style={StyleSheet.absoluteFillObject}
            />
            <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
              <Path
                d="M15 18l-6-6 6-6"
                stroke={'#000'}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </TouchableOpacity>
          <Text style={styles.title}>Medical Info</Text>
          <Text style={styles.subtitle}>Complete your medical details</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Gender Picker */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Gender</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={gender}
                onValueChange={(value) => setGender(value)}
                style={styles.picker}
              >
                <Picker.Item label="Select gender..." value="" />
                <Picker.Item label="Male" value="male" />
                <Picker.Item label="Female" value="female" />
                <Picker.Item label="Other" value="other" />
              </Picker>
            </View>
          </View>

          {/* Age Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Age</Text>
            <TextInput
              style={styles.input}
              placeholder="Your age"
              placeholderTextColor="#999"
              keyboardType="numeric"
              value={age}
              onChangeText={setAge}
            />
          </View>

          {/* Blood Type Picker */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Blood Type</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={bloodType}
                onValueChange={(value) => setBloodType(value)}
                style={styles.picker}
              >
                <Picker.Item label="Select blood type..." value="" />
                <Picker.Item label="A+" value="A+" />
                <Picker.Item label="A-" value="A-" />
                <Picker.Item label="B+" value="B+" />
                <Picker.Item label="B-" value="B-" />
                <Picker.Item label="AB+" value="AB+" />
                <Picker.Item label="AB-" value="AB-" />
                <Picker.Item label="O+" value="O+" />
                <Picker.Item label="O-" value="O-" />
              </Picker>
            </View>
          </View>

          {/* Diagnoses */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Special Diagnoses (optional)</Text>
            <TextInput
              style={[styles.input, { height: 80 }]}
              placeholder="e.g. Diabetes, Asthma"
              placeholderTextColor="#999"
              multiline
              value={diagnoses}
              onChangeText={setDiagnoses}
            />
            <Text style={styles.hint}>Separate multiple with commas</Text>
          </View>

          {/* Prescriptions */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Prescriptions (optional)</Text>
            <TextInput
              style={[styles.input, { height: 80 }]}
              placeholder="e.g. Metformin, Ventolin"
              placeholderTextColor="#999"
              multiline
              value={prescriptions}
              onChangeText={setPrescriptions}
            />
            <Text style={styles.hint}>Separate multiple with commas</Text>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Saving...' : 'Save Information'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 32,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderColor: 'gray',
    borderWidth: 1,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  pickerWrapper: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    overflow: 'hidden',
  },
  picker: {
    color: '#1a1a1a',
  },
  hint: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  button: {
    backgroundColor: '#13A77C',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OptionsRegister;
