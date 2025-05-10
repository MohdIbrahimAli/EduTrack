
// src/mobile_guidance/components/ChildListItem.tsx
import type { FC } from 'react';
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import type { Child } from '../types';

interface ChildListItemProps {
  child: Child;
  onPress: () => void;
}

// Define theme colors or import from a theme file
const themeColors = {
  cardBackground: '#FFFFFF',
  textPrimary: '#003366', // Deep Blue
  textSecondary: '#546E7A', // Muted Blue/Gray
  statusPresent: '#4CAF50', // Green
  statusAbsent: '#F44336', // Red
  statusLate: '#FFC107', // Amber
  avatarBorder: '#003366', // Deep Blue
  shadow: '#000',
};

const ChildListItem: FC<ChildListItemProps> = ({ child, onPress }) => {
  const getStatusStyle = () => {
    switch (child.currentAttendanceStatus) {
      case 'Present':
        return { color: themeColors.statusPresent, fontWeight: 'bold' as 'bold' };
      case 'Absent':
        return { color: themeColors.statusAbsent, fontWeight: 'bold' as 'bold' };
      case 'Late':
        return { color: themeColors.statusLate, fontWeight: 'bold' as 'bold' };
      default:
        return { color: themeColors.textSecondary };
    }
  };

  return (
    <TouchableOpacity onPress={onPress} style={styles.card} activeOpacity={0.7}>
      <Image
        source={{ uri: child.avatarUrl || `https://picsum.photos/100/100?random=${child.id}` }}
        style={styles.avatar}
        // accessibilityLabel={`${child.name}'s avatar`} // Good for RN accessibility
      />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{child.name}</Text>
        <Text style={styles.grade}>{child.gradeLevel || 'N/A'}</Text>
        <View style={styles.statusContainer}>
          <Text style={styles.statusLabel}>Status: </Text>
          <Text style={[styles.status, getStatusStyle()]}>
            {child.currentAttendanceStatus || 'Unknown'}
          </Text>
        </View>
        {child.absenceCountThisMonth !== undefined && (
          <Text style={styles.absences}>
            Absences this month: {child.absenceCountThisMonth}
          </Text>
        )}
      </View>
      {/* Simple arrow or chevron can be added here for visual cue */}
      <Text style={styles.arrow}>〉</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: themeColors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: themeColors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: themeColors.avatarBorder,
    marginRight: 16,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: themeColors.textPrimary,
    marginBottom: 2,
  },
  grade: {
    fontSize: 14,
    color: themeColors.textSecondary,
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: 14,
    color: themeColors.textSecondary,
  },
  status: {
    fontSize: 14,
  },
  absences: {
    fontSize: 13,
    color: themeColors.textSecondary,
    marginTop: 4,
  },
  arrow: {
    fontSize: 20,
    color: themeColors.textSecondary,
    marginLeft: 8,
  }
});

export default ChildListItem;
