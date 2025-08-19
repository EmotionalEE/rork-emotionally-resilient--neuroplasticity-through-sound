import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  Animated,
  Alert,
  BackHandler,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Play,
  Pause,
  X,
  Volume2,
  Brain,
  Heart,
  Activity,
} from "lucide-react-native";
import { sessions } from "@/constants/sessions";
import { useAudio } from "@/providers/AudioProvider";
import { useUserProgress } from "@/providers/UserProgressProvider";
import * as Haptics from "expo-haptics";

// Sacred Geometry Component
const SacredGeometry = ({ 
  isPlaying, 
  breathingPhase, 
  geometry 
}: { 
  isPlaying: boolean; 
  breathingPhase: 'in' | 'out';
  geometry: import('@/types/session').GeometryConfig;
}) => {
  const geometryAnim = useRef(new Animated.Value(0)).current;
  const rotationAnim = useRef(new Animated.Value(0)).current;
  const mandalaAnim = useRef(new Animated.Value(0)).current;
  const flowerAnim = useRef(new Animated.Value(0)).current;
  const counterRotationAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    console.log('Sacred geometry component mounted, starting animations...', geometry.type);
    
    // Reset all values first
    geometryAnim.setValue(0);
    rotationAnim.setValue(0);
    mandalaAnim.setValue(0);
    flowerAnim.setValue(0);
    counterRotationAnim.setValue(0);
    pulseAnim.setValue(1);
    
    // Start all animations immediately when component mounts
    // Main geometry animation
    const geometryAnimation = Animated.loop(
      Animated.timing(geometryAnim, {
        toValue: 1,
        duration: 4000,
        useNativeDriver: false, // Always use JS driver for consistent behavior
      })
    );
    geometryAnimation.start();

    // Rotation animation (clockwise) - use geometry config speed
    const rotationAnimation = Animated.loop(
      Animated.timing(rotationAnim, {
        toValue: 1,
        duration: geometry.rotationSpeed,
        useNativeDriver: false,
      })
    );
    rotationAnimation.start();

    // Counter rotation (counter-clockwise)
    const counterRotationAnimation = Animated.loop(
      Animated.timing(counterRotationAnim, {
        toValue: 1,
        duration: geometry.rotationSpeed + 2000,
        useNativeDriver: false,
      })
    );
    counterRotationAnimation.start();

    // Mandala pulsing
    const mandalaAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(mandalaAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(mandalaAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    );
    mandalaAnimation.start();

    // Flower of Life animation
    const flowerAnimation = Animated.loop(
      Animated.timing(flowerAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: false,
      })
    );
    flowerAnimation.start();

    // Pulse animation - use geometry config intensity
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: geometry.pulseIntensity,
          duration: 800,
          useNativeDriver: false,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: false,
        }),
      ])
    );
    pulseAnimation.start();
    
    console.log('All sacred geometry animations started!');

    // Cleanup function to stop all animations
    return () => {
      console.log('Stopping sacred geometry animations...');
      geometryAnimation.stop();
      rotationAnimation.stop();
      counterRotationAnimation.stop();
      mandalaAnimation.stop();
      flowerAnimation.stop();
      pulseAnimation.stop();
    };
  }, [geometry]);

  // Create interpolations for animations
  const rotation = rotationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const counterRotation = counterRotationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['360deg', '0deg'],
  });

  const scale = geometryAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.8, 1.4, 0.8],
  });

  const mandalaScale = mandalaAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.9, 1.3, 0.9],
  });

  const flowerOpacity = flowerAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 0.9, 0.3],
  });

  const pulseScale = pulseAnim.interpolate({
    inputRange: [1, 1.6],
    outputRange: [1, 1.6],
  });

  // Breathing animations
  const breathScale = breathingPhase === 'in' ? 1.3 : 0.7;
  const breathOpacity = breathingPhase === 'in' ? 0.8 : 0.4;

  // Render different geometry patterns based on type
  const renderGeometry = () => {
    const primaryColor = geometry.colors[0] || 'rgba(255,255,255,0.8)';
    const secondaryColor = geometry.colors[1] || 'rgba(255,255,255,0.6)';
    const accentColor = geometry.colors[2] || 'rgba(255,255,255,0.9)';

    switch (geometry.type) {
      case 'mandala':
        return (
          <>
            {/* Mandala rays */}
            <Animated.View
              style={[
                styles.mandalaOuter,
                {
                  transform: [{ rotate: rotation }, { scale: mandalaScale }],
                  opacity: flowerOpacity,
                },
              ]}
            >
              {[...Array(geometry.elements)].map((_, i) => (
                <Animated.View
                  key={i}
                  style={[
                    styles.mandalaLine,
                    {
                      backgroundColor: primaryColor,
                      transform: [
                        { rotate: `${i * (360 / geometry.elements)}deg` },
                        { scale: pulseScale },
                      ],
                    },
                  ]}
                />
              ))}
            </Animated.View>
            {/* Outer dots */}
            <Animated.View
              style={[
                styles.outerRing,
                {
                  transform: [{ rotate: counterRotation }, { scale: pulseScale }],
                },
              ]}
            >
              {[...Array(geometry.elements / 2)].map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.ringDot,
                    {
                      backgroundColor: secondaryColor,
                      transform: [
                        { rotate: `${i * (360 / (geometry.elements / 2))}deg` },
                        { translateY: -120 },
                      ],
                    },
                  ]}
                />
              ))}
            </Animated.View>
          </>
        );

      case 'flower':
        return (
          <Animated.View
            style={[
              styles.flowerContainer,
              {
                opacity: flowerOpacity,
                transform: [{ scale: scale }, { rotate: rotation }],
              },
            ]}
          >
            {[...Array(geometry.elements)].map((_, i) => (
              <Animated.View
                key={i}
                style={[
                  styles.flowerCircle,
                  {
                    borderColor: i % 2 === 0 ? primaryColor : secondaryColor,
                    transform: [
                      { rotate: `${i * (360 / geometry.elements)}deg` },
                      { translateY: i === 0 ? 0 : -35 },
                      { scale: pulseScale },
                    ],
                  },
                ]}
              />
            ))}
          </Animated.View>
        );

      case 'spiral':
        return (
          <Animated.View
            style={[
              styles.spiralContainer,
              {
                transform: [{ rotate: rotation }, { scale: mandalaScale }],
                opacity: 0.8,
              },
            ]}
          >
            {[...Array(geometry.elements)].map((_, i) => (
              <Animated.View
                key={i}
                style={[
                  styles.spiralDot,
                  {
                    backgroundColor: i % 3 === 0 ? accentColor : i % 3 === 1 ? primaryColor : secondaryColor,
                    transform: [
                      { rotate: `${i * (360 / geometry.elements)}deg` },
                      { translateY: -50 - i * 6 },
                      { scale: pulseScale },
                    ],
                  },
                ]}
              />
            ))}
          </Animated.View>
        );

      case 'triangle':
        return (
          <>
            {[...Array(geometry.layers)].map((layer) => (
              <Animated.View
                key={layer}
                style={[
                  styles.triangleContainer,
                  {
                    transform: [
                      { rotate: layer % 2 === 0 ? rotation : counterRotation },
                      { scale: breathScale * (1 + layer * 0.2) },
                    ],
                    opacity: breathOpacity * (1 - layer * 0.1),
                  },
                ]}
              >
                {[...Array(geometry.elements)].map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.innerTriangle,
                      {
                        borderBottomColor: layer % 2 === 0 ? primaryColor : secondaryColor,
                        transform: [{ rotate: `${i * (360 / geometry.elements)}deg` }],
                      },
                    ]}
                  />
                ))}
              </Animated.View>
            ))}
          </>
        );

      case 'hexagon':
        return (
          <Animated.View
            style={[
              styles.hexagonContainer,
              {
                transform: [{ rotate: counterRotation }, { scale: scale }],
              },
            ]}
          >
            {[...Array(geometry.elements)].map((_, i) => (
              <Animated.View
                key={i}
                style={[
                  styles.hexagonSide,
                  {
                    backgroundColor: primaryColor,
                    transform: [{ rotate: `${i * (360 / geometry.elements)}deg` }],
                    opacity: 0.8,
                  },
                ]}
              />
            ))}
          </Animated.View>
        );

      case 'star':
        return (
          <>
            {[...Array(geometry.layers)].map((layer) => (
              <Animated.View
                key={layer}
                style={[
                  styles.starContainer,
                  {
                    transform: [
                      { rotate: layer % 2 === 0 ? rotation : counterRotation },
                      { scale: (scale as any) * (1 - layer * 0.15) },
                    ],
                    opacity: 0.9 - layer * 0.2,
                  },
                ]}
              >
                {[...Array(geometry.elements)].map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.starPoint,
                      {
                        backgroundColor: layer === 0 ? accentColor : layer === 1 ? primaryColor : secondaryColor,
                        transform: [
                          { rotate: `${i * (360 / geometry.elements)}deg` },
                          { translateY: -60 - layer * 10 },
                        ],
                      },
                    ]}
                  />
                ))}
              </Animated.View>
            ))}
          </>
        );

      case 'lotus':
        return (
          <>
            {[...Array(geometry.layers)].map((layer) => (
              <Animated.View
                key={layer}
                style={[
                  styles.lotusLayer,
                  {
                    transform: [
                      { rotate: `${layer * 15}deg` },
                      { scale: (scale as any) * (1 - layer * 0.1) },
                    ],
                    opacity: (flowerOpacity as any) * (1 - layer * 0.1),
                  },
                ]}
              >
                {[...Array(geometry.elements)].map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.lotusPetal,
                      {
                        backgroundColor: layer % 3 === 0 ? primaryColor : layer % 3 === 1 ? secondaryColor : accentColor,
                        transform: [
                          { rotate: `${i * (360 / geometry.elements)}deg` },
                          { translateY: -40 - layer * 8 },
                        ],
                      },
                    ]}
                  />
                ))}
              </Animated.View>
            ))}
          </>
        );

      case 'merkaba':
        return (
          <>
            {/* Upper tetrahedron */}
            <Animated.View
              style={[
                styles.merkabaContainer,
                {
                  transform: [{ rotate: rotation }, { scale: scale }],
                  opacity: 0.8,
                },
              ]}
            >
              {[...Array(geometry.elements)].map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.merkabaTriangle,
                    {
                      borderBottomColor: primaryColor,
                      transform: [{ rotate: `${i * (360 / geometry.elements)}deg` }],
                    },
                  ]}
                />
              ))}
            </Animated.View>
            {/* Lower tetrahedron */}
            <Animated.View
              style={[
                styles.merkabaContainer,
                {
                  transform: [{ rotate: counterRotation }, { scale: scale }, { rotateX: '180deg' }],
                  opacity: 0.6,
                },
              ]}
            >
              {[...Array(geometry.elements)].map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.merkabaTriangle,
                    {
                      borderBottomColor: secondaryColor,
                      transform: [{ rotate: `${i * (360 / geometry.elements)}deg` }],
                    },
                  ]}
                />
              ))}
            </Animated.View>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.geometryContainer}>
      {renderGeometry()}
      
      {/* Breathing sync geometry */}
      <Animated.View
        style={[
          styles.breathGeometry,
          {
            transform: [{ scale: breathScale }, { rotate: rotation }],
            opacity: breathOpacity,
          },
        ]}
      >
        {[...Array(4)].map((_, i) => (
          <View
            key={i}
            style={[
              styles.breathTriangle,
              {
                borderBottomColor: geometry.colors[0] || 'rgba(255,255,255,0.4)',
                transform: [{ rotate: `${i * 90}deg` }],
              },
            ]}
          />
        ))}
      </Animated.View>
    </View>
  );
};

export default function SessionScreen() {
  const router = useRouter();
  const { sessionId } = useLocalSearchParams();
  const { playSound, stopSound, isPlaying } = useAudio();
  const { addSession } = useUserProgress();
  
  const session = useMemo(() => sessions.find((s) => s.id === sessionId), [sessionId]);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const waveAnim = useRef(new Animated.Value(0)).current;
  const breathAnim = useRef(new Animated.Value(0)).current;
  const [breathingPhase, setBreathingPhase] = useState<'in' | 'out'>('in');
  
  // Initialize animated values with proper numbers
  useEffect(() => {
    pulseAnim.setValue(1);
    waveAnim.setValue(0);
    breathAnim.setValue(0);
  }, [pulseAnim, waveAnim, breathAnim]);

  // Create interpolations for main animations
  const pulseOpacity = pulseAnim.interpolate({
    inputRange: [1, 1.2],
    outputRange: [0.1, 0.3],
  });

  const waveOpacity = waveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.2, 0.4],
  });

  // Breathing indicator animation
  const breathIndicatorScale = breathAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1.4],
  });

  const breathIndicatorOpacity = breathAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  const handleClose = useCallback(() => {
    Alert.alert(
      "End Session",
      "Are you sure you want to end this session?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "End Session",
          style: "destructive",
          onPress: async () => {
            try {
              await stopSound();
            } catch (error) {
              console.log("Error stopping sound during close:", error);
            }
            // Use router.dismiss() for modal navigation, fallback to replace
            if (router.canDismiss()) {
              router.dismiss();
            } else if (router.canGoBack()) {
              router.back();
            } else {
              router.replace("/home");
            }
          },
        },
      ]
    );
  }, [stopSound, router]);

  const handleQuickExit = useCallback(async () => {
    try {
      await stopSound();
    } catch (error) {
      console.log("Error stopping sound during quick exit:", error);
    }
    // Use router.dismiss() for modal navigation, fallback to replace
    if (router.canDismiss()) {
      router.dismiss();
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/home");
    }
  }, [stopSound, router]);

  useEffect(() => {
    if (!session) return;

    // Initialize animations

    // Start animations
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.timing(waveAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: false,
      })
    ).start();

    const breathAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(breathAnim, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: false,
        }),
        Animated.timing(breathAnim, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: false,
        }),
      ])
    );
    breathAnimation.start();

    // Update breathing phase
    const breathTimer = setInterval(() => {
      setBreathingPhase(prev => prev === 'in' ? 'out' : 'in');
    }, 4000);

    // Handle Android back button
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      handleClose();
      return true; // Prevent default back action
    });

    return () => {
      stopSound();
      clearInterval(breathTimer);
      backHandler.remove();
    };
  }, [session, pulseAnim, waveAnim, breathAnim, stopSound, handleClose]);

  const handleComplete = useCallback(async () => {
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    if (session) {
      await addSession(session.id, Math.floor(timeElapsed / 60), session.targetEmotions);
    }
    
    try {
      await stopSound();
    } catch (error) {
      console.log("Error stopping sound during completion:", error);
    }
    
    Alert.alert(
      "Session Complete!",
      "Great job! You've completed this session.",
      [
        {
          text: "Continue",
          onPress: () => {
            // Use router.dismiss() for modal navigation, fallback to replace
            if (router.canDismiss()) {
              router.dismiss();
            } else if (router.canGoBack()) {
              router.back();
            } else {
              router.replace("/home");
            }
          },
        },
      ]
    );
  }, [session, timeElapsed, addSession, stopSound, router]);

  useEffect(() => {
    if (!isPaused && session) {
      const timer = setInterval(() => {
        setTimeElapsed((prev) => {
          if (prev >= session.duration * 60) {
            handleComplete();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isPaused, session, handleComplete]);

  const handlePlayPause = useCallback(async () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    if (isPlaying) {
      stopSound();
      setIsPaused(true);
    } else {
      if (session) {
        await playSound(session.audioUrl);
        setIsPaused(false);
      }
    }
  }, [isPlaying, session, playSound, stopSound]);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }, []);

  if (!session) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Session not found</Text>
      </View>
    );
  }

  const progress = (timeElapsed / (session.duration * 60)) * 100;

  return (
    <LinearGradient colors={session.gradient as unknown as readonly [string, string, ...string[]]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleQuickExit} style={styles.closeButton}>
            <X size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.sessionTitle}>{session.title}</Text>
          <Text style={styles.frequency}>{session.frequency}Hz</Text>

          <View style={styles.visualizer}>
            {/* Sacred Geometry Background */}
            <SacredGeometry isPlaying={isPlaying} breathingPhase={breathingPhase} geometry={session.geometry} />
            
            <Animated.View
              style={[
                styles.pulseCircle,
                {
                  opacity: pulseOpacity,
                },
              ]}
            />
            <Animated.View
              style={[
                styles.waveCircle,
                {
                  opacity: waveOpacity,
                },
              ]}
            />
            <View style={styles.centerCircle}>
              <Brain size={48} color="#fff" />
            </View>
          </View>

          <View style={styles.breathingGuide}>
            <Animated.View
              style={[
                styles.breathIndicator,
                {
                  transform: [{ scale: breathIndicatorScale }],
                  opacity: breathIndicatorOpacity,
                },
              ]}
            />
            <Text style={styles.breathText}>
              {breathingPhase === 'in' ? "Breathe In" : "Breathe Out"}
            </Text>
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
            <View style={styles.timeContainer}>
              <Text style={styles.timeText}>{formatTime(timeElapsed)}</Text>
              <Text style={styles.timeText}>
                {formatTime(session.duration * 60)}
              </Text>
            </View>
          </View>

          <View style={styles.controls}>
            <TouchableOpacity
              onPress={handlePlayPause}
              style={styles.playButton}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["rgba(255,255,255,0.3)", "rgba(255,255,255,0.1)"]}
                style={styles.playButtonGradient}
              >
                {isPlaying ? (
                  <Pause size={40} color="#fff" />
                ) : (
                  <Play size={40} color="#fff" style={{ marginLeft: 4 }} />
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <View style={styles.infoCards}>
            <View style={styles.infoCard}>
              <Heart size={20} color="#fff" />
              <Text style={styles.infoText}>Reduces Stress</Text>
            </View>
            <View style={styles.infoCard}>
              <Activity size={20} color="#fff" />
              <Text style={styles.infoText}>Balances Energy</Text>
            </View>
            <View style={styles.infoCard}>
              <Volume2 size={20} color="#fff" />
              <Text style={styles.infoText}>Binaural Beats</Text>
            </View>
          </View>
        </View>
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
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  sessionTitle: {
    fontSize: 28,
    fontWeight: "bold" as const,
    color: "#fff",
    marginBottom: 8,
    textAlign: "center",
  },
  frequency: {
    fontSize: 18,
    color: "rgba(255,255,255,0.8)",
    marginBottom: 40,
  },
  visualizer: {
    width: 300,
    height: 300,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
  },
  geometryContainer: {
    position: "absolute",
    width: 300,
    height: 300,
    alignItems: "center",
    justifyContent: "center",
  },
  mandalaOuter: {
    position: "absolute",
    width: 280,
    height: 280,
    alignItems: "center",
    justifyContent: "center",
  },
  mandalaLine: {
    position: "absolute",
    width: 3,
    height: 140,
    backgroundColor: "rgba(255,255,255,0.7)",
    top: 0,
    borderRadius: 1.5,
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  outerRing: {
    position: "absolute",
    width: 240,
    height: 240,
    alignItems: "center",
    justifyContent: "center",
  },
  ringDot: {
    position: "absolute",
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "rgba(255,255,255,0.8)",
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
  },
  hexagonContainer: {
    position: "absolute",
    width: 160,
    height: 160,
    alignItems: "center",
    justifyContent: "center",
  },
  hexagonSide: {
    position: "absolute",
    width: 3,
    height: 80,
    backgroundColor: "rgba(255,255,255,0.6)",
    top: 0,
    borderRadius: 1.5,
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 3,
  },
  flowerContainer: {
    position: "absolute",
    width: 120,
    height: 120,
    alignItems: "center",
    justifyContent: "center",
  },
  flowerCircle: {
    position: "absolute",
    width: 45,
    height: 45,
    borderRadius: 22.5,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.7)",
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
  },
  spiralContainer: {
    position: "absolute",
    width: 200,
    height: 200,
    alignItems: "center",
    justifyContent: "center",
  },
  spiralDot: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.9)",
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 5,
  },
  triangleContainer: {
    position: "absolute",
    width: 80,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  innerTriangle: {
    position: "absolute",
    width: 0,
    height: 0,
    borderLeftWidth: 12,
    borderRightWidth: 12,
    borderBottomWidth: 20,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "rgba(255,255,255,0.5)",
    top: -10,
  },
  breathGeometry: {
    position: "absolute",
    width: 100,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  breathTriangle: {
    position: "absolute",
    width: 0,
    height: 0,
    borderLeftWidth: 15,
    borderRightWidth: 15,
    borderBottomWidth: 25,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "rgba(255,255,255,0.4)",
    top: -12.5,
  },
  pulseCircle: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#fff",
  },
  waveCircle: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "#fff",
  },
  centerCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.4)",
  },
  breathingGuide: {
    alignItems: "center",
    marginBottom: 30,
  },
  breathIndicator: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.3)",
    marginBottom: 10,
  },
  breathText: {
    fontSize: 16,
    color: "rgba(255,255,255,0.9)",
    fontWeight: "600" as const,
  },
  progressContainer: {
    width: "100%",
    marginBottom: 40,
  },
  progressBar: {
    height: 6,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 10,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#fff",
    borderRadius: 3,
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  timeText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
  },
  controls: {
    marginBottom: 40,
  },
  playButton: {
    width: 80,
    height: 80,
  },
  playButtonGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.4)",
  },
  infoCards: {
    flexDirection: "row",
    gap: 15,
  },
  infoCard: {
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  infoText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600" as const,
  },
  errorText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
  },
  starContainer: {
    position: "absolute",
    width: 200,
    height: 200,
    alignItems: "center",
    justifyContent: "center",
  },
  starPoint: {
    position: "absolute",
    width: 6,
    height: 20,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.8)",
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  lotusLayer: {
    position: "absolute",
    width: 180,
    height: 180,
    alignItems: "center",
    justifyContent: "center",
  },
  lotusPetal: {
    position: "absolute",
    width: 8,
    height: 25,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.7)",
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 3,
  },
  merkabaContainer: {
    position: "absolute",
    width: 150,
    height: 150,
    alignItems: "center",
    justifyContent: "center",
  },
  merkabaTriangle: {
    position: "absolute",
    width: 0,
    height: 0,
    borderLeftWidth: 18,
    borderRightWidth: 18,
    borderBottomWidth: 30,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "rgba(255,255,255,0.6)",
    top: -15,
  },
});