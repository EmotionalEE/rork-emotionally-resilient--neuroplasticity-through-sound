import React, { useState, useMemo, useCallback } from "react";
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
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";

import Svg, { Circle, Polygon, Path, G } from "react-native-svg";
import { emotionalStates, sessions } from "@/constants/sessions";
import { useUserProgress } from "@/providers/UserProgressProvider";
import { EmotionalState, Session } from "@/types/session";
import * as Haptics from "expo-haptics";

export default function HomeScreen() {
  const router = useRouter();
  const { progress, hasCompletedOnboarding } = useUserProgress();
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionalState | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const fadeAnim = useMemo(() => new Animated.Value(0), []);
  const scaleAnim = useMemo(() => new Animated.Value(0.95), []);

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
    const geometryIcons: Record<string, React.ReactNode> = {
      anxious: (
        <Svg width={24} height={24} viewBox="0 0 24 24">
          <G opacity={0.9}>
            <Circle cx={12} cy={12} r={8} fill="none" stroke="#fff" strokeWidth={1.5} />
            <Circle cx={12} cy={12} r={4} fill="none" stroke="#fff" strokeWidth={1} />
            <Path d="M12 4 L16 8 L12 12 L8 8 Z" fill="none" stroke="#fff" strokeWidth={1} />
          </G>
        </Svg>
      ),
      stressed: (
        <Svg width={24} height={24} viewBox="0 0 24 24">
          <G opacity={0.9}>
            <Polygon points="12,2 22,20 2,20" fill="none" stroke="#fff" strokeWidth={1.5} />
            <Circle cx={12} cy={14} r={3} fill="none" stroke="#fff" strokeWidth={1} />
            <Path d="M12 8 L15 11 L12 14 L9 11 Z" fill="none" stroke="#fff" strokeWidth={1} />
          </G>
        </Svg>
      ),
      sad: (
        <Svg width={24} height={24} viewBox="0 0 24 24">
          <G opacity={0.9}>
            <Circle cx={12} cy={12} r={9} fill="none" stroke="#fff" strokeWidth={1.5} />
            <Path d="M12 3 L12 21 M3 12 L21 12" stroke="#fff" strokeWidth={1} />
            <Circle cx={12} cy={12} r={3} fill="none" stroke="#fff" strokeWidth={1} />
          </G>
        </Svg>
      ),
      angry: (
        <Svg width={24} height={24} viewBox="0 0 24 24">
          <G opacity={0.9}>
            <Polygon points="12,2 20,8 20,16 12,22 4,16 4,8" fill="none" stroke="#fff" strokeWidth={1.5} />
            <Polygon points="12,6 16,10 12,14 8,10" fill="none" stroke="#fff" strokeWidth={1} />
          </G>
        </Svg>
      ),
      calm: (
        <Svg width={24} height={24} viewBox="0 0 24 24">
          <G opacity={0.9}>
            <Circle cx={12} cy={12} r={10} fill="none" stroke="#fff" strokeWidth={1.5} />
            <Circle cx={12} cy={12} r={6} fill="none" stroke="#fff" strokeWidth={1} />
            <Circle cx={12} cy={12} r={2} fill="none" stroke="#fff" strokeWidth={1} />
          </G>
        </Svg>
      ),
      focused: (
        <Svg width={24} height={24} viewBox="0 0 24 24">
          <G opacity={0.9}>
            <Polygon points="12,1 23,12 12,23 1,12" fill="none" stroke="#fff" strokeWidth={1.5} />
            <Circle cx={12} cy={12} r={4} fill="none" stroke="#fff" strokeWidth={1} />
            <Path d="M12 8 L16 12 L12 16 L8 12 Z" fill="none" stroke="#fff" strokeWidth={1} />
          </G>
        </Svg>
      ),
      happy: (
        <Svg width={24} height={24} viewBox="0 0 24 24">
          <G opacity={0.9}>
            {Array.from({ length: 8 }).map((_, i) => {
              const angle = (i * 45) * Math.PI / 180;
              const x1 = 12 + Math.cos(angle) * 6;
              const y1 = 12 + Math.sin(angle) * 6;
              const x2 = 12 + Math.cos(angle) * 10;
              const y2 = 12 + Math.sin(angle) * 10;
              return <Path key={i} d={`M ${x1} ${y1} L ${x2} ${y2}`} stroke="#fff" strokeWidth={1} />;
            })}
            <Circle cx={12} cy={12} r={4} fill="none" stroke="#fff" strokeWidth={1.5} />
          </G>
        </Svg>
      ),
      energized: (
        <Svg width={24} height={24} viewBox="0 0 24 24">
          <G opacity={0.9}>
            <Polygon points="12,2 18,8 18,16 12,22 6,16 6,8" fill="none" stroke="#fff" strokeWidth={1.5} />
            <Polygon points="12,6 15,9 15,15 12,18 9,15 9,9" fill="none" stroke="#fff" strokeWidth={1} />
            <Circle cx={12} cy={12} r={2} fill="#fff" />
          </G>
        </Svg>
      ),
    };
    
    return geometryIcons[emotion.id] || (
      <Svg width={24} height={24} viewBox="0 0 24 24">
        <Circle cx={12} cy={12} r={8} fill="none" stroke="#fff" strokeWidth={1.5} />
      </Svg>
    );
  }, []);

  const filteredSessions = useMemo(() => 
    selectedEmotion
      ? sessions.filter((s) => s.targetEmotions.includes(selectedEmotion.id))
      : sessions,
    [selectedEmotion]
  );

  // Use useFocusEffect to handle navigation after the screen is focused
  useFocusEffect(
    useCallback(() => {
      // Add a small delay to ensure the navigation system is ready
      const timer = setTimeout(() => {
        setIsInitialized(true);
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
      }, 100);

      return () => clearTimeout(timer);
    }, [hasCompletedOnboarding, fadeAnim, scaleAnim, router])
  );

  // Don't render anything until initialized
  if (!isInitialized) {
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
                      <View style={styles.emotionIconContainer}>
                        {getEmotionIcon(emotion)}
                      </View>
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
                        <Svg width={32} height={32} viewBox="0 0 32 32">
                          <G opacity={0.8}>
                            <Circle cx={16} cy={16} r={12} fill="none" stroke="#fff" strokeWidth={1.5} />
                            <Circle cx={16} cy={16} r={8} fill="none" stroke="#fff" strokeWidth={1} />
                            <Circle cx={16} cy={16} r={4} fill="none" stroke="#fff" strokeWidth={1} />
                            <Path d="M16 4 L20 8 L16 12 L12 8 Z" fill="none" stroke="#fff" strokeWidth={1} />
                            <Path d="M28 16 L24 20 L20 16 L24 12 Z" fill="none" stroke="#fff" strokeWidth={1} />
                            <Path d="M16 28 L12 24 L16 20 L20 24 Z" fill="none" stroke="#fff" strokeWidth={1} />
                            <Path d="M4 16 L8 12 L12 16 L8 20 Z" fill="none" stroke="#fff" strokeWidth={1} />
                          </G>
                        </Svg>
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
  emotionIconContainer: {
    alignItems: "center",
    justifyContent: "center",
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
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600" as const,
  },
});