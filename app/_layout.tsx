import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AudioProvider } from "@/providers/AudioProvider";
import { UserProgressProvider } from "@/providers/UserProgressProvider";
import { AuthProvider } from "@/providers/AuthProvider";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="welcome" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="login" options={{ presentation: "modal" }} />
      <Stack.Screen name="register" options={{ presentation: "modal" }} />
      <Stack.Screen name="index" />
      <Stack.Screen name="home" />
      <Stack.Screen name="session" options={{ presentation: "modal" }} />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AuthProvider>
          <UserProgressProvider>
            <AudioProvider>
              <RootLayoutNav />
            </AudioProvider>
          </UserProgressProvider>
        </AuthProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}