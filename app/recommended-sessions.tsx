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
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  Waves,
  ArrowLeft,
} from "lucide-react-native";
import { emotionalStates, sessions } from "@/constants/sessions";
import { Session } from "@/types/session";
import * as Haptics from "expo-haptics";

export default function RecommendedSessionsScreen() {
  const router = useRouter();
  const { emotionId } = useLocalSearchParams<{ emotionId: string }>();
  const [isNavigationReady, setIsNavigationReady] = useState(false);
  const fadeAnim = useMemo(() => new Animated.Value(0), []);
  const scaleAnim = useMemo(() => new Animated.Value(0.95), []);

  const selectedEmotion = useMemo(() => 
    emotionalStates.find(emotion => emotion.id === emotionId),
    [emotionId]
  );

  const filteredSessions = useMemo(() => 
    selectedEmotion
      ? sessions.filter((s) => s.targetEmotions.includes(selectedEmotion.id))
      : sessions,
    [selectedEmotion]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsNavigationReady(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

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

  const handleSessionPress = useCallback((session: Session) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    router.push({
      pathname: "/session",
      params: { sessionId: session.id },
    });
  }, [router]);

  const handleBackPress = useCallback(() => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  }, [router]);

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
            <View style={styles.headerTop}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={handleBackPress}
                activeOpacity={0.7}
              >
                <ArrowLeft size={24} color="#fff" />
              </TouchableOpacity>
              <View style={styles.headerText}>
                <Text style={styles.title}>
                  {selectedEmotion
                    ? `Sessions for ${selectedEmotion.label}`
                    : "Recommended Sessions"}
                </Text>
                <Text style={styles.subtitle}>
                  How do you want to feel?
                </Text>
              </View>
            </View>
          </Animated.View>

          <View style={styles.sessionsSection}>
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
                          console.warn('RecommendedSessions fadeAnim translateX interpolation error:', error);
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
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold" as const,
    color: "#fff",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.7)",
  },
  sessionsSection: {
    paddingHorizontal: 20,
    marginTop: 20,
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
});