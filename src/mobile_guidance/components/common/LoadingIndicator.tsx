
// src/mobile_guidance/components/common/LoadingIndicator.tsx
import type { FC } from 'react';
import React from 'react';
import { View, ActivityIndicator, StyleSheet, Modal, Text, ViewStyle } from 'react-native';

interface LoadingIndicatorProps {
  isLoading: boolean;
  size?: 'small' | 'large';
  color?: string;
  message?: string;
  overlay?: boolean; // If true, displays as a modal overlay
  style?: ViewStyle;
}

const themeColors = {
  primary: '#003366', // Deep Blue
  text: '#FFFFFF',
  overlayBackground: 'rgba(0, 0, 0, 0.5)',
};

const LoadingIndicator: FC<LoadingIndicatorProps> = ({
  isLoading,
  size = 'large',
  color = themeColors.primary,
  message,
  overlay = false,
  style,
}) => {
  if (!isLoading) {
    return null;
  }

  const indicatorContent = (
    <View style={[styles.container, style, overlay && styles.overlayContainer]}>
      <ActivityIndicator size={size} color={color} />
      {message && <Text style={[styles.messageText, { color: overlay ? themeColors.text : color }]}>{message}</Text>}
    </View>
  );

  if (overlay) {
    return (
      <Modal
        transparent={true}
        animationType="none"
        visible={isLoading}
        onRequestClose={() => {}} // Required for Android
      >
        <View style={styles.modalBackground}>
          {indicatorContent}
        </View>
      </Modal>
    );
  }

  return indicatorContent;
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  overlayContainer: {
    backgroundColor: themeColors.primary, // Or a semi-transparent card background
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: themeColors.overlayBackground,
  },
  messageText: {
    marginTop: 10,
    fontSize: 16,
  },
});

export default LoadingIndicator;
