import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
import { colors, borderRadius, spacing } from '../../constants/theme';

interface IconBoxProps {
  icon: string;
  variant?: 'orange' | 'red' | 'green' | 'blue' | 'purple' | 'gray';
  size?: 'sm' | 'md' | 'lg';
  iconSize?: number;
}

const IconBox: React.FC<IconBoxProps> = ({
  icon,
  variant = 'orange',
  size = 'md',
  iconSize,
}) => {
  const containerStyle: ViewStyle[] = [
    styles.container,
    styles[`container_${variant}`],
    styles[`size_${size}`],
  ];

  const iconColors = {
    orange: colors.primary,
    red: colors.danger,
    green: colors.success,
    blue: colors.info,
    purple: '#8B5CF6',
    gray: colors.gray[500],
  };

  const defaultIconSizes = {
    sm: 14,
    md: 16,
    lg: 20,
  };

  return (
    <View style={containerStyle}>
      <Icon
        name={icon}
        size={iconSize || defaultIconSizes[size]}
        color={iconColors[variant]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
  },

  // Variants
  container_orange: {
    backgroundColor: colors.orange[50],
  },
  container_red: {
    backgroundColor: colors.dangerLight,
  },
  container_green: {
    backgroundColor: colors.successLight,
  },
  container_blue: {
    backgroundColor: colors.infoLight,
  },
  container_purple: {
    backgroundColor: '#F3E8FF',
  },
  container_gray: {
    backgroundColor: colors.gray[100],
  },

  // Sizes
  size_sm: {
    width: 24,
    height: 24,
  },
  size_md: {
    width: 32,
    height: 32,
  },
  size_lg: {
    width: 40,
    height: 40,
  },
});

export default IconBox;
