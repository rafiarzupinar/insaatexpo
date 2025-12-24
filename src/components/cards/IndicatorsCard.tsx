import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
import { Card } from '../common';
import { GaugeChart } from '../charts';
import { colors, spacing, typography } from '../../constants/theme';

interface IndicatorItem {
  label: string;
  value: string;
  color: string;
}

interface IndicatorsCardProps {
  value: number;
  indicators: IndicatorItem[];
  onPress?: () => void;
}

const IndicatorsCard: React.FC<IndicatorsCardProps> = ({
  value,
  indicators,
  onPress,
}) => {
  return (
    <Card onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.title}>Indicators</Text>
        <Icon name="more-horizontal" size={20} color={colors.gray[400]} />
      </View>

      <View style={styles.gaugeContainer}>
        <GaugeChart value={value} />
      </View>

      <View style={styles.indicators}>
        {indicators.map((item, index) => (
          <View key={index} style={styles.indicatorRow}>
            <View style={styles.indicatorLabel}>
              <View style={[styles.dot, { backgroundColor: item.color }]} />
              <Text style={styles.labelText}>{item.label}</Text>
            </View>
            <Text style={styles.valueText}>{item.value}</Text>
          </View>
        ))}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.base,
  },
  title: {
    fontSize: typography.fontSize.base,
    color: colors.gray[500],
  },
  gaugeContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  indicators: {
    marginTop: spacing.lg,
    gap: spacing.md,
  },
  indicatorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  indicatorLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  labelText: {
    fontSize: typography.fontSize.base,
    color: colors.gray[600],
  },
  valueText: {
    fontSize: typography.fontSize.base,
    fontWeight: '500',
    color: colors.gray[900],
  },
});

export default IndicatorsCard;
