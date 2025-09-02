import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Platform } from "react-native";
import createContextHook from "@nkzw/create-context-hook";

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
  startDespairRelease: () => void;
  stopMusic: () => void;
  isPlaying: boolean;
  intensity: number;
  setIntensity: (intensity: number) => void;
  addHealingLayer: () => void;
  removeLayer: (layerId: string) => void;
  currentLayers: MusicLayer[];
}

// Healing frequencies for despair release
const HEALING_FREQUENCIES = {
  // Solfeggio frequencies for emotional healing
  UT: 396, // Liberating guilt and fear
  RE: 417, // Facilitating change
  MI: 528, // Transformation and DNA repair
  FA: 639, // Connecting relationships
  SOL: 741, // Awakening intuition
  LA: 852, // Returning to spiritual order
  // Additional therapeutic frequencies
  SCHUMANN: 7.83, // Earth's resonance
  ALPHA: 10, // Relaxed awareness
  THETA: 6, // Deep meditation
  DELTA: 2, // Deep sleep/healing
};

const DESPAIR_RELEASE_PROGRESSION = [
  { freq: HEALING_FREQUENCIES.UT, duration: 30000, intensity: 0.8 }, // Release fear
  { freq: HEALING_FREQUENCIES.RE, duration: 45000, intensity: 0.6 }, // Facilitate change
  { freq: HEALING_FREQUENCIES.MI, duration: 60000, intensity: 0.4 }, // Transform
  { freq: HEALING_FREQUENCIES.FA, duration: 45000, intensity: 0.3 }, // Connect
  { freq: HEALING_FREQUENCIES.SOL, duration: 30000, intensity: 0.2 }, // Awaken
];

export const [DynamicMusicProvider, useDynamicMusic] = createContextHook<DynamicMusicContextType>(() => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [intensity, setIntensity] = useState(0.5);
  const [currentLayers, setCurrentLayers] = useState<MusicLayer[]>([]);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<Map<string, OscillatorNode>>(new Map());
  const gainNodesRef = useRef<Map<string, GainNode>>(new Map());
  const progressionTimeoutRef = useRef<any>(null);
  const currentStepRef = useRef(0);

  // Initialize Web Audio Context (works on both web and mobile)
  const initAudioContext = useCallback(() => {
    if (Platform.OS === 'web' && !audioContextRef.current) {
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (error) {
        console.log('Web Audio not supported:', error);
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
      
    } catch (error) {
      console.log('Error creating audio layer:', error);
    }
  }, [intensity]);

  // Remove a layer
  const removeLayer = useCallback((layerId: string) => {
    const oscillator = oscillatorsRef.current.get(layerId);
    const gainNode = gainNodesRef.current.get(layerId);
    
    if (oscillator && gainNode && audioContextRef.current) {
      try {
        gainNode.gain.linearRampToValueAtTime(0, audioContextRef.current.currentTime + 1);
        const stopTimeout = setTimeout(() => {
          oscillator.stop();
          oscillatorsRef.current.delete(layerId);
          gainNodesRef.current.delete(layerId);
        }, 1000);
      } catch (error) {
        console.log('Error removing layer:', error);
      }
    }
    
    setCurrentLayers(prev => prev.filter(layer => layer.id !== layerId));
  }, []);

  // Add a new healing layer
  const addHealingLayer = useCallback(() => {
    const frequencies = Object.values(HEALING_FREQUENCIES);
    const randomFreq = frequencies[Math.floor(Math.random() * frequencies.length)];
    const waveTypes: OscillatorType[] = ['sine', 'triangle', 'sawtooth'];
    const randomWave = waveTypes[Math.floor(Math.random() * waveTypes.length)];
    
    const newLayer: MusicLayer = {
      id: `layer_${Date.now()}_${Math.random()}`,
      frequency: randomFreq,
      volume: 0.1 + Math.random() * 0.3,
      waveType: randomWave,
      modulation: Math.random() > 0.5 ? {
        frequency: 0.1 + Math.random() * 0.5,
        depth: 1 + Math.random() * 3
      } : undefined
    };
    
    setCurrentLayers(prev => [...prev, newLayer]);
    createLayer(newLayer);
  }, [createLayer]);

  // Start the despair release journey
  const startDespairRelease = useCallback(() => {
    if (Platform.OS !== 'web') {
      console.log('Dynamic music synthesis only available on web platform');
      return;
    }
    
    initAudioContext();
    
    if (!audioContextRef.current) {
      console.log('Could not initialize audio context');
      return;
    }
    
    setIsPlaying(true);
    currentStepRef.current = 0;
    
    // Start the healing progression
    const runProgression = () => {
      if (currentStepRef.current >= DESPAIR_RELEASE_PROGRESSION.length) {
        // Journey complete, add gentle ambient layers
        addHealingLayer();
        progressionTimeoutRef.current = setTimeout(() => {
          addHealingLayer();
        }, 10000);
        return;
      }
      
      const step = DESPAIR_RELEASE_PROGRESSION[currentStepRef.current];
      setIntensity(step.intensity);
      
      // Create main healing tone
      const mainLayer: MusicLayer = {
        id: `main_${currentStepRef.current}`,
        frequency: step.freq,
        volume: 0.4,
        waveType: 'sine',
        modulation: {
          frequency: 0.2,
          depth: 2
        }
      };
      
      // Create harmonic
      const harmonicLayer: MusicLayer = {
        id: `harmonic_${currentStepRef.current}`,
        frequency: step.freq * 1.5, // Perfect fifth
        volume: 0.2,
        waveType: 'triangle',
        modulation: {
          frequency: 0.15,
          depth: 1.5
        }
      };
      
      // Create sub-harmonic for depth
      const subLayer: MusicLayer = {
        id: `sub_${currentStepRef.current}`,
        frequency: step.freq * 0.5,
        volume: 0.15,
        waveType: 'sawtooth',
        modulation: {
          frequency: 0.1,
          depth: 1
        }
      };
      
      setCurrentLayers([mainLayer, harmonicLayer, subLayer]);
      createLayer(mainLayer);
      createLayer(harmonicLayer);
      createLayer(subLayer);
      
      // Add random healing layers during the step
      const addRandomLayers = () => {
        if (Math.random() > 0.3) {
          addHealingLayer();
        }
      };
      
      const randomInterval = setInterval(addRandomLayers, 8000 + Math.random() * 12000);
      
      progressionTimeoutRef.current = setTimeout(() => {
        clearInterval(randomInterval);
        // Clean up current step layers
        [mainLayer, harmonicLayer, subLayer].forEach(layer => {
          removeLayer(layer.id);
        });
        
        currentStepRef.current++;
        runProgression();
      }, step.duration);
    };
    
    runProgression();
  }, [initAudioContext, createLayer, addHealingLayer, removeLayer]);

  // Stop all music
  const stopMusic = useCallback(() => {
    setIsPlaying(false);
    
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
        const stopTimeout = setTimeout(() => {
          oscillator.stop();
        }, 1000);
      } catch (error) {
        console.log('Error stopping oscillator:', error);
      }
    });
    
    const cleanupTimeout = setTimeout(() => {
      oscillatorsRef.current.clear();
      gainNodesRef.current.clear();
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

  return useMemo(() => ({
    startDespairRelease,
    stopMusic,
    isPlaying,
    intensity,
    setIntensity,
    addHealingLayer,
    removeLayer,
    currentLayers,
  }), [startDespairRelease, stopMusic, isPlaying, intensity, setIntensity, addHealingLayer, removeLayer, currentLayers]);
});