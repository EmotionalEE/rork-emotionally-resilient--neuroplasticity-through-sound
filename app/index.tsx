import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useUserProgress } from "@/providers/UserProgressProvider";

export default function IndexScreen() {
  const router = useRouter();
  const { hasSeenWelcome, hasCompletedOnboarding } = useUserProgress();

  useEffect(() => {
    // Small delay to ensure providers are loaded
    const timer = setTimeout(() => {
      if (!hasSeenWelcome) {
        router.replace("/welcome");
      } else if (!hasCompletedOnboarding) {
        router.replace("/onboarding");
      } else {
        router.replace("/home");
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [hasSeenWelcome, hasCompletedOnboarding, router]);

  return <View style={styles.container} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
  },
});