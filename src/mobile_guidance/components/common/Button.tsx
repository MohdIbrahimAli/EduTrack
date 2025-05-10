
// src/mobile_guidance/components/common/Button.tsx
import type { FC, ReactNode } from 'react';
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';

interface ButtonProps {
  title?: string;
  onPress: () => void;
  children?: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

// Define your app's theme colors here or import from a theme file
const themeColors = {
  primary: '#003366', // Deep Blue
  primaryText: '#FFFFFF',
  secondary: '#E0E0E0', // Light Gray
  secondaryText: '#003366',
  outlineBorder: '#003366',
  outlineText: '#003366',
  ghostText: '#003366',
  destructive: '#D32F2F', // Example destructive color
  destructiveText: '#FFFFFF',
  disabledBackground: '#BDBDBD',
  disabledText: '#757575',
  accent: '#008080', // Teal for interactive elements
};

const AppButton: FC<ButtonProps> = ({
  title,
  onPress,
  children,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  style,
  textStyle,
  leftIcon,
  rightIcon,
}) => {
  const isDisabled = disabled || loading;

  const getButtonStyles = (): ViewStyle[] => {
    const base = styles.buttonBase;
    const sizeStyle = styles[size];
    const variantStyle = styles[variant];
    if (isDisabled) return [base, sizeStyle, styles.disabledButton, style];
    return [base, sizeStyle, variantStyle, style];
  };

  const getTextStyles = (): TextStyle[] => {
    const base = styles.textBase;
    let variantTextStyleKey: keyof typeof styles = 'primaryText';
    switch (variant) {
      case 'secondary':
        variantTextStyleKey = 'secondaryText';
        break;
      case 'outline':
        variantTextStyleKey = 'outlineText';
        break;
      case 'ghost':
        variantTextStyleKey = 'ghostText';
        break;
      case 'destructive':
        variantTextStyleKey = 'destructiveText';
        break;
      default: // primary
        variantTextStyleKey = 'primaryText';
    }
    if (isDisabled) return [base, styles.disabledText, textStyle];
    return [base, styles[variantTextStyleKey], textStyle];
  };

  return (
    <TouchableOpacity
      style={getButtonStyles()}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' || variant === 'destructive' ? themeColors.primaryText : themeColors.primary} size="small" />
      ) : (
        <>
          {leftIcon}
          {children || (title && <Text style={getTextStyles()}>{title}</Text>)}
          {rightIcon}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonBase: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  textBase: {
    fontWeight: '600',
    textAlign: 'center',
  },
  // Sizes
  small: {
    height: 36,
    paddingHorizontal: 12,
  },
  medium: {
    height: 48,
  },
  large: {
    height: 56,
    paddingHorizontal: 24,
  },
  // Variants - Button Backgrounds
  primary: {
    backgroundColor: themeColors.primary,
  },
  secondary: {
    backgroundColor: themeColors.secondary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: themeColors.outlineBorder,
  },
  ghost: {
    backgroundColor: 'transparent',
    elevation: 0, // No shadow for ghost
    shadowOpacity: 0,
  },
  destructive: {
    backgroundColor: themeColors.destructive,
  },
  // Variants - Text Colors
  primaryText: {
    color: themeColors.primaryText,
  },
  secondaryText: {
    color: themeColors.secondaryText,
  },
  outlineText: {
    color: themeColors.outlineText,
  },
  ghostText: {
    color: themeColors.ghostText,
  },
  destructiveText: {
    color: themeColors.destructiveText,
  },
  // Disabled state
  disabledButton: {
    backgroundColor: themeColors.disabledBackground,
    elevation: 0,
    shadowOpacity: 0,
  },
  disabledText: {
    color: themeColors.disabledText,
  },
});

export default AppButton;
