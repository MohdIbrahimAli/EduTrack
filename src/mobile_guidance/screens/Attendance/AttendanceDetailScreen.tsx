
// src/mobile_guidance/screens/Attendance/AttendanceDetailScreen.tsx
import type { FC } from 'react';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, ActivityIndicator } from 'react-native';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import { getAttendanceRecordsForChild } from '../../services/firestoreService';
import type { AttendanceRecord, Child } from '../../types';
// import { useRoute, useNavigation } from '@react-navigation/native'; // Placeholder for navigation

// Mock data for child details if not passed fully or fetched separately
const MOCK_CHILDREN_DETAILS: Record<string, Partial<Child>> = {
  '1': { name: 'Alex Johnson', gradeLevel: 'Grade 5' },
  '2': { name: 'Mia Williams', gradeLevel: 'Grade 3' },
  '3': { name: 'Ethan Brown', gradeLevel: 'Grade 7' },
};

interface AttendanceDetailScreenProps {
  // Props would typically come from React Navigation route params
  route?: { params: { childId: string; childName?: string; childGrade?: string } };
}

const AttendanceDetailScreen: FC<AttendanceDetailScreenProps> = ({ route }) => {
  // const route = useRoute(); // Placeholder for actual navigation
  // const navigation = useNavigation(); // Placeholder

  // Simulate route params for example
  const childId = route?.params?.childId || '1'; // Default to child '1' for example
  const initialChildName = route?.params?.childName || MOCK_CHILDREN_DETAILS[childId]?.name || 'Child';
  const initialChildGrade = route?.params?.childGrade || MOCK_CHILDREN_DETAILS[childId]?.gradeLevel;


  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // navigation.setOptions({ title: `Attendance for ${initialChildName}` }); // Placeholder for setting header title
    setIsLoading(true);
    const unsubscribe = getAttendanceRecordsForChild(
      childId,
      (fetchedRecords) => {
        setRecords(fetchedRecords);
        setError(null);
        setIsLoading(false);
      },
      (fetchError) => {
        console.error("Failed to fetch attendance records:", fetchError);
        setError("Failed to load attendance data. Please try again.");
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [childId, initialChildName]);

  const renderRecordItem = ({ item }: { item: AttendanceRecord }) => (
    <View style={styles.recordItem}>
      <View style={styles.dateContainer}>
        <Text style={styles.dateText}>{item.date}</Text>
      </View>
      <View style={styles.statusInfoContainer}>
        <Text style={[styles.statusText, getStatusStyle(item.status)]}>
          {item.status}
        </Text>
        {item.notes && <Text style={styles.notesText}>{item.notes}</Text>}
      </View>
    </View>
  );

  const getStatusStyle = (status: AttendanceRecord['status']) => {
    switch (status) {
      case 'Present': return { color: '#4CAF50', fontWeight: 'bold' as 'bold' };
      case 'Absent': return { color: '#F44336', fontWeight: 'bold' as 'bold' };
      case 'Late': return { color: '#FFC107', fontWeight: 'bold' as 'bold' };
      case 'Excused': return { color: '#00BCD4', fontWeight: 'bold' as 'bold' };
      default: return { color: '#757575' };
    }
  };

  if (isLoading) {
    return <LoadingIndicator isLoading={true} message={`Loading attendance for ${initialChildName}...`} overlay />;
  }

  if (error) {
    return (
      <View style={styles.centeredMessageContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.childHeader}>
        <Text style={styles.childName}>{initialChildName}</Text>
        {initialChildGrade && <Text style={styles.childGrade}>{initialChildGrade}</Text>}
      </View>
      
      {/* Add Tabs here for Daily, Calendar, Monthly views if implementing fully */}
      {/* For this example, a simple list (Daily Log) */}

      {records.length === 0 ? (
        <View style={styles.centeredMessageContainer}>
          <Text style={styles.noRecordsText}>No attendance records found for this child.</Text>
        </View>
      ) : (
        <FlatList
          data={records}
          renderItem={renderRecordItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  childHeader: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    alignItems: 'center',
  },
  childName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#003366', // Deep Blue
  },
  childGrade: {
    fontSize: 16,
    color: '#546E7A', // Muted Blue/Gray
    marginTop: 4,
  },
  listContent: {
    padding: 16,
  },
  recordItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  dateContainer: {
    marginRight: 16,
    paddingRight: 16,
    borderRightWidth: 1,
    borderRightColor: '#E0E0E0',
    alignItems: 'center',
    minWidth: 90, // Ensure consistent width for date
  },
  dateText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#003366', // Deep Blue
  },
  statusInfoContainer: {
    flex: 1,
  },
  statusText: {
    fontSize: 16,
    marginBottom: 4,
  },
  notesText: {
    fontSize: 13,
    color: '#757575', // Medium gray
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
  },
  noRecordsText: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
  },
});

export default AttendanceDetailScreen;
