import React, { useEffect, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Sparkles } from "lucide-react-native";
import { useUserProgress } from "@/providers/UserProgressProvider";

export default function WelcomeScreen() {
  const router = useRouter();
  const { completeWelcome } = useUserProgress();
  const fadeAnim = useMemo(() => new Animated.Value(0), []);
  const scaleAnim = useMemo(() => new Animated.Value(0.8), []);
  const sparkleAnim = useMemo(() => new Animated.Value(0), []);

  useEffect(() => {
    // Start welcome animation
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 20,
          friction: 7,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(sparkleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate to onboarding after 3 seconds
    const timer = setTimeout(async () => {
      await completeWelcome();
      router.replace("/onboarding");
    }, 3000);

    return () => clearTimeout(timer);
  }, [fadeAnim, scaleAnim, sparkleAnim, router, completeWelcome]);

  const sparkleRotation = sparkleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const sparkleScale = sparkleAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.2, 1],
  });

  return (
    <LinearGradient 
      colors={["#1a1a2e", "#16213e", "#0f3460", "#667eea"]} 
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <Animated.View
            style={[
              styles.logoContainer,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <Animated.View
              style={[
                styles.sparkleContainer,
                {
                  transform: [
                    { rotate: sparkleRotation },
                    { scale: sparkleScale },
                  ],
                },
              ]}
            >
              <Sparkles size={80} color="#fff" />
            </Animated.View>
          </Animated.View>

          <Animated.View
            style={[
              styles.textContainer,
              {
                opacity: fadeAnim,
                transform: [
                  {
                    translateY: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [30, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={styles.welcomeText}>Welcome to</Text>
            <Text style={styles.appName}>Harmonia</Text>
            <Text style={styles.subtitle}>Transform your mind through sound</Text>
          </Animated.View>

          {/* Animated dots for loading effect */}
          <Animated.View
            style={[
              styles.loadingContainer,
              {
                opacity: sparkleAnim,
              },
            ]}
          >
            <View style={styles.loadingDots}>
              {[0, 1, 2].map((index) => (
                <Animated.View
                  key={index}
                  style={[
                    styles.loadingDot,
                    {
                      opacity: sparkleAnim.interpolate({
                        inputRange: [0, 0.5, 1],
                        outputRange: [0.3, 1, 0.3],
                      }),
                      transform: [
                        {
                          scale: sparkleAnim.interpolate({
                            inputRange: [0, 0.5, 1],
                            outputRange: [0.8, 1.2, 0.8],
                          }),
                        },
                      ],
                    },
                  ]}
                />
              ))}
            </View>
          </Animated.View>
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
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  logoContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 60,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.2)",
  },
  sparkleContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    alignItems: "center",
    marginBottom: 80,
  },
  welcomeText: {
    fontSize: 24,
    color: "rgba(255,255,255,0.8)",
    marginBottom: 10,
    fontWeight: "300" as const,
  },
  appName: {
    fontSize: 48,
    fontWeight: "bold" as const,
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 18,
    color: "rgba(255,255,255,0.7)",
    textAlign: "center",
    lineHeight: 26,
    fontWeight: "300" as const,
  },
  loadingContainer: {
    position: "absolute",
    bottom: 100,
  },
  loadingDots: {
    flexDirection: "row",
    gap: 12,
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.6)",
  },
});