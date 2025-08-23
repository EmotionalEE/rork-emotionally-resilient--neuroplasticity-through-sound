import React, { useEffect, useState, useMemo, useRef, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Circle, ArrowRight, LogIn, UserPlus } from "lucide-react-native";
import { useUserProgress } from "@/providers/UserProgressProvider";
import * as Haptics from "expo-haptics";

export default function WelcomeScreen() {
  const router = useRouter();
  const { hasSeenWelcome, hasCompletedOnboarding, completeWelcome } = useUserProgress();
  const [showContent, setShowContent] = useState(false);
  const fadeAnim = useMemo(() => new Animated.Value(0), []);
  const scaleAnim = useMemo(() => new Animated.Value(0.8), []);
  const slideAnim = useMemo(() => new Animated.Value(50), []);
  
  // Breathing animation values
  const breatheScale = useRef(new Animated.Value(1)).current;
  const breatheOpacity = useRef(new Animated.Value(0.3)).current;
  const pulseScale = useRef(new Animated.Value(1)).current;
  


  const startBreathingAnimation = useCallback(() => {
    // Breathing cycle: 4 seconds in, 4 seconds out
    const breathingCycle = () => {
      Animated.sequence([
        // Inhale - expand
        Animated.parallel([
          Animated.timing(breatheScale, {
            toValue: 1.3,
            duration: 4000,
            useNativeDriver: true,
          }),
          Animated.timing(breatheOpacity, {
            toValue: 0.8,
            duration: 4000,
            useNativeDriver: true,
          }),
        ]),
        // Exhale - contract
        Animated.parallel([
          Animated.timing(breatheScale, {
            toValue: 1,
            duration: 4000,
            useNativeDriver: true,
          }),
          Animated.timing(breatheOpacity, {
            toValue: 0.3,
            duration: 4000,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => {
        // Loop the animation
        breathingCycle();
      });
    };
    
    // Subtle pulse animation for the inner circle
    const pulseAnimation = () => {
      Animated.sequence([
        Animated.timing(pulseScale, {
          toValue: 1.1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseScale, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]).start(() => {
        pulseAnimation();
      });
    };
    
    breathingCycle();
    pulseAnimation();
  }, [breatheScale, breatheOpacity, pulseScale]);
  


  useEffect(() => {
    // If user has already seen welcome, redirect immediately
    if (hasSeenWelcome) {
      if (!hasCompletedOnboarding) {
        router.replace("/onboarding");
      } else {
        router.replace("/");
      }
      return;
    }

    // Initial delay then show content
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 500);

    return () => clearTimeout(timer);
  }, [hasSeenWelcome, hasCompletedOnboarding, router]);

  useEffect(() => {
    if (showContent) {
      // Main content animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 20,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start();
      
      // Start breathing animation after content loads
      setTimeout(() => {
        startBreathingAnimation();
      }, 1500);
      

    }
  }, [showContent, fadeAnim, scaleAnim, slideAnim, startBreathingAnimation]);

  const handleGetStarted = async () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    await completeWelcome();
    router.replace("/login");
  };

  const handleLogin = async () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    await completeWelcome();
    router.replace("/login");
  };

  const handleRegister = async () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    await completeWelcome();
    router.replace("/register");
  };



  return (
    <LinearGradient 
      colors={["#0f0f23", "#1a1a2e", "#16213e", "#0f3460"]} 
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          {/* Logo Section */}
          <Animated.View
            style={[
              styles.logoContainer,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            {/* Breathing outer ring */}
            <Animated.View
              style={[
                styles.breathingRing,
                {
                  transform: [{ scale: breatheScale }],
                  opacity: breatheOpacity,
                },
              ]}
            >
              <LinearGradient
                colors={["rgba(102, 126, 234, 0.3)", "rgba(118, 75, 162, 0.3)", "rgba(240, 147, 251, 0.3)"]}
                style={styles.breathingGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
            </Animated.View>
            
            {/* Main logo */}
            <LinearGradient
              colors={["#667eea", "#764ba2", "#f093fb"]}
              style={styles.logoGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Animated.View 
                style={[
                  styles.logoInner,
                  {
                    transform: [{ scale: pulseScale }],
                  },
                ]}
              >
                <Circle size={40} color="#fff" />
              </Animated.View>
            </LinearGradient>
            

          </Animated.View>

          {/* Main Content */}
          <View style={styles.mainContent}>
            {/* Welcome Text */}
            <Animated.View
              style={[
                styles.textContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <Text style={styles.welcomeText}>Welcome to</Text>
              <LinearGradient
                colors={["#667eea", "#764ba2", "#f093fb"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.titleGradient}
              >
                <Text style={styles.title}>Harmonia</Text>
              </LinearGradient>
              <Text style={styles.subtitle}>
                Transform your emotional landscape through the power of sound frequencies and music
              </Text>
            </Animated.View>


          </View>

          {/* Auth Buttons */}
          <Animated.View
            style={[
              styles.buttonContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* Get Started Button */}
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleGetStarted}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["#667eea", "#764ba2"]}
                style={styles.primaryButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.primaryButtonText}>Begin Your Journey</Text>
                <ArrowRight size={20} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>

            {/* Auth Options */}
            <View style={styles.authOptionsContainer}>
              <TouchableOpacity
                style={styles.authButton}
                onPress={handleLogin}
                activeOpacity={0.8}
              >
                <LogIn size={18} color="#667eea" />
                <Text style={styles.authButtonText}>Sign In</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.authButton}
                onPress={handleRegister}
                activeOpacity={0.8}
              >
                <UserPlus size={18} color="#667eea" />
                <Text style={styles.authButtonText}>Create Account</Text>
              </TouchableOpacity>
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
    paddingHorizontal: 30,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },

  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    flex: 1,
  },
  breathingRing: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    zIndex: 1,
  },
  breathingGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 80,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  breathingTextContainer: {
    position: 'absolute',
    bottom: -35,
    alignItems: 'center',
  },
  breathingText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    fontWeight: '300' as const,
    textAlign: 'center',
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  logoGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  logoInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  textContainer: {
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 10,
    fontWeight: '300' as const,
  },
  titleGradient: {
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 15,
    marginBottom: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold' as const,
    color: '#fff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 10,
  },

  buttonContainer: {
    width: '100%',
    paddingHorizontal: 0,
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 20,
  },
  primaryButton: {
    width: '100%',
    marginBottom: 16,
  },
  primaryButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 30,
    shadowColor: '#667eea',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600' as const,
    marginRight: 8,
  },
  authOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  authButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(102, 126, 234, 0.3)',
  },
  authButtonText: {
    color: '#667eea',
    fontSize: 15,
    fontWeight: '500' as const,
    marginLeft: 6,
  },
});