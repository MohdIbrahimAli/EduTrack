
// src/mobile_guidance/components/common/Input.tsx
import type { FC } from 'react';
import React from 'react';
import { View, TextInput, Text, StyleSheet, ViewStyle, TextStyle, TextInputProps } from 'react-native';

interface AppInputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  errorStyle?: TextStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

// Define your app's theme colors here or import from a theme file
const themeColors = {
  text: '#212121',
  placeholder: '#9E9E9E',
  border: '#BDBDBD', // Light gray for border
  focusedBorder: '#003366', // Deep blue for focused border
  error: '#D32F2F',
  background: '#FFFFFF',
  label: '#003366', // Deep blue for label
};

const AppInput: FC<AppInputProps> = ({
  label,
  error,
  containerStyle,
  inputStyle,
  labelStyle,
  errorStyle,
  leftIcon,
  rightIcon,
  ...rest
}) => {
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
      <View
        style={[
          styles.inputContainer,
          { borderColor: error ? themeColors.error : isFocused ? themeColors.focusedBorder : themeColors.border },
          error ? styles.inputContainerError : {},
        ]}
      >
        {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}
        <TextInput
          style={[styles.input, inputStyle]}
          placeholderTextColor={themeColors.placeholder}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...rest}
        />
        {rightIcon && <View style={styles.iconContainer}>{rightIcon}</View>}
      </View>
      {error && <Text style={[styles.errorText, errorStyle]}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: themeColors.label,
    marginBottom: 6,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: themeColors.background,
    borderWidth: 1,
    borderRadius: 8,
    height: 48,
    paddingHorizontal: 12,
  },
  inputContainerError: {
    borderColor: themeColors.error,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: themeColors.text,
    height: '100%', // Ensure TextInput takes full height of container
  },
  iconContainer: {
    marginHorizontal: 8,
  },
  errorText: {
    fontSize: 12,
    color: themeColors.error,
    marginTop: 4,
  },
});

export default AppInput;
