import React, { useEffect, useState, useMemo, useCallback } from "react";
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
  const { progress, hasCompletedOnboarding } = useUserProgress();
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionalState | null>(null);
  const [isNavigationReady, setIsNavigationReady] = useState(false);
  const fadeAnim = useMemo(() => new Animated.Value(0), []);
  const scaleAnim = useMemo(() => new Animated.Value(0.95), []);

  // Use useFocusEffect to ensure navigation is ready
  useFocusEffect(
    useCallback(() => {
      setIsNavigationReady(true);
    }, [])
  );

  useEffect(() => {
    if (!isNavigationReady) return;
    
    if (!hasCompletedOnboarding) {
      router.replace("/onboarding");
      return;
    }

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
  }, [hasCompletedOnboarding, fadeAnim, scaleAnim, router, isNavigationReady]);

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

  const getEmotionIcon = useCallback((emotion: EmotionalState) => {
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
    return <Icon size={24} color="#fff" />;
  }, []);

  const filteredSessions = useMemo(() => 
    selectedEmotion
      ? sessions.filter((s) => s.targetEmotions.includes(selectedEmotion.id))
      : sessions,
    [selectedEmotion]
  );

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
                        translateY: fadeAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [20, 0],
                        }),
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
                      {getEmotionIcon(emotion)}
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
                      translateX: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-30, 0],
                      }),
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
});