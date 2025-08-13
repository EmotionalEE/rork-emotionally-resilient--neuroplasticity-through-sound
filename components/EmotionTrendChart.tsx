import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react-native';
import { useEmotions } from '@/providers/EmotionProvider';
// import { emotionalStates } from '@/constants/sessions'; // Removed unused import

const { width } = Dimensions.get('window');

interface EmotionTrendChartProps {
  days?: number;
}

export default function EmotionTrendChart({ days = 7 }: EmotionTrendChartProps) {
  const { getRecentEmotions, getEmotionTrend } = useEmotions();
  
  const recentEmotions = useMemo(() => getRecentEmotions(days), [getRecentEmotions, days]);
  const trend = useMemo(() => getEmotionTrend(), [getEmotionTrend]);

  const chartData = useMemo(() => {
    if (recentEmotions.length === 0) return [];

    // Group emotions by day
    const emotionsByDay = recentEmotions.reduce((acc, emotion) => {
      const day = emotion.timestamp.toDateString();
      if (!acc[day]) acc[day] = [];
      acc[day].push(emotion);
      return acc;
    }, {} as Record<string, typeof recentEmotions>);

    // Calculate average intensity per day
    return Object.entries(emotionsByDay)
      .map(([day, emotions]) => {
        const avgIntensity = emotions.reduce((sum, e) => sum + e.intensity, 0) / emotions.length;
        return {
          day: new Date(day),
          intensity: avgIntensity,
          count: emotions.length,
        };
      })
      .sort((a, b) => a.day.getTime() - b.day.getTime());
  }, [recentEmotions]);

  const maxIntensity = Math.max(...chartData.map(d => d.intensity), 10);
  const minIntensity = Math.min(...chartData.map(d => d.intensity), 1);

  const getTrendColor = () => {
    switch (trend) {
      case 'improving': return ['#4CAF50', '#81C784'];
      case 'declining': return ['#F44336', '#EF5350'];
      default: return ['#9E9E9E', '#BDBDBD'];
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'improving': return <TrendingUp size={20} color="#4CAF50" />;
      case 'declining': return <TrendingDown size={20} color="#F44336" />;
      default: return <Minus size={20} color="#9E9E9E" />;
    }
  };

  const getTrendText = () => {
    switch (trend) {
      case 'improving': return 'Your emotional state is improving!';
      case 'declining': return 'Consider more sessions to boost your mood';
      default: return 'Your emotional state is stable';
    }
  };

  if (chartData.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Emotion Trend</Text>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Start tracking your emotions to see trends</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Emotion Trend ({days} days)</Text>
        <View style={styles.trendIndicator}>
          {getTrendIcon()}
          <Text style={[styles.trendText, { color: getTrendColor()[0] }]}>
            {getTrendText()}
          </Text>
        </View>
      </View>

      <View style={styles.chartContainer}>
        <LinearGradient
          colors={getTrendColor() as unknown as readonly [string, string, ...string[]]}
          style={styles.chartBackground}
        >
          <View style={styles.chart}>
            {chartData.map((point, index) => {
              const height = ((point.intensity - minIntensity) / (maxIntensity - minIntensity)) * 100;
              const barWidth = (width - 80) / chartData.length - 8;
              
              return (
                <View key={index} style={styles.barContainer}>
                  <View style={styles.barWrapper}>
                    <View
                      style={[
                        styles.bar,
                        {
                          height: `${Math.max(height, 5)}%`,
                          width: barWidth,
                          backgroundColor: 'rgba(255,255,255,0.8)',
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.dayLabel}>
                    {point.day.getDate()}/{point.day.getMonth() + 1}
                  </Text>
                  <Text style={styles.intensityLabel}>
                    {point.intensity.toFixed(1)}
                  </Text>
                </View>
              );
            })}
          </View>
        </LinearGradient>
      </View>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#4CAF50' }]} />
          <Text style={styles.legendText}>Positive (7-10)</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#FFC107' }]} />
          <Text style={styles.legendText}>Neutral (6)</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#F44336' }]} />
          <Text style={styles.legendText}>Challenging (1-5)</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    margin: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: '#333',
    marginBottom: 8,
  },
  trendIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  trendText: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  chartContainer: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  chartBackground: {
    flex: 1,
    padding: 16,
  },
  chart: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    gap: 4,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
  },
  barWrapper: {
    height: 120,
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  bar: {
    borderRadius: 4,
    minHeight: 8,
  },
  dayLabel: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600' as const,
    marginBottom: 2,
  },
  intensityLabel: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.8)',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    gap: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
  },
  emptyState: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});