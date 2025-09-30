import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
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
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Play,
  Pause,
  ChevronDown,
  Download,
  Heart,
  Share2,
  Timer,
  Layers,
  Radio,
} from "lucide-react-native";
import { Video, ResizeMode } from "expo-av";
import { sessions } from "@/constants/sessions";
import { useAudio } from "@/providers/AudioProvider";
import { useUserProgress } from "@/providers/UserProgressProvider";
import { useCustomMusic } from "@/providers/CustomMusicProvider";
import SocialShare from "@/components/SocialShare";
import * as Haptics from "expo-haptics";

export default function SessionScreen() {
  const router = useRouter();
  const { sessionId } = useLocalSearchParams();
  const { playSound, stopSound, isPlaying } = useAudio();
  const { addSession } = useUserProgress();
  const { getSessionMusic } = useCustomMusic();

  const { session, sessionMusic } = useMemo(() => {
    const found = sessions.find((s) => s.id === sessionId);
    return {
      session: found,
      sessionMusic: found ? getSessionMusic(found.id) : undefined,
    };
  }, [sessionId, getSessionMusic]);
  
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [frequencyIntensity, setFrequencyIntensity] = useState<'Off' | 'Low' | 'Normal' | 'High'>('High');
  const [beatMode, setBeatMode] = useState<'Binaural' | 'Isochronic'>('Binaural');
  const [shareModalVisible, setShareModalVisible] = useState<boolean>(false);
  const [shareData, setShareData] = useState<{
    type: 'progress' | 'achievement' | 'streak' | 'session';
    title: string;
    description: string;
    stats?: {
      sessions?: number;
      streak?: number;
      minutes?: number;
      improvement?: number;
    };
  } | null>(null);
  
  // Animation refs
  const orbPulseAnim = useRef(new Animated.Value(1)).current;
  const particleAnims = useRef(Array.from({ length: 50 }, () => ({
    x: new Animated.Value(0),
    y: new Animated.Value(0),
    opacity: new Animated.Value(0),
  }))).current;
  const roadLineAnim = useRef(new Animated.Value(0)).current;
  const expandAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0.8)).current;
  const scrollY = useRef(new Animated.Value(0)).current;
  const videoRef = useRef<Video | null>(null);
  
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
        const delay = index * 60;
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
      "End Session",
      "Are you sure you want to end this session?",
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
    if (!session) return;

    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      handleClose();
      return true;
    });

    return () => {
      try {
        videoRef.current?.pauseAsync();
        videoRef.current?.setPositionAsync(0);
      } catch (e) {
        console.log('Video cleanup error', e);
      }
      stopSound();
      backHandler.remove();
    };
  }, [session, stopSound, handleClose]);

  const handleShare = useCallback((type: 'session') => {
    if (!session) return;

    const sessionMinutes = Math.floor(timeElapsed / 60);
    const title = `Completed: ${session.title}`;
    const description = sessionMusic
      ? `Just finished a ${sessionMinutes}-minute session using "${sessionMusic.name}". Feeling more centered and peaceful!`
      : `Just finished a ${sessionMinutes}-minute ${session.title.toLowerCase()} session. Feeling more centered and peaceful!`;

    setShareData({
      type,
      title,
      description,
      stats: {
        minutes: sessionMinutes,
      }
    });
    setShareModalVisible(true);
  }, [session, timeElapsed, sessionMusic]);

  const handleComplete = useCallback(async () => {
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    if (session) {
      await addSession(session.id, Math.floor(timeElapsed / 60), session.targetEmotions);
    }
    
    try {
      await stopSound();
    } catch (error) {
      console.log("Error stopping sound during completion:", error);
    }
    
    Alert.alert(
      "Session Complete!",
      "Great job! You've completed this session.",
      [
        {
          text: "Share Progress",
          onPress: () => handleShare('session'),
        },
        {
          text: "Continue",
          onPress: () => {
            router.replace("/home");
          },
        },
      ]
    );
  }, [session, timeElapsed, addSession, stopSound, router, handleShare]);

  useEffect(() => {
    if (!isPaused && session) {
      const timer = setInterval(() => {
        setTimeElapsed((prev) => {
          if (prev >= session.duration * 60) {
            handleComplete();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isPaused, session, handleComplete]);

  const handlePlayPause = useCallback(async () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    if (isPlaying) {
      console.log('[Session] Pausing audio + video');
      stopSound();
      setIsPaused(true);
    } else {
      if (session) {
        console.log('[Session] Playing audio + video for', session.id);
        await playSound(sessionMusic?.url ?? session.audioUrl);
        setIsPaused(false);
      }
    }
  }, [isPlaying, session, sessionMusic, playSound, stopSound]);

  if (!session) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Session not found</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, (session.id === '396hz-release' || session.id === 'alpha-waves') ? { backgroundColor: 'transparent' } : null]}>
      {/* Background video */}
      {session.videoUrl ? (
        <View style={styles.videoContainer} pointerEvents="none">
          <Video
            ref={videoRef}
            source={{ uri: session.videoUrl }}
            style={[
              styles.videoElement,
              (session.id === '396hz-release' || session.id === 'alpha-waves') ? { opacity: 1 } : null
            ]}
            isLooping
            isMuted
            shouldPlay={isPlaying && !isPaused}
            resizeMode={(session.id === 'alpha-waves') ? ResizeMode.CONTAIN : ResizeMode.COVER}
            onLoadStart={() => console.log('[Session] Background video load start', session.id)}
            onLoad={() => console.log('[Session] Background video loaded', session.id)}
            onPlaybackStatusUpdate={(status) => {
              try {
                if (!status.isLoaded) {
                  console.log('[Session] Video status (not loaded)', { error: status.error });
                  return;
                }
                const s = status;
                console.log('[Session] Video status', {
                  isLoaded: s.isLoaded,
                  durationMillis: s.durationMillis ?? null,
                  positionMillis: s.positionMillis,
                  shouldPlay: s.shouldPlay,
                  isPlaying: s.isPlaying,
                  isBuffering: s.isBuffering,
                  rate: s.rate,
                  volume: s.volume,
                  isMuted: s.isMuted,
                  isLooping: s.isLooping,
                  didJustFinish: s.didJustFinish ?? false,
                });
              } catch (e) {
                console.log('[Session] Video status update (safe log)');
              }
            }}
            onError={(e) => {
              console.log("Background video error", e);
            }}
            accessibilityLabel="session background video"
            testID="bg-video"
            // @ts-expect-error: web only prop safe to ignore on native
            playsInline
          />
        </View>
      ) : null}

      {/* Gradient overlay */}
      {(session.id === '396hz-release' || session.id === 'alpha-waves') ? null : (
        <LinearGradient 
          colors={["rgba(0,0,0,0.9)", "rgba(0,0,0,0.6)", "rgba(0,0,0,0.95)"]} 
          style={StyleSheet.absoluteFillObject}
          pointerEvents="none"
        />
      )}
      
      {/* Road perspective */}
      {(session.id === '396hz-release' || session.id === 'alpha-waves') ? null : (
        <View style={styles.roadContainer} pointerEvents="none">
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
      )}

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
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.headerButton}>
                <Download size={20} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton}>
                <Heart size={20} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton}>
                <Share2 size={20} color="#fff" />
              </TouchableOpacity>
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
                  {session.id !== '396hz-release' ? (
                    <Text style={styles.frequencyText}>{session.frequency} Hz</Text>
                  ) : null}
                  {session.id !== '396hz-release' ? (
                    <Text style={styles.frequencyLabel}>
                      {session.frequency === '40' ? 'Focus' : 
                       session.frequency === '528' ? 'Love' :
                       session.frequency === '741' ? 'Cleanse' :
                       session.frequency === '396' ? 'Release' :
                       session.frequency === '2' ? 'Sleep' :
                       session.frequency === '6' ? 'Healing' :
                       session.frequency === '10' ? 'Calm' :
                       session.frequency === '20' ? 'Focus' :
                       session.frequency === '432' ? 'Harmony' :
                       session.frequency === '963' ? 'Awaken' :
                       'Balance'}
                    </Text>
                  ) : null}
                </View>
              </LinearGradient>
            </Animated.View>
          </View>

          {/* Play/Pause button */}
          <TouchableOpacity
            onPress={handlePlayPause}
            style={styles.playButton}
            activeOpacity={0.8}
            testID="play-pause"
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
            <Text style={styles.sessionTitle}>{session.title}</Text>
            <Text style={styles.sessionDescription}>{session.description}</Text>
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
              <Text style={styles.detailsTitle}>{session.frequency} Hz Gamma brainwaves</Text>
              <Text style={styles.detailsText}>
                The beat frequency in this session induces Gamma waves in the brain which are associated 
                with heightened perception, problem solving, and conscious awareness.
              </Text>
            </View>
          </Animated.View>

          {/* About section */}
          <View style={styles.aboutSection}>
            <Text style={styles.aboutTitle}>About this soundscape</Text>
            <Text style={styles.aboutText}>
              Embark on a musical drive towards the limitless horizon. The rhythmic dance of synths inspires 
              purpose and determination, accompanied by the embrace of tranquil harmonies. Gamma beats 
              seamlessly integrate, sharpening your focus, as you navigate the winding roads of your objectives 
              with clarity and motivation.
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
      
      {/* Social Share Modal */}
      {shareData && (
        <SocialShare
          visible={shareModalVisible}
          onClose={() => {
            setShareModalVisible(false);
            setShareData(null);
            router.replace("/home");
          }}
          shareType={shareData.type}
          data={shareData}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  videoContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoElement: {
    width: '100%',
    height: '100%',
    opacity: 0.45,
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
  headerActions: {
    flexDirection: "row",
    gap: 10,
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
  },
  sessionDescription: {
    fontSize: 16,
    color: "rgba(255,255,255,0.7)",
    lineHeight: 24,
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
  aboutSection: {
    paddingHorizontal: 30,
    marginVertical: 30,
  },
  aboutTitle: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: '#fff',
    marginBottom: 15,
  },
  aboutText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 22,
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
  errorText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
    marginTop: 100,
  },
  chevronRotate: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});