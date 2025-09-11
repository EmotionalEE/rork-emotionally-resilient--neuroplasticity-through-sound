import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
  Animated,
  Dimensions,
  ImageBackground,
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
  Home,
  Search,
  Library,
  MoreHorizontal,
  Play,
  Headphones,
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
import { emotionalStates } from "@/constants/sessions";
import { useUserProgress } from "@/providers/UserProgressProvider";
import { useAuth } from "@/providers/AuthProvider";
import { usePayment } from "@/providers/PaymentProvider";
import { EmotionalState } from "@/types/session";
import * as Haptics from "expo-haptics";

const { width: screenWidth } = Dimensions.get('window');

// Featured sessions data
const featuredSession = {
  id: 'roots-rhythm',
  title: 'Roots in Rhythm',
  subtitle: 'Focus · Music',
  frequency: '14 Hz',
  image: 'https://images.unsplash.com/photo-1511884642898-4c92249e20b6?w=800',
  isNew: true,
};

const trendingSessions = [
  {
    id: 'endless-serenity',
    title: 'Endless Serenity',
    subtitle: 'Sleep · Music',
    frequency: '1 Hz',
    image: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=800',
  },
  {
    id: 'slowly-drifting',
    title: 'Slowly Drifting',
    subtitle: 'Sleep · Music',
    frequency: '0.5 Hz',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
  },
  {
    id: 'deep-focus',
    title: 'Deep Focus',
    subtitle: 'Focus · Pure tone',
    frequency: '40 Hz',
    image: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800',
  },
];

const categories = [
  {
    id: 'stop-overthinking',
    title: 'Stop overthinking',
    description: 'Quiet your mind and slow your thoughts with Theta and Alpha beats tuned for inner calm.',
    sessions: [
      { id: '1', title: 'Calm Mind', frequency: '8 Hz', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800' },
      { id: '2', title: 'Inner Peace', frequency: '10 Hz', image: 'https://images.unsplash.com/photo-1454391304352-2bf4678b1a7a?w=800' },
    ],
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const { progress } = useUserProgress();
  const { user, logout } = useAuth();
  const { isPremium, trialDaysLeft, subscription } = usePayment();

  const [isNavigationReady, setIsNavigationReady] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
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
    setSelectedEmotion(emotion.id);
    router.push({
      pathname: "/recommended-sessions",
      params: { emotionId: emotion.id },
    });
  }, [router]);

  const handleSessionPress = useCallback((sessionId: string) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push({
      pathname: "/session",
      params: { sessionId },
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
    <View style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <SafeAreaView edges={['top']}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.profileButton}
              onPress={() => router.push('/profile')}
              activeOpacity={0.7}
            >
              <User size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => {}}
              activeOpacity={0.7}
            >
              <MoreHorizontal size={24} color="rgba(255, 255, 255, 0.7)" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        {/* Featured Session Card */}
        <Animated.View
          style={[
            styles.featuredCard,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => handleSessionPress(featuredSession.id)}
          >
            <ImageBackground
              source={{ uri: featuredSession.image }}
              style={styles.featuredImage}
              imageStyle={styles.featuredImageStyle}
            >
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)']}
                style={styles.featuredGradient}
              >
                <View style={styles.featuredContent}>
                  <View style={styles.frequencyBubble}>
                    <Text style={styles.frequencyText}>{featuredSession.frequency}</Text>
                  </View>
                  <View style={styles.featuredInfo}>
                    <Text style={styles.featuredTitle}>{featuredSession.title}</Text>
                    <Text style={styles.featuredSubtitle}>{featuredSession.subtitle}</Text>
                  </View>
                  {featuredSession.isNew && (
                    <View style={styles.newBadge}>
                      <Text style={styles.newBadgeText}>NEW</Text>
                    </View>
                  )}
                </View>
              </LinearGradient>
            </ImageBackground>
          </TouchableOpacity>
        </Animated.View>

        {/* How are you feeling section */}
        {!selectedEmotion && (
          <Animated.View
            style={[
              styles.emotionSection,
              {
                opacity: fadeAnim,
              },
            ]}
          >
            <Text style={styles.emotionTitle}>How are you feeling?</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.emotionsContainer}
            >
              {emotionalStates.map((emotion) => {
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

                return (
                  <TouchableOpacity
                    key={emotion.id}
                    onPress={() => handleEmotionSelect(emotion)}
                    activeOpacity={0.8}
                    style={styles.emotionCard}
                  >
                    <LinearGradient
                      colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
                      style={styles.emotionGradient}
                    >
                      <Icon size={28} color="#fff" />
                      <Text style={styles.emotionLabel}>{emotion.label}</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </Animated.View>
        )}

        {/* Trending Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trending</Text>
          <Text style={styles.sectionSubtitle}>Explore the most popular sessions on MindEase.</Text>
          
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.trendingContainer}
          >
            {trendingSessions.map((session) => (
              <TouchableOpacity
                key={session.id}
                style={styles.trendingCard}
                onPress={() => handleSessionPress(session.id)}
                activeOpacity={0.9}
              >
                <ImageBackground
                  source={{ uri: session.image }}
                  style={styles.trendingImage}
                  imageStyle={styles.trendingImageStyle}
                >
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.9)']}
                    style={styles.trendingGradient}
                  >
                    <View style={styles.trendingFrequency}>
                      <Text style={styles.trendingFrequencyText}>{session.frequency}</Text>
                    </View>
                    <View style={styles.trendingInfo}>
                      <Text style={styles.trendingTitle}>{session.title}</Text>
                      <Text style={styles.trendingSubtitle}>{session.subtitle}</Text>
                    </View>
                  </LinearGradient>
                </ImageBackground>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Categories */}
        {categories.map((category) => (
          <View key={category.id} style={styles.section}>
            <Text style={styles.sectionTitle}>{category.title}</Text>
            <Text style={styles.sectionSubtitle}>{category.description}</Text>
            
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryContainer}
            >
              {category.sessions.map((session) => (
                <TouchableOpacity
                  key={session.id}
                  style={styles.categoryCard}
                  onPress={() => handleSessionPress(session.id)}
                  activeOpacity={0.9}
                >
                  <ImageBackground
                    source={{ uri: session.image }}
                    style={styles.categoryImage}
                    imageStyle={styles.categoryImageStyle}
                  >
                    <LinearGradient
                      colors={['transparent', 'rgba(0,0,0,0.8)']}
                      style={styles.categoryGradient}
                    >
                      <View style={styles.categoryInfo}>
                        <Text style={styles.categoryTitle}>{session.title}</Text>
                        <Text style={styles.categoryFrequency}>{session.frequency}</Text>
                      </View>
                    </LinearGradient>
                  </ImageBackground>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        ))}



      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
          <Home size={24} color="#fff" />
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
          <Search size={24} color="rgba(255,255,255,0.5)" />
          <Text style={[styles.navLabel, styles.navLabelInactive]}>Search</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
          <Library size={24} color="rgba(255,255,255,0.5)" />
          <Text style={[styles.navLabel, styles.navLabelInactive]}>Your Library</Text>
        </TouchableOpacity>
      </View>

      {/* Now Playing Bar */}
      <LinearGradient
        colors={['#6B46C1', '#9333EA']}
        style={styles.nowPlayingBar}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.nowPlayingContent}>
          <View style={styles.nowPlayingIcon}>
            <View style={styles.nowPlayingCircle} />
          </View>
          <View style={styles.nowPlayingInfo}>
            <Text style={styles.nowPlayingTitle}>Pure High Gamma Waves</Text>
            <Text style={styles.nowPlayingSubtitle}>60 Hz · Pure tone</Text>
          </View>
          <TouchableOpacity style={styles.playButton} activeOpacity={0.7}>
            <Headphones size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.playButton} activeOpacity={0.7}>
            <Play size={24} color="#fff" fill="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 180,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
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
    marginBottom: 8,
    letterSpacing: 0.3,
    paddingHorizontal: 20,
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
  // New styles for Moongate design
  featuredCard: {
    marginHorizontal: 20,
    marginBottom: 30,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  featuredImage: {
    width: '100%',
    height: 280,
  },
  featuredImageStyle: {
    borderRadius: 20,
  },
  featuredGradient: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 20,
  },
  featuredContent: {
    position: 'relative',
  },
  frequencyBubble: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  frequencyText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold' as const,
  },
  featuredInfo: {
    marginBottom: 10,
  },
  featuredTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold' as const,
    marginBottom: 5,
  },
  featuredSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
  },
  newBadge: {
    position: 'absolute',
    top: -100,
    right: 0,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  newBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold' as const,
  },
  emotionSection: {
    marginBottom: 30,
  },
  emotionTitle: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: '#fff',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  emotionGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
  },
  section: {
    marginBottom: 30,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  trendingContainer: {
    paddingHorizontal: 20,
    gap: 15,
  },
  trendingCard: {
    width: 200,
    height: 250,
    marginRight: 15,
    borderRadius: 16,
    overflow: 'hidden',
  },
  trendingImage: {
    width: '100%',
    height: '100%',
  },
  trendingImageStyle: {
    borderRadius: 16,
  },
  trendingGradient: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 16,
  },
  trendingFrequency: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  trendingFrequencyText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold' as const,
  },
  trendingInfo: {
    marginBottom: 5,
  },
  trendingTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold' as const,
    marginBottom: 4,
  },
  trendingSubtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
  },
  categoryContainer: {
    paddingHorizontal: 20,
    gap: 15,
  },
  categoryCard: {
    width: 160,
    height: 200,
    marginRight: 15,
    borderRadius: 12,
    overflow: 'hidden',
  },
  categoryImage: {
    width: '100%',
    height: '100%',
  },
  categoryImageStyle: {
    borderRadius: 12,
  },
  categoryGradient: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 12,
  },
  categoryInfo: {
    marginBottom: 5,
  },
  categoryTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold' as const,
    marginBottom: 2,
  },
  categoryFrequency: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 70,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: 'rgba(10,10,10,0.95)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navLabel: {
    color: '#fff',
    fontSize: 11,
    marginTop: 4,
    fontWeight: '500' as const,
  },
  navLabelInactive: {
    color: 'rgba(255,255,255,0.5)',
  },
  nowPlayingBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  nowPlayingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
  },
  nowPlayingIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  nowPlayingCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#fff',
  },
  nowPlayingInfo: {
    flex: 1,
  },
  nowPlayingTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600' as const,
    marginBottom: 2,
  },
  nowPlayingSubtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
  },
  playButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
});