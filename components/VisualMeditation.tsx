import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import SacredGeometry from './SacredGeometry';
import Svg, { Path, G, Defs, RadialGradient, Stop } from 'react-native-svg';

interface VisualMeditationProps {
  frequency: number;
  isPlaying: boolean;
  emotionGradient: string[];
}

function FrequencyRings({ isPlaying, emotionGradient }: { isPlaying: boolean; emotionGradient: string[] }) {
  const ringAnims = useRef(Array.from({ length: 8 }, () => new Animated.Value(0))).current;

  useEffect(() => {
    if (isPlaying) {
      ringAnims.forEach((ringAnim, index) => {
        Animated.loop(
          Animated.timing(ringAnim, {
            toValue: 1,
            duration: 2000 + (index * 300),
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
          outputRange: [0.3, 2.5],
        });

        const opacity = ringAnim.interpolate({
          inputRange: [0, 0.2, 0.8, 1],
          outputRange: [0, 0.8, 0.3, 0],
        });

        const borderWidth = ringAnim.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [3, 1, 0.5],
        });

        return (
          <Animated.View
            key={index}
            style={[
              styles.frequencyRing,
              {
                transform: [{ scale }],
                opacity,
                borderColor: emotionGradient[index % emotionGradient.length] || '#ffffff',
                borderWidth,
              }
            ]}
          />
        );
      })}
    </>
  );
}

function EnergyField({ frequency, isPlaying, emotionGradient }: { frequency: number; isPlaying: boolean; emotionGradient: string[] }) {
  const fieldAnims = useRef(Array.from({ length: 20 }, () => new Animated.Value(0))).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isPlaying) {
      // Field line animations
      fieldAnims.forEach((anim, index) => {
        Animated.loop(
          Animated.timing(anim, {
            toValue: 1,
            duration: 4000 + (index * 100),
            useNativeDriver: false,
          })
        ).start();
      });

      // Rotation animation
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 20000,
          useNativeDriver: true,
        })
      ).start();
    }
  }, [isPlaying, fieldAnims, rotateAnim]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const renderEnergyLines = () => {
    return fieldAnims.map((anim, index) => {
      const angle = (index * 18) * (Math.PI / 180);
      const baseRadius = 50;
      const maxRadius = 300;
      


      const x1 = 200 + baseRadius * Math.cos(angle);
      const y1 = 200 + baseRadius * Math.sin(angle);
      
      return (
        <Animated.View key={index} style={{ position: 'absolute' }}>
          <Svg width={400} height={400} style={{ position: 'absolute' }}>
            <Defs>
              <RadialGradient id={`energyGradient-${index}`} cx="50%" cy="50%" r="50%">
                <Stop offset="0%" stopColor={emotionGradient[0] || '#ffffff'} stopOpacity={0.8} />
                <Stop offset="100%" stopColor={emotionGradient[1] || emotionGradient[0] || '#ffffff'} stopOpacity={0.1} />
              </RadialGradient>
            </Defs>
            <G>
              <Path
                d={`M ${x1} ${y1} Q ${200 + (baseRadius + 50) * Math.cos(angle + 0.5)} ${200 + (baseRadius + 50) * Math.sin(angle + 0.5)} ${200 + maxRadius * Math.cos(angle)} ${200 + maxRadius * Math.sin(angle)}`}
                stroke={`url(#energyGradient-${index})`}
                strokeWidth="2"
                fill="none"
                opacity={0.6}
              />
            </G>
          </Svg>
        </Animated.View>
      );
    });
  };

  return (
    <Animated.View 
      style={[
        styles.energyField,
        {
          transform: [{ rotate: rotation }]
        }
      ]}
    >
      {renderEnergyLines()}
    </Animated.View>
  );
}

export default function VisualMeditation({ frequency, isPlaying, emotionGradient }: VisualMeditationProps) {
  const [currentGeometry, setCurrentGeometry] = useState<'flowerOfLife' | 'metatronsCube' | 'sriYantra' | 'vesicaPiscis' | 'goldenSpiral' | 'merkaba' | 'treeOfLife' | 'seedOfLife' | 'platonic' | 'mandala' | 'fibonacci' | 'torusField'>('flowerOfLife');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const particleAnims = useRef(Array.from({ length: 12 }, () => new Animated.Value(0))).current;
  const breathAnim = useRef(new Animated.Value(0)).current;
  const colorShiftAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Always fade in when component mounts
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

    // Particle animations - more active when playing
    particleAnims.forEach((anim, index) => {
      Animated.loop(
        Animated.timing(anim, {
          toValue: 1,
          duration: isPlaying ? 5000 + (index * 200) : 8000 + (index * 300),
          useNativeDriver: true,
        })
      ).start();
    });

    // Change geometry based on frequency with more variety
    const geometryTimer = setInterval(() => {
      const geometries: ('flowerOfLife' | 'metatronsCube' | 'sriYantra' | 'vesicaPiscis' | 'goldenSpiral' | 'merkaba' | 'treeOfLife' | 'seedOfLife' | 'platonic' | 'mandala' | 'fibonacci' | 'torusField')[] = [
        'seedOfLife', 'sriYantra', 'vesicaPiscis', 'flowerOfLife', 'merkaba', 
        'treeOfLife', 'metatronsCube', 'platonic', 'mandala', 'fibonacci', 
        'goldenSpiral', 'torusField'
      ];
      
      const index = Math.floor((frequency / 50) * geometries.length);
      const clampedIndex = Math.min(Math.max(index, 0), geometries.length - 1);
      setCurrentGeometry(geometries[clampedIndex]);
    }, isPlaying ? 6000 : 10000);

    return () => clearInterval(geometryTimer);
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
          size={250}
          color="#ffffff"
          animated={true}
          opacity={0.8}
        />
      </Animated.View>

      {/* Secondary geometry layers with dynamic types */}
      <View style={styles.secondaryGeometry}>
        <SacredGeometry
          type={frequency < 25 ? 'seedOfLife' : frequency < 50 ? 'mandala' : 'torusField'}
          size={350}
          color="#ffffff"
          animated={true}
          opacity={0.3}
        />
      </View>

      <View style={styles.tertiaryGeometry}>
        <SacredGeometry
          type={frequency < 15 ? 'vesicaPiscis' : frequency < 35 ? 'fibonacci' : 'treeOfLife'}
          size={450}
          color="#ffffff"
          animated={true}
          opacity={0.15}
        />
      </View>

      {/* Energy field visualization */}
      <EnergyField frequency={frequency} isPlaying={isPlaying} emotionGradient={emotionGradient} />
      
      {/* Frequency visualization rings */}
      <FrequencyRings isPlaying={isPlaying} emotionGradient={emotionGradient} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 300,
    height: 300,
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
  quaternaryGeometry: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  frequencyRing: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
  },
  energyField: {
    position: 'absolute',
    width: 400,
    height: 400,
    alignItems: 'center',
    justifyContent: 'center',
  },
});