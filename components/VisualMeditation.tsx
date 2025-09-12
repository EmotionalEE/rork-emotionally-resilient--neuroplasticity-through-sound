import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import SacredGeometry from './SacredGeometry';

interface VisualMeditationProps {
  frequency: number;
  isPlaying: boolean;
  emotionGradient: string[];
}

function FrequencyRings({ isPlaying, emotionGradient }: { isPlaying: boolean; emotionGradient: string[] }) {
  const ringAnims = useRef(Array.from({ length: 5 }, () => new Animated.Value(0))).current;

  useEffect(() => {
    if (isPlaying) {
      ringAnims.forEach((ringAnim, index) => {
        Animated.loop(
          Animated.timing(ringAnim, {
            toValue: 1,
            duration: 3000 + (index * 500),
            useNativeDriver: true,
          })
        ).start();
      });
    }
  }, [isPlaying, ringAnims]);

  return (
    <>
      {ringAnims.map((ringAnim, index) => {
        const scale = ringAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0.5, 2],
        });

        const opacity = ringAnim.interpolate({
          inputRange: [0, 0.3, 1],
          outputRange: [0.8, 0.4, 0],
        });

        return (
          <Animated.View
            key={index}
            style={[
              styles.frequencyRing,
              {
                transform: [{ scale }],
                opacity,
                borderColor: emotionGradient[0],
              }
            ]}
          />
        );
      })}
    </>
  );
}

export default function VisualMeditation({ frequency, isPlaying, emotionGradient }: VisualMeditationProps) {
  const [currentGeometry, setCurrentGeometry] = useState<'flowerOfLife' | 'metatronsCube' | 'vesicaPiscis' | 'merkabah' | 'seedOfLife'>('flowerOfLife');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const particleAnims = useRef(Array.from({ length: 12 }, () => new Animated.Value(0))).current;
  const breathAnim = useRef(new Animated.Value(0)).current;
  const colorShiftAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isPlaying) {
      // Fade in animation
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }).start();

      // Breathing animation based on frequency
      const breathDuration = Math.max(2000, 8000 - (frequency * 10));
      Animated.loop(
        Animated.sequence([
          Animated.timing(breathAnim, {
            toValue: 1,
            duration: breathDuration,
            useNativeDriver: true,
          }),
          Animated.timing(breathAnim, {
            toValue: 0,
            duration: breathDuration,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Color shifting animation
      Animated.loop(
        Animated.timing(colorShiftAnim, {
          toValue: 1,
          duration: 10000,
          useNativeDriver: false,
        })
      ).start();

      // Particle animations
      particleAnims.forEach((anim, index) => {
        Animated.loop(
          Animated.timing(anim, {
            toValue: 1,
            duration: 5000 + (index * 200),
            useNativeDriver: true,
          })
        ).start();
      });

      // Change geometry based on frequency
      const geometryTimer = setInterval(() => {
        if (frequency < 10) {
          setCurrentGeometry('vesicaPiscis');
        } else if (frequency < 20) {
          setCurrentGeometry('flowerOfLife');
        } else if (frequency < 30) {
          setCurrentGeometry('metatronsCube');
        } else if (frequency < 40) {
          setCurrentGeometry('merkabah');
        } else {
          setCurrentGeometry('seedOfLife');
        }
      }, 8000);

      return () => clearInterval(geometryTimer);
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }
  }, [isPlaying, frequency, fadeAnim, breathAnim, colorShiftAnim, particleAnims]);

  const renderParticles = () => {
    return particleAnims.map((anim, index) => {
      const angle = (index * 30) * (Math.PI / 180);
      const radius = 150 + (index * 20);
      
      const translateX = anim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, radius * Math.cos(angle)],
      });
      
      const translateY = anim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, radius * Math.sin(angle)],
      });
      
      const opacity = anim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, 1, 0],
      });
      
      const scale = anim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0.5, 1, 0.5],
      });

      return (
        <Animated.View
          key={index}
          style={[
            styles.particle,
            {
              transform: [
                { translateX },
                { translateY },
                { scale }
              ],
              opacity,
            }
          ]}
        >
          <LinearGradient
            colors={emotionGradient.length >= 2 ? [emotionGradient[0], emotionGradient[1] || emotionGradient[0]] : ['#ffffff', '#ffffff']}
            style={styles.particleGradient}
          />
        </Animated.View>
      );
    });
  };

  const breathScale = breathAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.9, 1.1],
  });

  const backgroundOpacity = colorShiftAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.1, 0.3, 0.1],
  });

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* Background gradient */}
      <Animated.View style={[styles.backgroundGradient, { opacity: backgroundOpacity }]}>
        <LinearGradient
          colors={emotionGradient.length >= 2 ? [emotionGradient[0], emotionGradient[1] || emotionGradient[0]] : ['#ffffff', '#ffffff']}
          style={StyleSheet.absoluteFillObject}
        />
      </Animated.View>

      {/* Floating particles */}
      <View style={styles.particleContainer}>
        {renderParticles()}
      </View>

      {/* Main sacred geometry */}
      <Animated.View
        style={[
          styles.geometryContainer,
          {
            transform: [{ scale: breathScale }]
          }
        ]}
      >
        <SacredGeometry
          type={currentGeometry}
          size={280}
          color="#ffffff"
          animated={true}
          opacity={0.6}
        />
      </Animated.View>

      {/* Secondary geometry layers */}
      <View style={styles.secondaryGeometry}>
        <SacredGeometry
          type="vesicaPiscis"
          size={400}
          color="#ffffff"
          animated={true}
          opacity={0.2}
        />
      </View>

      <View style={styles.tertiaryGeometry}>
        <SacredGeometry
          type="flowerOfLife"
          size={500}
          color="#ffffff"
          animated={true}
          opacity={0.1}
        />
      </View>

      {/* Frequency visualization rings */}
      <FrequencyRings isPlaying={isPlaying} emotionGradient={emotionGradient} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  particleContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  particle: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  particleGradient: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  geometryContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryGeometry: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tertiaryGeometry: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  frequencyRing: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
  },
});