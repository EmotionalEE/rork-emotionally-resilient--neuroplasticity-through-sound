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
import SocialShare from "@/components/SocialShare";
import * as Haptics from "expo-haptics";
import SacredGeometryRenderer from "@/components/geometry/SacredGeometryRenderer";

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
  const [shareModalVisible, setShareModalVisible] = useState<boolean>(false);
  const [shareData, setShareData] = useState<{
    type: 'progress' | 'achievement' | 'streak' | 'session';
    title: string;
    description: string;
    stats?: {
      sessions?: number;
      streak?: number;
      minutes?: number;
      improvement?: number;
    };
  } | null>(null);
  
  // Icon animation values
  const heartAnim = useRef(new Animated.Value(1)).current;
  const activityAnim = useRef(new Animated.Value(0)).current;
  const volumeAnim = useRef(new Animated.Value(1)).current;
  
  // Initialize animated values with proper numbers
  useEffect(() => {
    pulseAnim.setValue(1);
    waveAnim.setValue(0);
    breathAnim.setValue(0);
    heartAnim.setValue(1);
    activityAnim.setValue(0);
    volumeAnim.setValue(1);
  }, [pulseAnim, waveAnim, breathAnim, heartAnim, activityAnim, volumeAnim]);

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

  // Icon animations
  const heartScale = heartAnim.interpolate({
    inputRange: [0.8, 1, 1.2],
    outputRange: [0.8, 1, 1.2],
    extrapolate: 'clamp',
  });

  const activityRotation = activityAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const volumeScale = volumeAnim.interpolate({
    inputRange: [0.9, 1, 1.1],
    outputRange: [0.9, 1, 1.1],
    extrapolate: 'clamp',
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
            // Always navigate to home to avoid GO_BACK errors
            router.replace("/home");
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
    // Always navigate to home to avoid GO_BACK errors
    router.replace("/home");
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

    // Heart beating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(heartAnim, {
          toValue: 1.2,
          duration: 600,
          useNativeDriver: false,
        }),
        Animated.timing(heartAnim, {
          toValue: 0.8,
          duration: 600,
          useNativeDriver: false,
        }),
        Animated.timing(heartAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: false,
        }),
      ])
    ).start();

    // Activity pulse animation
    Animated.loop(
      Animated.timing(activityAnim, {
        toValue: 1,
        duration: 4000,
        useNativeDriver: false,
      })
    ).start();

    // Volume wave animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(volumeAnim, {
          toValue: 1.1,
          duration: 1500,
          useNativeDriver: false,
        }),
        Animated.timing(volumeAnim, {
          toValue: 0.9,
          duration: 1500,
          useNativeDriver: false,
        }),
      ])
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

  const handleShare = useCallback((type: 'session') => {
    if (!session) return;
    
    const sessionMinutes = Math.floor(timeElapsed / 60);
    const title = `Completed: ${session.title}`;
    const description = `Just finished a ${sessionMinutes}-minute ${session.title.toLowerCase()} session. Feeling more centered and peaceful!`;
    
    setShareData({ 
      type, 
      title, 
      description,
      stats: {
        minutes: sessionMinutes,
      }
    });
    setShareModalVisible(true);
  }, [session, timeElapsed]);

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
          text: "Share Progress",
          onPress: () => handleShare('session'),
        },
        {
          text: "Continue",
          onPress: () => {
            // Always navigate to home to avoid GO_BACK errors
            router.replace("/home");
          },
        },
      ]
    );
  }, [session, timeElapsed, addSession, stopSound, router, handleShare]);

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
            <View style={styles.geometryContainer}>
              <SacredGeometryRenderer geometry={session.geometry} />
            </View>
            
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
              <Animated.View style={{ transform: [{ scale: heartScale }] }}>
                <Heart size={20} color="#fff" />
              </Animated.View>
              <Text style={styles.infoText}>Reduces Stress</Text>
            </View>
            <View style={styles.infoCard}>
              <Animated.View style={{ transform: [{ rotate: activityRotation }] }}>
                <Activity size={20} color="#fff" />
              </Animated.View>
              <Text style={styles.infoText}>Balances Energy</Text>
            </View>
            <View style={styles.infoCard}>
              <Animated.View style={{ transform: [{ scale: volumeScale }] }}>
                <Volume2 size={20} color="#fff" />
              </Animated.View>
              <Text style={styles.infoText}>Binaural Beats</Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
      
      {/* Social Share Modal */}
      {shareData && (
        <SocialShare
          visible={shareModalVisible}
          onClose={() => {
            setShareModalVisible(false);
            setShareData(null);
            // Navigate to home after sharing
            router.replace("/home");
          }}
          shareType={shareData.type}
          data={shareData}
        />
      )}
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