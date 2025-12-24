import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography, borderRadius } from '../../constants/theme';

interface ProgressBarProps {
  progress: number; // 0-100
  height?: number;
  showMarker?: boolean;
  markerLabel?: string;
  markerDate?: string;
  startDate?: string;
  endDate?: string;
  striped?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 48,
  showMarker = true,
  markerLabel = 'Today',
  markerDate,
  startDate,
  endDate,
  striped = true,
}) => {
  const progressValue = Math.min(Math.max(progress, 0), 100);

  return (
    <View style={styles.container}>
      {/* Progress Bar */}
      <View style={[styles.track, { height }]}>
        <View
          style={[
            styles.progress,
            striped && styles.striped,
            { width: `${progressValue}%` },
          ]}
        />
        <View style={[styles.remaining, { width: `${100 - progressValue}%` }]} />

        {/* Marker */}
        {showMarker && (
          <View style={[styles.marker, { left: `${progressValue}%` }]}>
            <View style={styles.markerLine} />
            <View style={styles.markerLabel}>
              <Text style={styles.markerLabelText}>{markerLabel}</Text>
              {markerDate && (
                <Text style={styles.markerDateText}>{markerDate}</Text>
              )}
            </View>
          </View>
        )}
      </View>

      {/* Date Labels */}
      {(startDate || endDate) && (
        <View style={styles.dateLabels}>
          <View>
            <Text style={styles.dateLabel}>Start date</Text>
            <Text style={styles.dateValue}>{startDate}</Text>
          </View>
          <View style={styles.endDateContainer}>
            <Text style={styles.dateLabel}>End date</Text>
            <Text style={styles.dateValue}>{endDate}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  track: {
    flexDirection: 'row',
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    position: 'relative',
  },
  progress: {
    backgroundColor: colors.primary,
  },
  striped: {
    // Striped effect is simulated with gradient-like appearance
    opacity: 0.9,
  },
  remaining: {
    backgroundColor: colors.gray[50],
    opacity: 0.5,
  },
  marker: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    zIndex: 10,
  },
  markerLine: {
    width: 2,
    height: '100%',
    backgroundColor: colors.primary,
  },
  markerLabel: {
    position: 'absolute',
    top: -4,
    left: 8,
  },
  markerLabelText: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[400],
  },
  markerDateText: {
    fontSize: typography.fontSize.xs,
    fontWeight: '700',
    color: colors.primary,
    marginTop: 2,
  },
  dateLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  endDateContainer: {
    alignItems: 'flex-end',
  },
  dateLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[400],
  },
  dateValue: {
    fontSize: typography.fontSize.base,
    fontWeight: '500',
    color: colors.gray[800],
    marginTop: 2,
  },
});

export default ProgressBar;
