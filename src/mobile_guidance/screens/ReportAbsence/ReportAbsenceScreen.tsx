
// src/mobile_guidance/screens/ReportAbsence/ReportAbsenceScreen.tsx
import type { FC } from 'react';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, Platform } from 'react-native';
import AppInput from '../../components/common/Input';
import AppButton from '../../components/common/Button';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import { submitAbsenceReport } from '../../services/firestoreService';
import { getCurrentUser, onAuthStateChanged } from '../../services/authService';
import type { Child, User, AbsenceReportData } from '../../types';
// import { useNavigation } from '@react-navigation/native'; // Placeholder
// For Child Picker, you might use a library like @react-native-picker/picker or a custom modal
// For Date Picker, you might use @react-native-community/datetimepicker
// For Document Picker (attachment): react-native-document-picker (see firebase_storage_setup.md)

// Mock children data for picker - in a real app, fetch this
const MOCK_CHILDREN_FOR_PICKER: Child[] = [
  { id: '1', name: 'Alex Johnson', gradeLevel: 'Grade 5', parentUid: 'testUser123' },
  { id: '2', name: 'Mia Williams', gradeLevel: 'Grade 3', parentUid: 'testUser123' },
];

const ReportAbsenceScreen: FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(getCurrentUser());
  const [selectedChildId, setSelectedChildId] = useState<string>('');
  // const [date, setDate] = useState(new Date()); // For date picker state
  const [dateString, setDateString] = useState(new Date().toISOString().split('T')[0]); // YYYY-MM-DD for input
  const [reason, setReason] = useState('');
  const [additionalDetails, setAdditionalDetails] = useState('');
  // const [attachmentUrl, setAttachmentUrl] = useState<string | null>(null); // For file uploads
  const [isLoading, setIsLoading] = useState(false);
  const [userChildren, setUserChildren] = useState<Child[]>([]); // Children of current user

  // const navigation = useNavigation(); // Placeholder

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(setCurrentUser);
    return unsubscribe;
  }, []);

  useEffect(() => {
    // In a real app, fetch children for the current user here
    // For now, using mock or assuming they are passed / globally available
    if (currentUser) {
      // Replace with actual fetch: getChildrenForParent(currentUser.id, setUserChildren, handleError)
      const filteredChildren = MOCK_CHILDREN_FOR_PICKER.filter(c => c.parentUid === currentUser.id);
      setUserChildren(filteredChildren);
      if (filteredChildren.length > 0 && !selectedChildId) {
        setSelectedChildId(filteredChildren[0].id);
      }
    }
  }, [currentUser, selectedChildId]);

  const handleSubmit = async () => {
    if (!currentUser) {
      Alert.alert('Error', 'You must be logged in to report an absence.');
      return;
    }
    if (!selectedChildId) {
      Alert.alert('Error', 'Please select a child.');
      return;
    }
    if (!dateString) {
      Alert.alert('Error', 'Please select a date.');
      return;
    }
    if (!reason.trim()) {
      Alert.alert('Error', 'Please provide a reason for absence.');
      return;
    }

    const selectedChild = userChildren.find(c => c.id === selectedChildId);
    if (!selectedChild) {
      Alert.alert('Error', 'Selected child not found.');
      return;
    }

    const reportData: Omit<AbsenceReportData, 'submittedAt' | 'parentUid' | 'status'> = {
      childId: selectedChildId,
      childName: selectedChild.name,
      date: dateString, // Ensure this is YYYY-MM-DD
      reason: reason.trim(),
      additionalDetails: additionalDetails.trim() || undefined,
      // attachmentUrl: attachmentUrl || undefined,
    };

    setIsLoading(true);
    try {
      await submitAbsenceReport(reportData);
      Alert.alert('Success', 'Absence report submitted successfully.');
      // navigation.goBack(); // Placeholder: Go back or to a confirmation screen
      // Reset form
      setReason('');
      setAdditionalDetails('');
      // setAttachmentUrl(null);
      setDateString(new Date().toISOString().split('T')[0]);

    } catch (error: any) {
      Alert.alert('Submission Failed', error.message || 'Could not submit the report.');
    } finally {
      setIsLoading(false);
    }
  };

  // Placeholder for child selection UI (e.g., Picker)
  const renderChildPicker = () => (
    <View style={styles.pickerContainer}>
      <Text style={styles.label}>Child</Text>
      {/* Replace with actual Picker component */}
      {userChildren.length > 0 ? (
        <AppInput
            value={userChildren.find(c => c.id === selectedChildId)?.name || "Select Child"}
            editable={false} // Or use a proper Picker
            placeholder="Select Child (Use Picker Component)"
         />
        // <Picker selectedValue={selectedChildId} onValueChange={(itemValue) => setSelectedChildId(itemValue)}>
        //   {userChildren.map(child => <Picker.Item key={child.id} label={child.name} value={child.id} />)}
        // </Picker>
      ) : (
        <Text>No children available. Add children in your profile.</Text>
      )}
    </View>
  );
  
  // Placeholder for Date Picker UI
  // const showDatePicker = () => { /* Logic to show native date picker */ };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Report Absence</Text>

        {renderChildPicker()}

        <AppInput
          label="Date of Absence (YYYY-MM-DD)"
          value={dateString}
          onChangeText={setDateString} // Ideally use a DatePicker component
          placeholder="YYYY-MM-DD"
          // onFocus={showDatePicker} // To trigger date picker
          keyboardType={Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'default'}
          containerStyle={styles.inputSpacing}
        />
        {/* Add a proper DatePicker component here for better UX */}

        <AppInput
          label="Reason for Absence"
          value={reason}
          onChangeText={setReason}
          placeholder="e.g., Illness, Doctor's appointment"
          multiline
          numberOfLines={3}
          containerStyle={styles.inputSpacing}
          inputStyle={styles.textArea}
        />
        <AppInput
          label="Additional Details (Optional)"
          value={additionalDetails}
          onChangeText={setAdditionalDetails}
          placeholder="Any other important information..."
          multiline
          numberOfLines={4}
          containerStyle={styles.inputSpacing}
          inputStyle={styles.textArea}
        />

        {/* Placeholder for attachment upload button
        <AppButton
          title={attachmentUrl ? "Attachment Added" : "Add Attachment (Optional)"}
          onPress={() => { /* Open document picker */ /*}}
          variant="outline"
          style={styles.button}
        />
        {attachmentUrl && <Text style={styles.attachmentInfo}>File ready to upload.</Text>}
        */}

        <AppButton
          title="Submit Report"
          onPress={handleSubmit}
          loading={isLoading}
          style={styles.button}
        />
        <LoadingIndicator isLoading={isLoading} overlay message="Submitting report..." />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#F8F9FA',
  },
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#003366', // Deep Blue
    marginBottom: 24,
    textAlign: 'center',
  },
  pickerContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#003366',
    marginBottom: 6,
    fontWeight: '500',
  },
  inputSpacing: {
    marginBottom: 16,
  },
  textArea: {
    height: Platform.OS === 'ios' ? 80 : undefined, // iOS needs explicit height for multiline
    textAlignVertical: 'top', // Android
  },
  button: {
    marginTop: 20,
  },
  attachmentInfo: {
    fontSize: 12,
    color: 'green',
    textAlign: 'center',
    marginTop: 5,
  },
});

export default ReportAbsenceScreen;
