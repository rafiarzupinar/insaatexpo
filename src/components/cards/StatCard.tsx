import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
import { Card, IconBox, Badge } from '../common';
import { CircularProgress } from '../charts';
import { colors, spacing, typography } from '../../constants/theme';

interface StatCardProps {
  title: string;
  value: string;
  icon: string;
  iconVariant?: 'orange' | 'red' | 'green' | 'blue';
  progress: number;
  progressColor?: string;
  changeValue?: string;
  changeType?: 'up' | 'down';
  onPress?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  iconVariant = 'orange',
  progress,
  progressColor,
  changeValue,
  changeType = 'up',
  onPress,
}) => {
  const getProgressColor = () => {
    if (progressColor) return progressColor;
    switch (iconVariant) {
      case 'red':
        return colors.chart.pink;
      case 'green':
        return colors.chart.green;
      case 'blue':
        return colors.chart.blue;
      default:
        return colors.chart.blue;
    }
  };

  return (
    <Card onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <IconBox icon={icon} variant={iconVariant} size="sm" />
          <Text style={styles.title}>{title}</Text>
        </View>
        <Icon name="arrow-up-right" size={16} color={colors.gray[400]} />
      </View>

      <View style={styles.content}>
        <View style={styles.valueSection}>
          <Text style={styles.value}>{value}</Text>
          {changeValue && (
            <Badge
              label={changeValue}
              variant={changeType === 'up' ? 'success' : 'danger'}
              showArrow
              arrowDirection={changeType}
            />
          )}
        </View>

        <CircularProgress
          progress={progress}
          size={64}
          strokeWidth={6}
          color={getProgressColor()}
        />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    fontSize: typography.fontSize.base,
    fontWeight: '500',
    color: colors.gray[500],
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  valueSection: {
    flex: 1,
  },
  value: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: '700',
    color: colors.gray[900],
    marginBottom: spacing.sm,
  },
});

export default StatCard;
