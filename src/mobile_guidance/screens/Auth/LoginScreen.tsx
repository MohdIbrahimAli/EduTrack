
// src/mobile_guidance/screens/Auth/LoginScreen.tsx
import type { FC } from 'react';
import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, Image, KeyboardAvoidingView, Platform } from 'react-native';
import AppInput from '../../components/common/Input';
import AppButton from '../../components/common/Button';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import { signInWithEmail, signInWithGoogle, signUpWithEmail, configureGoogleSignIn } from '../../services/authService';
// import { useNavigation } from '@react-navigation/native'; // Placeholder for navigation

// Call Google Sign-In configuration once
// This might be better placed in App.tsx or a central config file on app startup
configureGoogleSignIn();

const LoginScreen: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false); // To toggle between Login and Sign Up

  // const navigation = useNavigation(); // Placeholder

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }
    setIsLoading(true);
    try {
      await signInWithEmail(email, password);
      // Navigation to Dashboard will be handled by onAuthStateChanged listener in App.tsx typically
      // navigation.navigate('Dashboard'); // Placeholder
      Alert.alert('Success', 'Logged in successfully!');
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }
    setIsLoading(true);
    try {
      await signUpWithEmail(email, password);
      // navigation.navigate('Dashboard'); // Placeholder
      Alert.alert('Success', 'Signed up and logged in successfully!');
    } catch (error: any) {
      Alert.alert('Sign Up Failed', error.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
      // navigation.navigate('Dashboard'); // Placeholder
      Alert.alert('Success', 'Logged in with Google successfully!');
    } catch (error: any) {
      Alert.alert('Google Sign-In Failed', error.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Image source={{ uri: 'https://picsum.photos/150/150?random=logo' }} style={styles.logo} data-ai-hint="school logo" />
          <Text style={styles.title}>EduAttend Parent Portal</Text>
          <Text style={styles.subtitle}>{isSignUp ? 'Create an Account' : 'Welcome Back!'}</Text>

          <AppInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            containerStyle={styles.inputSpacing}
          />
          <AppInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry
            containerStyle={styles.inputSpacing}
          />

          {isSignUp ? (
            <AppButton title="Sign Up" onPress={handleSignUp} loading={isLoading} style={styles.button} />
          ) : (
            <AppButton title="Login" onPress={handleLogin} loading={isLoading} style={styles.button} />
          )}

          <AppButton
            title="Sign In with Google"
            onPress={handleGoogleSignIn}
            loading={isLoading}
            variant="outline"
            style={styles.button}
            // leftIcon={<Image source={require('../../assets/images/google_icon.png')} style={styles.googleIcon} />} // Add a Google icon asset
          />
          
          <AppButton
            title={isSignUp ? "Already have an account? Login" : "Don't have an account? Sign Up"}
            onPress={() => setIsSignUp(!isSignUp)}
            variant="ghost"
            style={styles.toggleButton}
          />
          <LoadingIndicator isLoading={isLoading && !isSignUp && !email} overlay message="Logging in..." />
          <LoadingIndicator isLoading={isLoading && isSignUp} overlay message="Signing up..." />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: '#F5F5F5', // Light gray background
  },
  container: {
    padding: 24,
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 15,
    marginBottom: 20,
    backgroundColor: '#E0E0E0' // Placeholder bg for image
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#003366', // Deep Blue
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#0055A4', // Slightly Lighter Blue
    marginBottom: 32,
    textAlign: 'center',
  },
  inputSpacing: {
    marginBottom: 12,
    width: '100%',
  },
  button: {
    marginTop: 16,
    width: '100%',
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  toggleButton: {
    marginTop: 24,
  },
});

export default LoginScreen;
