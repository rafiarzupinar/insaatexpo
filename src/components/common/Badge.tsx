import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
import { colors, borderRadius, spacing, typography } from '../../constants/theme';

interface BadgeProps {
  label: string;
  variant?: 'success' | 'danger' | 'warning' | 'info' | 'neutral';
  size?: 'sm' | 'md';
  icon?: string;
  showArrow?: boolean;
  arrowDirection?: 'up' | 'down';
}

const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'neutral',
  size = 'sm',
  icon,
  showArrow = false,
  arrowDirection = 'up',
}) => {
  const containerStyle: ViewStyle[] = [
    styles.container,
    styles[`container_${variant}`],
    styles[`container_${size}`],
  ];

  const textStyle: TextStyle[] = [
    styles.text,
    styles[`text_${variant}`],
    styles[`text_${size}`],
  ];

  const iconColor = {
    success: colors.success,
    danger: colors.danger,
    warning: colors.warning,
    info: colors.info,
    neutral: colors.gray[500],
  }[variant];

  const arrowIcon = arrowDirection === 'up' ? 'arrow-up' : 'arrow-down';
  const iconSize = size === 'sm' ? 10 : 12;

  return (
    <View style={containerStyle}>
      {showArrow && (
        <Icon name={arrowIcon} size={iconSize} color={iconColor} style={styles.icon} />
      )}
      {icon && !showArrow && (
        <Icon name={icon} size={iconSize} color={iconColor} style={styles.icon} />
      )}
      <Text style={textStyle}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
  },

  // Variants
  container_success: {
    backgroundColor: colors.successLight,
  },
  container_danger: {
    backgroundColor: colors.dangerLight,
  },
  container_warning: {
    backgroundColor: colors.warningLight,
  },
  container_info: {
    backgroundColor: colors.infoLight,
  },
  container_neutral: {
    backgroundColor: colors.gray[100],
  },

  // Sizes
  container_sm: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  container_md: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },

  text: {
    fontWeight: '500',
  },
  text_success: {
    color: colors.success,
  },
  text_danger: {
    color: colors.danger,
  },
  text_warning: {
    color: colors.warning,
  },
  text_info: {
    color: colors.info,
  },
  text_neutral: {
    color: colors.gray[600],
  },
  text_sm: {
    fontSize: typography.fontSize.xs,
  },
  text_md: {
    fontSize: typography.fontSize.sm,
  },

  icon: {
    marginRight: 4,
  },
});

export default Badge;
