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
} from "lucide-react-native";
import { sessions } from "@/constants/sessions";
import { useAudio } from "@/providers/AudioProvider";
import { useUserProgress } from "@/providers/UserProgressProvider";
import { useDynamicMusic } from "@/providers/DynamicMusicProvider";
import DynamicMusicPlayer from "@/components/DynamicMusicPlayer";
import * as Haptics from "expo-haptics";

// Sacred Geometry Component
const SacredGeometry = ({ 
  isPlaying, 
  breathingPhase, 
  geometry 
}: { 
  isPlaying: boolean; 
  breathingPhase: 'in' | 'out';
  geometry: import('@/types/session').GeometryConfig;
}) => {
  const geometryAnim = useRef(new Animated.Value(0)).current;
  const rotationAnim = useRef(new Animated.Value(0)).current;
  const mandalaAnim = useRef(new Animated.Value(0)).current;
  const flowerAnim = useRef(new Animated.Value(0)).current;
  const counterRotationAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    console.log('Sacred geometry component mounted, starting animations...', {
      type: geometry.type,
      elements: geometry.elements,
      rotationSpeed: geometry.rotationSpeed,
      pulseIntensity: geometry.pulseIntensity
    });
    
    // Reset all values first
    geometryAnim.setValue(0);
    rotationAnim.setValue(0);
    mandalaAnim.setValue(0);
    flowerAnim.setValue(0);
    counterRotationAnim.setValue(0);
    pulseAnim.setValue(1);
    
    // Start all animations immediately when component mounts
    // Main geometry animation - varies by geometry type
    const geometryAnimation = Animated.loop(
      Animated.timing(geometryAnim, {
        toValue: 1,
        duration: geometry.type === 'spiral' ? 6000 : geometry.type === 'star' ? 3000 : 4000,
        useNativeDriver: false,
      })
    );
    geometryAnimation.start();

    // Rotation animation (clockwise) - use geometry config speed
    const rotationAnimation = Animated.loop(
      Animated.timing(rotationAnim, {
        toValue: 1,
        duration: geometry.rotationSpeed,
        useNativeDriver: false,
      })
    );
    rotationAnimation.start();

    // Counter rotation (counter-clockwise) - different speed for visual variety
    const counterRotationAnimation = Animated.loop(
      Animated.timing(counterRotationAnim, {
        toValue: 1,
        duration: geometry.rotationSpeed + (geometry.elements * 200), // Varies by element count
        useNativeDriver: false,
      })
    );
    counterRotationAnimation.start();

    // Mandala/Flower pulsing - varies by geometry type
    const mandalaAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(mandalaAnim, {
          toValue: 1,
          duration: geometry.type === 'lotus' ? 1500 : geometry.type === 'flower' ? 800 : 1000,
          useNativeDriver: false,
        }),
        Animated.timing(mandalaAnim, {
          toValue: 0,
          duration: geometry.type === 'lotus' ? 1500 : geometry.type === 'flower' ? 800 : 1000,
          useNativeDriver: false,
        }),
      ])
    );
    mandalaAnimation.start();

    // Flower of Life animation - varies by element count
    const flowerAnimation = Animated.loop(
      Animated.timing(flowerAnim, {
        toValue: 1,
        duration: 2000 + (geometry.elements * 100), // More elements = slower animation
        useNativeDriver: false,
      })
    );
    flowerAnimation.start();

    // Pulse animation - use geometry config intensity and type-specific timing
    const pulseDuration = geometry.type === 'merkaba' ? 600 : geometry.type === 'triangle' ? 1000 : 800;
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: geometry.pulseIntensity,
          duration: pulseDuration,
          useNativeDriver: false,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: pulseDuration,
          useNativeDriver: false,
        }),
      ])
    );
    pulseAnimation.start();
    
    console.log(`Sacred geometry animations started for ${geometry.type} with ${geometry.elements} elements!`);

    // Cleanup function to stop all animations
    return () => {
      console.log('Stopping sacred geometry animations...');
      geometryAnimation.stop();
      rotationAnimation.stop();
      counterRotationAnimation.stop();
      mandalaAnimation.stop();
      flowerAnimation.stop();
      pulseAnimation.stop();
    };
  }, [geometry]);

  // Create interpolations for animations - customized per geometry type
  const rotation = rotationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const counterRotation = counterRotationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['360deg', '0deg'],
  });

  // Scale varies by geometry type for unique visual effects
  const scaleRange = geometry.type === 'spiral' ? [0.6, 1.8, 0.6] : 
                   geometry.type === 'star' ? [0.9, 1.2, 0.9] :
                   geometry.type === 'merkaba' ? [0.7, 1.5, 0.7] : [0.8, 1.4, 0.8];
  
  const scale = geometryAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: scaleRange,
    extrapolate: 'clamp',
  });

  // Mandala scale varies by type
  const mandalaScaleRange = geometry.type === 'lotus' ? [0.8, 1.5, 0.8] :
                           geometry.type === 'mandala' ? [0.9, 1.3, 0.9] : [0.85, 1.4, 0.85];
  
  const mandalaScale = mandalaAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: mandalaScaleRange,
    extrapolate: 'clamp',
  });

  // Opacity varies by geometry type
  const opacityRange = geometry.type === 'flower' ? [0.2, 1.0, 0.2] :
                      geometry.type === 'lotus' ? [0.4, 0.9, 0.4] : [0.3, 0.9, 0.3];
  
  const flowerOpacity = flowerAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: opacityRange,
    extrapolate: 'clamp',
  });

  const pulseScale = pulseAnim.interpolate({
    inputRange: [1, geometry.pulseIntensity || 1.6],
    outputRange: [1, geometry.pulseIntensity || 1.6],
    extrapolate: 'clamp',
  });

  // Breathing animations
  const breathScale = breathingPhase === 'in' ? 1.3 : 0.7;
  const breathOpacity = breathingPhase === 'in' ? 0.8 : 0.4;

  // Render different geometry patterns based on type
  const renderGeometry = () => {
    const primaryColor = geometry.colors[0] || 'rgba(255,255,255,0.8)';
    const secondaryColor = geometry.colors[1] || 'rgba(255,255,255,0.6)';
    const accentColor = geometry.colors[2] || 'rgba(255,255,255,0.9)';

    switch (geometry.type) {
      case 'mandala':
        return (
          <>
            {/* Mandala rays */}
            <Animated.View
              style={[
                styles.mandalaOuter,
                {
                  transform: [{ rotate: rotation }, { scale: mandalaScale }],
                  opacity: flowerOpacity,
                },
              ]}
            >
              {[...Array(geometry.elements)].map((_, i) => (
                <Animated.View
                  key={`mandala-line-${i}`}
                  style={[
                    styles.mandalaLine,
                    {
                      backgroundColor: primaryColor,
                      transform: [
                        { rotate: `${i * (360 / geometry.elements)}deg` },
                        { scale: pulseScale },
                      ],
                    },
                  ]}
                />
              ))}
            </Animated.View>
            {/* Outer dots */}
            <Animated.View
              style={[
                styles.outerRing,
                {
                  transform: [{ rotate: counterRotation }, { scale: pulseScale }],
                },
              ]}
            >
              {[...Array(Math.floor(geometry.elements / 2))].map((_, i) => (
                <View
                  key={`ring-dot-${i}`}
                  style={[
                    styles.ringDot,
                    {
                      backgroundColor: secondaryColor,
                      transform: [
                        { rotate: `${i * (360 / Math.floor(geometry.elements / 2))}deg` },
                        { translateY: -90 },
                      ],
                    },
                  ]}
                />
              ))}
            </Animated.View>
          </>
        );

      case 'flower':
        return (
          <Animated.View
            style={[
              styles.flowerContainer,
              {
                opacity: flowerOpacity,
                transform: [{ scale: scale }, { rotate: rotation }],
              },
            ]}
          >
            {[...Array(geometry.elements)].map((_, i) => (
              <Animated.View
                key={`flower-circle-${i}`}
                style={[
                  styles.flowerCircle,
                  {
                    borderColor: i % 2 === 0 ? primaryColor : secondaryColor,
                    transform: [
                      { rotate: `${i * (360 / geometry.elements)}deg` },
                      { translateY: i === 0 ? 0 : -35 },
                      { scale: pulseScale },
                    ],
                  },
                ]}
              />
            ))}
          </Animated.View>
        );

      case 'spiral':
        return (
          <Animated.View
            style={[
              styles.spiralContainer,
              {
                transform: [{ rotate: rotation }, { scale: mandalaScale }],
                opacity: 0.8,
              },
            ]}
          >
            {[...Array(geometry.elements)].map((_, i) => (
              <Animated.View
                key={`spiral-dot-${i}`}
                style={[
                  styles.spiralDot,
                  {
                    backgroundColor: i % 3 === 0 ? accentColor : i % 3 === 1 ? primaryColor : secondaryColor,
                    transform: [
                      { rotate: `${i * (360 / geometry.elements)}deg` },
                      { translateY: -50 - i * 6 },
                      { scale: pulseScale },
                    ],
                  },
                ]}
              />
            ))}
          </Animated.View>
        );

      case 'triangle':
        return (
          <>
            {[...Array(geometry.layers || 3)].map((_, layer) => (
              <Animated.View
                key={`triangle-layer-${layer}`}
                style={[
                  styles.triangleContainer,
                  {
                    transform: [
                      { rotate: layer % 2 === 0 ? rotation : counterRotation },
                      { scale: breathScale * (1 + layer * 0.2) },
                    ],
                    opacity: breathOpacity * (1 - layer * 0.1),
                  },
                ]}
              >
                {[...Array(geometry.elements)].map((_, i) => (
                  <View
                    key={`triangle-element-${layer}-${i}`}
                    style={[
                      styles.innerTriangle,
                      {
                        borderBottomColor: layer % 2 === 0 ? primaryColor : secondaryColor,
                        transform: [{ rotate: `${i * (360 / geometry.elements)}deg` }],
                      },
                    ]}
                  />
                ))}
              </Animated.View>
            ))}
          </>
        );

      case 'hexagon':
        return (
          <Animated.View
            style={[
              styles.hexagonContainer,
              {
                transform: [{ rotate: counterRotation }, { scale: scale }],
              },
            ]}
          >
            {[...Array(geometry.elements)].map((_, i) => (
              <Animated.View
                key={`hexagon-side-${i}`}
                style={[
                  styles.hexagonSide,
                  {
                    backgroundColor: primaryColor,
                    transform: [{ rotate: `${i * (360 / geometry.elements)}deg` }],
                    opacity: 0.8,
                  },
                ]}
              />
            ))}
          </Animated.View>
        );

      case 'star':
        return (
          <>
            {[...Array(geometry.layers || 3)].map((_, layer) => (
              <Animated.View
                key={`star-layer-${layer}`}
                style={[
                  styles.starContainer,
                  {
                    transform: [
                      { rotate: layer % 2 === 0 ? rotation : counterRotation },
                      { scale: Animated.multiply(scale, 1 - layer * 0.15) },
                    ],
                    opacity: Math.max(0.1, 0.9 - layer * 0.2),
                  },
                ]}
              >
                {[...Array(geometry.elements)].map((_, i) => (
                  <View
                    key={`star-point-${layer}-${i}`}
                    style={[
                      styles.starPoint,
                      {
                        backgroundColor: layer === 0 ? accentColor : layer === 1 ? primaryColor : secondaryColor,
                        transform: [
                          { rotate: `${i * (360 / geometry.elements)}deg` },
                          { translateY: -60 - layer * 10 },
                        ],
                      },
                    ]}
                  />
                ))}
              </Animated.View>
            ))}
          </>
        );

      case 'lotus':
        return (
          <>
            {[...Array(geometry.layers || 3)].map((_, layer) => (
              <Animated.View
                key={`lotus-layer-${layer}`}
                style={[
                  styles.lotusLayer,
                  {
                    transform: [
                      { rotate: `${layer * 15}deg` },
                      { scale: Animated.multiply(scale, 1 - layer * 0.1) },
                    ],
                    opacity: Animated.multiply(flowerOpacity, Math.max(0.1, 1 - layer * 0.1)),
                  },
                ]}
              >
                {[...Array(geometry.elements)].map((_, i) => (
                  <View
                    key={`lotus-petal-${layer}-${i}`}
                    style={[
                      styles.lotusPetal,
                      {
                        backgroundColor: layer % 3 === 0 ? primaryColor : layer % 3 === 1 ? secondaryColor : accentColor,
                        transform: [
                          { rotate: `${i * (360 / geometry.elements)}deg` },
                          { translateY: -40 - layer * 8 },
                        ],
                      },
                    ]}
                  />
                ))}
              </Animated.View>
            ))}
          </>
        );

      case 'merkaba':
        return (
          <>
            {/* Upper tetrahedron */}
            <Animated.View
              style={[
                styles.merkabaContainer,
                {
                  transform: [{ rotate: rotation }, { scale: scale }],
                  opacity: 0.8,
                },
              ]}
            >
              {[...Array(geometry.elements)].map((_, i) => (
                <View
                  key={`merkaba-upper-${i}`}
                  style={[
                    styles.merkabaTriangle,
                    {
                      borderBottomColor: primaryColor,
                      transform: [{ rotate: `${i * (360 / geometry.elements)}deg` }],
                    },
                  ]}
                />
              ))}
            </Animated.View>
            {/* Lower tetrahedron */}
            <Animated.View
              style={[
                styles.merkabaContainer,
                {
                  transform: [{ rotate: counterRotation }, { scale: scale }, { rotateX: '180deg' }],
                  opacity: 0.6,
                },
              ]}
            >
              {[...Array(geometry.elements)].map((_, i) => (
                <View
                  key={`merkaba-lower-${i}`}
                  style={[
                    styles.merkabaTriangle,
                    {
                      borderBottomColor: secondaryColor,
                      transform: [{ rotate: `${i * (360 / geometry.elements)}deg` }],
                    },
                  ]}
                />
              ))}
            </Animated.View>
          </>
        );

      case 'sri_yantra':
        return (
          <>
            {/* Central bindu (dot) */}
            <Animated.View
              style={[
                styles.sriYantraBindu,
                {
                  backgroundColor: accentColor,
                  transform: [{ scale: pulseScale }],
                },
              ]}
            />
            
            {/* Inner triangles - upward pointing */}
            <Animated.View
              style={[
                styles.sriYantraContainer,
                {
                  transform: [{ rotate: rotation }, { scale: scale }],
                  opacity: 0.9,
                },
              ]}
            >
              {[...Array(4)].map((_, i) => (
                <View
                  key={`sri-yantra-up-${i}`}
                  style={[
                    styles.sriYantraTriangleUp,
                    {
                      borderBottomColor: primaryColor,
                      transform: [
                        { rotate: `${i * 90}deg` },
                        { scale: 1 - i * 0.15 },
                      ],
                    },
                  ]}
                />
              ))}
            </Animated.View>
            
            {/* Outer triangles - downward pointing */}
            <Animated.View
              style={[
                styles.sriYantraContainer,
                {
                  transform: [{ rotate: counterRotation }, { scale: mandalaScale }],
                  opacity: 0.8,
                },
              ]}
            >
              {[...Array(5)].map((_, i) => (
                <View
                  key={`sri-yantra-down-${i}`}
                  style={[
                    styles.sriYantraTriangleDown,
                    {
                      borderTopColor: secondaryColor,
                      transform: [
                        { rotate: `${i * 72}deg` },
                        { scale: 1.2 - i * 0.1 },
                      ],
                    },
                  ]}
                />
              ))}
            </Animated.View>
            
            {/* Outer lotus petals */}
            <Animated.View
              style={[
                styles.sriYantraLotus,
                {
                  transform: [{ rotate: `${rotation}deg` }, { scale: flowerOpacity }],
                  opacity: flowerOpacity,
                },
              ]}
            >
              {[...Array(geometry.elements)].map((_, i) => (
                <View
                  key={`sri-yantra-petal-${i}`}
                  style={[
                    styles.sriYantraPetal,
                    {
                      backgroundColor: i % 2 === 0 ? primaryColor : secondaryColor,
                      transform: [
                        { rotate: `${i * (360 / geometry.elements)}deg` },
                        { translateY: -90 },
                      ],
                    },
                  ]}
                />
              ))}
            </Animated.View>
            
            {/* Outer square boundary */}
            <Animated.View
              style={[
                styles.sriYantraSquare,
                {
                  borderColor: accentColor,
                  transform: [{ rotate: `${counterRotation}deg` }, { scale: breathScale }],
                  opacity: breathOpacity,
                },
              ]}
            />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.geometryContainer}>
      {renderGeometry()}
      
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
            key={`breath-triangle-${i}`}
            style={[
              styles.breathTriangle,
              {
                borderBottomColor: geometry.colors[0] || 'rgba(255,255,255,0.4)',
                transform: [{ rotate: `${i * 90}deg` }],
              },
            ]}
          />
        ))}
      </Animated.View>
    </View>
  );
};

export default function SessionScreen() {
  const router = useRouter();
  const { sessionId } = useLocalSearchParams();
  const { playSound, stopSound, isPlaying } = useAudio();
  const { addSession } = useUserProgress();
  const { stopMusic: stopDynamicMusic, isPlaying: isDynamicPlaying } = useDynamicMusic();
  
  const session = useMemo(() => sessions.find((s) => s.id === sessionId), [sessionId]);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const waveAnim = useRef(new Animated.Value(0)).current;
  const breathAnim = useRef(new Animated.Value(0)).current;
  const [breathingPhase, setBreathingPhase] = useState<'in' | 'out'>('in');
  
  // Icon animation values
  const heartAnim = useRef(new Animated.Value(1)).current;
  const activityAnim = useRef(new Animated.Value(0)).current;
  const volumeAnim = useRef(new Animated.Value(1)).current;
  
  // Initialize animated values with proper numbers
  useEffect(() => {
    pulseAnim.setValue(1);
    waveAnim.setValue(0);
    breathAnim.setValue(0);
    heartAnim.setValue(1);
    activityAnim.setValue(0);
    volumeAnim.setValue(1);
  }, [pulseAnim, waveAnim, breathAnim, heartAnim, activityAnim, volumeAnim]);

  // Create interpolations for main animations
  const pulseOpacity = pulseAnim.interpolate({
    inputRange: [1, 1.2],
    outputRange: [0.1, 0.3],
  });

  const waveOpacity = waveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.2, 0.4],
  });

  // Breathing indicator animation
  const breathIndicatorScale = breathAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1.4],
  });

  const breathIndicatorOpacity = breathAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  // Icon animations
  const heartScale = heartAnim.interpolate({
    inputRange: [0.8, 1, 1.2],
    outputRange: [0.8, 1, 1.2],
    extrapolate: 'clamp',
  });

  const activityRotation = activityAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const volumeScale = volumeAnim.interpolate({
    inputRange: [0.9, 1, 1.1],
    outputRange: [0.9, 1, 1.1],
    extrapolate: 'clamp',
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
              stopDynamicMusic();
            } catch (error) {
              console.log("Error stopping sound during close:", error);
            }
            // Always navigate to home to avoid GO_BACK errors
            router.replace("/home");
          },
        },
      ]
    );
  }, [stopSound, stopDynamicMusic, router]);

  const handleQuickExit = useCallback(async () => {
    try {
      await stopSound();
      stopDynamicMusic();
    } catch (error) {
      console.log("Error stopping sound during quick exit:", error);
    }
    // Always navigate to home to avoid GO_BACK errors
    router.replace("/home");
  }, [stopSound, stopDynamicMusic, router]);

  useEffect(() => {
    if (!session) return;

    // Initialize animations

    // Start animations
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.timing(waveAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: false,
      })
    ).start();

    // Heart beating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(heartAnim, {
          toValue: 1.2,
          duration: 600,
          useNativeDriver: false,
        }),
        Animated.timing(heartAnim, {
          toValue: 0.8,
          duration: 600,
          useNativeDriver: false,
        }),
        Animated.timing(heartAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: false,
        }),
      ])
    ).start();

    // Activity pulse animation
    Animated.loop(
      Animated.timing(activityAnim, {
        toValue: 1,
        duration: 4000,
        useNativeDriver: false,
      })
    ).start();

    // Volume wave animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(volumeAnim, {
          toValue: 1.1,
          duration: 1500,
          useNativeDriver: false,
        }),
        Animated.timing(volumeAnim, {
          toValue: 0.9,
          duration: 1500,
          useNativeDriver: false,
        }),
      ])
    ).start();

    const breathAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(breathAnim, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: false,
        }),
        Animated.timing(breathAnim, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: false,
        }),
      ])
    );
    breathAnimation.start();

    // Update breathing phase
    const breathTimer = setInterval(() => {
      setBreathingPhase(prev => prev === 'in' ? 'out' : 'in');
    }, 4000);

    // Handle Android back button
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      handleClose();
      return true; // Prevent default back action
    });

    return () => {
      stopSound();
      stopDynamicMusic();
      clearInterval(breathTimer);
      backHandler.remove();
    };
  }, [session, pulseAnim, waveAnim, breathAnim, stopSound, handleClose]);

  const handleComplete = useCallback(async () => {
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    if (session) {
      await addSession(session.id, Math.floor(timeElapsed / 60), session.targetEmotions);
    }
    
    try {
      await stopSound();
      stopDynamicMusic();
    } catch (error) {
      console.log("Error stopping sound during completion:", error);
    }
    
    Alert.alert(
      "Session Complete!",
      "Great job! You've completed this session.",
      [
        {
          text: "Continue",
          onPress: () => {
            // Always navigate to home to avoid GO_BACK errors
            router.replace("/home");
          },
        },
      ]
    );
  }, [session, timeElapsed, addSession, stopSound, stopDynamicMusic, router]);

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
      setIsPaused(true);
    } else {
      if (session) {
        await playSound(session.audioUrl);
        setIsPaused(false);
      }
    }
  }, [isPlaying, session, playSound, stopSound]);

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
          <TouchableOpacity onPress={handleQuickExit} style={styles.closeButton}>
            <X size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {/* Title and Frequency */}
          <View style={styles.titleSection}>
            <Text style={styles.sessionTitle}>{session.title}</Text>
            <Text style={styles.frequency}>{session.frequency}Hz</Text>
          </View>

          {/* Main Visualizer Section */}
          <View style={styles.mainSection}>
            <View style={styles.visualizer}>
              {/* Sacred Geometry Background */}
              <SacredGeometry isPlaying={isPlaying} breathingPhase={breathingPhase} geometry={session.geometry} />
              
              <Animated.View
                style={[
                  styles.pulseCircle,
                  {
                    opacity: pulseOpacity,
                  },
                ]}
              />
              <Animated.View
                style={[
                  styles.waveCircle,
                  {
                    opacity: waveOpacity,
                  },
                ]}
              />
              <View style={styles.centerCircle}>
                <Brain size={32} color="#fff" />
              </View>
            </View>

            {/* Side Controls */}
            <View style={styles.sideControls}>
              {/* Breathing Guide */}
              <View style={styles.breathingGuide}>
                <Animated.View
                  style={[
                    styles.breathIndicator,
                    {
                      transform: [{ scale: breathIndicatorScale }],
                      opacity: breathIndicatorOpacity,
                    },
                  ]}
                />
                <Text style={styles.breathText}>
                  {breathingPhase === 'in' ? "In" : "Out"}
                </Text>
              </View>

              {/* Play Button */}
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
                    <Pause size={28} color="#fff" />
                  ) : (
                    <Play size={28} color="#fff" style={{ marginLeft: 2 }} />
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>

          {/* Progress Section */}
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

          {/* Info Cards */}
          <View style={styles.infoCards}>
            <View style={styles.infoCard}>
              <Animated.View style={{ transform: [{ scale: heartScale }] }}>
                <Heart size={16} color="#fff" />
              </Animated.View>
              <Text style={styles.infoText}>Stress Relief</Text>
            </View>
            <View style={styles.infoCard}>
              <Animated.View style={{ transform: [{ rotate: activityRotation }] }}>
                <Activity size={16} color="#fff" />
              </Animated.View>
              <Text style={styles.infoText}>Energy Balance</Text>
            </View>
            <View style={styles.infoCard}>
              <Animated.View style={{ transform: [{ scale: volumeScale }] }}>
                <Volume2 size={16} color="#fff" />
              </Animated.View>
              <Text style={styles.infoText}>Binaural</Text>
            </View>
          </View>
          
          {/* Dynamic Music Player */}
          <View style={styles.dynamicMusicSection}>
            <DynamicMusicPlayer sessionId={session.id} style={styles.dynamicMusicPlayer} />
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
    paddingHorizontal: 20,
    justifyContent: "space-between",
  },
  titleSection: {
    alignItems: "center",
    paddingTop: 10,
  },
  sessionTitle: {
    fontSize: 24,
    fontWeight: "bold" as const,
    color: "#fff",
    marginBottom: 4,
    textAlign: "center",
  },
  frequency: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
  },
  mainSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
    paddingVertical: 20,
  },
  visualizer: {
    width: 220,
    height: 220,
    alignItems: "center",
    justifyContent: "center",
  },
  sideControls: {
    alignItems: "center",
    justifyContent: "space-around",
    height: 220,
    paddingLeft: 20,
  },
  geometryContainer: {
    position: "absolute",
    width: 220,
    height: 220,
    alignItems: "center",
    justifyContent: "center",
  },
  mandalaOuter: {
    position: "absolute",
    width: 200,
    height: 200,
    alignItems: "center",
    justifyContent: "center",
  },
  mandalaLine: {
    position: "absolute",
    width: 2,
    height: 100,
    backgroundColor: "rgba(255,255,255,0.7)",
    top: 0,
    borderRadius: 1,
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
  },
  outerRing: {
    position: "absolute",
    width: 180,
    height: 180,
    alignItems: "center",
    justifyContent: "center",
  },
  ringDot: {
    position: "absolute",
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "rgba(255,255,255,0.8)",
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
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
    width: 3,
    height: 80,
    backgroundColor: "rgba(255,255,255,0.6)",
    top: 0,
    borderRadius: 1.5,
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 3,
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
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.7)",
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
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
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.9)",
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 5,
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
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#fff",
  },
  waveCircle: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: "#fff",
  },
  centerCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.4)",
  },
  breathingGuide: {
    alignItems: "center",
  },
  breathIndicator: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.3)",
    marginBottom: 8,
  },
  breathText: {
    fontSize: 12,
    color: "rgba(255,255,255,0.9)",
    fontWeight: "600" as const,
  },
  progressContainer: {
    width: "100%",
    marginBottom: 20,
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
  playButton: {
    width: 60,
    height: 60,
  },
  playButtonGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.4)",
  },
  infoCards: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  infoCard: {
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
    marginHorizontal: 4,
  },
  infoText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600" as const,
  },
  dynamicMusicSection: {
    width: '100%',
    paddingBottom: 10,
  },
  dynamicMusicPlayer: {
    marginHorizontal: 0,
  },
  errorText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
  },
  starContainer: {
    position: "absolute",
    width: 200,
    height: 200,
    alignItems: "center",
    justifyContent: "center",
  },
  starPoint: {
    position: "absolute",
    width: 6,
    height: 20,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.8)",
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  lotusLayer: {
    position: "absolute",
    width: 180,
    height: 180,
    alignItems: "center",
    justifyContent: "center",
  },
  lotusPetal: {
    position: "absolute",
    width: 8,
    height: 25,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.7)",
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 3,
  },
  merkabaContainer: {
    position: "absolute",
    width: 150,
    height: 150,
    alignItems: "center",
    justifyContent: "center",
  },
  merkabaTriangle: {
    position: "absolute",
    width: 0,
    height: 0,
    borderLeftWidth: 18,
    borderRightWidth: 18,
    borderBottomWidth: 30,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "rgba(255,255,255,0.6)",
    top: -15,
  },
  // Sri Yantra Sacred Geometry Styles
  sriYantraBindu: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.9)",
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
    zIndex: 10,
  },
  sriYantraContainer: {
    position: "absolute",
    width: 200,
    height: 200,
    alignItems: "center",
    justifyContent: "center",
  },
  sriYantraTriangleUp: {
    position: "absolute",
    width: 0,
    height: 0,
    borderLeftWidth: 20,
    borderRightWidth: 20,
    borderBottomWidth: 35,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "rgba(168,237,234,0.8)",
    top: -17.5,
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
  },
  sriYantraTriangleDown: {
    position: "absolute",
    width: 0,
    height: 0,
    borderLeftWidth: 16,
    borderRightWidth: 16,
    borderTopWidth: 28,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "rgba(254,214,227,0.7)",
    bottom: -14,
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
  sriYantraLotus: {
    position: "absolute",
    width: 240,
    height: 240,
    alignItems: "center",
    justifyContent: "center",
  },
  sriYantraPetal: {
    position: "absolute",
    width: 6,
    height: 30,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.6)",
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
  },
  sriYantraSquare: {
    position: "absolute",
    width: 280,
    height: 280,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.4)",
    backgroundColor: "transparent",
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
});