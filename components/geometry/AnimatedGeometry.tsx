import React, { useRef, useEffect } from 'react';
import { Animated, ViewStyle } from 'react-native';

interface AnimatedGeometryProps {
  rotationSpeed: number;
  pulseIntensity: number;
  children: React.ReactNode;
  style?: ViewStyle;
}

const AnimatedGeometry: React.FC<AnimatedGeometryProps> = ({
  rotationSpeed,
  pulseIntensity,
  children,
  style,
}) => {
  const rotationAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const rotation = Animated.loop(
      Animated.timing(rotationAnim, {
        toValue: 1,
        duration: rotationSpeed,
        useNativeDriver: true,
      })
    );

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: pulseIntensity,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    rotation.start();
    pulse.start();

    return () => {
      rotation.stop();
      pulse.stop();
    };
  }, [rotationSpeed, pulseIntensity, rotationAnim, pulseAnim]);

  const rotation = rotationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View style={[{ transform: [{ rotate: rotation }, { scale: pulseAnim }] }, style]}>
      {children}
    </Animated.View>
  );
};

export default AnimatedGeometry;
