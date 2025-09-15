import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Play, Pause, Volume2, Waves } from 'lucide-react-native';
import { useDynamicMusic } from '@/providers/DynamicMusicProvider';
import { sessions } from '@/constants/sessions';

interface DynamicMusicPlayerProps {
  sessionId?: string;
  style?: any;
}

export default function DynamicMusicPlayer({ sessionId, style }: DynamicMusicPlayerProps) {
  const {
    startSession,
    stopMusic,
    isPlaying,
    intensity,
    setIntensity,
    addHealingLayer,
    currentLayers,
    currentSessionId
  } = useDynamicMusic();
  
  // Animation refs for wave and pause effects
  const waveAnims = useRef(Array.from({ length: 12 }, () => new Animated.Value(0))).current;
  const pauseAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const breathAnim = useRef(new Animated.Value(0)).current;
  
  // Find current session info
  const currentSession = sessions.find(s => s.id === (currentSessionId || sessionId));
  const displaySessionId = currentSessionId || sessionId || '396hz-release';
  const sessionTitle = currentSession?.title || 'Dynamic Healing Music';
  
  // Wave and pause animations synced with music
  useEffect(() => {
    const waveLoops: Animated.CompositeAnimation[] = [];
    let pulseLoop: Animated.CompositeAnimation | null = null;
    let breathLoop: Animated.CompositeAnimation | null = null;
    
    if (isPlaying) {
      // Animate pause indicator out
      Animated.timing(pauseAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
      
      // Start wave animations with different frequencies
      waveAnims.forEach((anim, index) => {
        const baseFreq = currentLayers.length > 0 ? currentLayers[0].frequency : 440;
        const waveFreq = Math.max(500, 2000 - (baseFreq * 2) + (index * 100));
        
        const loop = Animated.loop(
          Animated.sequence([
            Animated.timing(anim, {
              toValue: 1,
              duration: waveFreq,
              useNativeDriver: true,
            }),
            Animated.timing(anim, {
              toValue: 0,
              duration: waveFreq,
              useNativeDriver: true,
            }),
          ])
        );
        loop.start();
        waveLoops.push(loop);
      });
      
      // Pulse animation for active state
      pulseLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0.9,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      );
      pulseLoop.start();
      
      // Breathing rhythm animation
      breathLoop = Animated.loop(
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
      breathLoop.start();
    } else {
      // Animate pause indicator in
      Animated.timing(pauseAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      
      // Reset all animations
      waveAnims.forEach(anim => {
        Animated.timing(anim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start();
      });
      
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      
      Animated.timing(breathAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
    
    return () => {
      waveLoops.forEach(loop => loop.stop());
      pulseLoop?.stop();
      breathLoop?.stop();
    };
  }, [isPlaying, currentLayers, waveAnims, pauseAnim, pulseAnim, breathAnim]);

  if (Platform.OS !== 'web') {
    return (
      <View style={[styles.container, style]}>
        <LinearGradient
          colors={['#1a1a2e', '#16213e', '#0f3460']}
          style={styles.gradient}
        >
          <Text style={styles.title}>Dynamic Healing Music</Text>
          <Text style={styles.subtitle}>
            Dynamic music synthesis is only available on web platform
          </Text>
          <Text style={styles.description}>
            Please use the web version to experience the unique dynamic music for deep despair release
          </Text>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <LinearGradient
        colors={isPlaying ? ['#2d1b69', '#11998e', '#38ef7d'] : ['#1a1a2e', '#16213e', '#0f3460']}
        style={styles.gradient}
      >
        <Text style={styles.title}>{sessionTitle}</Text>
        <Text style={styles.subtitle}>
          {currentSessionId ? 'Playing Now' : 'Ready to Play'} • Unique Composition
        </Text>
        
        <View style={styles.visualizer}>
          {/* Animated wave bars synced with music */}
          {waveAnims.map((anim, index) => {
            const layer = currentLayers[index % currentLayers.length];
            const waveHeight = anim.interpolate({
              inputRange: [0, 1],
              outputRange: [20, Math.max(60, intensity * 120)],
            });
            
            const waveOpacity = anim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.3, 0.9],
            });
            
            const waveColor = layer 
              ? `hsl(${(layer.frequency / 10) % 360}, 70%, 60%)`
              : `hsl(${(index * 30) % 360}, 70%, 60%)`;
            
            return (
              <Animated.View
                key={`wave-${index}-${currentSessionId || 'default'}`}
                style={[
                  styles.waveBar,
                  styles.waveBarAnimated,
                  {
                    height: waveHeight,
                    backgroundColor: waveColor,
                    opacity: waveOpacity,
                  }
                ]}
              />
            );
          })}
          
          {/* Pause indicator with breathing animation */}
          <Animated.View 
            style={[
              styles.pauseIndicator,
              {
                opacity: pauseAnim,
                transform: [{
                  scale: breathAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1.2],
                  })
                }]
              }
            ]}
          >
            <Waves size={40} color="#ffffff60" />
            <Text style={styles.pauseText}>
              {isPlaying ? '' : 'Ready for your healing journey'}
            </Text>
          </Animated.View>
        </View>

        <View style={styles.controls}>
          <Animated.View style={[styles.pulseContainer, { transform: [{ scale: pulseAnim }] }]}>
            <TouchableOpacity
              style={[styles.playButton, isPlaying && styles.playButtonActive]}
              onPress={isPlaying ? stopMusic : () => startSession(displaySessionId)}
            >
              {isPlaying ? (
                <Pause size={24} color="#ffffff" />
              ) : (
                <Play size={24} color="#ffffff" />
              )}
            </TouchableOpacity>
          </Animated.View>

          <View style={styles.intensityControl}>
            <Text style={styles.intensityLabel}>Intensity</Text>
            <View style={styles.intensitySlider}>
              <TouchableOpacity
                style={[styles.intensityButton, intensity <= 0.2 && styles.intensityButtonActive]}
                onPress={() => setIntensity(0.2)}
              >
                <Text style={styles.intensityButtonText}>Low</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.intensityButton, intensity > 0.2 && intensity <= 0.6 && styles.intensityButtonActive]}
                onPress={() => setIntensity(0.5)}
              >
                <Text style={styles.intensityButtonText}>Med</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.intensityButton, intensity > 0.6 && styles.intensityButtonActive]}
                onPress={() => setIntensity(0.8)}
              >
                <Text style={styles.intensityButtonText}>High</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={styles.addLayerButton}
            onPress={addHealingLayer}
            disabled={!isPlaying}
          >
            <Volume2 size={20} color={isPlaying ? "#ffffff" : "#ffffff40"} />
            <Text style={[styles.addLayerText, !isPlaying && styles.addLayerTextDisabled]}>
              Add Layer
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.info}>
          <Text style={styles.infoText}>
            🎵 {currentSession?.frequency}Hz healing frequency
          </Text>
          <Text style={styles.infoText}>
            🌊 Orchestral synthesis • {currentSession?.duration || 15} min journey
          </Text>
          <Text style={styles.infoText}>
            ✨ Never the same composition twice
          </Text>
          <Text style={styles.infoText}>
            🧘 Emotion-specific harmonic progression
          </Text>
          {isPlaying && (
            <Text style={styles.layerCount}>
              Active layers: {currentLayers.length} • {sessionTitle} in progress...
            </Text>
          )}
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    overflow: 'hidden',
    marginVertical: 10,
  },
  gradient: {
    padding: 20,
    minHeight: 300,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#ffffff80',
    textAlign: 'center',
    marginBottom: 20,
  },
  description: {
    fontSize: 14,
    color: '#ffffff60',
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 10,
  },
  visualizer: {
    height: 80,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 2,
  },
  waveBar: {
    width: 4,
    borderRadius: 2,
    minHeight: 20,
    marginHorizontal: 1,
  },
  pauseIndicator: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  pauseText: {
    color: '#ffffff60',
    fontSize: 12,
    marginTop: 10,
    textAlign: 'center',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  playButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ffffff20',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ffffff40',
  },
  playButtonActive: {
    backgroundColor: '#ffffff30',
    borderColor: '#ffffff80',
  },
  intensityControl: {
    alignItems: 'center',
  },
  intensityLabel: {
    color: '#ffffff80',
    fontSize: 12,
    marginBottom: 8,
  },
  intensitySlider: {
    flexDirection: 'row',
    gap: 5,
  },
  intensityButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    backgroundColor: '#ffffff20',
    borderWidth: 1,
    borderColor: '#ffffff30',
  },
  intensityButtonActive: {
    backgroundColor: '#ffffff40',
    borderColor: '#ffffff80',
  },
  intensityButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  addLayerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#ffffff20',
    borderWidth: 1,
    borderColor: '#ffffff30',
  },
  addLayerText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  addLayerTextDisabled: {
    color: '#ffffff40',
  },
  info: {
    gap: 5,
  },
  infoText: {
    color: '#ffffff60',
    fontSize: 12,
    textAlign: 'center',
  },
  layerCount: {
    color: '#ffffff80',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 10,
  },
  pulseContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  waveBarAnimated: {
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
});