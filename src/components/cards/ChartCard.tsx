import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
import { Card, Badge } from '../common';
import { BarChart } from '../charts';
import { colors, spacing, typography, borderRadius } from '../../constants/theme';

interface ChartCardProps {
  title: string;
  value: string;
  changeValue?: string;
  changeType?: 'up' | 'down';
  data: Array<{ label: string; value: number }>;
  activeIndex?: number;
  onFilterPress?: () => void;
  onExpandPress?: () => void;
}

const ChartCard: React.FC<ChartCardProps> = ({
  title,
  value,
  changeValue,
  changeType = 'up',
  data,
  activeIndex = 4,
  onFilterPress,
  onExpandPress,
}) => {
  return (
    <Card>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.valueRow}>
            <Text style={styles.value}>{value}</Text>
            {changeValue && (
              <Badge
                label={changeValue}
                variant={changeType === 'up' ? 'success' : 'danger'}
                icon={changeType === 'up' ? 'arrow-up-right' : 'arrow-down-right'}
              />
            )}
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.filterButton} onPress={onFilterPress}>
            <Text style={styles.filterText}>Monthly</Text>
            <Icon name="chevron-down" size={16} color={colors.gray[600]} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onExpandPress}>
            <Icon name="maximize-2" size={16} color={colors.gray[400]} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.chartContainer}>
        <BarChart
          data={data}
          height={200}
          activeIndex={activeIndex}
          showTooltip
          tooltipData={{
            title: 'July 2024',
            value: '56.3%',
            change: '1.25%',
            isPositive: true,
          }}
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
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.fontSize.base,
    color: colors.gray[500],
    marginBottom: spacing.sm,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  value: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: '700',
    color: colors.gray[900],
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: borderRadius.full,
  },
  filterText: {
    fontSize: typography.fontSize.base,
    color: colors.gray[600],
  },
  chartContainer: {
    marginTop: spacing.md,
  },
});

export default ChartCard;
