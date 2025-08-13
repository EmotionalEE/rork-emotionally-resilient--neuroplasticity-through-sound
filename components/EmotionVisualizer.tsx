import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Path, G } from 'react-native-svg';

interface EmotionVisualizerProps {
  emotionId: string;
  intensity: number;
  gradient: string[];
  size?: number;
}

export default function EmotionVisualizer({ 
  emotionId, 
  intensity, 
  gradient, 
  size = 120 
}: EmotionVisualizerProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const waveAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Pulse animation based on intensity
    const pulseDuration = Math.max(500, 2000 - (intensity * 150));
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1 + (intensity * 0.1),
          duration: pulseDuration,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: pulseDuration,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Wave animation
    Animated.loop(
      Animated.timing(waveAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();

    // Rotation for certain emotions
    if (['energized', 'anxious', 'stressed'].includes(emotionId)) {
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 8000,
          useNativeDriver: true,
        })
      ).start();
    }
  }, [emotionId, intensity, pulseAnim, waveAnim, rotateAnim]);

  const getEmotionPattern = () => {
    const centerX = size / 2;
    const centerY = size / 2;
    const baseRadius = size / 6;

    switch (emotionId) {
      case 'happy':
      case 'energized':
        // Radiating sun pattern
        const rays = [];
        for (let i = 0; i < 12; i++) {
          const angle = (i * 30) * (Math.PI / 180);
          const startX = centerX + baseRadius * Math.cos(angle);
          const startY = centerY + baseRadius * Math.sin(angle);
          const endX = centerX + (baseRadius * 2) * Math.cos(angle);
          const endY = centerY + (baseRadius * 2) * Math.sin(angle);
          
          rays.push(
            <Path
              key={`ray-${i}`}
              d={`M ${startX} ${startY} L ${endX} ${endY}`}
              stroke={gradient[0]}
              strokeWidth="3"
              opacity={0.7}
            />
          );
        }
        return [
          ...rays,
          <Circle
            key="center"
            cx={centerX}
            cy={centerY}
            r={baseRadius}
            fill={gradient[0]}
            opacity={0.8}
          />
        ];

      case 'calm':
      case 'focused':
        // Concentric circles
        return Array.from({ length: 4 }, (_, i) => (
          <Circle
            key={`circle-${i}`}
            cx={centerX}
            cy={centerY}
            r={baseRadius + (i * 15)}
            fill="none"
            stroke={gradient[0]}
            strokeWidth="2"
            opacity={0.6 - (i * 0.1)}
          />
        ));

      case 'sad':
      case 'depressed':
        // Downward flowing pattern
        const drops = [];
        for (let i = 0; i < 6; i++) {
          const x = centerX + (i - 2.5) * 15;
          const y = centerY + (i * 8);
          drops.push(
            <Circle
              key={`drop-${i}`}
              cx={x}
              cy={y}
              r={4 + (i * 2)}
              fill={gradient[0]}
              opacity={0.7 - (i * 0.1)}
            />
          );
        }
        return drops;

      case 'angry':
      case 'stressed':
        // Jagged, sharp pattern
        const spikes = [];
        for (let i = 0; i < 8; i++) {
          const angle = (i * 45) * (Math.PI / 180);
          const innerX = centerX + baseRadius * 0.5 * Math.cos(angle);
          const innerY = centerY + baseRadius * 0.5 * Math.sin(angle);
          const outerX = centerX + baseRadius * 1.5 * Math.cos(angle);
          const outerY = centerY + baseRadius * 1.5 * Math.sin(angle);
          
          spikes.push(
            <Path
              key={`spike-${i}`}
              d={`M ${centerX} ${centerY} L ${innerX} ${innerY} L ${outerX} ${outerY} Z`}
              fill={gradient[0]}
              opacity={0.6}
            />
          );
        }
        return spikes;

      case 'anxious':
        // Chaotic, scattered pattern
        const chaos = [];
        for (let i = 0; i < 15; i++) {
          const angle = Math.random() * 2 * Math.PI;
          const distance = Math.random() * baseRadius * 2;
          const x = centerX + distance * Math.cos(angle);
          const y = centerY + distance * Math.sin(angle);
          
          chaos.push(
            <Circle
              key={`chaos-${i}`}
              cx={x}
              cy={y}
              r={2 + Math.random() * 4}
              fill={gradient[0]}
              opacity={0.4 + Math.random() * 0.4}
            />
          );
        }
        return chaos;

      default:
        // Neutral pattern
        return [
          <Circle
            key="neutral"
            cx={centerX}
            cy={centerY}
            r={baseRadius}
            fill="none"
            stroke={gradient[0]}
            strokeWidth="3"
            opacity={0.7}
          />
        ];
    }
  };

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const waveScale = waveAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.2, 1],
  });

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Background gradient */}
      <LinearGradient
        colors={gradient.length >= 1 ? [gradient[0], 'transparent'] : ['#ffffff', 'transparent']}
        style={[styles.background, { borderRadius: size / 2 }]}
      />
      
      {/* Animated pattern */}
      <Animated.View
        style={[
          styles.patternContainer,
          {
            transform: [
              { scale: pulseAnim },
              { rotate: rotation }
            ]
          }
        ]}
      >
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <G>
            {getEmotionPattern()}
          </G>
        </Svg>
      </Animated.View>
      
      {/* Wave overlay */}
      <Animated.View
        style={[
          styles.waveOverlay,
          {
            transform: [{ scale: waveScale }],
            borderRadius: size / 2,
            borderColor: gradient[0],
          }
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  background: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.3,
  },
  patternContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  waveOverlay: {
    position: 'absolute',
    width: '90%',
    height: '90%',
    borderWidth: 2,
    opacity: 0.4,
  },
});