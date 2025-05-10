
// src/mobile_guidance/screens/Dashboard/DashboardScreen.tsx
import type { FC } from 'react';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, TouchableOpacity } from 'react-native';
import AppButton from '../../components/common/Button';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import ChildListItem from '../../components/ChildListItem'; // Assuming this component exists
import { getChildrenForParent } from '../../services/firestoreService';
import { signOut, getCurrentUser } from '../../services/authService';
import type { Child, User } from '../../types';
// import { useNavigation } from '@react-navigation/native'; // Placeholder

const DashboardScreen: FC = () => {
  const [children, setChildren] = useState<Child[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const currentUser = getCurrentUser(); // Get the currently authenticated user

  // const navigation = useNavigation(); // Placeholder

  useEffect(() => {
    if (!currentUser) {
      // This case should ideally be handled by a global auth state listener navigating to Login
      Alert.alert("Error", "No user logged in.");
      setIsLoading(false);
      // navigation.navigate('Login'); // Placeholder
      return;
    }

    setIsLoading(true);
    const unsubscribe = getChildrenForParent(
      currentUser.id,
      (fetchedChildren) => {
        setChildren(fetchedChildren);
        setError(null);
        setIsLoading(false);
      },
      (fetchError) => {
        console.error("Failed to fetch children:", fetchError);
        setError("Failed to load children's data. Please try again.");
        setIsLoading(false);
      }
    );

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, [currentUser]);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut();
      // Navigation to Login will be handled by onAuthStateChanged listener in App.tsx typically
      // navigation.navigate('Login'); // Placeholder
    } catch (e: any) {
      Alert.alert('Logout Failed', e.message || 'Could not log out.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigateToChildDetail = (childId: string) => {
    // navigation.navigate('AttendanceDetail', { childId }); // Placeholder
    Alert.alert("Navigate", `Go to details for child ID: ${childId}`);
  };

  const handleNavigateToReportAbsence = () => {
    // navigation.navigate('ReportAbsence'); // Placeholder
    Alert.alert("Navigate", `Go to Report Absence page`);
  };

  if (isLoading && children.length === 0) { // Show full screen loader only on initial load
    return <LoadingIndicator isLoading={true} message="Loading dashboard..." overlay />;
  }

  if (error && children.length === 0) {
    return (
      <View style={styles.centeredMessageContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <AppButton title="Retry" onPress={() => { /* Trigger re-fetch, maybe by re-setting user */ }} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Children</Text>
        <AppButton title="Logout" onPress={handleSignOut} variant="ghost" size="small" />
      </View>

      {children.length === 0 && !isLoading ? (
        <View style={styles.centeredMessageContainer}>
          <Text style={styles.noChildrenText}>No children found for your account.</Text>
          {/* Optionally, add a button to add a child if that's a feature */}
        </View>
      ) : (
        <FlatList
          data={children}
          renderItem={({ item }) => (
            <ChildListItem
              child={item}
              onPress={() => handleNavigateToChildDetail(item.id)}
            />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}
      
      <View style={styles.quickActionsContainer}>
        <AppButton
          title="Report an Absence"
          onPress={handleNavigateToReportAbsence}
          style={styles.quickActionButton}
          variant="primary" // Use primary for main action
        />
         {/* Add other quick action buttons like "View Notifications", "Messages" */}
      </View>
       <LoadingIndicator isLoading={isLoading} message="Updating..." />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA', // A very light gray
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 20, // Adjust for status bar
    paddingBottom: 15,
    backgroundColor: '#FFFFFF', // White header
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0', // Light border
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#003366', // Deep Blue
  },
  listContent: {
    padding: 16,
  },
  centeredMessageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#D32F2F',
    textAlign: 'center',
    marginBottom: 10,
  },
  noChildrenText: {
    fontSize: 16,
    color: '#757575', // Medium gray
    textAlign: 'center',
  },
  quickActionsContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  quickActionButton: {
    // Specific styling for quick action button if needed, e.g. margin
  },
});

export default DashboardScreen;
