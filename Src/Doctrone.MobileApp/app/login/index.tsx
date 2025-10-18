import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Index = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Logo Container */}
        <View style={styles.logoContainer}>
          <Text style={styles.companyName}>DOCTRONE</Text>
        </View>

        {/* Welcome Text */}
        <View style={styles.textContainer}>
          <Text style={styles.welcomeText}>Your AI Health Assistant</Text>
          <Text style={styles.subText}>
            Get instant medical insights.{"\n"}
            Ask questions. Stay informed.
          </Text>
        </View>

        {/* Login Button */}
        <TouchableOpacity
          onPress={() => router.push('/login/login')}
          activeOpacity={0.8}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 60,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  companyName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    letterSpacing: 0.5,
  },
  textContainer: {
    alignItems: 'center',
    gap: 12,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1a1a1a',
  },
  subText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#13A77C',
    paddingVertical: 20,
    paddingHorizontal: 100,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default Index;