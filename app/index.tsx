import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useUserProgress } from "@/providers/UserProgressProvider";
import { useAuth } from "@/providers/AuthProvider";

export default function IndexScreen() {
  const router = useRouter();
  const { hasSeenWelcome, hasCompletedOnboarding } = useUserProgress();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    // Small delay to ensure providers are loaded
    const timer = setTimeout(() => {
      if (isLoading) return; // Wait for auth to load
      
      if (!hasSeenWelcome) {
        router.replace("/welcome");
      } else if (!isAuthenticated) {
        router.replace("/login");
      } else if (!hasCompletedOnboarding) {
        router.replace("/onboarding");
      } else {
        router.replace("/home");
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [hasSeenWelcome, hasCompletedOnboarding, isAuthenticated, isLoading, router]);

  return <View style={styles.container} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
  },
});