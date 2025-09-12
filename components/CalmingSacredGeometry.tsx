import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet } from 'react-native';
import { FlowerOfLife } from './SacredGeometry';

interface CalmingSacredGeometryProps {
  size?: number;
  color?: string;
  opacity?: number;
}

export const CalmingSacredGeometry: React.FC<CalmingSacredGeometryProps> = ({
  size = 80,
  color = 'rgba(100, 200, 255, 0.4)',
  opacity = 0.6,
}) => {
  const rotationAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Slow rotation animation
    const rotationAnimation = Animated.loop(
      Animated.timing(rotationAnim, {
        toValue: 1,
        duration: 30000, // 30 seconds for very slow rotation
        useNativeDriver: true,
      })
    );

    // Gentle pulsing animation
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 4000, // 4 seconds inhale
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.9,
          duration: 4000, // 4 seconds exhale
          useNativeDriver: true,
        }),
      ])
    );

    // Subtle floating animation
    const floatAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 6000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 6000,
          useNativeDriver: true,
        }),
      ])
    );

    rotationAnimation.start();
    pulseAnimation.start();
    floatAnimation.start();

    return () => {
      rotationAnimation.stop();
      pulseAnimation.stop();
      floatAnimation.stop();
    };
  }, [rotationAnim, pulseAnim, floatAnim]);

  const rotationInterpolation = rotationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const floatInterpolation = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-10, 10],
  });

  return (
    <View style={[styles.container, { opacity }]}>
      <Animated.View
        style={[
          styles.geometryContainer,
          {
            transform: [
              { rotate: rotationInterpolation },
              { scale: pulseAnim },
              { translateY: floatInterpolation },
            ],
          },
        ]}
      >
        <FlowerOfLife size={size} color={color} strokeWidth={1.5} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '20%',
    left: '50%',
    transform: [{ translateX: -40 }], // Half of default size
    zIndex: 1,
  },
  geometryContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});