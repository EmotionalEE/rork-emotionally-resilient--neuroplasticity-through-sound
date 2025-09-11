import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
  Animated,
  ImageBackground,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useFocusEffect } from "expo-router";
import {
  Moon,
  User,
  LucideIcon,
  Home,
  Search,
  Library,
  Play,
  Headphones,
  Smile,
  Frown,
  Meh,
  AlertCircle,
  Battery,
  Wind,
  Target,
  Zap as Lightning,
} from "lucide-react-native";
import { CalmLandscape } from "@/components/CalmLandscape";
import { CalmingSacredGeometry } from "@/components/CalmingSacredGeometry";
import { emotionalStates } from "@/constants/sessions";
import { useAuth } from "@/providers/AuthProvider";
import { EmotionalState } from "@/types/session";
import * as Haptics from "expo-haptics";

// Session data
const harmonySessions = [
  {
    id: 'morning-harmony',
    title: 'Morning Harmony',
    subtitle: 'Start your day balanced',
    duration: '15 min',
    image: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=800',
    color: ['#FFB6C1', '#FFA07A'],
  },
  {
    id: 'peaceful-mind',
    title: 'Peaceful Mind',
    subtitle: 'Release mental tension',
    duration: '20 min',
    image: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=800',
    color: ['#87CEEB', '#98D8C8'],
  },
  {
    id: 'emotional-balance',
    title: 'Emotional Balance',
    subtitle: 'Find your center',
    duration: '25 min',
    image: 'https://images.unsplash.com/photo-1501139083538-0139583c060f?w=800',
    color: ['#DDA0DD', '#BA55D3'],
  },
  {
    id: 'evening-calm',
    title: 'Evening Calm',
    subtitle: 'Wind down peacefully',
    duration: '30 min',
    image: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800',
    color: ['#4B0082', '#8A2BE2'],
  },
];

const emotionIcons: Record<string, { icon: LucideIcon; label: string; color: readonly [string, string] }> = {
  happy: { icon: Smile, label: 'Happy', color: ['#FFD700', '#FFA500'] as const },
  sad: { icon: Frown, label: 'Sad', color: ['#4682B4', '#5F9EA0'] as const },
  anxious: { icon: AlertCircle, label: 'Anxious', color: ['#FF6B6B', '#FF8E53'] as const },
  calm: { icon: Wind, label: 'Calm', color: ['#48C9B0', '#45B7D1'] as const },
  stressed: { icon: Lightning, label: 'Stressed', color: ['#F39C12', '#E74C3C'] as const },
  neutral: { icon: Meh, label: 'Neutral', color: ['#95A5A6', '#7F8C8D'] as const },
  energized: { icon: Battery, label: 'Energized', color: ['#F1C40F', '#E67E22'] as const },
  focused: { icon: Target, label: 'Focused', color: ['#9B59B6', '#8E44AD'] as const },
};

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
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
      {/* Background Elements */}
      <CalmLandscape opacity={0.2} />
      <CalmingSacredGeometry size={150} opacity={0.3} color="rgba(147, 51, 234, 0.3)" />
      
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <SafeAreaView edges={['top']}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.greeting}>Welcome back,</Text>
              <Text style={styles.userName}>{user?.name || 'Friend'}</Text>
            </View>
            <TouchableOpacity
              style={styles.profileButton}
              onPress={() => router.push('/profile')}
              activeOpacity={0.7}
            >
              <User size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        {/* How are you feeling section */}
        <Animated.View
          style={[
            styles.emotionSection,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>How are you feeling?</Text>
          <View style={styles.emotionGrid}>
            {Object.entries(emotionIcons).map(([key, emotion]) => {
              const Icon = emotion.icon;
              const isSelected = selectedEmotion === key;
              return (
                <TouchableOpacity
                  key={key}
                  onPress={() => {
                    setSelectedEmotion(key);
                    const emotionState = emotionalStates.find(e => e.id === key);
                    if (emotionState) {
                      handleEmotionSelect(emotionState);
                    }
                  }}
                  activeOpacity={0.7}
                  style={styles.emotionItem}
                >
                  <LinearGradient
                    colors={isSelected ? emotion.color : ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
                    style={styles.emotionButton}
                  >
                    <Icon size={28} color={isSelected ? '#fff' : 'rgba(255,255,255,0.8)'} />
                  </LinearGradient>
                  <Text style={[styles.emotionLabel, isSelected && styles.emotionLabelSelected]}>
                    {emotion.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Animated.View>

        {/* Harmonious Sessions */}
        <View style={styles.sessionsSection}>
          <Text style={styles.sectionTitle}>Harmonious Sessions</Text>
          <Text style={styles.sectionSubtitle}>Find balance through emotional training</Text>
          
          <View style={styles.sessionGrid}>
            {harmonySessions.map((session, index) => (
              <TouchableOpacity
                key={session.id}
                style={[
                  styles.sessionCard,
                  index % 2 === 1 && styles.sessionCardRight,
                ]}
                onPress={() => handleSessionPress(session.id)}
                activeOpacity={0.9}
              >
                <ImageBackground
                  source={{ uri: session.image }}
                  style={styles.sessionImage}
                  imageStyle={styles.sessionImageStyle}
                >
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.7)']}
                    style={styles.sessionGradient}
                  >
                    <View style={styles.sessionContent}>
                      <Text style={styles.sessionTitle}>{session.title}</Text>
                      <Text style={styles.sessionSubtitle}>{session.subtitle}</Text>
                      <View style={styles.sessionMeta}>
                        <View style={styles.sessionDuration}>
                          <Play size={12} color="#fff" fill="#fff" />
                          <Text style={styles.sessionDurationText}>{session.duration}</Text>
                        </View>
                      </View>
                    </View>
                  </LinearGradient>
                </ImageBackground>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionCard} activeOpacity={0.8}>
            <LinearGradient
              colors={['#667EEA', '#764BA2']}
              style={styles.actionGradient}
            >
              <Headphones size={24} color="#fff" />
              <Text style={styles.actionTitle}>Daily Focus</Text>
              <Text style={styles.actionSubtitle}>10 min session</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionCard} activeOpacity={0.8}>
            <LinearGradient
              colors={['#F093FB', '#F5576C']}
              style={styles.actionGradient}
            >
              <Moon size={24} color="#fff" />
              <Text style={styles.actionTitle}>Sleep Better</Text>
              <Text style={styles.actionSubtitle}>30 min session</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

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
    backgroundColor: '#0F0F1E',
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
    paddingBottom: 20,
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: 14,
    color: "rgba(255,255,255,0.6)",
    marginBottom: 2,
    fontWeight: "400" as const,
  },
  userName: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "600" as const,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(147, 51, 234, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(147, 51, 234, 0.3)',
  },
  emotionSection: {
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  emotionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  emotionItem: {
    width: '23%',
    alignItems: 'center',
    marginBottom: 16,
  },
  emotionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  emotionLabel: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 12,
    fontWeight: "400" as const,
    textAlign: "center" as const,
  },
  emotionLabelSelected: {
    color: "#fff",
    fontWeight: "500" as const,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600" as const,
    color: "#fff",
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 16,
  },
  sessionsSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sessionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  sessionCard: {
    width: '48%',
    height: 180,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  sessionCardRight: {
    marginLeft: '4%',
  },
  sessionImage: {
    width: '100%',
    height: '100%',
  },
  sessionImageStyle: {
    borderRadius: 16,
  },
  sessionGradient: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 16,
  },
  sessionContent: {
    justifyContent: 'flex-end',
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#fff",
    marginBottom: 4,
  },
  sessionSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 8,
  },
  sessionMeta: {
    flexDirection: "row",
    alignItems: 'center',
  },
  sessionDuration: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  sessionDurationText: {
    color: '#fff',
    fontSize: 11,
    marginLeft: 4,
    fontWeight: '500' as const,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  actionCard: {
    width: '48%',
    height: 120,
    borderRadius: 16,
    overflow: 'hidden',
  },
  actionGradient: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600' as const,
    marginTop: 8,
    marginBottom: 4,
  },
  actionSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
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
  bottomNav: {
    position: 'absolute',
    bottom: 70,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: 'rgba(15,15,30,0.98)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(147,51,234,0.2)',
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