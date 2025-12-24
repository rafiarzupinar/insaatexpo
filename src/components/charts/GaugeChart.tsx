import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../../constants/theme';

interface GaugeChartProps {
  value: number; // 0-100
  size?: number;
  label?: string;
  segments?: number;
}

const GaugeChart: React.FC<GaugeChartProps> = ({
  value,
  size = 240,
  label = 'Average',
  segments = 11,
}) => {
  const segmentData = [];
  const activeSegments = Math.round((value / 100) * segments);

  for (let i = 0; i < segments; i++) {
    const angle = -80 + (i * 160) / (segments - 1);
    const isActive = i < activeSegments;
    const intensity = isActive ? 1 - (i / segments) * 0.5 : 0;

    segmentData.push({
      angle,
      isActive,
      intensity,
      height: 16 + Math.sin((i / (segments - 1)) * Math.PI) * 40,
    });
  }

  return (
    <View style={[styles.container, { width: size }]}>
      <View style={styles.gaugeContainer}>
        <View style={styles.segmentsContainer}>
          {segmentData.map((segment, index) => (
            <View
              key={index}
              style={[
                styles.segment,
                {
                  height: segment.height,
                  backgroundColor: segment.isActive
                    ? `rgba(255, 127, 80, ${0.3 + segment.intensity * 0.7})`
                    : colors.gray[200],
                  transform: [
                    { rotate: `${segment.angle}deg` },
                    { translateY: 20 },
                  ],
                },
              ]}
            />
          ))}
        </View>
      </View>

      <View style={styles.valueContainer}>
        <Text style={styles.value}>{value.toFixed(1)} %</Text>
        <Text style={styles.label}>{label}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  gaugeContainer: {
    width: '100%',
    aspectRatio: 2,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  segmentsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
    gap: 4,
  },
  segment: {
    width: 12,
    borderRadius: 6,
    transformOrigin: 'bottom center',
  },
  valueContainer: {
    alignItems: 'center',
    marginTop: -20,
  },
  value: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: '700',
    color: colors.gray[900],
  },
  label: {
    fontSize: typography.fontSize.base,
    color: colors.gray[400],
    marginTop: spacing.xs,
  },
});

export default GaugeChart;
