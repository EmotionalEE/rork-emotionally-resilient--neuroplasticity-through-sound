import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AudioProvider } from "@/providers/AudioProvider";
import { UserProgressProvider } from "@/providers/UserProgressProvider";
import { AuthProvider } from "@/providers/AuthProvider";
import { PaymentProvider } from "@/providers/PaymentProvider";
import { DynamicMusicProvider } from "@/providers/DynamicMusicProvider";
import { CustomMusicProvider } from "@/providers/CustomMusicProvider";

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
      <Stack.Screen name="profile" />
      <Stack.Screen name="session" options={{ presentation: "modal" }} />
      <Stack.Screen name="subscription" options={{ presentation: "modal" }} />
      <Stack.Screen name="payment-methods" options={{ presentation: "modal" }} />
      <Stack.Screen name="dynamic-music" options={{ presentation: "modal" }} />
      <Stack.Screen name="music-library" options={{ presentation: "modal" }} />
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
          <PaymentProvider>
            <UserProgressProvider>
              <AudioProvider>
                <DynamicMusicProvider>
                  <CustomMusicProvider>
                    <RootLayoutNav />
                  </CustomMusicProvider>
                </DynamicMusicProvider>
              </AudioProvider>
            </UserProgressProvider>
          </PaymentProvider>
        </AuthProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}