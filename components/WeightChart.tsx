import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, Circle, Line, Text as SvgText } from 'react-native-svg';
import { AbalColors } from '@/constants/theme';

interface ChartDataPoint {
  value: number;
  label?: string;
}

interface WeightChartProps {
  data: ChartDataPoint[];
  color?: string;
  height?: number;
}

export function WeightChart({ data, color = AbalColors.primary, height = 180 }: WeightChartProps) {
  if (!data || data.length < 2) return null;

  const chartWidth = Dimensions.get('window').width - 48;
  const chartHeight = height - 40; // Reserve space for labels
  const yAxisWidth = 45; // Space for Y-axis labels
  const padding = 16;
  const leftPadding = yAxisWidth + padding;
  const innerWidth = chartWidth - leftPadding - padding;
  const innerHeight = chartHeight - padding * 2;

  // Calculate min/max for scaling
  const values = data.map(d => d.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const valueRange = maxValue - minValue || 1; // Avoid division by zero

  // Generate Y-axis labels
  const numSections = 4;
  const yAxisLabels: number[] = [];
  for (let i = 0; i <= numSections; i++) {
    yAxisLabels.push(minValue + (valueRange * i) / numSections);
  }

  // Convert data points to coordinates
  const points = data.map((point, index) => {
    const x = leftPadding + (index / (data.length - 1)) * innerWidth;
    const y = padding + innerHeight - ((point.value - minValue) / valueRange) * innerHeight;
    return { x, y, value: point.value };
  });

  // Create smooth path using quadratic curves
  const createSmoothPath = () => {
    if (points.length < 2) return '';
    
    let path = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const next = points[i + 1];
      
      if (next) {
        // Use control point between current and next for smooth curve
        const cp1x = curr.x;
        const cp1y = curr.y;
        const cp2x = (curr.x + next.x) / 2;
        const cp2y = (curr.y + next.y) / 2;
        path += ` Q ${cp1x} ${cp1y} ${cp2x} ${cp2y}`;
      } else {
        path += ` L ${curr.x} ${curr.y}`;
      }
    }
    
    return path;
  };

  const path = createSmoothPath();
  const bottomY = padding + innerHeight;
  const areaPath = path + ` L ${points[points.length - 1].x} ${bottomY} L ${points[0].x} ${bottomY} Z`;

  return (
    <View style={styles.container}>
      <Svg width={chartWidth} height={height}>
        {/* Grid lines */}
        {yAxisLabels.map((label, index) => {
          const y = padding + ((numSections - index) / numSections) * innerHeight;
          return (
            <Line
              key={`grid-${index}`}
              x1={leftPadding}
              y1={y}
              x2={leftPadding + innerWidth}
              y2={y}
              stroke={AbalColors.border}
              strokeWidth={0.5}
              opacity={0.3}
            />
          );
        })}

        {/* Area fill */}
        <Path
          d={areaPath}
          fill={color}
          opacity={0.1}
        />

        {/* Line */}
        <Path
          d={path}
          fill="none"
          stroke={color}
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {points.map((point, index) => (
          <Circle
            key={`point-${index}`}
            cx={point.x}
            cy={point.y}
            r={4}
            fill={color}
          />
        ))}

        {/* Y-axis labels */}
        {yAxisLabels.map((label, index) => {
          const y = padding + ((numSections - index) / numSections) * innerHeight;
          return (
            <SvgText
              key={`y-label-${index}`}
              x={leftPadding - 8}
              y={y + 4}
              fontSize={10}
              fill={AbalColors.textSecondary}
              textAnchor="end"
            >
              {label.toFixed(1)}
            </SvgText>
          );
        })}

        {/* X-axis labels */}
        {data.map((point, index) => {
          if (index % Math.ceil(data.length / 5) !== 0 && index !== data.length - 1) return null;
          const x = leftPadding + (index / (data.length - 1)) * innerWidth;
          return (
            <SvgText
              key={`x-label-${index}`}
              x={x}
              y={height - 8}
              fontSize={9}
              fill={AbalColors.textSecondary}
              textAnchor="middle"
            >
              {point.label || ''}
            </SvgText>
          );
        })}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

