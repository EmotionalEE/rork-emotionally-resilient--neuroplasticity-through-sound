import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
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
  
  // Find current session info
  const currentSession = sessions.find(s => s.id === (currentSessionId || sessionId));
  const displaySessionId = currentSessionId || sessionId || '396hz-release';
  const sessionTitle = currentSession?.title || 'Dynamic Healing Music';

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
          {currentLayers.map((layer, index) => (
            <View
              key={layer.id}
              style={[
                styles.waveBar,
                {
                  height: Math.max(20, layer.volume * intensity * 100),
                  backgroundColor: `hsl(${(layer.frequency / 10) % 360}, 70%, 60%)`,
                  opacity: 0.7 + (layer.volume * 0.3)
                }
              ]}
            />
          ))}
          {!isPlaying && (
            <View style={styles.placeholderWaves}>
              <Waves size={40} color="#ffffff40" />
              <Text style={styles.placeholderText}>
                Your unique healing journey will visualize here
              </Text>
            </View>
          )}
        </View>

        <View style={styles.controls}>
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
  },
  placeholderWaves: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: '#ffffff40',
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
});