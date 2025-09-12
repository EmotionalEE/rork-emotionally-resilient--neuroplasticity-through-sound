import React, { useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import { useRouter } from "expo-router";
import { useUserProgress } from "@/providers/UserProgressProvider";
import { useAuth } from "@/providers/AuthProvider";

export default function IndexScreen() {
  const router = useRouter();
  const { hasSeenWelcome, hasCompletedOnboarding } = useUserProgress();
  const { isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    // Small delay to ensure providers are loaded
    const timer = setTimeout(() => {
      console.log("Index navigation check:", {
        isLoading,
        hasSeenWelcome,
        isAuthenticated,
        hasCompletedOnboarding,
        user: user ? `${user.name} (${user.email})` : 'null'
      });
      
      if (isLoading) {
        console.log("Still loading, waiting...");
        return; // Wait for auth to load
      }
      
      if (!hasSeenWelcome) {
        console.log("Redirecting to welcome");
        router.replace("/welcome");
      } else if (!isAuthenticated) {
        console.log("Redirecting to login");
        router.replace("/login");
      } else if (!hasCompletedOnboarding) {
        console.log("Redirecting to onboarding");
        router.replace("/onboarding");
      } else {
        console.log("Redirecting to home");
        router.replace("/home");
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [hasSeenWelcome, hasCompletedOnboarding, isAuthenticated, isLoading, router, user]);

  return (
    <View style={styles.container}>
      <Text style={styles.debugText}>Loading...</Text>
      <Text style={styles.debugText}>Auth Loading: {isLoading.toString()}</Text>
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