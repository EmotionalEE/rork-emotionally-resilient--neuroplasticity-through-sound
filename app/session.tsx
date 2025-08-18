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
const SacredGeometry = ({ isPlaying, breathingPhase }: { isPlaying: boolean; breathingPhase: 'in' | 'out' }) => {
  const geometryAnim = useRef(new Animated.Value(0)).current;
  const rotationAnim = useRef(new Animated.Value(0)).current;
  const mandalaAnim = useRef(new Animated.Value(0)).current;
  const flowerAnim = useRef(new Animated.Value(0)).current;
  const counterRotationAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const animationsRef = useRef<Animated.CompositeAnimation[]>([]);

  // Initialize animations properly
  useEffect(() => {
    // Reset all values to initial state
    geometryAnim.setValue(0);
    rotationAnim.setValue(0);
    mandalaAnim.setValue(0);
    flowerAnim.setValue(0);
    counterRotationAnim.setValue(0);
    pulseAnim.setValue(1);
    console.log('Sacred geometry animations initialized');
  }, []);

  useEffect(() => {
    console.log('Sacred geometry effect triggered, isPlaying:', isPlaying);
    
    // Only initialize animations once, don't restart them
    if (animationsRef.current.length > 0) {
      console.log('Animations already running, skipping initialization');
      return;
    }

    console.log('Starting sacred geometry animations (always on)');
    
    // Reset all values before starting new animations
    geometryAnim.setValue(0);
    rotationAnim.setValue(0);
    mandalaAnim.setValue(0);
    flowerAnim.setValue(0);
    counterRotationAnim.setValue(0);
    pulseAnim.setValue(1);
    
    // Start all animations immediately
    // Main geometry animation
    const geometryAnimation = Animated.loop(
      Animated.timing(geometryAnim, {
        toValue: 1,
        duration: 8000,
        useNativeDriver: true,
      })
    );
    geometryAnimation.start();
    animationsRef.current.push(geometryAnimation);

    // Rotation animation (clockwise)
    const rotationAnimation = Animated.loop(
      Animated.timing(rotationAnim, {
        toValue: 1,
        duration: 15000,
        useNativeDriver: true,
      })
    );
    rotationAnimation.start();
    animationsRef.current.push(rotationAnimation);

    // Counter rotation (counter-clockwise)
    const counterRotationAnimation = Animated.loop(
      Animated.timing(counterRotationAnim, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
      })
    );
    counterRotationAnimation.start();
    animationsRef.current.push(counterRotationAnimation);

    // Mandala pulsing
    const mandalaAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(mandalaAnim, {
          toValue: 1,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(mandalaAnim, {
          toValue: 0,
          duration: 2500,
          useNativeDriver: true,
        }),
      ])
    );
    mandalaAnimation.start();
    animationsRef.current.push(mandalaAnimation);

    // Flower of Life animation
    const flowerAnimation = Animated.loop(
      Animated.timing(flowerAnim, {
        toValue: 1,
        duration: 10000,
        useNativeDriver: true,
      })
    );
    flowerAnimation.start();
    animationsRef.current.push(flowerAnimation);

    // Pulse animation - make it more intense when playing
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
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
    animationsRef.current.push(pulseAnimation);
    
    console.log('All sacred geometry animations started, count:', animationsRef.current.length);

    return () => {
      console.log('Cleaning up sacred geometry animations');
      animationsRef.current.forEach(anim => {
        try {
          anim.stop();
        } catch (error) {
          console.log('Error stopping animation in cleanup:', error);
        }
      });
      animationsRef.current = [];
    };
  }, []);



  // Create safe interpolations with proper error handling
  const safeRotation = useMemo(() => {
    try {
      return rotationAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
        extrapolate: 'clamp',
      });
    } catch (error) {
      console.log('Rotation interpolation error:', error);
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
      console.log('Counter rotation interpolation error:', error);
      return '0deg';
    }
  }, [counterRotationAnim]);

  const safeScale = useMemo(() => {
    try {
      return geometryAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0.8, 1.2, 0.8],
        extrapolate: 'clamp',
      });
    } catch (error) {
      console.log('Scale interpolation error:', error);
      return 1;
    }
  }, [geometryAnim]);

  const safeMandalaScale = useMemo(() => {
    try {
      return mandalaAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [1, 1.3, 1],
        extrapolate: 'clamp',
      });
    } catch (error) {
      console.log('Mandala scale interpolation error:', error);
      return 1;
    }
  }, [mandalaAnim]);

  const safeFlowerOpacity = useMemo(() => {
    try {
      return flowerAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0.3, 0.8, 0.3],
        extrapolate: 'clamp',
      });
    } catch (error) {
      console.log('Flower opacity interpolation error:', error);
      return 0.5;
    }
  }, [flowerAnim]);

  const safePulseScale = useMemo(() => {
    try {
      return pulseAnim.interpolate({
        inputRange: [1, 1.2],
        outputRange: [1, 1.2],
        extrapolate: 'clamp',
      });
    } catch (error) {
      console.log('Pulse scale interpolation error:', error);
      return 1;
    }
  }, [pulseAnim]);

  // Breathing animations with safe interpolation
  const safeBreathScale = useMemo(() => {
    if (!isPlaying || !breathingPhase) return 1;
    return breathingPhase === 'in' ? 1.4 : 0.6;
  }, [isPlaying, breathingPhase]);
  
  const safeBreathOpacity = useMemo(() => {
    if (!isPlaying || !breathingPhase) return 0.5;
    return breathingPhase === 'in' ? 0.9 : 0.3;
  }, [isPlaying, breathingPhase]);

  return (
    <View style={styles.geometryContainer}>
      {/* Outer rotating mandala */}
      <Animated.View
        style={[
          styles.mandalaOuter,
          {
            transform: [
              { rotate: typeof safeRotation === 'string' ? safeRotation : '0deg' }, 
              { scale: typeof safeMandalaScale === 'number' ? safeMandalaScale : 1 }
            ],
            opacity: typeof safeFlowerOpacity === 'number' ? safeFlowerOpacity : 0.5,
          },
        ]}
      >
        {[...Array(16)].map((_, i) => (
          <Animated.View
            key={i}
            style={[
              styles.mandalaLine,
              {
                transform: [
                  { rotate: `${i * 22.5}deg` },
                  { scale: typeof safePulseScale === 'number' ? safePulseScale : 1 },
                ],
                opacity: 0.6,
              },
            ]}
          />
        ))}
      </Animated.View>

      {/* Counter-rotating outer ring */}
      <Animated.View
        style={[
          styles.outerRing,
          {
            transform: [
              { rotate: typeof safeCounterRotation === 'string' ? safeCounterRotation : '0deg' }, 
              { scale: typeof safePulseScale === 'number' ? safePulseScale : 1 }
            ],
            opacity: 0.6,
          },
        ]}
      >
        {[...Array(8)].map((_, i) => (
          <View
            key={i}
            style={[
              styles.ringDot,
              {
                transform: [
                  { rotate: `${i * 45}deg` },
                  { translateY: -120 },
                ],
              },
            ]}
          />
        ))}
      </Animated.View>

      {/* Middle hexagon pattern */}
      <Animated.View
        style={[
          styles.hexagonContainer,
          {
            transform: [
              { rotate: typeof safeCounterRotation === 'string' ? safeCounterRotation : '0deg' }, 
              { scale: typeof safeScale === 'number' ? safeScale : 1 }
            ],
          },
        ]}
      >
        {[...Array(6)].map((_, i) => (
          <Animated.View
            key={i}
            style={[
              styles.hexagonSide,
              {
                transform: [{ rotate: `${i * 60}deg` }],
                opacity: 0.6,
              },
            ]}
          />
        ))}
      </Animated.View>

      {/* Flower of Life pattern */}
      <Animated.View
        style={[
          styles.flowerContainer,
          {
            opacity: typeof safeFlowerOpacity === 'number' ? safeFlowerOpacity : 0.5,
            transform: [
              { scale: typeof safeScale === 'number' ? safeScale : 1 }, 
              { rotate: typeof safeRotation === 'string' ? safeRotation : '0deg' }
            ],
          },
        ]}
      >
        {[...Array(7)].map((_, i) => (
          <Animated.View
            key={i}
            style={[
              styles.flowerCircle,
              {
                transform: [
                  { rotate: `${i * 51.43}deg` },
                  { translateY: i === 0 ? 0 : -35 },
                  { scale: typeof safePulseScale === 'number' ? safePulseScale : 1 },
                ],
              },
            ]}
          />
        ))}
      </Animated.View>

      {/* Sacred spiral */}
      <Animated.View
        style={[
          styles.spiralContainer,
          {
            transform: [
              { rotate: typeof safeRotation === 'string' ? safeRotation : '0deg' }, 
              { scale: typeof safeMandalaScale === 'number' ? safeMandalaScale : 1 }
            ],
            opacity: 0.6,
          },
        ]}
      >
        {[...Array(12)].map((_, i) => (
          <Animated.View
            key={i}
            style={[
              styles.spiralDot,
              {
                transform: [
                  { rotate: `${i * 30}deg` },
                  { translateY: -50 - i * 6 },
                  { scale: typeof safePulseScale === 'number' ? safePulseScale : 1 },
                ],
              },
            ]}
          />
        ))}
      </Animated.View>

      {/* Inner rotating triangles */}
      <Animated.View
        style={[
          styles.triangleContainer,
          {
            transform: [
              { rotate: typeof safeCounterRotation === 'string' ? safeCounterRotation : '0deg' }, 
              { scale: typeof safeBreathScale === 'number' ? safeBreathScale : 1 }
            ],
            opacity: typeof safeBreathOpacity === 'number' ? safeBreathOpacity : 0.5,
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
              },
            ]}
          />
        ))}
      </Animated.View>

      {/* Breathing sync geometry */}
      <Animated.View
        style={[
          styles.breathGeometry,
          {
            transform: [
              { scale: typeof safeBreathScale === 'number' ? safeBreathScale : 1 }, 
              { rotate: typeof safeRotation === 'string' ? safeRotation : '0deg' }
            ],
            opacity: typeof safeBreathOpacity === 'number' ? safeBreathOpacity : 0.5,
          },
        ]}
      >
        {[...Array(4)].map((_, i) => (
          <View
            key={i}
            style={[
              styles.breathTriangle,
              {
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

  // Create safe interpolations for main animations at component level
  const safePulseOpacity = useMemo(() => {
    try {
      return pulseAnim.interpolate({
        inputRange: [1, 1.2],
        outputRange: [0.1, 0.3],
        extrapolate: 'clamp',
      });
    } catch (error) {
      console.log('Pulse opacity interpolation error:', error);
      return 0.2;
    }
  }, [pulseAnim]);

  const safeWaveOpacity = useMemo(() => {
    try {
      return waveAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.2, 0.4],
        extrapolate: 'clamp',
      });
    } catch (error) {
      console.log('Wave opacity interpolation error:', error);
      return 0.3;
    }
  }, [waveAnim]);

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
            // Force navigation back to home screen
            router.replace("/");
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
    // Force navigation back to home screen
    router.replace("/");
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
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.timing(waveAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();

    const breathAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(breathAnim, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(breathAnim, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: true,
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
      await addSession(session.id, Math.floor(timeElapsed / 60));
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
            // Force navigation back to home screen
            router.replace("/");
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
            <SacredGeometry isPlaying={isPlaying} breathingPhase={breathingPhase} />
            
            <View
              style={[
                styles.pulseCircle,
                {
                  opacity: typeof safePulseOpacity === 'number' ? safePulseOpacity : 0.2,
                },
              ]}
            />
            <View
              style={[
                styles.waveCircle,
                {
                  opacity: typeof safeWaveOpacity === 'number' ? safeWaveOpacity : 0.3,
                },
              ]}
            />
            <View style={styles.centerCircle}>
              <Brain size={48} color="#fff" />
            </View>
          </View>

          <View style={styles.breathingGuide}>
            <View
              style={[
                styles.breathIndicator,
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
    width: 2,
    height: 140,
    backgroundColor: "rgba(255,255,255,0.4)",
    top: 0,
    borderRadius: 1,
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
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.6)",
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
    width: 2,
    height: 80,
    backgroundColor: "rgba(255,255,255,0.4)",
    top: 0,
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
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.4)",
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
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.7)",
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
});