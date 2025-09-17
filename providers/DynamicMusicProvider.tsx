import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { Platform } from "react-native";
import createContextHook from "@nkzw/create-context-hook";

// Web Audio API type definitions for better TypeScript support
type OscillatorType = 'sine' | 'square' | 'sawtooth' | 'triangle';

// Define Web Audio API types for platforms that don't have them
interface WebAudioContext {
  createOscillator(): WebOscillatorNode;
  createGain(): WebGainNode;
  destination: AudioDestinationNode;
  currentTime: number;
  state: string;
  resume(): Promise<void>;
  close(): Promise<void>;
}

interface WebOscillatorNode {
  type: OscillatorType;
  frequency: AudioParam;
  connect(destination: WebGainNode | AudioDestinationNode): void;
  start(): void;
  stop(): void;
}

interface WebGainNode {
  gain: AudioParam;
  connect(destination: WebGainNode | AudioDestinationNode | AudioParam): void;
}

interface AudioParam {
  setValueAtTime(value: number, startTime: number): void;
  linearRampToValueAtTime(value: number, endTime: number): void;
}

interface AudioDestinationNode {
  // Placeholder for audio destination node
}

// Extend Window interface for Web Audio API
declare global {
  interface Window {
    AudioContext: new () => WebAudioContext;
    webkitAudioContext: new () => WebAudioContext;
  }
  
  // Declare window as a global variable
  const window: Window & typeof globalThis;
}

interface MusicLayer {
  id: string;
  frequency: number;
  volume: number;
  waveType: OscillatorType;
  modulation?: {
    frequency: number;
    depth: number;
  };
}

interface DynamicMusicContextType {
  startSession: (sessionId: string) => void;
  stopMusic: () => void;
  isPlaying: boolean;
  intensity: number;
  setIntensity: (intensity: number) => void;
  addHealingLayer: () => void;
  removeLayer: (layerId: string) => void;
  currentLayers: MusicLayer[];
  currentSessionId: string | null;
}

// Comprehensive healing frequencies for all emotional states
const HEALING_FREQUENCIES = {
  // Solfeggio frequencies for emotional healing
  UT: 396, // Liberating guilt and fear
  RE: 417, // Facilitating change
  MI: 528, // Transformation and DNA repair
  FA: 639, // Connecting relationships
  SOL: 741, // Awakening intuition
  LA: 852, // Returning to spiritual order
  SI: 963, // Divine connection
  
  // Brainwave frequencies
  DELTA: 2, // Deep sleep/healing
  THETA: 6, // Deep meditation
  ALPHA: 10, // Relaxed awareness
  BETA: 20, // Focus and concentration
  GAMMA: 40, // Higher consciousness
  
  // Chakra frequencies
  ROOT_CHAKRA: 256, // Grounding and stability
  SACRAL_CHAKRA: 288, // Creativity and emotion
  SOLAR_PLEXUS: 320, // Personal power
  HEART_CHAKRA: 341.3, // Love and compassion
  THROAT_CHAKRA: 384, // Expression and truth
  THIRD_EYE: 426.7, // Intuition and insight
  CROWN_CHAKRA: 480, // Spiritual connection
  
  // Nature frequencies
  SCHUMANN: 7.83, // Earth's resonance
  OCEAN_WAVES: 0.5, // Deep relaxation
  FOREST_CALM: 12, // Natural peace
  
  // Emotional healing frequencies
  ANXIETY_RELIEF: 174, // Pain relief and security
  STRESS_RELEASE: 285, // Healing and regeneration
  FEAR_DISSOLUTION: 396, // Liberation from fear
  TRAUMA_HEALING: 417, // Change and transformation
  LOVE_FREQUENCY: 528, // Miracle tone
  CLARITY_FOCUS: 741, // Awakening intuition
  SPIRITUAL_ORDER: 852, // Returning to order
  ENLIGHTENMENT: 963, // Pineal gland activation
};

// Simplified session configurations - basic healing frequencies only
const SESSION_CONFIGS = {
  '396hz-release': {
    name: 'Deep Despair Release',
    baseFrequencies: [HEALING_FREQUENCIES.UT],
    waveTypes: ['sine'] as OscillatorType[],
  },
  '741hz-detox': {
    name: 'Grief & Anger Cleanse',
    baseFrequencies: [HEALING_FREQUENCIES.SOL],
    waveTypes: ['sine'] as OscillatorType[],
  },
  'theta-healing': {
    name: 'Sadness Transformation',
    baseFrequencies: [HEALING_FREQUENCIES.THETA],
    waveTypes: ['sine'] as OscillatorType[],
  },
  'delta-sleep': {
    name: 'Anxiety Dissolution',
    baseFrequencies: [HEALING_FREQUENCIES.DELTA],
    waveTypes: ['sine'] as OscillatorType[],
  },
  'alpha-waves': {
    name: 'Peaceful Neutrality',
    baseFrequencies: [HEALING_FREQUENCIES.ALPHA],
    waveTypes: ['sine'] as OscillatorType[],
  },
  '528hz-love': {
    name: 'Heart Opening Love',
    baseFrequencies: [HEALING_FREQUENCIES.MI],
    waveTypes: ['sine'] as OscillatorType[],
  },
  'beta-focus': {
    name: 'Confident Clarity',
    baseFrequencies: [HEALING_FREQUENCIES.BETA],
    waveTypes: ['sine'] as OscillatorType[],
  },
  'gamma-insight': {
    name: 'Blissful Enlightenment',
    baseFrequencies: [HEALING_FREQUENCIES.GAMMA],
    waveTypes: ['sine'] as OscillatorType[],
  },
};

// Simple single frequency generation - no complex orchestration
const generateSimpleFrequency = (sessionId: string) => {
  const config = SESSION_CONFIGS[sessionId as keyof typeof SESSION_CONFIGS];
  if (!config) {
    console.warn(`No configuration found for session ${sessionId}, using default`);
    return { freq: HEALING_FREQUENCIES.ALPHA, config: null };
  }
  
  return {
    freq: config.baseFrequencies[0], // Just use the primary frequency
    config,
  };
};



export const [DynamicMusicProvider, useDynamicMusic] = createContextHook<DynamicMusicContextType>(() => {
  // All useState hooks first
  const [isPlaying, setIsPlaying] = useState(false);
  const [intensity, setIntensity] = useState(0.5);
  const [currentLayers, setCurrentLayers] = useState<MusicLayer[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  
  // All useRef hooks together
  const audioContextRef = useRef<WebAudioContext | null>(null);
  const oscillatorsRef = useRef<Map<string, WebOscillatorNode>>(new Map());
  const gainNodesRef = useRef<Map<string, WebGainNode>>(new Map());
  const fadeOutTimeoutsRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  const progressionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Initialize Web Audio Context (works on both web and mobile)
  const initAudioContext = useCallback(() => {
    if (Platform.OS === 'web' && !audioContextRef.current) {
      try {
        // Check if Web Audio API is available
        const globalWindow = typeof window !== 'undefined' ? window : null;
        if (globalWindow && (globalWindow.AudioContext || (globalWindow as any).webkitAudioContext)) {
          const AudioContextConstructor = globalWindow.AudioContext || (globalWindow as any).webkitAudioContext;
          audioContextRef.current = new AudioContextConstructor();
          
          if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
            audioContextRef.current.resume().catch((resumeError: any) => {
              if (resumeError && typeof resumeError === 'object') {
                console.log('Could not resume audio context:', resumeError);
              }
            });
          }
          console.log('Web Audio Context initialized successfully');
        } else {
          console.log('Web Audio API not available in this browser');
        }
      } catch (error) {
        console.log('Web Audio not supported:', error);
        audioContextRef.current = null;
      }
    }
  }, []);

  // Create a single oscillator layer
  const createLayer = useCallback((layer: MusicLayer) => {
    if (!audioContextRef.current) return;

    try {
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();
      
      oscillator.type = layer.waveType;
      oscillator.frequency.setValueAtTime(layer.frequency, audioContextRef.current.currentTime);
      
      // Add subtle modulation for organic feel
      if (layer.modulation) {
        const lfo = audioContextRef.current.createOscillator();
        const lfoGain = audioContextRef.current.createGain();
        
        lfo.frequency.setValueAtTime(layer.modulation.frequency, audioContextRef.current.currentTime);
        lfoGain.gain.setValueAtTime(layer.modulation.depth, audioContextRef.current.currentTime);
        
        lfo.connect(lfoGain);
        lfoGain.connect(oscillator.frequency);
        lfo.start();
      }
      
      gainNode.gain.setValueAtTime(0, audioContextRef.current.currentTime);
      gainNode.gain.linearRampToValueAtTime(layer.volume * intensity, audioContextRef.current.currentTime + 2);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      
      oscillator.start();
      
      oscillatorsRef.current.set(layer.id, oscillator);
      gainNodesRef.current.set(layer.id, gainNode);

      // Add gentle fade out after some time
      const fadeTimeout = setTimeout(() => {
        const gain = gainNodesRef.current.get(layer.id);
        if (gain && audioContextRef.current) {
          gain.gain.linearRampToValueAtTime(0, audioContextRef.current.currentTime + 5);
        }
      }, 120000); // 2 minutes

      fadeOutTimeoutsRef.current.set(layer.id, fadeTimeout as ReturnType<typeof setTimeout>);

    } catch (error) {
      console.log('Error creating audio layer:', error);
    }
  }, [intensity]);

  // Remove a layer
  const removeLayer = useCallback((layerId: string) => {
    const oscillator = oscillatorsRef.current.get(layerId);
    const gainNode = gainNodesRef.current.get(layerId);

    const fadeTimeout = fadeOutTimeoutsRef.current.get(layerId);
    if (fadeTimeout) {
      clearTimeout(fadeTimeout);
      fadeOutTimeoutsRef.current.delete(layerId);
    }

    if (oscillator && gainNode && audioContextRef.current) {
      try {
        gainNode.gain.linearRampToValueAtTime(0, audioContextRef.current.currentTime + 1);
        setTimeout(() => {
          try {
            oscillator.stop();
            oscillatorsRef.current.delete(layerId);
            gainNodesRef.current.delete(layerId);
          } catch (stopError) {
            console.log('Error stopping oscillator:', stopError);
          }
        }, 1000);
      } catch (error) {
        console.log('Error removing layer:', error);
      }
    }
    
    setCurrentLayers(prev => prev.filter(layer => layer.id !== layerId));
  }, []);

  // Add a simple healing layer - no complex orchestration
  const addHealingLayer = useCallback(() => {
    if (!currentSessionId) return;
    
    const config = SESSION_CONFIGS[currentSessionId as keyof typeof SESSION_CONFIGS];
    const baseFreq = config?.baseFrequencies[0] || HEALING_FREQUENCIES.ALPHA;
    
    // Simple harmonic frequency
    const harmonicFreq = baseFreq * (Math.random() > 0.5 ? 0.5 : 2); // Octave up or down
    
    const newLayer: MusicLayer = {
      id: `healing_${currentSessionId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      frequency: harmonicFreq,
      volume: 0.1,
      waveType: 'sine',
      modulation: {
        frequency: 0.1,
        depth: 0.3
      }
    };
    
    setCurrentLayers(prev => [...prev, newLayer]);
    createLayer(newLayer);
    
    // Auto-remove layer after 60 seconds
    setTimeout(() => {
      removeLayer(newLayer.id);
    }, 60000);
    
  }, [createLayer, removeLayer, currentSessionId]);

  // Start simple healing frequency session - no orchestration
  const startSession = useCallback((sessionId: string) => {
    if (Platform.OS !== 'web') {
      console.log('Dynamic music synthesis only available on web platform');
      return;
    }
    
    initAudioContext();

    if (!audioContextRef.current) {
      console.log('Could not initialize audio context');
      return;
    }
    audioContextRef.current.resume();
    setIsPlaying(true);
    setCurrentSessionId(sessionId);
    
    // Generate simple single frequency for this session
    const simpleFreq = generateSimpleFrequency(sessionId);
    const sessionConfig = SESSION_CONFIGS[sessionId as keyof typeof SESSION_CONFIGS];
    console.log(`Starting simple healing frequency for ${sessionConfig?.name || sessionId}:`, simpleFreq.freq);
    
    // Create single healing frequency layer
    const healingLayer: MusicLayer = {
      id: `healing_${sessionId}_${Date.now()}`,
      frequency: simpleFreq.freq,
      volume: 0.2,
      waveType: 'sine',
      modulation: {
        frequency: 0.1,
        depth: 0.5
      }
    };
    
    setCurrentLayers([healingLayer]);
    createLayer(healingLayer);
  }, [initAudioContext, createLayer]);

  // Stop all music
  const stopMusic = useCallback(() => {
    setIsPlaying(false);
    setCurrentSessionId(null);
    
    if (progressionTimeoutRef.current) {
      clearTimeout(progressionTimeoutRef.current);
    }
    
    // Stop all oscillators
    oscillatorsRef.current.forEach((oscillator, id) => {
      try {
        const gainNode = gainNodesRef.current.get(id);
        if (gainNode && audioContextRef.current) {
          gainNode.gain.linearRampToValueAtTime(0, audioContextRef.current.currentTime + 1);
        }
        const fadeTimeout = fadeOutTimeoutsRef.current.get(id);
        if (fadeTimeout) {
          clearTimeout(fadeTimeout);
          fadeOutTimeoutsRef.current.delete(id);
        }
        setTimeout(() => {
          try {
            oscillator.stop();
          } catch (stopError) {
            console.log('Error stopping oscillator in cleanup:', stopError);
          }
        }, 1000);
      } catch (error) {
        console.log('Error stopping oscillator:', error);
      }
    });

    setTimeout(() => {
      oscillatorsRef.current.clear();
      gainNodesRef.current.clear();
      fadeOutTimeoutsRef.current.clear();
      setCurrentLayers([]);
    }, 1000);
  }, []);

  // Update intensity of all current layers
  useEffect(() => {
    gainNodesRef.current.forEach((gainNode, id) => {
      const layer = currentLayers.find(l => l.id === id);
      if (layer && audioContextRef.current) {
        gainNode.gain.linearRampToValueAtTime(
          layer.volume * intensity,
          audioContextRef.current.currentTime + 0.5
        );
      }
    });
  }, [intensity, currentLayers]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopMusic();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [stopMusic]);

  // Use useMemo for optimization as required by linter
  return useMemo(() => ({
    startSession,
    stopMusic,
    isPlaying,
    intensity,
    setIntensity,
    addHealingLayer,
    removeLayer,
    currentLayers,
    currentSessionId,
  }), [startSession, stopMusic, isPlaying, intensity, setIntensity, addHealingLayer, removeLayer, currentLayers, currentSessionId]);
});
