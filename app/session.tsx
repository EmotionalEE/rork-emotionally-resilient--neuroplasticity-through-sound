import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  Animated,
  Alert,
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
import Svg, { Circle, Polygon, Path, G } from "react-native-svg";
import { sessions } from "@/constants/sessions";
import { useAudio } from "@/providers/AudioProvider";
import { useUserProgress } from "@/providers/UserProgressProvider";
import * as Haptics from "expo-haptics";

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
  const geometryAnim = useRef(new Animated.Value(0)).current;
  const mandalaAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!session) return;

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

    // Sacred geometry animations
    Animated.loop(
      Animated.timing(geometryAnim, {
        toValue: 1,
        duration: 8000,
        useNativeDriver: true,
      })
    ).start();

    Animated.loop(
      Animated.timing(mandalaAnim, {
        toValue: 1,
        duration: 12000,
        useNativeDriver: true,
      })
    ).start();

    // Update breathing phase
    const breathTimer = setInterval(() => {
      setBreathingPhase(prev => prev === 'in' ? 'out' : 'in');
    }, 4000);

    return () => {
      stopSound();
      clearInterval(breathTimer);
    };
  }, [session, pulseAnim, waveAnim, breathAnim, geometryAnim, mandalaAnim, stopSound]);

  const handleComplete = useCallback(async () => {
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    if (session) {
      await addSession(session.id, Math.floor(timeElapsed / 60));
    }
    
    stopSound();
    Alert.alert(
      "Session Complete!",
      "Great job! You've completed this session.",
      [
        {
          text: "Continue",
          onPress: () => router.back(),
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

  const handleClose = useCallback(() => {
    Alert.alert(
      "End Session",
      "Are you sure you want to end this session?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "End Session",
          style: "destructive",
          onPress: () => {
            stopSound();
            router.back();
          },
        },
      ]
    );
  }, [stopSound, router]);



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
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <X size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.sessionTitle}>{session.title}</Text>
          <Text style={styles.frequency}>{session.frequency}Hz</Text>

          <View style={styles.visualizer}>
            {/* Sacred Geometry Background */}
            <Animated.View
              style={[
                styles.geometryContainer,
                {
                  transform: [
                    {
                      rotate: geometryAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '360deg'],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Svg width={300} height={300} style={styles.geometrySvg}>
                {/* Flower of Life Pattern */}
                <G opacity={0.3}>
                  <Circle cx={150} cy={150} r={40} fill="none" stroke="#fff" strokeWidth={1} />
                  <Circle cx={150} cy={110} r={40} fill="none" stroke="#fff" strokeWidth={1} />
                  <Circle cx={150} cy={190} r={40} fill="none" stroke="#fff" strokeWidth={1} />
                  <Circle cx={115} cy={130} r={40} fill="none" stroke="#fff" strokeWidth={1} />
                  <Circle cx={185} cy={130} r={40} fill="none" stroke="#fff" strokeWidth={1} />
                  <Circle cx={115} cy={170} r={40} fill="none" stroke="#fff" strokeWidth={1} />
                  <Circle cx={185} cy={170} r={40} fill="none" stroke="#fff" strokeWidth={1} />
                </G>
                {/* Metatron's Cube */}
                <G opacity={0.2}>
                  <Polygon
                    points="150,80 200,120 200,180 150,220 100,180 100,120"
                    fill="none"
                    stroke="#fff"
                    strokeWidth={1}
                  />
                  <Polygon
                    points="150,100 180,120 180,180 150,200 120,180 120,120"
                    fill="none"
                    stroke="#fff"
                    strokeWidth={1}
                  />
                </G>
              </Svg>
            </Animated.View>

            {/* Mandala Pattern */}
            <Animated.View
              style={[
                styles.mandalaContainer,
                {
                  transform: [
                    {
                      rotate: mandalaAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '-360deg'],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Svg width={250} height={250} style={styles.mandalaSvg}>
                <G opacity={0.4}>
                  {/* Outer petals */}
                  {Array.from({ length: 12 }).map((_, i) => {
                    const angle = (i * 30) * Math.PI / 180;
                    const x1 = 125 + Math.cos(angle) * 80;
                    const y1 = 125 + Math.sin(angle) * 80;
                    const x2 = 125 + Math.cos(angle) * 100;
                    const y2 = 125 + Math.sin(angle) * 100;
                    return (
                      <Path
                        key={i}
                        d={`M 125 125 L ${x1} ${y1} L ${x2} ${y2} Z`}
                        fill="none"
                        stroke="#fff"
                        strokeWidth={0.8}
                      />
                    );
                  })}
                  {/* Inner circle */}
                  <Circle cx={125} cy={125} r={60} fill="none" stroke="#fff" strokeWidth={1} />
                  <Circle cx={125} cy={125} r={30} fill="none" stroke="#fff" strokeWidth={1} />
                </G>
              </Svg>
            </Animated.View>

            {/* Pulsing circles */}
            <Animated.View
              style={[
                styles.pulseCircle,
                {
                  transform: [{ scale: pulseAnim }],
                  opacity: pulseAnim.interpolate({
                    inputRange: [1, 1.2],
                    outputRange: [0.3, 0.1],
                  }),
                },
              ]}
            />
            <Animated.View
              style={[
                styles.waveCircle,
                {
                  transform: [
                    {
                      scale: waveAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.8, 1.5],
                      }),
                    },
                  ],
                  opacity: waveAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.5, 0],
                  }),
                },
              ]}
            />
            
            {/* Center icon */}
            <View style={styles.centerCircle}>
              <Brain size={48} color="#fff" />
            </View>
          </View>

          <View style={styles.breathingGuide}>
            <Animated.View
              style={[
                styles.breathIndicator,
                {
                  transform: [
                    {
                      scale: breathAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 1.3],
                      }),
                    },
                  ],
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
  geometrySvg: {
    position: "absolute",
  },
  mandalaContainer: {
    position: "absolute",
    width: 250,
    height: 250,
    alignItems: "center",
    justifyContent: "center",
  },
  mandalaSvg: {
    position: "absolute",
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