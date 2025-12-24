import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'react-native-svg';
import { colors, spacing, typography, borderRadius } from '../../constants/theme';

interface BarData {
  label: string;
  value: number;
  isActive?: boolean;
}

interface BarChartProps {
  data: BarData[];
  maxValue?: number;
  height?: number;
  showYAxis?: boolean;
  showTooltip?: boolean;
  activeIndex?: number;
  tooltipData?: {
    title: string;
    value: string;
    change: string;
    isPositive: boolean;
  };
}

const BarChart: React.FC<BarChartProps> = ({
  data,
  maxValue,
  height = 200,
  showYAxis = true,
  showTooltip = true,
  activeIndex,
  tooltipData,
}) => {
  const max = maxValue || Math.max(...data.map(d => d.value));
  const yAxisLabels = [100, 70, 50, 20, 0];

  return (
    <View style={styles.container}>
      {/* Tooltip */}
      {showTooltip && tooltipData && activeIndex !== undefined && (
        <View style={[styles.tooltip, { left: `${(activeIndex / data.length) * 100}%` }]}>
          <Text style={styles.tooltipTitle}>{tooltipData.title}</Text>
          <View style={styles.tooltipContent}>
            <View style={styles.tooltipValue}>
              <View style={styles.tooltipDot} />
              <Text style={styles.tooltipValueText}>{tooltipData.value}</Text>
              <Text style={styles.tooltipUnit}>Z (ft)</Text>
            </View>
            <View style={[
              styles.tooltipChange,
              tooltipData.isPositive ? styles.tooltipChangePositive : styles.tooltipChangeNegative
            ]}>
              <Text style={[
                styles.tooltipChangeText,
                tooltipData.isPositive ? styles.tooltipChangeTextPositive : styles.tooltipChangeTextNegative
              ]}>
                {tooltipData.isPositive ? '↑' : '↓'} {tooltipData.change}
              </Text>
            </View>
          </View>
        </View>
      )}

      <View style={styles.chartArea}>
        {/* Y Axis */}
        {showYAxis && (
          <View style={styles.yAxis}>
            {yAxisLabels.map((label, index) => (
              <Text key={index} style={styles.yAxisLabel}>{label}</Text>
            ))}
          </View>
        )}

        {/* Bars */}
        <View style={[styles.barsContainer, { height }]}>
          {data.map((item, index) => {
            const barHeight = (item.value / max) * 100;
            const isActive = item.isActive || index === activeIndex;

            return (
              <View key={index} style={styles.barWrapper}>
                <View style={styles.barColumn}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: `${barHeight}%`,
                        backgroundColor: isActive ? colors.primary : colors.orange[200],
                      },
                    ]}
                  >
                    {isActive && <View style={styles.barDot} />}
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </View>

      {/* X Axis Labels */}
      <View style={styles.xAxis}>
        {data.map((item, index) => (
          <View key={index} style={styles.xAxisItem}>
            <Text
              style={[
                styles.xAxisLabel,
                (item.isActive || index === activeIndex) && styles.xAxisLabelActive,
              ]}
            >
              {item.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  chartArea: {
    flexDirection: 'row',
  },
  yAxis: {
    width: 32,
    justifyContent: 'space-between',
    paddingBottom: spacing.lg,
  },
  yAxisLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[400],
    textAlign: 'right',
    paddingRight: spacing.sm,
  },
  barsContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingBottom: spacing.sm,
  },
  barWrapper: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
  },
  barColumn: {
    width: '60%',
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bar: {
    width: '100%',
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
    position: 'relative',
  },
  barDot: {
    position: 'absolute',
    top: -6,
    left: '50%',
    marginLeft: -6,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.white,
  },
  xAxis: {
    flexDirection: 'row',
    marginLeft: 32,
    marginTop: spacing.sm,
  },
  xAxisItem: {
    flex: 1,
    alignItems: 'center',
  },
  xAxisLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[400],
    fontWeight: '500',
  },
  xAxisLabelActive: {
    color: colors.gray[800],
    fontWeight: '700',
    backgroundColor: colors.orange[50],
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  tooltip: {
    position: 'absolute',
    top: 20,
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: borderRadius.xl,
    ...{
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 8,
    },
    borderWidth: 1,
    borderColor: colors.gray[100],
    zIndex: 10,
    transform: [{ translateX: -60 }],
  },
  tooltipTitle: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[400],
    marginBottom: spacing.sm,
  },
  tooltipContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  tooltipValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tooltipDot: {
    width: 8,
    height: 8,
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
  tooltipValueText: {
    fontSize: typography.fontSize.base,
    fontWeight: '700',
    color: colors.gray[800],
  },
  tooltipUnit: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[400],
  },
  tooltipChange: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  tooltipChangePositive: {
    backgroundColor: colors.successLight,
  },
  tooltipChangeNegative: {
    backgroundColor: colors.dangerLight,
  },
  tooltipChangeText: {
    fontSize: typography.fontSize.xs,
    fontWeight: '500',
  },
  tooltipChangeTextPositive: {
    color: colors.success,
  },
  tooltipChangeTextNegative: {
    color: colors.danger,
  },
});

export default BarChart;
