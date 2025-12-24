import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { colors } from '../../constants/theme';

interface CircularProgressProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  showDot?: boolean;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  progress,
  size = 64,
  strokeWidth = 6,
  color = colors.chart.blue,
  backgroundColor = colors.gray[100],
  showDot = true,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progressValue = Math.min(Math.max(progress, 0), 100);
  const strokeDashoffset = circumference - (progressValue / 100) * circumference;

  // Calculate dot position
  const angle = (progressValue / 100) * 360 - 90; // Start from top
  const angleRad = (angle * Math.PI) / 180;
  const dotX = size / 2 + radius * Math.cos(angleRad);
  const dotY = size / 2 + radius * Math.sin(angleRad);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} style={styles.svg}>
        {/* Background circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      {showDot && progressValue > 0 && (
        <View
          style={[
            styles.dot,
            {
              backgroundColor: color,
              left: dotX - 4,
              top: dotY - 4,
            },
          ]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  svg: {
    transform: [{ rotateZ: '0deg' }],
  },
  dot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.white,
  },
});

export default CircularProgress;
