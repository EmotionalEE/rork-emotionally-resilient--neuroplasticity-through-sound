import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet } from 'react-native';
import { FlowerOfLife } from '@/components/SacredGeometry';

interface MovingFlowerOfLifeProps {
  size?: number;
  color?: string;
  opacity?: number;
  speed?: number;
}

export function MovingFlowerOfLife({ 
  size = 80, 
  color = 'rgba(100, 200, 255, 0.2)', 
  opacity = 0.6,
  speed = 1
}: MovingFlowerOfLifeProps) {
  const { width, height } = Dimensions.get('window');
  const translateX = useRef(new Animated.Value(-size)).current;
  const translateY = useRef(new Animated.Value(height * 0.3)).current;
  const rotation = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Create a continuous floating animation path
    const createFloatingAnimation = () => {
      // Reset position to start from left side
      translateX.setValue(-size);
      translateY.setValue(height * 0.3 + (Math.random() - 0.5) * height * 0.4);
      
      // Horizontal movement across screen
      const horizontalAnimation = Animated.timing(translateX, {
        toValue: width + size,
        duration: (15000 + Math.random() * 10000) / speed, // 15-25 seconds base duration
        useNativeDriver: true,
      });

      // Vertical floating motion (sine wave-like)
      const currentY = height * 0.3 + (Math.random() - 0.5) * height * 0.4;
      const verticalAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(translateY, {
            toValue: currentY + 50,
            duration: 3000 / speed,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: currentY - 50,
            duration: 3000 / speed,
            useNativeDriver: true,
          }),
        ])
      );

      // Rotation animation
      const rotationAnimation = Animated.loop(
        Animated.timing(rotation, {
          toValue: 1,
          duration: 8000 / speed,
          useNativeDriver: true,
        })
      );

      // Pulsing scale animation
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(scale, {
            toValue: 1.2,
            duration: 2000 / speed,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 0.8,
            duration: 2000 / speed,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1,
            duration: 2000 / speed,
            useNativeDriver: true,
          }),
        ])
      );

      // Start all animations
      verticalAnimation.start();
      rotationAnimation.start();
      pulseAnimation.start();
      
      // When horizontal animation completes, restart the cycle
      horizontalAnimation.start(({ finished }) => {
        if (finished) {
          // Small delay before restarting
          setTimeout(() => {
            createFloatingAnimation();
          }, 2000 + Math.random() * 3000); // 2-5 second delay
        }
      });
    };

    // Start the animation cycle
    createFloatingAnimation();

    // Cleanup function
    return () => {
      translateX.stopAnimation();
      translateY.stopAnimation();
      rotation.stopAnimation();
      scale.stopAnimation();
    };
  }, [translateX, translateY, rotation, scale, width, height, size, speed]);

  const rotationInterpolation = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [
            { translateX },
            { translateY },
            { rotate: rotationInterpolation },
            { scale },
          ],
          opacity,
        },
      ]}
      pointerEvents="none"
    >
      <FlowerOfLife 
        size={size} 
        color={color} 
        strokeWidth={1.5} 
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 1,
  },
});