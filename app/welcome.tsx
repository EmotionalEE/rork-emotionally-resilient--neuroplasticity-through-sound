import React, { useEffect, useState, useMemo } from "react";
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
import { Sparkles, Waves, Heart, ArrowRight } from "lucide-react-native";
import { useUserProgress } from "@/providers/UserProgressProvider";
import * as Haptics from "expo-haptics";



export default function WelcomeScreen() {
  const router = useRouter();
  const { hasSeenWelcome, hasCompletedOnboarding, completeWelcome } = useUserProgress();
  const [showContent, setShowContent] = useState(false);
  const fadeAnim = useMemo(() => new Animated.Value(0), []);
  const scaleAnim = useMemo(() => new Animated.Value(0.8), []);
  const slideAnim = useMemo(() => new Animated.Value(50), []);
  const logoRotateAnim = useMemo(() => new Animated.Value(0), []);
  const particleAnims = useMemo(() => 
    Array.from({ length: 12 }, () => ({
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(0),
      scale: new Animated.Value(0),
    })), []
  );

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
      // Logo rotation animation
      Animated.loop(
        Animated.timing(logoRotateAnim, {
          toValue: 1,
          duration: 20000,
          useNativeDriver: true,
        })
      ).start();

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

      // Staggered particle animations
      particleAnims.forEach((anim, index) => {
        setTimeout(() => {
          Animated.parallel([
            Animated.timing(anim.opacity, {
              toValue: 0.8,
              duration: 800,
              useNativeDriver: true,
            }),
            Animated.spring(anim.scale, {
              toValue: 1,
              tension: 50,
              friction: 8,
              useNativeDriver: true,
            }),
            Animated.loop(
              Animated.sequence([
                Animated.timing(anim.translateY, {
                  toValue: -20,
                  duration: 2000 + Math.random() * 1000,
                  useNativeDriver: true,
                }),
                Animated.timing(anim.translateY, {
                  toValue: 20,
                  duration: 2000 + Math.random() * 1000,
                  useNativeDriver: true,
                }),
              ])
            ),
          ]).start();
        }, index * 150);
      });
    }
  }, [showContent, fadeAnim, scaleAnim, slideAnim, logoRotateAnim, particleAnims]);

  const handleGetStarted = async () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    await completeWelcome();
    
    // Navigate based on onboarding status
    if (!hasCompletedOnboarding) {
      router.replace("/onboarding");
    } else {
      router.replace("/");
    }
  };

  const logoRotation = logoRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Sacred geometry particles positions
  const particlePositions = [
    { top: '15%', left: '10%' },
    { top: '25%', right: '15%' },
    { top: '35%', left: '5%' },
    { top: '45%', right: '8%' },
    { top: '55%', left: '12%' },
    { top: '65%', right: '20%' },
    { top: '75%', left: '8%' },
    { top: '20%', left: '50%' },
    { top: '80%', right: '12%' },
    { top: '30%', right: '45%' },
    { top: '70%', left: '45%' },
    { top: '40%', left: '25%' },
  ];

  return (
    <LinearGradient 
      colors={["#0f0f23", "#1a1a2e", "#16213e", "#0f3460"]} 
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Floating Sacred Geometry Particles */}
        {particleAnims.map((anim, index) => {
          const position = particlePositions[index];
          const icons = [Sparkles, Waves, Heart];
          const Icon = icons[index % icons.length];
          
          return (
            <Animated.View
              key={index}
              style={[
                styles.particle,
                position,
                {
                  opacity: anim.opacity,
                  transform: [
                    { translateY: anim.translateY },
                    { scale: anim.scale },
                  ],
                },
              ]}
            >
              <Icon 
                size={12 + Math.random() * 8} 
                color={`rgba(255, 255, 255, ${0.3 + Math.random() * 0.4})`} 
              />
            </Animated.View>
          );
        })}

        <View style={styles.content}>
          {/* Logo Section */}
          <Animated.View
            style={[
              styles.logoContainer,
              {
                opacity: fadeAnim,
                transform: [
                  { scale: scaleAnim },
                  { rotate: logoRotation },
                ],
              },
            ]}
          >
            <LinearGradient
              colors={["#667eea", "#764ba2", "#f093fb"]}
              style={styles.logoGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.logoInner}>
                <Waves size={40} color="#fff" />
              </View>
            </LinearGradient>
            
            {/* Sacred geometry rings around logo */}
            <View style={styles.logoRings}>
              {[...Array(3)].map((_, i) => (
                <Animated.View
                  key={i}
                  style={[
                    styles.logoRing,
                    {
                      width: 120 + i * 20,
                      height: 120 + i * 20,
                      borderRadius: 60 + i * 10,
                      transform: [
                        {
                          rotate: logoRotateAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [`${i * 120}deg`, `${360 + i * 120}deg`],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  {[...Array(6)].map((_, j) => (
                    <View
                      key={j}
                      style={[
                        styles.ringDot,
                        {
                          transform: [{ rotate: `${j * 60}deg` }],
                        },
                      ]}
                    />
                  ))}
                </Animated.View>
              ))}
            </View>
          </Animated.View>

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
              Transform your emotional landscape through the power of sound frequencies and sacred geometry
            </Text>
          </Animated.View>

          {/* Features */}
          <Animated.View
            style={[
              styles.featuresContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {[
              { icon: Waves, text: "Binaural Beats" },
              { icon: Sparkles, text: "Sacred Geometry" },
              { icon: Heart, text: "Emotional Healing" },
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Animated.View
                  key={index}
                  style={[
                    styles.featureItem,
                    {
                      transform: [
                        {
                          translateY: slideAnim.interpolate({
                            inputRange: [0, 50],
                            outputRange: [0, 20 + index * 10],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  <View style={styles.featureIcon}>
                    <Icon size={20} color="#fff" />
                  </View>
                  <Text style={styles.featureText}>{feature.text}</Text>
                </Animated.View>
              );
            })}
          </Animated.View>

          {/* Get Started Button */}
          <Animated.View
            style={[
              styles.buttonContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <TouchableOpacity
              style={styles.button}
              onPress={handleGetStarted}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["#667eea", "#764ba2"]}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.buttonText}>Begin Your Journey</Text>
                <ArrowRight size={20} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  particle: {
    position: 'absolute',
    zIndex: 1,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 60,
    position: 'relative',
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
  logoRings: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoRing: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringDot: {
    position: 'absolute',
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    top: -1.5,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 50,
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
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 60,
  },
  featureItem: {
    alignItems: 'center',
    flex: 1,
  },
  featureIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  featureText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontWeight: '500' as const,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    position: 'absolute',
    bottom: 50,
  },
  button: {
    width: '100%',
  },
  buttonGradient: {
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
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600' as const,
    marginRight: 8,
  },
});