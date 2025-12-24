import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { colors, borderRadius, shadows, spacing } from '../../constants/theme';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  variant?: 'default' | 'small' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  variant = 'default',
  padding = 'lg',
}) => {
  const cardStyle = [
    styles.base,
    variant === 'small' && styles.small,
    variant === 'elevated' && styles.elevated,
    padding === 'none' && styles.paddingNone,
    padding === 'sm' && styles.paddingSm,
    padding === 'md' && styles.paddingMd,
    padding === 'lg' && styles.paddingLg,
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        style={cardStyle}
        onPress={onPress}
        activeOpacity={0.7}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.white,
    borderRadius: borderRadius['3xl'],
    ...shadows.lg,
  },
  small: {
    borderRadius: borderRadius['2xl'],
    ...shadows.md,
  },
  elevated: {
    ...shadows.xl,
  },
  paddingNone: {
    padding: 0,
  },
  paddingSm: {
    padding: spacing.md,
  },
  paddingMd: {
    padding: spacing.base,
  },
  paddingLg: {
    padding: spacing.lg,
  },
});

export default Card;
