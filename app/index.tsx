import React, { useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import { useRouter } from "expo-router";
import { useUserProgress } from "@/providers/UserProgressProvider";
import { useAuth } from "@/providers/AuthProvider";

export default function IndexScreen() {
  const router = useRouter();
  const { hasSeenWelcome, hasCompletedOnboarding, isLoading: progressLoading } = useUserProgress();
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();

  useEffect(() => {
    const isLoading = authLoading || progressLoading;
    
    console.log("[INDEX] Navigation check:", {
      authLoading,
      progressLoading,
      isLoading,
      hasSeenWelcome,
      isAuthenticated,
      hasCompletedOnboarding,
      user: user ? `${user.name} (${user.email})` : 'null'
    });
    
    // Wait for both providers to finish loading
    if (isLoading) {
      console.log("[INDEX] Still loading, waiting...");
      return;
    }
    
    // Small delay to ensure state is stable
    const timer = setTimeout(() => {
      console.log("[INDEX] Determining navigation route...");
      
      if (!hasSeenWelcome) {
        console.log("[INDEX] Redirecting to welcome");
        router.replace("/welcome");
      } else if (!isAuthenticated) {
        console.log("[INDEX] Redirecting to login");
        router.replace("/login");
      } else if (!hasCompletedOnboarding) {
        console.log("[INDEX] Redirecting to onboarding");
        router.replace("/onboarding");
      } else {
        console.log("[INDEX] Redirecting to home");
        router.replace("/home");
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [hasSeenWelcome, hasCompletedOnboarding, isAuthenticated, authLoading, progressLoading, router, user]);

  return (
    <View style={styles.container}>
      <Text style={styles.debugText}>Loading...</Text>
      <Text style={styles.debugText}>Auth Loading: {authLoading.toString()}</Text>
      <Text style={styles.debugText}>Progress Loading: {progressLoading.toString()}</Text>
      <Text style={styles.debugText}>Is Authenticated: {isAuthenticated.toString()}</Text>
      <Text style={styles.debugText}>User: {user ? `${user.name} (${user.email})` : 'null'}</Text>
      <Text style={styles.debugText}>Has Seen Welcome: {hasSeenWelcome.toString()}</Text>
      <Text style={styles.debugText}>Has Completed Onboarding: {hasCompletedOnboarding.toString()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  debugText: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
  },
});