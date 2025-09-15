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
  Heart,
  Activity,
} from "lucide-react-native";
import { sessions } from "@/constants/sessions";
import { useAudio } from "@/providers/AudioProvider";
import { useUserProgress } from "@/providers/UserProgressProvider";
import { useCustomMusic } from "@/providers/CustomMusicProvider";
import SocialShare from "@/components/SocialShare";
import * as Haptics from "expo-haptics";
import SacredGeometry from "@/components/SacredGeometry";
import { GeometryConfig } from "@/types/session";

type SacredGeometryVariant = React.ComponentProps<typeof SacredGeometry>["type"];

const geometryTypeMap: Record<GeometryConfig["type"], SacredGeometryVariant> = {
  mandala: "flowerOfLife",
  flower: "flowerOfLife",
  spiral: "goldenSpiral",
  triangle: "metatronsCube",
  hexagon: "flowerOfLife",
  star: "circleOfLife",
  lotus: "flowerOfLife",
  merkaba: "metatronsCube",
  sri_yantra: "sriYantra",
  torus: "circleOfLife",
  dodecahedron: "metatronsCube",
};

export default function SessionScreen() {
  const router = useRouter();
  const { sessionId } = useLocalSearchParams();
  const { playSound, stopSound, isPlaying } = useAudio();
  const { addSession } = useUserProgress();
  const { getSessionMusic } = useCustomMusic();

  const { session, sessionMusic } = useMemo(() => {
    const found = sessions.find((s) => s.id === sessionId);
    return {
      session: found,
      sessionMusic: found ? getSessionMusic(found.id) : undefined,
    };
  }, [sessionId, getSessionMusic]);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
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
    breathAnim.setValue(0);
    heartAnim.setValue(1);
    activityAnim.setValue(0);
    volumeAnim.setValue(1);
  }, [breathAnim, heartAnim, activityAnim, volumeAnim]);



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
  }, [session, breathAnim, stopSound, handleClose]);

  const handleShare = useCallback((type: 'session') => {
    if (!session) return;

    const sessionMinutes = Math.floor(timeElapsed / 60);
    const title = `Completed: ${session.title}`;
    const description = sessionMusic
      ? `Just finished a ${sessionMinutes}-minute session using "${sessionMusic.name}". Feeling more centered and peaceful!`
      : `Just finished a ${sessionMinutes}-minute ${session.title.toLowerCase()} session. Feeling more centered and peaceful!`;

    setShareData({
      type,
      title,
      description,
      stats: {
        minutes: sessionMinutes,
      }
    });
    setShareModalVisible(true);
  }, [session, timeElapsed, sessionMusic]);

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
        await playSound(sessionMusic?.url ?? session.audioUrl);
        setIsPaused(false);
      }
    }
  }, [isPlaying, session, sessionMusic, playSound, stopSound]);

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
  const geometry = session.geometry;
  const sacredGeometryType = geometryTypeMap[geometry.type];
  const sacredGeometryColor = geometry.colors?.[0] ?? "rgba(255,255,255,0.8)";
  const sacredGeometryOpacity = Math.max(
    0.35,
    Math.min(0.85, (geometry.pulseIntensity || 1.2) / 2)
  );
  const sacredGeometryStrokeWidth = Math.min(
    3,
    0.6 + Math.max(1, geometry.layers) * 0.25
  );
  const sacredGeometrySize = 260;

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
            <SacredGeometry
              type={sacredGeometryType}
              size={sacredGeometrySize}
              color={sacredGeometryColor}
              strokeWidth={sacredGeometryStrokeWidth}
              animated
              isActive={sacredGeometryType === "circleOfLife" ? isPlaying : undefined}
              opacity={sacredGeometryOpacity}
            />
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
  // Sri Yantra Sacred Geometry Styles
  sriYantraBindu: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.9)",
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
    zIndex: 10,
  },
  sriYantraContainer: {
    position: "absolute",
    width: 200,
    height: 200,
    alignItems: "center",
    justifyContent: "center",
  },
  sriYantraTriangleUp: {
    position: "absolute",
    width: 0,
    height: 0,
    borderLeftWidth: 20,
    borderRightWidth: 20,
    borderBottomWidth: 35,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "rgba(168,237,234,0.8)",
    top: -17.5,
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
  },
  sriYantraTriangleDown: {
    position: "absolute",
    width: 0,
    height: 0,
    borderLeftWidth: 16,
    borderRightWidth: 16,
    borderTopWidth: 28,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "rgba(254,214,227,0.7)",
    bottom: -14,
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
  sriYantraLotus: {
    position: "absolute",
    width: 240,
    height: 240,
    alignItems: "center",
    justifyContent: "center",
  },
  sriYantraPetal: {
    position: "absolute",
    width: 6,
    height: 30,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.6)",
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
  },
  sriYantraSquare: {
    position: "absolute",
    width: 280,
    height: 280,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.4)",
    backgroundColor: "transparent",
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
});