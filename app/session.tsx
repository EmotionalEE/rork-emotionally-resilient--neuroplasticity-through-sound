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
  Activity,
} from "lucide-react-native";
import { sessions, emotionalStates } from "@/constants/sessions";
import { useAudio } from "@/providers/AudioProvider";
import { useUserProgress } from "@/providers/UserProgressProvider";
import { useEmotions } from "@/providers/EmotionProvider";
import EmotionSelector from "@/components/EmotionSelector";
import VisualMeditation from "@/components/VisualMeditation";
import EmotionVisualizer from "@/components/EmotionVisualizer";
import SacredGeometry from "@/components/SacredGeometry";
import * as Haptics from "expo-haptics";

export default function SessionScreen() {
  const router = useRouter();
  const { sessionId } = useLocalSearchParams();
  const { playSound, stopSound, isPlaying } = useAudio();
  const { addSession } = useUserProgress();
  const { addEmotion } = useEmotions();
  
  const session = useMemo(() => sessions.find((s) => s.id === sessionId), [sessionId]);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showPreEmotionSelector, setShowPreEmotionSelector] = useState(false);
  const [showPostEmotionSelector, setShowPostEmotionSelector] = useState(false);
  const [preSessionEmotion, setPreSessionEmotion] = useState<string | null>(null);
  const [sessionStarted, setSessionStarted] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const waveAnim = useRef(new Animated.Value(0)).current;
  const breathAnim = useRef(new Animated.Value(0)).current;
  const [breathingPhase, setBreathingPhase] = useState<'in' | 'out'>('in');

  // Show pre-session emotion selector when component mounts
  useEffect(() => {
    if (session && !sessionStarted) {
      setShowPreEmotionSelector(true);
    }
  }, [session, sessionStarted]);

  useEffect(() => {
    if (!session || !sessionStarted) return;

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

    return () => {
      stopSound();
      clearInterval(breathTimer);
    };
  }, [session, sessionStarted, pulseAnim, waveAnim, breathAnim, stopSound]);

  const handleComplete = useCallback(async () => {
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    stopSound();
    setShowPostEmotionSelector(true);
  }, [stopSound]);

  const handlePostEmotionSelect = useCallback(async (emotionId: string, intensity: number) => {
    if (session) {
      await addSession(session.id, Math.floor(timeElapsed / 60));
      await addEmotion(emotionId, intensity, session.id);
    }
    
    Alert.alert(
      "Session Complete!",
      "Great job! You've completed this session and tracked your emotional progress.",
      [
        {
          text: "Continue",
          onPress: () => router.back(),
        },
      ]
    );
  }, [session, timeElapsed, addSession, addEmotion, router]);

  useEffect(() => {
    if (!isPaused && session && sessionStarted) {
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
  }, [isPaused, session, sessionStarted, handleComplete]);

  const handlePlayPause = useCallback(async () => {
    if (!sessionStarted) return;
    
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
  }, [isPlaying, session, sessionStarted, playSound, stopSound]);

  const handlePreEmotionSelect = useCallback(async (emotionId: string, intensity: number) => {
    await addEmotion(emotionId, intensity, session?.id);
    setPreSessionEmotion(emotionId);
    setShowPreEmotionSelector(false);
    setSessionStarted(true);
    
    // Auto-start the session
    if (session) {
      await playSound(session.audioUrl);
      setIsPaused(false);
    }
  }, [addEmotion, session, playSound]);

  const handlePreEmotionClose = useCallback(() => {
    setShowPreEmotionSelector(false);
    router.back();
  }, [router]);

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

  // const currentMood = getCurrentMood(); // Removed unused variable
  const preEmotionState = preSessionEmotion ? emotionalStates.find(e => e.id === preSessionEmotion) : null;

  const progress = (timeElapsed / (session.duration * 60)) * 100;

  return (
    <>
      <EmotionSelector
        visible={showPreEmotionSelector}
        onClose={handlePreEmotionClose}
        onSelect={handlePreEmotionSelect}
        title="How are you feeling before this session?"
      />
      
      <EmotionSelector
        visible={showPostEmotionSelector}
        onClose={() => {
          setShowPostEmotionSelector(false);
          router.back();
        }}
        onSelect={handlePostEmotionSelect}
        title="How are you feeling after this session?"
      />
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

          {/* Sacred Geometry Visualization */}
          <View style={styles.visualizer}>
            {sessionStarted ? (
              <VisualMeditation
                frequency={parseInt(session.frequency, 10)}
                isPlaying={isPlaying}
                emotionGradient={session.gradient}
              />
            ) : (
              <>
                <SacredGeometry
                  type="flowerOfLife"
                  size={200}
                  color="#ffffff"
                  animated={false}
                  opacity={0.6}
                />
                <View style={styles.centerCircle}>
                  <Brain size={48} color="#fff" />
                </View>
              </>
            )}
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
            {preEmotionState && (
              <View style={styles.infoCard}>
                <EmotionVisualizer
                  emotionId={preEmotionState.id}
                  intensity={5}
                  gradient={preEmotionState.gradient}
                  size={40}
                />
                <Text style={styles.infoText}>Starting: {preEmotionState.label}</Text>
              </View>
            )}
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
    </>
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
    position: "relative",
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