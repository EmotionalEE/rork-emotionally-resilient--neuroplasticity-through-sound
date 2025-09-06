import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useFocusEffect } from "expo-router";
import {
  Brain,
  Heart,
  Sparkles,
  Waves,
  Activity,
  Moon,
  Sun,
  Cloud,
  Zap,
  LogOut,
  User,
  LucideIcon,
  Crown,
} from "lucide-react-native";
import {
  EggOfLife,
  FruitOfLife,
  MetatronsCube,
  VesicaPiscis,
  SeedOfLife,
  SixPetalRosette,
  TreeOfLife,
  Merkabah,
  FlowerOfLife,
  Cubeoctahedron,
  VectorEquilibrium,
  TetrahedronGrid,
} from "@/components/SacredGeometry";
import { CalmLandscape } from "@/components/CalmLandscape";
import { emotionalStates } from "@/constants/sessions";
import { useUserProgress } from "@/providers/UserProgressProvider";
import { useAuth } from "@/providers/AuthProvider";
import { usePayment } from "@/providers/PaymentProvider";
import { EmotionalState } from "@/types/session";
import * as Haptics from "expo-haptics";

export default function HomeScreen() {
  const router = useRouter();
  const { progress } = useUserProgress();
  const { user, logout } = useAuth();
  const { isPremium, trialDaysLeft, subscription } = usePayment();

  const [isNavigationReady, setIsNavigationReady] = useState(false);
  const fadeAnim = useMemo(() => new Animated.Value(0), []);
  const scaleAnim = useMemo(() => new Animated.Value(0.95), []);
  




  // Use useFocusEffect to handle navigation when screen is focused
  useFocusEffect(
    useCallback(() => {
      // Small delay to ensure navigation is ready
      const timer = setTimeout(() => {
        setIsNavigationReady(true);
      }, 100);

      return () => clearTimeout(timer);
    }, [])
  );

  // Handle animations after navigation is ready
  useEffect(() => {
    if (isNavigationReady) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 20,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
      

    }
  }, [isNavigationReady, fadeAnim, scaleAnim]);

  const handleEmotionSelect = useCallback((emotion: EmotionalState) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push({
      pathname: "/recommended-sessions",
      params: { emotionId: emotion.id },
    });
  }, [router]);



  const handleLogout = useCallback(async () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    await logout();
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/welcome");
    }
  }, [logout, router]);

  // Sacred Geometry Icon Component
  const SacredGeometryIcon = ({ emotion, isSelected }: { emotion: EmotionalState; isSelected: boolean }) => {
    const rotationAnim = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const mandalaAnim = useRef(new Animated.Value(0)).current;
    const spiralAnim = useRef(new Animated.Value(0)).current;
    const counterRotationAnim = useRef(new Animated.Value(0)).current;
    const waveAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      // Initialize all animation values to ensure they start from a known state
      rotationAnim.setValue(0);
      counterRotationAnim.setValue(0);
      pulseAnim.setValue(1);
      mandalaAnim.setValue(0);
      spiralAnim.setValue(0);
      waveAnim.setValue(0);

      // Always start animations for all icons
      const rotationAnimation = Animated.loop(
        Animated.timing(rotationAnim, {
          toValue: 1,
          duration: 8000 + Math.random() * 4000, // Vary duration for each icon
          useNativeDriver: true,
        })
      );
      rotationAnimation.start();

      const counterRotationAnimation = Animated.loop(
        Animated.timing(counterRotationAnim, {
          toValue: 1,
          duration: 12000 + Math.random() * 6000, // Vary duration for each icon
          useNativeDriver: true,
        })
      );
      counterRotationAnimation.start();

      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: isSelected ? 1.3 : 1.1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimation.start();

      const mandalaAnimation = Animated.loop(
        Animated.timing(mandalaAnim, {
          toValue: 1,
          duration: 3000 + Math.random() * 2000, // Vary duration for each icon
          useNativeDriver: true,
        })
      );
      mandalaAnimation.start();

      const spiralAnimation = Animated.loop(
        Animated.timing(spiralAnim, {
          toValue: 1,
          duration: 5000 + Math.random() * 3000, // Vary duration for each icon
          useNativeDriver: true,
        })
      );
      spiralAnimation.start();

      const waveAnimation = Animated.loop(
        Animated.timing(waveAnim, {
          toValue: 1,
          duration: 2000 + Math.random() * 1000, // Vary duration for each icon
          useNativeDriver: true,
        })
      );
      waveAnimation.start();

      // Cleanup function to stop animations when component unmounts
      return () => {
        rotationAnimation.stop();
        counterRotationAnimation.stop();
        pulseAnimation.stop();
        mandalaAnimation.stop();
        spiralAnimation.stop();
        waveAnimation.stop();
      };
    }, [isSelected, rotationAnim, pulseAnim, mandalaAnim, spiralAnim, counterRotationAnim, waveAnim]);

    // Create interpolations for animations
    const rotationInterpolation = rotationAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
      extrapolate: 'clamp',
    });

    const counterRotationInterpolation = counterRotationAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['360deg', '0deg'],
      extrapolate: 'clamp',
    });

    const spiralScaleInterpolation = spiralAnim.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0.8, 1.2, 0.8],
      extrapolate: 'clamp',
    });

    const waveScaleInterpolation = waveAnim.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [1, 1.4, 1],
      extrapolate: 'clamp',
    });

    const pulseScaleInterpolation = pulseAnim.interpolate({
      inputRange: [1, 1.3],
      outputRange: [1, 1.3],
      extrapolate: 'clamp',
    });

    const icons: Record<string, LucideIcon> = {
      anxious: Cloud,
      stressed: Zap,
      sad: Moon,
      angry: Activity,
      calm: Waves,
      focused: Brain,
      happy: Sun,
      energized: Sparkles,
    };
    const Icon = icons[emotion.id] || Heart;

    // Render different sacred geometry based on emotion
    const renderSacredGeometry = () => {
      const baseOpacity = 1; // Always show geometry at full brightness
      const geometryColor = getGeometryColor(emotion.id);

      switch (emotion.id) {
        case 'anxious':
          // Chaotic swirling pattern for anxiety - using Tetrahedron Grid for dissolution
          return (
            <>
              <Animated.View
                style={[
                  styles.geometryContainer,
                  {
                    transform: [
                      { rotate: rotationInterpolation }, 
                      { scale: pulseScaleInterpolation }
                    ],
                    opacity: baseOpacity * 0.8,
                  },
                ]}
              >
                <TetrahedronGrid size={50} color={geometryColor} strokeWidth={1.5} />
              </Animated.View>
              <Animated.View
                style={[
                  styles.geometryContainer,
                  {
                    transform: [
                      { rotate: counterRotationInterpolation }, 
                      { scale: spiralScaleInterpolation }
                    ],
                    opacity: 0.6 * baseOpacity,
                  },
                ]}
              >
                <VesicaPiscis size={35} color={geometryColor} strokeWidth={1} />
              </Animated.View>
            </>
          );

        case 'stressed':
          // Sharp, precise patterns for stress - using Merkabah
          return (
            <>
              <Animated.View
                style={[
                  styles.geometryContainer,
                  {
                    transform: [
                      { rotate: rotationInterpolation }, 
                      { scale: pulseScaleInterpolation }
                    ],
                    opacity: 0.8 * baseOpacity,
                  },
                ]}
              >
                <Merkabah size={45} color={geometryColor} strokeWidth={2} />
              </Animated.View>
              <Animated.View
                style={[
                  styles.geometryContainer,
                  {
                    transform: [
                      { rotate: counterRotationInterpolation }, 
                      { scale: spiralScaleInterpolation }
                    ],
                    opacity: baseOpacity * 0.6,
                  },
                ]}
              >
                <TreeOfLife size={30} color={geometryColor} strokeWidth={1} />
              </Animated.View>
            </>
          );

        case 'sad':
          // Gentle, flowing patterns - using Seed of Life
          return (
            <>
              <Animated.View
                style={[
                  styles.geometryContainer,
                  {
                    transform: [
                      { scale: waveScaleInterpolation }, 
                      { rotate: rotationInterpolation }
                    ],
                    opacity: baseOpacity * 0.7,
                  },
                ]}
              >
                <SeedOfLife size={45} color={geometryColor} strokeWidth={1.5} />
              </Animated.View>
              <Animated.View
                style={[
                  styles.geometryContainer,
                  {
                    transform: [
                      { rotate: counterRotationInterpolation }, 
                      { scale: spiralScaleInterpolation }
                    ],
                    opacity: 0.5 * baseOpacity,
                  },
                ]}
              >
                <VesicaPiscis size={30} color={geometryColor} strokeWidth={1} />
              </Animated.View>
            </>
          );

        case 'angry':
          // Intense, powerful patterns - using Metatron's Cube
          return (
            <>
              <Animated.View
                style={[
                  styles.geometryContainer,
                  {
                    transform: [
                      { rotate: rotationInterpolation }, 
                      { scale: pulseScaleInterpolation }
                    ],
                    opacity: baseOpacity * 0.8,
                  },
                ]}
              >
                <MetatronsCube size={50} color={geometryColor} strokeWidth={2} />
              </Animated.View>
              <Animated.View
                style={[
                  styles.geometryContainer,
                  {
                    transform: [
                      { rotate: counterRotationInterpolation }, 
                      { scale: spiralScaleInterpolation }
                    ],
                    opacity: 0.6 * baseOpacity,
                  },
                ]}
              >
                <Merkabah size={35} color={geometryColor} strokeWidth={1.5} />
              </Animated.View>
            </>
          );

        case 'calm':
          // Smooth, flowing patterns - using Flower of Life
          return (
            <>
              <Animated.View
                style={[
                  styles.geometryContainer,
                  {
                    transform: [{ scale: waveScaleInterpolation }],
                    opacity: baseOpacity * 0.7,
                  },
                ]}
              >
                <FlowerOfLife size={50} color={geometryColor} strokeWidth={1} />
              </Animated.View>
              <Animated.View
                style={[
                  styles.geometryContainer,
                  {
                    transform: [
                      { rotate: rotationInterpolation }, 
                      { scale: spiralScaleInterpolation }
                    ],
                    opacity: 0.5 * baseOpacity,
                  },
                ]}
              >
                <SeedOfLife size={30} color={geometryColor} strokeWidth={1} />
              </Animated.View>
            </>
          );

        case 'focused':
          // Precise, geometric patterns - using Vector Equilibrium
          return (
            <>
              <Animated.View
                style={[
                  styles.geometryContainer,
                  {
                    transform: [
                      { rotate: rotationInterpolation }, 
                      { scale: pulseScaleInterpolation }
                    ],
                    opacity: baseOpacity * 0.8,
                  },
                ]}
              >
                <VectorEquilibrium size={50} color={geometryColor} strokeWidth={1.5} />
              </Animated.View>
              <Animated.View
                style={[
                  styles.geometryContainer,
                  {
                    transform: [
                      { rotate: counterRotationInterpolation }, 
                      { scale: spiralScaleInterpolation }
                    ],
                    opacity: 0.6 * baseOpacity,
                  },
                ]}
              >
                <Cubeoctahedron size={35} color={geometryColor} strokeWidth={1} />
              </Animated.View>
            </>
          );

        case 'happy':
          // Bright, radiating patterns - using Six-Petal Rosette
          return (
            <>
              <Animated.View
                style={[
                  styles.geometryContainer,
                  {
                    transform: [
                      { rotate: rotationInterpolation }, 
                      { scale: pulseScaleInterpolation }
                    ],
                    opacity: baseOpacity * 0.8,
                  },
                ]}
              >
                <SixPetalRosette size={50} color={geometryColor} strokeWidth={1.5} />
              </Animated.View>
              <Animated.View
                style={[
                  styles.geometryContainer,
                  {
                    transform: [
                      { scale: waveScaleInterpolation }, 
                      { rotate: counterRotationInterpolation }
                    ],
                    opacity: 0.6 * baseOpacity,
                  },
                ]}
              >
                <FlowerOfLife size={35} color={geometryColor} strokeWidth={1} />
              </Animated.View>
            </>
          );

        case 'energized':
          // Dynamic, electric patterns - using Fruit of Life
          return (
            <>
              <Animated.View
                style={[
                  styles.geometryContainer,
                  {
                    transform: [
                      { rotate: rotationInterpolation }, 
                      { scale: pulseScaleInterpolation }
                    ],
                    opacity: baseOpacity * 0.8,
                  },
                ]}
              >
                <FruitOfLife size={50} color={geometryColor} strokeWidth={1.5} />
              </Animated.View>
              <Animated.View
                style={[
                  styles.geometryContainer,
                  {
                    transform: [
                      { rotate: counterRotationInterpolation }, 
                      { scale: spiralScaleInterpolation }
                    ],
                    opacity: 0.7 * baseOpacity,
                  },
                ]}
              >
                <EggOfLife size={35} color={geometryColor} strokeWidth={1} />
              </Animated.View>
            </>
          );

        default:
          // Default pattern - using Egg of Life
          return (
            <>
              <Animated.View
                style={[
                  styles.geometryContainer,
                  {
                    transform: [
                      { rotate: rotationInterpolation }, 
                      { scale: pulseScaleInterpolation }
                    ],
                    opacity: baseOpacity * 0.7,
                  },
                ]}
              >
                <EggOfLife size={45} color={geometryColor} strokeWidth={1.5} />
              </Animated.View>
            </>
          );
      }
    };

    // Get color based on emotion
    const getGeometryColor = (emotionId: string): string => {
      switch (emotionId) {
        case 'anxious': return 'rgba(255,100,100,0.7)';
        case 'stressed': return 'rgba(255,200,0,0.7)';
        case 'sad': return 'rgba(150,150,255,0.7)';
        case 'angry': return 'rgba(255,80,120,0.8)';
        case 'calm': return 'rgba(100,200,255,0.7)';
        case 'focused': return 'rgba(100,255,150,0.7)';
        case 'happy': return 'rgba(255,200,100,0.8)';
        case 'energized': return 'rgba(100,255,255,0.8)';
        default: return 'rgba(255,255,255,0.6)';
      }
    };

    return (
      <View style={styles.iconContainer}>
        {/* Sacred Geometry Background */}
        {renderSacredGeometry()}

        {/* Main Icon */}
        <Animated.View
          style={[
            styles.mainIcon,
            {
              transform: [{ scale: isSelected ? pulseScaleInterpolation : 1 }],
            },
          ]}
        >
          <Icon size={24} color="#fff" />
        </Animated.View>
      </View>
    );
  };

  const getEmotionIcon = useCallback((emotion: EmotionalState, isSelected: boolean) => {
    return <SacredGeometryIcon emotion={emotion} isSelected={isSelected} />;
  }, []);



  // Show loading state while navigation is not ready
  if (!isNavigationReady) {
    return (
      <LinearGradient colors={["#1a1a2e", "#16213e", "#0f3460"]} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={["#1a1a2e", "#16213e", "#0f3460"]} style={styles.container}>
      {/* Calm landscape background */}
      <CalmLandscape opacity={0.4} />
      

      
      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <Animated.View
            style={[
              styles.header,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <View style={styles.headerTop}>
              <View style={styles.headerText}>
                <Text style={styles.greeting}>Welcome back{user?.name ? `, ${user.name}` : ''}</Text>
                <Text style={styles.title}>How are you feeling today?</Text>
              </View>
              <View style={styles.headerButtons}>
                <TouchableOpacity
                  style={styles.profileButton}
                  onPress={() => router.push('/profile')}
                  activeOpacity={0.7}
                >
                  <User size={20} color="rgba(255, 255, 255, 0.7)" />
                </TouchableOpacity>
                {!isPremium && (
                  <TouchableOpacity
                    style={styles.premiumButton}
                    onPress={() => router.push('/subscription')}
                    activeOpacity={0.7}
                  >
                    <Crown size={20} color="#fbbf24" />
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={styles.logoutButton}
                  onPress={handleLogout}
                  activeOpacity={0.7}
                >
                  <LogOut size={20} color="rgba(255, 255, 255, 0.7)" />
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>

          {/* How do you feel section */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.emotionsContainer}
          >
            {emotionalStates.map((emotion, index) => {
              const isSelected = false;

              return (
                <Animated.View
                  key={`current-${emotion.id}`}
                  style={{
                    opacity: fadeAnim,
                    transform: [
                      {
                        translateY: (() => {
                          try {
                            return fadeAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [20, 0],
                              extrapolate: 'clamp',
                            });
                          } catch (error) {
                            console.warn('Home fadeAnim translateY interpolation error:', error);
                            return 0;
                          }
                        })(),
                      },
                    ],
                  }}
                >
                  <TouchableOpacity
                    onPress={() => console.log(`Current feeling: ${emotion.label}`)}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={["#2a2a3e", "#1f1f2e"] as const}
                      style={[
                        styles.emotionCard,
                        styles.currentEmotionCard,
                      ]}
                    >
                      {getEmotionIcon(emotion, isSelected)}
                      <Text style={styles.emotionLabel}>{emotion.label}</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </ScrollView>

          {/* How do you want to feel section */}
          <Animated.View
            style={[
              styles.wantToFeelHeader,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <Text style={styles.sectionTitle}>How do you want to feel?</Text>
          </Animated.View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.emotionsContainer}
          >
            {emotionalStates.map((emotion, index) => {
              const isSelected = false;

              return (
                <Animated.View
                  key={`want-${emotion.id}`}
                  style={{
                    opacity: fadeAnim,
                    transform: [
                      {
                        translateY: (() => {
                          try {
                            return fadeAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [20, 0],
                              extrapolate: 'clamp',
                            });
                          } catch (error) {
                            console.warn('Home fadeAnim translateY interpolation error:', error);
                            return 0;
                          }
                        })(),
                      },
                    ],
                  }}
                >
                  <TouchableOpacity
                    onPress={() => handleEmotionSelect(emotion)}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={isSelected ? (emotion.gradient as unknown as readonly [string, string, ...string[]]) : ["#2a2a3e", "#1f1f2e"] as const}
                      style={[
                        styles.emotionCard,
                        isSelected && styles.emotionCardSelected,
                      ]}
                    >
                      {getEmotionIcon(emotion, isSelected)}
                      <Text style={styles.emotionLabel}>{emotion.label}</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </ScrollView>



          {/* Premium Upgrade Prompt */}
          {!isPremium && (
            <Animated.View
              style={[
                styles.upgradePrompt,
                {
                  opacity: fadeAnim,
                  transform: [{ scale: scaleAnim }],
                },
              ]}
            >
              <TouchableOpacity
                onPress={() => router.push('/subscription')}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={["#667eea", "#764ba2"]}
                  style={styles.upgradeGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.upgradeContent}>
                    <View style={styles.upgradeIcon}>
                      <Sparkles size={24} color="#fff" />
                    </View>
                    <View style={styles.upgradeText}>
                      <Text style={styles.upgradeTitle}>Unlock Premium Features</Text>
                      <Text style={styles.upgradeSubtitle}>
                        Advanced sacred geometry, binaural beats & more
                      </Text>
                    </View>
                    <View style={styles.upgradeArrow}>
                      <Text style={styles.upgradeArrowText}>→</Text>
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          )}

          {/* Trial Status */}
          {subscription?.status === 'trialing' && trialDaysLeft > 0 && (
            <Animated.View
              style={[
                styles.trialStatus,
                {
                  opacity: fadeAnim,
                  transform: [{ scale: scaleAnim }],
                },
              ]}
            >
              <LinearGradient
                colors={["#4ade80", "#22c55e"]}
                style={styles.trialGradient}
              >
                <View style={styles.trialContent}>
                  <Heart size={20} color="#fff" />
                  <Text style={styles.trialText}>
                    {trialDaysLeft} days left in your free trial
                  </Text>
                </View>
              </LinearGradient>
            </Animated.View>
          )}

          <View style={styles.statsContainer}>
            <Text style={styles.statsTitle}>Your Progress</Text>
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{progress.totalSessions}</Text>
                <Text style={styles.statLabel}>Sessions</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{progress.totalMinutes}</Text>
                <Text style={styles.statLabel}>Minutes</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{progress.streak}</Text>
                <Text style={styles.statLabel}>Day Streak</Text>
              </View>
            </View>
          </View>
        </ScrollView>
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
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerText: {
    flex: 1,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  premiumButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(251, 191, 36, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.3)',
  },
  greeting: {
    fontSize: 18,
    color: "rgba(255,255,255,0.8)",
    marginBottom: 4,
    fontWeight: "500" as const,
  },
  title: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: "#fff",
    letterSpacing: 0.5,
  },
  emotionsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  emotionCard: {
    width: 95,
    height: 95,
    borderRadius: 18,
    marginRight: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  emotionCardSelected: {
    borderColor: "rgba(255,255,255,0.5)",
  },
  emotionLabel: {
    color: "#fff",
    fontSize: 13,
    marginTop: 6,
    fontWeight: "500" as const,
    textAlign: "center" as const,
  },
  sessionsSection: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "600" as const,
    color: "#fff",
    marginBottom: 16,
    letterSpacing: 0.3,
  },
  sessionCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    minHeight: 120,
  },
  sessionContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sessionInfo: {
    flex: 1,
    marginRight: 16,
  },
  sessionTitle: {
    fontSize: 18,
    fontWeight: "bold" as const,
    color: "#fff",
    marginBottom: 8,
  },
  sessionDescription: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginBottom: 12,
    lineHeight: 20,
  },
  sessionMeta: {
    flexDirection: "row",
    gap: 8,
  },
  sessionTag: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  sessionTagText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600" as const,
  },
  sessionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  statsContainer: {
    paddingHorizontal: 20,
    marginTop: 30,
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: "bold" as const,
    color: "#fff",
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold" as const,
    color: "#fff",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600" as const,
  },
  // Sacred Geometry Icon Styles
  iconContainer: {
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  geometryContainer: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  mainIcon: {
    zIndex: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  upgradePrompt: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 20,
    overflow: "hidden",
  },
  upgradeGradient: {
    padding: 20,
  },
  upgradeContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  upgradeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  upgradeText: {
    flex: 1,
  },
  upgradeTitle: {
    fontSize: 18,
    fontWeight: "bold" as const,
    color: "#fff",
    marginBottom: 4,
  },
  upgradeSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    lineHeight: 20,
  },
  upgradeArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  upgradeArrowText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold" as const,
  },
  trialStatus: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    overflow: "hidden",
  },
  trialGradient: {
    padding: 16,
  },
  trialContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  trialText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#fff",
  },
  wantToFeelHeader: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 8,
  },
  currentEmotionCard: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },

});