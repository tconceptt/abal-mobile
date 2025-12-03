import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
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
  if (!data || data.length === 0) return null;

  const chartWidth = Dimensions.get('window').width - 64;

  // Convert data to gifted-charts format
  const lineData = data.map((point, index) => ({
    value: point.value,
    label: point.label || '',
    dataPointText: index === data.length - 1 ? point.value.toFixed(1) : undefined,
  }));

  // Calculate min and max for better visualization
  const values = data.map(d => d.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const padding = (maxValue - minValue) * 0.1 || 5;
  const yAxisMin = Math.floor(minValue - padding);

  // Determine label frequency based on data length
  const labelFrequency = data.length > 7 ? Math.ceil(data.length / 5) : 1;

  return (
    <View style={styles.container}>
      <LineChart
        data={lineData}
        width={chartWidth}
        height={height - 30}
        color={color}
        thickness={3}
        dataPointsColor={color}
        dataPointsRadius={5}
        curved
        curvature={0.2}
        startFillColor={`${color}30`}
        endFillColor={`${color}05`}
        startOpacity={0.9}
        endOpacity={0.2}
        areaChart
        hideRules
        yAxisColor="transparent"
        xAxisColor={AbalColors.border}
        yAxisTextStyle={styles.yAxisText}
        xAxisLabelTextStyle={styles.xAxisText}
        yAxisSide="right"
        yAxisOffset={0}
        noOfSections={4}
        maxValue={maxValue + padding}
        yAxisLabelWidth={45}
        spacing={Math.max((chartWidth - 60) / Math.max(data.length - 1, 1), 30)}
        initialSpacing={15}
        endSpacing={15}
        adjustToWidth
        isAnimated
        animationDuration={800}
        pointerConfig={{
          pointerStripHeight: height - 50,
          pointerStripColor: `${color}40`,
          pointerStripWidth: 2,
          pointerColor: color,
          radius: 6,
          pointerLabelWidth: 80,
          pointerLabelHeight: 30,
          activatePointersOnLongPress: true,
          autoAdjustPointerLabelPosition: true,
          pointerLabelComponent: (items: { value: number }[]) => (
            <View style={[styles.pointerLabel, { backgroundColor: color }]}>
              <View style={styles.pointerLabelText}>
                {items[0] && (
                  <View>
                    <View style={styles.pointerValue}>
                      <View style={{ alignItems: 'center' }}>
                        <View>
                          <View style={styles.pointerValueText}>
                            <View>
                              {/* We can't use ThemedText in pointer, so we'll keep it simple */}
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                )}
              </View>
            </View>
          ),
        }}
        showValuesAsDataPointsText
        textShiftY={-10}
        textShiftX={-5}
        textColor={AbalColors.textSecondary}
        textFontSize={10}
        hideDataPoints={data.length > 10}
        xAxisLabelsVerticalShift={2}
        rotateLabel={data.length > 5}
        labelsExtraHeight={data.length > 5 ? 20 : 0}
        showXAxisIndices={false}
        xAxisIndicesHeight={0}
        xAxisIndicesWidth={0}
        xAxisLabelsHeight={20}
        rulesType="solid"
        rulesColor={`${AbalColors.border}30`}
        showReferenceLine1={false}
        formatYLabel={(label) => {
          const num = parseFloat(label);
          return num.toFixed(0);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  yAxisText: {
    color: AbalColors.textSecondary,
    fontSize: 10,
  },
  xAxisText: {
    color: AbalColors.textSecondary,
    fontSize: 9,
    width: 50,
    textAlign: 'center',
  },
  pointerLabel: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  pointerLabelText: {
    alignItems: 'center',
  },
  pointerValue: {
    alignItems: 'center',
  },
  pointerValueText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});
