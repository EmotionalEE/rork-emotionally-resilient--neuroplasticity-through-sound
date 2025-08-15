import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  Animated,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Play,
  Pause,
  X,
  Volume2,
  Brain,
  Heart,
  Activity,
  Vibrate,
  Settings,
} from "lucide-react-native";
import { sessions } from "@/constants/sessions";
import { useAudio } from "@/providers/AudioProvider";
import { useUserProgress } from "@/providers/UserProgressProvider";
import * as Haptics from "expo-haptics";

// Sacred Geometry Component
const SacredGeometry = ({ 
  isPlaying, 
  breathingPhase, 
  isVibroacousticsActive, 
  vibroacousticFrequency 
}: { 
  isPlaying: boolean; 
  breathingPhase: 'in' | 'out';
  isVibroacousticsActive: boolean;
  vibroacousticFrequency: number;
}) => {
  const geometryAnim = useRef(new Animated.Value(0)).current;
  const rotationAnim = useRef(new Animated.Value(0)).current;
  const mandalaAnim = useRef(new Animated.Value(0)).current;
  const flowerAnim = useRef(new Animated.Value(0)).current;
  const counterRotationAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const vibroacousticAnim = useRef(new Animated.Value(0)).current;
  const vibroacousticPulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isPlaying) {
      // Main geometry animation
      Animated.loop(
        Animated.timing(geometryAnim, {
          toValue: 1,
          duration: 8000,
          useNativeDriver: true,
        })
      ).start();

      // Rotation animation (clockwise)
      Animated.loop(
        Animated.timing(rotationAnim, {
          toValue: 1,
          duration: 15000,
          useNativeDriver: true,
        })
      ).start();

      // Counter rotation (counter-clockwise)
      Animated.loop(
        Animated.timing(counterRotationAnim, {
          toValue: 1,
          duration: 20000,
          useNativeDriver: true,
        })
      ).start();

      // Mandala pulsing
      Animated.loop(
        Animated.sequence([
          Animated.timing(mandalaAnim, {
            toValue: 1,
            duration: 2500,
            useNativeDriver: true,
          }),
          Animated.timing(mandalaAnim, {
            toValue: 0,
            duration: 2500,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Flower of Life animation
      Animated.loop(
        Animated.timing(flowerAnim, {
          toValue: 1,
          duration: 10000,
          useNativeDriver: true,
        })
      ).start();

      // Pulse animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Vibroacoustic-specific animations
      if (isVibroacousticsActive) {
        const vibroacousticSpeed = Math.max(500, Math.min(3000, 2000 / vibroacousticFrequency));
        
        Animated.loop(
          Animated.timing(vibroacousticAnim, {
            toValue: 1,
            duration: vibroacousticSpeed,
            useNativeDriver: true,
          })
        ).start();

        Animated.loop(
          Animated.sequence([
            Animated.timing(vibroacousticPulse, {
              toValue: 1.5,
              duration: vibroacousticSpeed / 2,
              useNativeDriver: true,
            }),
            Animated.timing(vibroacousticPulse, {
              toValue: 1,
              duration: vibroacousticSpeed / 2,
              useNativeDriver: true,
            }),
          ])
        ).start();
      }
    } else {
      geometryAnim.setValue(0);
      rotationAnim.setValue(0);
      mandalaAnim.setValue(0);
      flowerAnim.setValue(0);
      counterRotationAnim.setValue(0);
      pulseAnim.setValue(1);
      vibroacousticAnim.setValue(0);
      vibroacousticPulse.setValue(1);
    }
  }, [isPlaying, isVibroacousticsActive, vibroacousticFrequency, geometryAnim, rotationAnim, mandalaAnim, flowerAnim, counterRotationAnim, pulseAnim, vibroacousticAnim, vibroacousticPulse]);

  const rotation = rotationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const counterRotation = counterRotationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['360deg', '0deg'],
  });

  const scale = geometryAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.8, 1.3, 0.8],
  });

  const mandalaScale = mandalaAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1.3],
  });

  const flowerOpacity = flowerAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.2, 0.9, 0.2],
  });

  const breathScale = breathingPhase === 'in' ? 1.4 : 0.6;
  const breathOpacity = breathingPhase === 'in' ? 0.9 : 0.3;

  const vibroacousticRotation = vibroacousticAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const vibroacousticScale = vibroacousticPulse.interpolate({
    inputRange: [1, 1.5],
    outputRange: [1, 1.2],
  });

  const vibroacousticOpacity = isVibroacousticsActive ? 0.8 : 0.3;

  return (
    <View style={styles.geometryContainer}>
      {/* Outer rotating mandala */}
      <Animated.View
        style={[
          styles.mandalaOuter,
          {
            transform: [{ rotate: rotation }, { scale: mandalaScale }],
            opacity: flowerOpacity,
          },
        ]}
      >
        {[...Array(16)].map((_, i) => (
          <Animated.View
            key={i}
            style={[
              styles.mandalaLine,
              {
                transform: [
                  { rotate: `${i * 22.5}deg` },
                  { scale: pulseAnim },
                ],
                opacity: mandalaAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.2, 0.8],
                }),
              },
            ]}
          />
        ))}
      </Animated.View>

      {/* Counter-rotating outer ring */}
      <Animated.View
        style={[
          styles.outerRing,
          {
            transform: [{ rotate: counterRotation }, { scale: pulseAnim }],
            opacity: 0.6,
          },
        ]}
      >
        {[...Array(8)].map((_, i) => (
          <View
            key={i}
            style={[
              styles.ringDot,
              {
                transform: [
                  { rotate: `${i * 45}deg` },
                  { translateY: -120 },
                ],
              },
            ]}
          />
        ))}
      </Animated.View>

      {/* Middle hexagon pattern */}
      <Animated.View
        style={[
          styles.hexagonContainer,
          {
            transform: [{ rotate: counterRotation }, { scale }],
          },
        ]}
      >
        {[...Array(6)].map((_, i) => (
          <Animated.View
            key={i}
            style={[
              styles.hexagonSide,
              {
                transform: [{ rotate: `${i * 60}deg` }],
                opacity: geometryAnim.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [0.3, 0.8, 0.3],
                }),
              },
            ]}
          />
        ))}
      </Animated.View>

      {/* Flower of Life pattern */}
      <Animated.View
        style={[
          styles.flowerContainer,
          {
            opacity: flowerOpacity,
            transform: [{ scale }, { rotate: rotation }],
          },
        ]}
      >
        {[...Array(7)].map((_, i) => (
          <Animated.View
            key={i}
            style={[
              styles.flowerCircle,
              {
                transform: [
                  { rotate: `${i * 51.43}deg` },
                  { translateY: i === 0 ? 0 : -35 },
                  { scale: pulseAnim },
                ],
              },
            ]}
          />
        ))}
      </Animated.View>

      {/* Sacred spiral */}
      <Animated.View
        style={[
          styles.spiralContainer,
          {
            transform: [{ rotate: rotation }, { scale: mandalaScale }],
            opacity: mandalaAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.3, 0.8],
            }),
          },
        ]}
      >
        {[...Array(12)].map((_, i) => (
          <Animated.View
            key={i}
            style={[
              styles.spiralDot,
              {
                transform: [
                  { rotate: `${i * 30}deg` },
                  { translateY: -50 - i * 6 },
                  { scale: pulseAnim },
                ],
              },
            ]}
          />
        ))}
      </Animated.View>

      {/* Inner rotating triangles */}
      <Animated.View
        style={[
          styles.triangleContainer,
          {
            transform: [{ rotate: counterRotation }, { scale: breathScale }],
            opacity: breathOpacity,
          },
        ]}
      >
        {[...Array(3)].map((_, i) => (
          <View
            key={i}
            style={[
              styles.innerTriangle,
              {
                transform: [{ rotate: `${i * 120}deg` }],
              },
            ]}
          />
        ))}
      </Animated.View>

      {/* Breathing sync geometry */}
      <Animated.View
        style={[
          styles.breathGeometry,
          {
            transform: [{ scale: breathScale }, { rotate: rotation }],
            opacity: breathOpacity,
          },
        ]}
      >
        {[...Array(4)].map((_, i) => (
          <View
            key={i}
            style={[
              styles.breathTriangle,
              {
                transform: [{ rotate: `${i * 90}deg` }],
              },
            ]}
          />
        ))}
      </Animated.View>

      {/* Vibroacoustic geometry overlay */}
      {isVibroacousticsActive && (
        <>
          <Animated.View
            style={[
              styles.vibroacousticRing,
              {
                transform: [{ rotate: vibroacousticRotation }, { scale: vibroacousticScale }],
                opacity: vibroacousticOpacity,
              },
            ]}
          >
            {[...Array(Math.floor(vibroacousticFrequency / 10))].map((_, i) => (
              <View
                key={i}
                style={[
                  styles.vibroacousticDot,
                  {
                    transform: [
                      { rotate: `${i * (360 / Math.floor(vibroacousticFrequency / 10))}deg` },
                      { translateY: -80 },
                    ],
                  },
                ]}
              />
            ))}
          </Animated.View>
          
          <Animated.View
            style={[
              styles.vibroacousticWaves,
              {
                transform: [{ scale: vibroacousticPulse }],
                opacity: vibroacousticOpacity * 0.6,
              },
            ]}
          >
            {[...Array(3)].map((_, i) => (
              <Animated.View
                key={i}
                style={[
                  styles.vibroacousticWave,
                  {
                    width: 100 + i * 40,
                    height: 100 + i * 40,
                    borderRadius: 50 + i * 20,
                    opacity: vibroacousticAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8 - i * 0.2, 0.1],
                    }),
                  },
                ]}
              />
            ))}
          </Animated.View>
        </>
      )}
    </View>
  );
};

export default function SessionScreen() {
  const router = useRouter();
  const { sessionId } = useLocalSearchParams();
  const { 
    playSound, 
    stopSound, 
    isPlaying, 
    startVibroacoustics, 
    stopVibroacoustics, 
    isVibroacousticsActive,
    vibroacousticIntensity,
    setVibroacousticIntensity 
  } = useAudio();
  const { addSession } = useUserProgress();
  
  const session = useMemo(() => sessions.find((s) => s.id === sessionId), [sessionId]);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const waveAnim = useRef(new Animated.Value(0)).current;
  const breathAnim = useRef(new Animated.Value(0)).current;
  const [breathingPhase, setBreathingPhase] = useState<'in' | 'out'>('in');
  const [showVibroacousticControls, setShowVibroacousticControls] = useState(false);
  const [vibroacousticFrequency, setVibroacousticFrequency] = useState(40);

  useEffect(() => {
    if (!session) return;

    // Start animations
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.timing(waveAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();

    const breathAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(breathAnim, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(breathAnim, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: true,
        }),
      ])
    );
    breathAnimation.start();

    // Update breathing phase
    const breathTimer = setInterval(() => {
      setBreathingPhase(prev => prev === 'in' ? 'out' : 'in');
    }, 4000);

    return () => {
      stopSound();
      stopVibroacoustics();
      clearInterval(breathTimer);
    };
  }, [session, pulseAnim, waveAnim, breathAnim, stopSound, stopVibroacoustics]);

  const handleComplete = useCallback(async () => {
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    if (session) {
      await addSession(session.id, Math.floor(timeElapsed / 60));
    }
    
    stopSound();
    Alert.alert(
      "Session Complete!",
      "Great job! You've completed this session.",
      [
        {
          text: "Continue",
          onPress: () => router.back(),
        },
      ]
    );
  }, [session, timeElapsed, addSession, stopSound, router]);

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
      stopSound();
      stopVibroacoustics();
      setIsPaused(true);
    } else {
      if (session) {
        await playSound(session.audioUrl);
        // Auto-start vibroacoustics with session frequency
        const sessionFreq = parseInt(session.frequency) || 40;
        setVibroacousticFrequency(sessionFreq);
        startVibroacoustics(sessionFreq);
        setIsPaused(false);
      }
    }
  }, [isPlaying, session, playSound, stopSound, startVibroacoustics, stopVibroacoustics]);

  const handleClose = useCallback(() => {
    Alert.alert(
      "End Session",
      "Are you sure you want to end this session?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "End Session",
          style: "destructive",
          onPress: () => {
            stopSound();
            stopVibroacoustics();
            router.back();
          },
        },
      ]
    );
  }, [stopSound, stopVibroacoustics, router]);



  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }, []);

  if (!session) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Session not found</Text>
      </View>
    );
  }

  const progress = (timeElapsed / (session.duration * 60)) * 100;

  return (
    <LinearGradient colors={session.gradient as unknown as readonly [string, string, ...string[]]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <X size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.sessionTitle}>{session.title}</Text>
          <Text style={styles.frequency}>{session.frequency}Hz</Text>

          <View style={styles.visualizer}>
            {/* Sacred Geometry Background */}
            <SacredGeometry 
              isPlaying={isPlaying} 
              breathingPhase={breathingPhase}
              isVibroacousticsActive={isVibroacousticsActive}
              vibroacousticFrequency={vibroacousticFrequency}
            />
            
            <Animated.View
              style={[
                styles.pulseCircle,
                {
                  transform: [{ scale: pulseAnim }],
                  opacity: pulseAnim.interpolate({
                    inputRange: [1, 1.2],
                    outputRange: [0.3, 0.1],
                  }),
                },
              ]}
            />
            <Animated.View
              style={[
                styles.waveCircle,
                {
                  transform: [
                    {
                      scale: waveAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.8, 1.5],
                      }),
                    },
                  ],
                  opacity: waveAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.5, 0],
                  }),
                },
              ]}
            />
            <View style={styles.centerCircle}>
              <Brain size={48} color="#fff" />
            </View>
          </View>

          <View style={styles.breathingGuide}>
            <Animated.View
              style={[
                styles.breathIndicator,
                {
                  transform: [
                    {
                      scale: breathAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 1.3],
                      }),
                    },
                  ],
                },
              ]}
            />
            <Text style={styles.breathText}>
              {breathingPhase === 'in' ? "Breathe In" : "Breathe Out"}
            </Text>
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
            <View style={styles.timeContainer}>
              <Text style={styles.timeText}>{formatTime(timeElapsed)}</Text>
              <Text style={styles.timeText}>
                {formatTime(session.duration * 60)}
              </Text>
            </View>
          </View>

          <View style={styles.controls}>
            <TouchableOpacity
              onPress={handlePlayPause}
              style={styles.playButton}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["rgba(255,255,255,0.3)", "rgba(255,255,255,0.1)"]}
                style={styles.playButtonGradient}
              >
                {isPlaying ? (
                  <Pause size={40} color="#fff" />
                ) : (
                  <Play size={40} color="#fff" style={{ marginLeft: 4 }} />
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Vibroacoustic Controls */}
          <View style={styles.vibroacousticSection}>
            <TouchableOpacity
              onPress={() => setShowVibroacousticControls(!showVibroacousticControls)}
              style={styles.vibroacousticToggle}
              activeOpacity={0.8}
            >
              <Vibrate size={20} color={isVibroacousticsActive ? "#00ff88" : "#fff"} />
              <Text style={[styles.vibroacousticToggleText, { color: isVibroacousticsActive ? "#00ff88" : "#fff" }]}>
                Vibroacoustics {isVibroacousticsActive ? 'ON' : 'OFF'}
              </Text>
              <Settings size={16} color="rgba(255,255,255,0.6)" />
            </TouchableOpacity>

            {showVibroacousticControls && (
              <View style={styles.vibroacousticControls}>
                <View style={styles.controlRow}>
                  <Text style={styles.controlLabel}>Frequency: {vibroacousticFrequency}Hz</Text>
                  <View style={styles.frequencyButtons}>
                    {[20, 40, 60, 80].map((freq) => (
                      <TouchableOpacity
                        key={freq}
                        onPress={() => {
                          setVibroacousticFrequency(freq);
                          if (isVibroacousticsActive) {
                            stopVibroacoustics();
                            startVibroacoustics(freq);
                          }
                        }}
                        style={[
                          styles.frequencyButton,
                          vibroacousticFrequency === freq && styles.frequencyButtonActive
                        ]}
                      >
                        <Text style={[
                          styles.frequencyButtonText,
                          vibroacousticFrequency === freq && styles.frequencyButtonTextActive
                        ]}>
                          {freq}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
                
                <View style={styles.controlRow}>
                  <Text style={styles.controlLabel}>Intensity: {Math.round(vibroacousticIntensity * 100)}%</Text>
                  <View style={styles.intensityButtons}>
                    {[0.3, 0.5, 0.7, 1.0].map((intensity) => (
                      <TouchableOpacity
                        key={intensity}
                        onPress={() => setVibroacousticIntensity(intensity)}
                        style={[
                          styles.intensityButton,
                          Math.abs(vibroacousticIntensity - intensity) < 0.1 && styles.intensityButtonActive
                        ]}
                      >
                        <Text style={[
                          styles.intensityButtonText,
                          Math.abs(vibroacousticIntensity - intensity) < 0.1 && styles.intensityButtonTextActive
                        ]}>
                          {Math.round(intensity * 100)}%
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            )}
          </View>

          <View style={styles.infoCards}>
            <View style={styles.infoCard}>
              <Heart size={20} color="#fff" />
              <Text style={styles.infoText}>Reduces Stress</Text>
            </View>
            <View style={styles.infoCard}>
              <Activity size={20} color="#fff" />
              <Text style={styles.infoText}>Balances Energy</Text>
            </View>
            <View style={styles.infoCard}>
              <Volume2 size={20} color="#fff" />
              <Text style={styles.infoText}>Binaural Beats</Text>
            </View>
            <View style={styles.infoCard}>
              <Vibrate size={20} color={isVibroacousticsActive ? "#00ff88" : "#fff"} />
              <Text style={[styles.infoText, { color: isVibroacousticsActive ? "#00ff88" : "#fff" }]}>Vibroacoustics</Text>
            </View>
          </View>
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
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  sessionTitle: {
    fontSize: 28,
    fontWeight: "bold" as const,
    color: "#fff",
    marginBottom: 8,
    textAlign: "center",
  },
  frequency: {
    fontSize: 18,
    color: "rgba(255,255,255,0.8)",
    marginBottom: 40,
  },
  visualizer: {
    width: 300,
    height: 300,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
  },
  geometryContainer: {
    position: "absolute",
    width: 300,
    height: 300,
    alignItems: "center",
    justifyContent: "center",
  },
  mandalaOuter: {
    position: "absolute",
    width: 280,
    height: 280,
    alignItems: "center",
    justifyContent: "center",
  },
  mandalaLine: {
    position: "absolute",
    width: 2,
    height: 140,
    backgroundColor: "rgba(255,255,255,0.4)",
    top: 0,
    borderRadius: 1,
  },
  outerRing: {
    position: "absolute",
    width: 240,
    height: 240,
    alignItems: "center",
    justifyContent: "center",
  },
  ringDot: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.6)",
  },
  hexagonContainer: {
    position: "absolute",
    width: 160,
    height: 160,
    alignItems: "center",
    justifyContent: "center",
  },
  hexagonSide: {
    position: "absolute",
    width: 2,
    height: 80,
    backgroundColor: "rgba(255,255,255,0.4)",
    top: 0,
  },
  flowerContainer: {
    position: "absolute",
    width: 120,
    height: 120,
    alignItems: "center",
    justifyContent: "center",
  },
  flowerCircle: {
    position: "absolute",
    width: 45,
    height: 45,
    borderRadius: 22.5,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.4)",
  },
  spiralContainer: {
    position: "absolute",
    width: 200,
    height: 200,
    alignItems: "center",
    justifyContent: "center",
  },
  spiralDot: {
    position: "absolute",
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.7)",
  },
  triangleContainer: {
    position: "absolute",
    width: 80,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  innerTriangle: {
    position: "absolute",
    width: 0,
    height: 0,
    borderLeftWidth: 12,
    borderRightWidth: 12,
    borderBottomWidth: 20,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "rgba(255,255,255,0.5)",
    top: -10,
  },
  breathGeometry: {
    position: "absolute",
    width: 100,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  breathTriangle: {
    position: "absolute",
    width: 0,
    height: 0,
    borderLeftWidth: 15,
    borderRightWidth: 15,
    borderBottomWidth: 25,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "rgba(255,255,255,0.4)",
    top: -12.5,
  },
  pulseCircle: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#fff",
  },
  waveCircle: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "#fff",
  },
  centerCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.4)",
  },
  breathingGuide: {
    alignItems: "center",
    marginBottom: 30,
  },
  breathIndicator: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.3)",
    marginBottom: 10,
  },
  breathText: {
    fontSize: 16,
    color: "rgba(255,255,255,0.9)",
    fontWeight: "600" as const,
  },
  progressContainer: {
    width: "100%",
    marginBottom: 40,
  },
  progressBar: {
    height: 6,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 10,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#fff",
    borderRadius: 3,
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  timeText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
  },
  controls: {
    marginBottom: 40,
  },
  playButton: {
    width: 80,
    height: 80,
  },
  playButtonGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.4)",
  },
  infoCards: {
    flexDirection: "row",
    gap: 10,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  infoCard: {
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  infoText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600" as const,
  },
  errorText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
  },
  // Vibroacoustic geometry styles
  vibroacousticRing: {
    position: "absolute",
    width: 160,
    height: 160,
    alignItems: "center",
    justifyContent: "center",
  },
  vibroacousticDot: {
    position: "absolute",
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#00ff88",
  },
  vibroacousticWaves: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  vibroacousticWave: {
    position: "absolute",
    borderWidth: 1,
    borderColor: "#00ff88",
  },
  // Vibroacoustic controls styles
  vibroacousticSection: {
    marginBottom: 20,
    width: "100%",
  },
  vibroacousticToggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 10,
  },
  vibroacousticToggleText: {
    fontSize: 16,
    fontWeight: "600" as const,
  },
  vibroacousticControls: {
    marginTop: 15,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 15,
    padding: 15,
    gap: 15,
  },
  controlRow: {
    gap: 10,
  },
  controlLabel: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    fontWeight: "600" as const,
    marginBottom: 8,
  },
  frequencyButtons: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
  },
  frequencyButton: {
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 50,
    alignItems: "center",
  },
  frequencyButtonActive: {
    backgroundColor: "#00ff88",
  },
  frequencyButtonText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
    fontWeight: "600" as const,
  },
  frequencyButtonTextActive: {
    color: "#000",
  },
  intensityButtons: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
  },
  intensityButton: {
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 45,
    alignItems: "center",
  },
  intensityButtonActive: {
    backgroundColor: "#00ff88",
  },
  intensityButtonText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
    fontWeight: "600" as const,
  },
  intensityButtonTextActive: {
    color: "#000",
  },
});