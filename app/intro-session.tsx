import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  Animated,
  Alert,
  BackHandler,
  ScrollView,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  Play,
  Pause,
  ChevronDown,
  Heart,
  Timer,
  Layers,
  Radio,
} from "lucide-react-native";
import { useAudio } from "@/providers/AudioProvider";
import { useUserProgress } from "@/providers/UserProgressProvider";
import * as Haptics from "expo-haptics";
import SacredGeometry from "@/components/SacredGeometry";

const introSession = {
  id: "intro",
  title: "Welcome to Harmonia",
  description: "Your first journey into emotional balance and mental clarity through sound frequencies",
  duration: 3, // 3 minutes for intro
  frequency: "432",
  audioUrl: "https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav",
  targetEmotions: ["calm", "focused"],
  geometry: {
    type: "flower" as const,
    colors: ["rgba(255,255,255,0.8)"],
    layers: 3,
    pulseIntensity: 1.2,
  },
};

export default function IntroSessionScreen() {
  const router = useRouter();
  const { playSound, stopSound, isPlaying } = useAudio();
  const { addSession } = useUserProgress();
  
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [frequencyIntensity, setFrequencyIntensity] = useState<'Off' | 'Low' | 'Normal' | 'High'>('High');
  const [beatMode, setBeatMode] = useState<'Binaural' | 'Isochronic'>('Binaural');

  
  // Animation refs
  const orbPulseAnim = useRef(new Animated.Value(1)).current;
  const particleAnims = useRef(Array.from({ length: 30 }, () => ({
    x: new Animated.Value(0),
    y: new Animated.Value(0),
    opacity: new Animated.Value(0),
  }))).current;
  const roadLineAnim = useRef(new Animated.Value(0)).current;
  const expandAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0.8)).current;
  const scrollY = useRef(new Animated.Value(0)).current;
  
  // Initialize animated values
  useEffect(() => {
    orbPulseAnim.setValue(1);
    roadLineAnim.setValue(0);
    expandAnim.setValue(0);
    glowAnim.setValue(0.8);
    particleAnims.forEach(particle => {
      particle.x.setValue(0);
      particle.y.setValue(0);
      particle.opacity.setValue(0);
    });
  }, [orbPulseAnim, roadLineAnim, expandAnim, glowAnim, particleAnims]);
  
  // Orb pulse and particle animations synced with music
  useEffect(() => {
    const animations: Animated.CompositeAnimation[] = [];
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    
    if (isPlaying && !isPaused) {
      // Orb pulsing animation
      const orbAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(orbPulseAnim, {
            toValue: 1.15,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(orbPulseAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      );
      orbAnimation.start();
      animations.push(orbAnimation);

      // Glow animation
      const glowAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0.6,
            duration: 3000,
            useNativeDriver: true,
          }),
        ])
      );
      glowAnimation.start();
      animations.push(glowAnimation);

      // Particle animations
      const screenHeight = Dimensions.get('window').height;
      particleAnims.forEach((particle, index) => {
        const delay = index * 80;
        const duration = 4000 + Math.random() * 2000;
        
        const timeout = setTimeout(() => {
          const particleAnimation = Animated.loop(
            Animated.parallel([
              Animated.sequence([
                Animated.timing(particle.y, {
                  toValue: -screenHeight * 0.6,
                  duration: duration,
                  useNativeDriver: true,
                }),
                Animated.timing(particle.y, {
                  toValue: 0,
                  duration: 0,
                  useNativeDriver: true,
                }),
              ]),
              Animated.sequence([
                Animated.timing(particle.x, {
                  toValue: (Math.random() - 0.5) * 300,
                  duration: duration,
                  useNativeDriver: true,
                }),
                Animated.timing(particle.x, {
                  toValue: 0,
                  duration: 0,
                  useNativeDriver: true,
                }),
              ]),
              Animated.sequence([
                Animated.timing(particle.opacity, {
                  toValue: Math.random() * 0.8 + 0.2,
                  duration: duration * 0.3,
                  useNativeDriver: true,
                }),
                Animated.timing(particle.opacity, {
                  toValue: 0,
                  duration: duration * 0.7,
                  useNativeDriver: true,
                }),
              ]),
            ])
          );
          particleAnimation.start();
          animations.push(particleAnimation);
        }, delay);
        timeouts.push(timeout);
      });

      // Road line animation
      const roadAnimation = Animated.loop(
        Animated.timing(roadLineAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        })
      );
      roadAnimation.start();
      animations.push(roadAnimation);
    } else {
      // Stop animations when paused
      orbPulseAnim.setValue(1);
      glowAnim.setValue(0.8);
      particleAnims.forEach(particle => {
        particle.opacity.setValue(0);
      });
    }
    
    return () => {
      animations.forEach(anim => anim.stop());
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, [isPlaying, isPaused, orbPulseAnim, glowAnim, particleAnims, roadLineAnim]);

  // Expand animation for controls
  useEffect(() => {
    Animated.timing(expandAnim, {
      toValue: isExpanded ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isExpanded, expandAnim]);

  const expandHeight = expandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 280],
  });





  const handleClose = useCallback(() => {
    Alert.alert(
      "End Intro Session",
      "Are you sure you want to end this intro session?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "End Session",
          style: "destructive",
          onPress: async () => {
            try {
              await stopSound();
            } catch (error) {
              console.log("Error stopping sound during close:", error);
            }
            router.replace("/home");
          },
        },
      ]
    );
  }, [stopSound, router]);

  const handleQuickExit = useCallback(async () => {
    try {
      await stopSound();
    } catch (error) {
      console.log("Error stopping sound during quick exit:", error);
    }
    router.replace("/home");
  }, [stopSound, router]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      handleClose();
      return true;
    });

    return () => {
      stopSound();
      backHandler.remove();
    };
  }, [stopSound, handleClose]);

  const handleComplete = useCallback(async () => {
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    await addSession(introSession.id, Math.floor(timeElapsed / 60), introSession.targetEmotions);
    
    try {
      await stopSound();
    } catch (error) {
      console.log("Error stopping sound during completion:", error);
    }
    
    Alert.alert(
      "Welcome Complete!",
      "Congratulations! You've completed your first Harmonia session. Ready to explore more?",
      [
        {
          text: "Explore Harmonia",
          onPress: () => {
            router.replace("/home");
          },
        },
      ]
    );
  }, [timeElapsed, addSession, stopSound, router]);

  useEffect(() => {
    if (!isPaused) {
      const timer = setInterval(() => {
        setTimeElapsed((prev) => {
          if (prev >= introSession.duration * 60) {
            handleComplete();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isPaused, handleComplete]);

  const handlePlayPause = useCallback(async () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    if (isPlaying) {
      await stopSound();
      setIsPaused(true);
    } else {
      console.log('Starting playback for intro session');
      console.log('Audio URL:', introSession.audioUrl);
      try {
        await playSound(introSession.audioUrl);
        setIsPaused(false);
        console.log('Intro session playback started successfully');
      } catch (error) {
        console.log('Error starting intro session playback:', error);
        setIsPaused(true);
        
        // On web, show a user-friendly message about autoplay
        if (Platform.OS === 'web') {
          console.log('💡 Tip: If audio doesn\'t play, try clicking the play button again. Web browsers require user interaction before playing audio.');
        }
      }
    }
  }, [isPlaying, playSound, stopSound]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = timeElapsed / (introSession.duration * 60);

  return (
    <View style={styles.container}>
      {/* Background with road perspective */}
      <LinearGradient 
        colors={['#000000', '#1a1a1a', '#000000']} 
        style={StyleSheet.absoluteFillObject}
      />
      
      {/* Road perspective */}
      <View style={styles.roadContainer}>
        <View style={styles.road}>
          <Animated.View 
            style={[
              styles.roadLine,
              {
                transform: [{
                  translateY: roadLineAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 100],
                  })
                }]
              }
            ]}
          />
        </View>
        <View style={styles.mountains} />
      </View>

      {/* Main content */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        <SafeAreaView style={styles.safeArea}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleQuickExit} style={styles.headerButton}>
              <ChevronDown size={24} color="#fff" />
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <Text style={styles.headerTitle}>Intro Session</Text>
              <Text style={styles.headerTime}>{formatTime(timeElapsed)} / {formatTime(introSession.duration * 60)}</Text>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.headerButton}>
                <Heart size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Progress bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
            </View>
          </View>

          {/* Orb visualization */}
          <View style={styles.orbContainer}>
            {/* Particles */}
            {particleAnims.map((particle, index) => (
              <Animated.View
                key={`particle-${index}`}
                style={[
                  styles.particle,
                  {
                    transform: [
                      { translateX: particle.x },
                      { translateY: particle.y },
                    ],
                    opacity: particle.opacity,
                  },
                ]}
              />
            ))}
            
            {/* Glow effect */}
            <Animated.View 
              style={[
                styles.orbGlow,
                {
                  opacity: glowAnim,
                  transform: [{ scale: orbPulseAnim }],
                }
              ]}
            />
            
            {/* Main orb */}
            <Animated.View 
              style={[
                styles.orb,
                {
                  transform: [{ scale: orbPulseAnim }],
                }
              ]}
            >
              <LinearGradient
                colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.3)', 'transparent']}
                style={styles.orbGradient}
              >
                <View style={styles.orbContent}>
                  <Text style={styles.frequencyText}>{introSession.frequency} Hz</Text>
                  <Text style={styles.frequencyLabel}>Harmony</Text>
                </View>
                
                {/* Sacred Geometry inside orb */}
                <View style={styles.geometryWrapper}>
                  <SacredGeometry
                    type="flowerOfLife"
                    size={200}
                    color="rgba(255,255,255,0.8)"
                    strokeWidth={2}
                    animated
                    pulse={isPlaying && !isPaused}
                    frequency={432}
                    opacity={0.6}
                  />
                </View>
              </LinearGradient>
            </Animated.View>
          </View>

          {/* Play/Pause button */}
          <TouchableOpacity
            onPress={handlePlayPause}
            style={styles.playButton}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={["rgba(255,255,255,0.2)", "rgba(255,255,255,0.05)"]}
              style={styles.playButtonGradient}
            >
              {isPlaying ? (
                <Pause size={32} color="#fff" />
              ) : (
                <Play size={32} color="#fff" style={styles.playIcon} />
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Session info */}
          <View style={styles.sessionInfo}>
            <Text style={styles.sessionTitle}>{introSession.title}</Text>
            <Text style={styles.sessionDescription}>{introSession.description}</Text>
          </View>

          {/* Expandable controls */}
          <TouchableOpacity 
            style={styles.expandButton}
            onPress={() => setIsExpanded(!isExpanded)}
            activeOpacity={0.8}
          >
            <View style={styles.expandButtonContent}>
              <Text style={styles.expandButtonText}>Frequency intensity</Text>
              <Animated.View
                style={[styles.chevronRotate, {
                  transform: [{
                    rotate: expandAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '180deg'],
                    })
                  }]
                }]}
              >
                <ChevronDown size={20} color="rgba(255,255,255,0.6)" />
              </Animated.View>
            </View>
          </TouchableOpacity>

          <Animated.View style={[styles.expandedContent, { maxHeight: expandHeight, overflow: 'hidden' }]}>
            {/* Frequency intensity selector */}
            <View style={styles.controlSection}>
              <Text style={styles.controlLabel}>Frequency intensity</Text>
              <View style={styles.intensitySelector}>
                {['Off', 'Low', 'Normal', 'High'].map((level) => (
                  <TouchableOpacity
                    key={level}
                    style={[
                      styles.intensityOption,
                      frequencyIntensity === level && styles.intensityOptionActive,
                    ]}
                    onPress={() => setFrequencyIntensity(level as typeof frequencyIntensity)}
                  >
                    <Text style={[
                      styles.intensityText,
                      frequencyIntensity === level && styles.intensityTextActive,
                    ]}>
                      {level}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Beat mode selector */}
            <View style={styles.controlSection}>
              <View style={styles.beatModeHeader}>
                <Text style={styles.controlLabel}>Beat mode</Text>
                <Radio size={16} color="rgba(255,255,255,0.6)" />
              </View>
              <View style={styles.beatModeSelector}>
                {['Binaural', 'Isochronic'].map((mode) => (
                  <TouchableOpacity
                    key={mode}
                    style={[
                      styles.beatModeOption,
                      beatMode === mode && styles.beatModeOptionActive,
                    ]}
                    onPress={() => setBeatMode(mode as typeof beatMode)}
                  >
                    <Text style={[
                      styles.beatModeText,
                      beatMode === mode && styles.beatModeTextActive,
                    ]}>
                      {mode}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.beatModeHint}>
                Recommended. Best with headphones.
              </Text>
            </View>

            {/* Session details */}
            <View style={styles.detailsSection}>
              <Text style={styles.detailsTitle}>432 Hz Harmony frequency</Text>
              <Text style={styles.detailsText}>
                This healing frequency is known to promote relaxation, reduce stress, and create a sense 
                of peace and well-being. It's often called the "natural frequency" and is perfect for 
                your first meditation experience.
              </Text>
            </View>
          </Animated.View>

          {/* Welcome message */}
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeTitle}>Your Journey Begins</Text>
            <Text style={styles.welcomeText}>
              This gentle introduction uses 432 Hz frequency, known as the &ldquo;healing frequency,&rdquo; 
              to help you experience the calming power of sound therapy. Let the sacred geometry 
              guide your focus as you breathe deeply and allow yourself to relax.
            </Text>
            <Text style={styles.welcomeInstructions}>
              • Find a comfortable position
              • Use headphones for the best experience
              • Focus on your breathing
              • Let the sounds wash over you
            </Text>
          </View>

          {/* Bottom controls */}
          <View style={styles.bottomControls}>
            <TouchableOpacity style={styles.bottomButton}>
              <Timer size={20} color="rgba(255,255,255,0.6)" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.bottomButton}>
              <Layers size={20} color="rgba(255,255,255,0.6)" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.bottomButton}>
              <Radio size={20} color="rgba(255,255,255,0.6)" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  safeArea: {
    flex: 1,
  },
  roadContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
    overflow: 'hidden',
  },
  road: {
    position: 'absolute',
    bottom: 0,
    left: '35%',
    right: '35%',
    height: '100%',
    alignItems: 'center',
  },
  roadLine: {
    width: 4,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginVertical: 20,
  },
  mountains: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,
    backgroundColor: 'rgba(30,30,30,0.5)',
    borderTopLeftRadius: 100,
    borderTopRightRadius: 100,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#fff',
  },
  headerTime: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: "row",
    gap: 10,
  },
  progressContainer: {
    paddingHorizontal: 30,
    marginBottom: 20,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  orbContainer: {
    height: 400,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  particle: {
    position: 'absolute',
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  orbGlow: {
    position: 'absolute',
    width: 350,
    height: 350,
    borderRadius: 175,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  orb: {
    width: 280,
    height: 280,
    borderRadius: 140,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  orbGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbContent: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  frequencyText: {
    fontSize: 48,
    fontWeight: '300' as const,
    color: '#fff',
    marginBottom: 5,
  },
  frequencyLabel: {
    fontSize: 24,
    fontWeight: '400' as const,
    color: 'rgba(255,255,255,0.9)',
  },
  geometryWrapper: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    alignSelf: 'center',
    marginVertical: 30,
  },
  playButtonGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.2)",
  },
  playIcon: {
    marginLeft: 4,
  },
  sessionInfo: {
    paddingHorizontal: 30,
    marginBottom: 30,
  },
  sessionTitle: {
    fontSize: 28,
    fontWeight: "600" as const,
    color: "#fff",
    marginBottom: 10,
    textAlign: 'center',
  },
  sessionDescription: {
    fontSize: 16,
    color: "rgba(255,255,255,0.7)",
    lineHeight: 24,
    textAlign: 'center',
  },
  welcomeSection: {
    paddingHorizontal: 30,
    marginVertical: 30,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '600' as const,
    color: '#fff',
    marginBottom: 15,
    textAlign: 'center',
  },
  welcomeText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  welcomeInstructions: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 22,
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 20,
    borderRadius: 12,
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 30,
    paddingVertical: 30,
  },
  bottomButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  expandButton: {
    marginHorizontal: 30,
    marginBottom: 10,
  },
  expandButtonContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  expandButtonText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  expandedContent: {
    overflow: 'hidden',
    marginHorizontal: 30,
  },
  controlSection: {
    marginVertical: 20,
  },
  controlLabel: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#fff',
    marginBottom: 15,
  },
  intensitySelector: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 4,
  },
  intensityOption: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  intensityOptionActive: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  intensityText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
  },
  intensityTextActive: {
    color: '#fff',
    fontWeight: '600' as const,
  },
  beatModeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 15,
  },
  beatModeSelector: {
    flexDirection: 'row',
    gap: 10,
  },
  beatModeOption: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  beatModeOptionActive: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  beatModeText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
  },
  beatModeTextActive: {
    color: '#fff',
    fontWeight: '600' as const,
  },
  beatModeHint: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 10,
  },
  detailsSection: {
    marginVertical: 20,
    padding: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#fff',
    marginBottom: 10,
  },
  detailsText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 22,
  },
  chevronRotate: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});