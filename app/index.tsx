import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { useRouter } from "expo-router";
import { useUserProgress } from "@/providers/UserProgressProvider";
import { useAuth } from "@/providers/AuthProvider";

export default function IndexScreen() {
  const router = useRouter();
  const { hasSeenWelcome, hasCompletedOnboarding } = useUserProgress();
  const { isAuthenticated, isLoading, user } = useAuth();
  const [debugInfo, setDebugInfo] = useState<string>("");
  
  // Add debug info on mount
  useEffect(() => {
    const checkAsyncStorage = async () => {
      try {
        const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
        const authData = await AsyncStorage.getItem('auth_user');
        const onboardingData = await AsyncStorage.getItem('onboarding_completed');
        const welcomeData = await AsyncStorage.getItem('welcome_seen');
        
        const info = `Storage: auth=${authData ? 'exists' : 'null'}, onboarding=${onboardingData}, welcome=${welcomeData}`;
        setDebugInfo(info);
        console.log("AsyncStorage debug:", info);
      } catch (error) {
        console.error("Error checking AsyncStorage:", error);
      }
    };
    
    checkAsyncStorage();
  }, []);

  useEffect(() => {
    // Small delay to ensure providers are loaded
    const timer = setTimeout(() => {
      console.log("=== INDEX NAVIGATION CHECK ===");
      console.log("Auth loading:", isLoading);
      console.log("Has seen welcome:", hasSeenWelcome);
      console.log("Is authenticated:", isAuthenticated);
      console.log("Has completed onboarding:", hasCompletedOnboarding);
      console.log("User:", user ? `${user.name} (${user.email})` : 'null');
      console.log("================================");
      
      if (isLoading) {
        console.log("Still loading auth, waiting...");
        return; // Wait for auth to load
      }
      
      if (!hasSeenWelcome) {
        console.log("→ Redirecting to welcome");
        router.replace("/welcome");
      } else if (!isAuthenticated) {
        console.log("→ Redirecting to login (not authenticated)");
        router.replace("/login");
      } else if (!hasCompletedOnboarding) {
        console.log("→ Redirecting to onboarding");
        router.replace("/onboarding");
      } else {
        console.log("→ Redirecting to home (all checks passed)");
        router.replace("/home");
      }
    }, 200); // Increased delay slightly

    return () => clearTimeout(timer);
  }, [hasSeenWelcome, hasCompletedOnboarding, isAuthenticated, isLoading, router, user]);

  return (
    <View style={styles.container}>
      <Text style={styles.debugText}>🔄 Loading App...</Text>
      <Text style={styles.debugText}>Auth Loading: {isLoading.toString()}</Text>
      <Text style={styles.debugText}>Is Authenticated: {isAuthenticated.toString()}</Text>
      <Text style={styles.debugText}>User: {user ? `${user.name} (${user.email})` : 'null'}</Text>
      <Text style={styles.debugText}>Has Seen Welcome: {hasSeenWelcome.toString()}</Text>
      <Text style={styles.debugText}>Has Completed Onboarding: {hasCompletedOnboarding.toString()}</Text>
      <Text style={[styles.debugText, { marginTop: 20, fontSize: 14, opacity: 0.7 }]}>Check console for detailed logs</Text>
      {debugInfo && <Text style={[styles.debugText, { fontSize: 12, opacity: 0.5 }]}>{debugInfo}</Text>}
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
    paddingHorizontal: 20,
  },
});