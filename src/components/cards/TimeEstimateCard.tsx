import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
import { Card } from '../common';
import { ProgressBar } from '../charts';
import { colors, spacing, typography } from '../../constants/theme';

interface TimeEstimateCardProps {
  duration: string;
  progress: number;
  startDate: string;
  endDate: string;
  currentDate?: string;
  onPress?: () => void;
}

const TimeEstimateCard: React.FC<TimeEstimateCardProps> = ({
  duration,
  progress,
  startDate,
  endDate,
  currentDate,
  onPress,
}) => {
  return (
    <Card onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Time Estimate</Text>
          <Icon name="info" size={14} color={colors.gray[400]} />
        </View>
        <Icon name="more-horizontal" size={20} color={colors.gray[400]} />
      </View>

      <Text style={styles.duration}>{duration}</Text>

      <ProgressBar
        progress={progress}
        height={48}
        showMarker
        markerLabel="Today"
        markerDate={currentDate}
        startDate={startDate}
        endDate={endDate}
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  duration: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: '700',
    color: colors.gray[900],
    marginVertical: spacing.lg,
  },
});

export default TimeEstimateCard;
