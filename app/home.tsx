import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useFocusEffect } from "expo-router";
import {
  Brain,
  Heart,
  Sparkles,
  Waves,
  Activity,
  Moon,
  Sun,
  Cloud,
  Zap,
  LucideIcon,
} from "lucide-react-native";
import { emotionalStates, sessions } from "@/constants/sessions";
import { useUserProgress } from "@/providers/UserProgressProvider";
import { EmotionalState, Session } from "@/types/session";
import * as Haptics from "expo-haptics";

export default function HomeScreen() {
  const router = useRouter();
  const { progress } = useUserProgress();
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionalState | null>(null);
  const [isNavigationReady, setIsNavigationReady] = useState(false);
  const fadeAnim = useMemo(() => new Animated.Value(0), []);
  const scaleAnim = useMemo(() => new Animated.Value(0.95), []);

  // Use useFocusEffect to handle navigation when screen is focused
  useFocusEffect(
    useCallback(() => {
      // Small delay to ensure navigation is ready
      const timer = setTimeout(() => {
        setIsNavigationReady(true);
      }, 100);

      return () => clearTimeout(timer);
    }, [])
  );

  // Handle animations after navigation is ready
  useEffect(() => {
    if (isNavigationReady) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 20,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isNavigationReady, fadeAnim, scaleAnim]);

  const handleEmotionSelect = useCallback((emotion: EmotionalState) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelectedEmotion(emotion);
  }, []);

  const handleSessionPress = useCallback((session: Session) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    router.push({
      pathname: "/session",
      params: { sessionId: session.id },
    });
  }, [router]);

  // Sacred Geometry Icon Component
  const SacredGeometryIcon = ({ emotion, isSelected }: { emotion: EmotionalState; isSelected: boolean }) => {
    const rotationAnim = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const mandalaAnim = useRef(new Animated.Value(0)).current;
    const spiralAnim = useRef(new Animated.Value(0)).current;
    const counterRotationAnim = useRef(new Animated.Value(0)).current;
    const waveAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      // Initialize all animation values to ensure they start from a known state
      rotationAnim.setValue(0);
      counterRotationAnim.setValue(0);
      pulseAnim.setValue(1);
      mandalaAnim.setValue(0);
      spiralAnim.setValue(0);
      waveAnim.setValue(0);

      // Always start animations for all icons
      const rotationAnimation = Animated.loop(
        Animated.timing(rotationAnim, {
          toValue: 1,
          duration: 8000 + Math.random() * 4000, // Vary duration for each icon
          useNativeDriver: true,
        })
      );
      rotationAnimation.start();

      const counterRotationAnimation = Animated.loop(
        Animated.timing(counterRotationAnim, {
          toValue: 1,
          duration: 12000 + Math.random() * 6000, // Vary duration for each icon
          useNativeDriver: true,
        })
      );
      counterRotationAnimation.start();

      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: isSelected ? 1.3 : 1.1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimation.start();

      const mandalaAnimation = Animated.loop(
        Animated.timing(mandalaAnim, {
          toValue: 1,
          duration: 3000 + Math.random() * 2000, // Vary duration for each icon
          useNativeDriver: true,
        })
      );
      mandalaAnimation.start();

      const spiralAnimation = Animated.loop(
        Animated.timing(spiralAnim, {
          toValue: 1,
          duration: 5000 + Math.random() * 3000, // Vary duration for each icon
          useNativeDriver: true,
        })
      );
      spiralAnimation.start();

      const waveAnimation = Animated.loop(
        Animated.timing(waveAnim, {
          toValue: 1,
          duration: 2000 + Math.random() * 1000, // Vary duration for each icon
          useNativeDriver: true,
        })
      );
      waveAnimation.start();

      // Cleanup function to stop animations when component unmounts
      return () => {
        rotationAnimation.stop();
        counterRotationAnimation.stop();
        pulseAnimation.stop();
        mandalaAnimation.stop();
        spiralAnimation.stop();
        waveAnimation.stop();
      };
    }, [isSelected, rotationAnim, pulseAnim, mandalaAnim, spiralAnim, counterRotationAnim, waveAnim]);

    // Create safe interpolations with proper error handling
    const safeRotation = useMemo(() => {
      try {
        return rotationAnim.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '360deg'],
          extrapolate: 'clamp',
        });
      } catch (error) {
        console.log('Home rotation interpolation error:', error);
        return '0deg';
      }
    }, [rotationAnim]);

    const safeCounterRotation = useMemo(() => {
      try {
        return counterRotationAnim.interpolate({
          inputRange: [0, 1],
          outputRange: ['360deg', '0deg'],
          extrapolate: 'clamp',
        });
      } catch (error) {
        console.log('Home counter rotation interpolation error:', error);
        return '0deg';
      }
    }, [counterRotationAnim]);

    const safeSpiralScale = useMemo(() => {
      try {
        return spiralAnim.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0.8, 1.2, 0.8],
          extrapolate: 'clamp',
        });
      } catch (error) {
        console.log('Home spiral scale interpolation error:', error);
        return 1;
      }
    }, [spiralAnim]);

    const safeWaveScale = useMemo(() => {
      try {
        return waveAnim.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [1, 1.4, 1],
          extrapolate: 'clamp',
        });
      } catch (error) {
        console.log('Home wave scale interpolation error:', error);
        return 1;
      }
    }, [waveAnim]);

    const safePulseScale = useMemo(() => {
      try {
        return pulseAnim.interpolate({
          inputRange: [1, 1.3],
          outputRange: [1, 1.3],
          extrapolate: 'clamp',
        });
      } catch (error) {
        console.log('Home pulse scale interpolation error:', error);
        return 1;
      }
    }, [pulseAnim]);

    const icons: Record<string, LucideIcon> = {
      anxious: Cloud,
      stressed: Zap,
      sad: Moon,
      angry: Activity,
      calm: Waves,
      focused: Brain,
      happy: Sun,
      energized: Sparkles,
    };
    const Icon = icons[emotion.id] || Heart;

    // Render different sacred geometry based on emotion
    const renderSacredGeometry = () => {
      const baseOpacity = isSelected ? 1 : 0.6; // Show geometry always, but dimmer when not selected

      switch (emotion.id) {
        case 'anxious':
          // Chaotic swirling pattern for anxiety
          return (
            <>
              <Animated.View
                style={[
                  styles.iconMandala,
                  {
                    transform: [
                      { rotate: typeof safeRotation === 'string' ? safeRotation : '0deg' }, 
                      { scale: typeof safePulseScale === 'number' ? safePulseScale : 1 }
                    ],
                    opacity: baseOpacity * 0.6,
                  },
                ]}
              >
                {[...Array(12)].map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.mandalaRay,
                      {
                        transform: [{ rotate: `${i * 30}deg` }],
                        backgroundColor: 'rgba(255,100,100,0.4)',
                      },
                    ]}
                  />
                ))}
              </Animated.View>
              <Animated.View
                style={[
                  styles.iconSpiral,
                  {
                    transform: [
                      { rotate: typeof safeCounterRotation === 'string' ? safeCounterRotation : '0deg' }, 
                      { scale: typeof safeSpiralScale === 'number' ? safeSpiralScale : 1 }
                    ],
                    opacity: 0.6 * baseOpacity,
                  },
                ]}
              >
                {[...Array(8)].map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.spiralDot,
                      {
                        transform: [
                          { rotate: `${i * 45}deg` },
                          { translateY: -12 - i * 2 },
                        ],
                        backgroundColor: 'rgba(255,150,150,0.7)',
                      },
                    ]}
                  />
                ))}
              </Animated.View>
            </>
          );

        case 'stressed':
          // Sharp, jagged patterns for stress
          return (
            <>
              <Animated.View
                style={[
                  styles.iconTriangles,
                  {
                    transform: [
                      { rotate: typeof safeRotation === 'string' ? safeRotation : '0deg' }, 
                      { scale: typeof safePulseScale === 'number' ? safePulseScale : 1 }
                    ],
                    opacity: 0.7 * baseOpacity,
                  },
                ]}
              >
                {[...Array(6)].map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.innerTriangle,
                      {
                        transform: [{ rotate: `${i * 60}deg` }],
                        borderBottomColor: 'rgba(255,200,0,0.6)',
                      },
                    ]}
                  />
                ))}
              </Animated.View>
              <Animated.View
                style={[
                  styles.iconMandala,
                  {
                    transform: [
                      { rotate: typeof safeCounterRotation === 'string' ? safeCounterRotation : '0deg' }, 
                      { scale: typeof safeSpiralScale === 'number' ? safeSpiralScale : 1 }
                    ],
                    opacity: baseOpacity * 0.6,
                  },
                ]}
              >
                {[...Array(8)].map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.mandalaRay,
                      {
                        transform: [{ rotate: `${i * 45}deg` }],
                        backgroundColor: 'rgba(255,180,0,0.5)',
                        width: 2,
                      },
                    ]}
                  />
                ))}
              </Animated.View>
            </>
          );

        case 'sad':
          // Gentle, flowing downward patterns
          return (
            <>
              <Animated.View
                style={[
                  styles.iconFlower,
                  {
                    transform: [
                      { scale: typeof safeWaveScale === 'number' ? safeWaveScale : 1 }, 
                      { rotate: typeof safeRotation === 'string' ? safeRotation : '0deg' }
                    ],
                    opacity: baseOpacity * 0.6,
                  },
                ]}
              >
                {[...Array(6)].map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.flowerPetal,
                      {
                        transform: [
                          { rotate: `${i * 60}deg` },
                          { translateY: -10 },
                        ],
                        borderColor: 'rgba(150,150,255,0.4)',
                      },
                    ]}
                  />
                ))}
              </Animated.View>
              <Animated.View
                style={[
                  styles.iconSpiral,
                  {
                    transform: [
                      { rotate: typeof safeCounterRotation === 'string' ? safeCounterRotation : '0deg' }, 
                      { scale: typeof safeSpiralScale === 'number' ? safeSpiralScale : 1 }
                    ],
                    opacity: 0.5 * baseOpacity,
                  },
                ]}
              >
                {[...Array(5)].map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.spiralDot,
                      {
                        transform: [
                          { rotate: `${i * 72}deg` },
                          { translateY: -18 - i * 2 },
                        ],
                        backgroundColor: 'rgba(120,120,255,0.6)',
                      },
                    ]}
                  />
                ))}
              </Animated.View>
            </>
          );

        case 'angry':
          // Intense, explosive patterns
          return (
            <>
              <Animated.View
                style={[
                  styles.iconMandala,
                  {
                    transform: [
                      { rotate: typeof safeRotation === 'string' ? safeRotation : '0deg' }, 
                      { scale: typeof safePulseScale === 'number' ? safePulseScale : 1 }
                    ],
                    opacity: baseOpacity * 0.6,
                  },
                ]}
              >
                {[...Array(16)].map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.mandalaRay,
                      {
                        transform: [{ rotate: `${i * 22.5}deg` }],
                        backgroundColor: 'rgba(255,80,120,0.6)',
                        width: i % 2 === 0 ? 2 : 1,
                        height: i % 2 === 0 ? 30 : 20,
                      },
                    ]}
                  />
                ))}
              </Animated.View>
              <Animated.View
                style={[
                  styles.iconTriangles,
                  {
                    transform: [
                      { rotate: typeof safeCounterRotation === 'string' ? safeCounterRotation : '0deg' }, 
                      { scale: typeof safeSpiralScale === 'number' ? safeSpiralScale : 1 }
                    ],
                    opacity: 0.8 * baseOpacity,
                  },
                ]}
              >
                {[...Array(4)].map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.innerTriangle,
                      {
                        transform: [{ rotate: `${i * 90}deg` }],
                        borderBottomColor: 'rgba(255,100,150,0.7)',
                        borderLeftWidth: 6,
                        borderRightWidth: 6,
                        borderBottomWidth: 10,
                      },
                    ]}
                  />
                ))}
              </Animated.View>
            </>
          );

        case 'calm':
          // Smooth, flowing wave patterns
          return (
            <>
              <Animated.View
                style={[
                  styles.iconFlower,
                  {
                    transform: [{ scale: typeof safeWaveScale === 'number' ? safeWaveScale : 1 }],
                    opacity: baseOpacity * 0.6,
                  },
                ]}
              >
                {[...Array(8)].map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.flowerPetal,
                      {
                        transform: [
                          { rotate: `${i * 45}deg` },
                          { translateY: -12 },
                        ],
                        borderColor: 'rgba(100,200,255,0.4)',
                        borderRadius: 8,
                      },
                    ]}
                  />
                ))}
              </Animated.View>
              <Animated.View
                style={[
                  styles.iconSpiral,
                  {
                    transform: [
                      { rotate: typeof safeRotation === 'string' ? safeRotation : '0deg' }, 
                      { scale: typeof safeSpiralScale === 'number' ? safeSpiralScale : 1 }
                    ],
                    opacity: 0.6 * baseOpacity,
                  },
                ]}
              >
                {[...Array(12)].map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.spiralDot,
                      {
                        transform: [
                          { rotate: `${i * 30}deg` },
                          { translateY: -8 - Math.sin(i * 0.5) * 8 },
                        ],
                        backgroundColor: 'rgba(150,220,255,0.6)',
                        borderRadius: 2,
                      },
                    ]}
                  />
                ))}
              </Animated.View>
            </>
          );

        case 'focused':
          // Precise, geometric patterns
          return (
            <>
              <Animated.View
                style={[
                  styles.iconMandala,
                  {
                    transform: [
                      { rotate: typeof safeRotation === 'string' ? safeRotation : '0deg' }, 
                      { scale: typeof safePulseScale === 'number' ? safePulseScale : 1 }
                    ],
                    opacity: baseOpacity * 0.6,
                  },
                ]}
              >
                {[...Array(6)].map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.mandalaRay,
                      {
                        transform: [{ rotate: `${i * 60}deg` }],
                        backgroundColor: 'rgba(100,255,150,0.5)',
                        width: 2,
                        height: 28,
                      },
                    ]}
                  />
                ))}
              </Animated.View>
              <Animated.View
                style={[
                  styles.iconTriangles,
                  {
                    transform: [
                      { rotate: typeof safeCounterRotation === 'string' ? safeCounterRotation : '0deg' }, 
                      { scale: typeof safeSpiralScale === 'number' ? safeSpiralScale : 1 }
                    ],
                    opacity: 0.7 * baseOpacity,
                  },
                ]}
              >
                {[...Array(3)].map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.innerTriangle,
                      {
                        transform: [{ rotate: `${i * 120}deg` }],
                        borderBottomColor: 'rgba(120,255,180,0.6)',
                      },
                    ]}
                  />
                ))}
              </Animated.View>
              <Animated.View
                style={[
                  styles.iconFlower,
                  {
                    transform: [{ scale: typeof safeWaveScale === 'number' ? safeWaveScale : 1 }],
                    opacity: 0.4 * baseOpacity,
                  },
                ]}
              >
                {[...Array(4)].map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.flowerPetal,
                      {
                        transform: [
                          { rotate: `${i * 90}deg` },
                          { translateY: -6 },
                        ],
                        borderColor: 'rgba(150,255,200,0.4)',
                        width: 8,
                        height: 8,
                      },
                    ]}
                  />
                ))}
              </Animated.View>
            </>
          );

        case 'happy':
          // Bright, radiating sun patterns
          return (
            <>
              <Animated.View
                style={[
                  styles.iconMandala,
                  {
                    transform: [
                      { rotate: typeof safeRotation === 'string' ? safeRotation : '0deg' }, 
                      { scale: typeof safePulseScale === 'number' ? safePulseScale : 1 }
                    ],
                    opacity: baseOpacity * 0.6,
                  },
                ]}
              >
                {[...Array(12)].map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.mandalaRay,
                      {
                        transform: [{ rotate: `${i * 30}deg` }],
                        backgroundColor: 'rgba(255,200,100,0.6)',
                        width: i % 3 === 0 ? 3 : 1,
                        height: i % 3 === 0 ? 32 : 24,
                      },
                    ]}
                  />
                ))}
              </Animated.View>
              <Animated.View
                style={[
                  styles.iconFlower,
                  {
                    transform: [
                      { scale: typeof safeWaveScale === 'number' ? safeWaveScale : 1 }, 
                      { rotate: typeof safeCounterRotation === 'string' ? safeCounterRotation : '0deg' }
                    ],
                    opacity: 0.7 * baseOpacity,
                  },
                ]}
              >
                {[...Array(8)].map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.flowerPetal,
                      {
                        transform: [
                          { rotate: `${i * 45}deg` },
                          { translateY: -10 },
                        ],
                        borderColor: 'rgba(255,220,120,0.5)',
                        backgroundColor: 'rgba(255,240,150,0.2)',
                      },
                    ]}
                  />
                ))}
              </Animated.View>
            </>
          );

        case 'energized':
          // Dynamic, electric patterns
          return (
            <>
              <Animated.View
                style={[
                  styles.iconMandala,
                  {
                    transform: [
                      { rotate: typeof safeRotation === 'string' ? safeRotation : '0deg' }, 
                      { scale: typeof safePulseScale === 'number' ? safePulseScale : 1 }
                    ],
                    opacity: baseOpacity * 0.6,
                  },
                ]}
              >
                {[...Array(10)].map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.mandalaRay,
                      {
                        transform: [{ rotate: `${i * 36}deg` }],
                        backgroundColor: 'rgba(100,255,255,0.6)',
                        width: 1.5,
                        height: 26,
                      },
                    ]}
                  />
                ))}
              </Animated.View>
              <Animated.View
                style={[
                  styles.iconSpiral,
                  {
                    transform: [
                      { rotate: typeof safeCounterRotation === 'string' ? safeCounterRotation : '0deg' }, 
                      { scale: typeof safeSpiralScale === 'number' ? safeSpiralScale : 1 }
                    ],
                    opacity: 0.8 * baseOpacity,
                  },
                ]}
              >
                {[...Array(8)].map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.spiralDot,
                      {
                        transform: [
                          { rotate: `${i * 45}deg` },
                          { translateY: -14 - i * 1.5 },
                        ],
                        backgroundColor: 'rgba(150,255,255,0.8)',
                        width: 4,
                        height: 4,
                      },
                    ]}
                  />
                ))}
              </Animated.View>
              <Animated.View
                style={[
                  styles.iconTriangles,
                  {
                    transform: [
                      { rotate: typeof safeRotation === 'string' ? safeRotation : '0deg' }, 
                      { scale: typeof safeWaveScale === 'number' ? safeWaveScale : 1 }
                    ],
                    opacity: 0.6 * baseOpacity,
                  },
                ]}
              >
                {[...Array(6)].map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.innerTriangle,
                      {
                        transform: [{ rotate: `${i * 60}deg` }],
                        borderBottomColor: 'rgba(120,255,255,0.5)',
                        borderLeftWidth: 3,
                        borderRightWidth: 3,
                        borderBottomWidth: 5,
                      },
                    ]}
                  />
                ))}
              </Animated.View>
            </>
          );

        default:
          // Default pattern
          return (
            <>
              <Animated.View
                style={[
                  styles.iconMandala,
                  {
                    transform: [
                      { rotate: typeof safeRotation === 'string' ? safeRotation : '0deg' }, 
                      { scale: typeof safePulseScale === 'number' ? safePulseScale : 1 }
                    ],
                    opacity: baseOpacity * 0.6,
                  },
                ]}
              >
                {[...Array(8)].map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.mandalaRay,
                      {
                        transform: [{ rotate: `${i * 45}deg` }],
                      },
                    ]}
                  />
                ))}
              </Animated.View>
            </>
          );
      }
    };

    return (
      <View style={styles.iconContainer}>
        {/* Sacred Geometry Background */}
        {renderSacredGeometry()}

        {/* Main Icon */}
        <Animated.View
          style={[
            styles.mainIcon,
            {
              transform: [{ scale: isSelected ? (typeof safePulseScale === 'number' ? safePulseScale : 1) : 1 }],
            },
          ]}
        >
          <Icon size={24} color="#fff" />
        </Animated.View>
      </View>
    );
  };

  const getEmotionIcon = useCallback((emotion: EmotionalState, isSelected: boolean) => {
    return <SacredGeometryIcon emotion={emotion} isSelected={isSelected} />;
  }, []);

  const filteredSessions = useMemo(() => 
    selectedEmotion
      ? sessions.filter((s) => s.targetEmotions.includes(selectedEmotion.id))
      : sessions,
    [selectedEmotion]
  );

  // Show loading state while navigation is not ready
  if (!isNavigationReady) {
    return (
      <LinearGradient colors={["#1a1a2e", "#16213e", "#0f3460"]} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={["#1a1a2e", "#16213e", "#0f3460"]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <Animated.View
            style={[
              styles.header,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <Text style={styles.greeting}>Welcome back</Text>
            <Text style={styles.title}>How are you feeling?</Text>
          </Animated.View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.emotionsContainer}
          >
            {emotionalStates.map((emotion, index) => {
              const isSelected = selectedEmotion?.id === emotion.id;

              return (
                <Animated.View
                  key={emotion.id}
                  style={{
                    opacity: fadeAnim,
                    transform: [
                      {
                        translateY: (() => {
                          try {
                            return fadeAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [20, 0],
                              extrapolate: 'clamp',
                            });
                          } catch (error) {
                            console.log('Home fadeAnim translateY interpolation error:', error);
                            return 0;
                          }
                        })(),
                      },
                    ],
                  }}
                >
                  <TouchableOpacity
                    onPress={() => handleEmotionSelect(emotion)}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={isSelected ? (emotion.gradient as unknown as readonly [string, string, ...string[]]) : ["#2a2a3e", "#1f1f2e"] as const}
                      style={[
                        styles.emotionCard,
                        isSelected && styles.emotionCardSelected,
                      ]}
                    >
                      {getEmotionIcon(emotion, isSelected)}
                      <Text style={styles.emotionLabel}>{emotion.label}</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </ScrollView>

          <View style={styles.sessionsSection}>
            <Text style={styles.sectionTitle}>
              {selectedEmotion
                ? `Sessions for ${selectedEmotion.label}`
                : "Recommended Sessions"}
            </Text>

            {filteredSessions.map((session, index) => (
              <Animated.View
                key={session.id}
                style={{
                  opacity: fadeAnim,
                  transform: [
                    {
                      translateX: (() => {
                        try {
                          return fadeAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [-30, 0],
                            extrapolate: 'clamp',
                          });
                        } catch (error) {
                          console.log('Home fadeAnim translateX interpolation error:', error);
                          return 0;
                        }
                      })(),
                    },
                  ],
                }}
              >
                <TouchableOpacity
                  onPress={() => handleSessionPress(session)}
                  activeOpacity={0.9}
                >
                  <LinearGradient
                    colors={session.gradient as unknown as readonly [string, string, ...string[]]}
                    style={styles.sessionCard}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <View style={styles.sessionContent}>
                      <View style={styles.sessionInfo}>
                        <Text style={styles.sessionTitle}>{session.title}</Text>
                        <Text style={styles.sessionDescription}>
                          {session.description}
                        </Text>
                        <View style={styles.sessionMeta}>
                          <View style={styles.sessionTag}>
                            <Text style={styles.sessionTagText}>
                              {session.duration} min
                            </Text>
                          </View>
                          <View style={styles.sessionTag}>
                            <Text style={styles.sessionTagText}>
                              {session.frequency}Hz
                            </Text>
                          </View>
                        </View>
                      </View>
                      <View style={styles.sessionIcon}>
                        <Waves size={32} color="rgba(255,255,255,0.8)" />
                      </View>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>

          <View style={styles.statsContainer}>
            <Text style={styles.statsTitle}>Your Progress</Text>
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{progress.totalSessions}</Text>
                <Text style={styles.statLabel}>Sessions</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{progress.totalMinutes}</Text>
                <Text style={styles.statLabel}>Minutes</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{progress.streak}</Text>
                <Text style={styles.statLabel}>Day Streak</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  greeting: {
    fontSize: 16,
    color: "rgba(255,255,255,0.7)",
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold" as const,
    color: "#fff",
  },
  emotionsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  emotionCard: {
    width: 100,
    height: 100,
    borderRadius: 20,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  emotionCardSelected: {
    borderColor: "rgba(255,255,255,0.5)",
  },
  emotionLabel: {
    color: "#fff",
    fontSize: 14,
    marginTop: 8,
    fontWeight: "600" as const,
  },
  sessionsSection: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold" as const,
    color: "#fff",
    marginBottom: 20,
  },
  sessionCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    minHeight: 120,
  },
  sessionContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sessionInfo: {
    flex: 1,
    marginRight: 16,
  },
  sessionTitle: {
    fontSize: 18,
    fontWeight: "bold" as const,
    color: "#fff",
    marginBottom: 8,
  },
  sessionDescription: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginBottom: 12,
    lineHeight: 20,
  },
  sessionMeta: {
    flexDirection: "row",
    gap: 8,
  },
  sessionTag: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  sessionTagText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600" as const,
  },
  sessionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  statsContainer: {
    paddingHorizontal: 20,
    marginTop: 30,
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: "bold" as const,
    color: "#fff",
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold" as const,
    color: "#fff",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600" as const,
  },
  // Sacred Geometry Icon Styles
  iconContainer: {
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  iconMandala: {
    position: "absolute",
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  mandalaRay: {
    position: "absolute",
    width: 1,
    height: 25,
    backgroundColor: "rgba(255,255,255,0.4)",
    top: 0,
  },
  iconSpiral: {
    position: "absolute",
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  spiralDot: {
    position: "absolute",
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "rgba(255,255,255,0.6)",
  },
  iconTriangles: {
    position: "absolute",
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  innerTriangle: {
    position: "absolute",
    width: 0,
    height: 0,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderBottomWidth: 7,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "rgba(255,255,255,0.5)",
    top: -3.5,
  },
  iconFlower: {
    position: "absolute",
    width: 35,
    height: 35,
    alignItems: "center",
    justifyContent: "center",
  },
  flowerPetal: {
    position: "absolute",
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
  },
  mainIcon: {
    zIndex: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});