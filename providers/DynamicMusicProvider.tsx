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
  // Deep despair specific frequencies
  HEART_CHAKRA: 341.3, // Heart healing
  THROAT_CHAKRA: 384, // Expression release
  THIRD_EYE: 426.7, // Inner vision
  CROWN_CHAKRA: 480, // Spiritual connection
  // Binaural beat frequencies for deep states
  DEEP_RELEASE: 40, // Gamma for breakthrough
  EMOTIONAL_CLEARING: 8, // Alpha-theta bridge
  SOUL_HEALING: 4, // Delta for deep healing
};

// Generate unique progression each time
const generateUniqueDespairProgression = () => {
  const baseFrequencies = [
    HEALING_FREQUENCIES.UT,
    HEALING_FREQUENCIES.RE, 
    HEALING_FREQUENCIES.MI,
    HEALING_FREQUENCIES.HEART_CHAKRA,
    HEALING_FREQUENCIES.THROAT_CHAKRA,
    HEALING_FREQUENCIES.THIRD_EYE
  ];
  
  // Shuffle and select 4-6 frequencies for unique journey
  const shuffled = [...baseFrequencies].sort(() => Math.random() - 0.5);
  const selectedCount = 4 + Math.floor(Math.random() * 3); // 4-6 steps
  const selected = shuffled.slice(0, selectedCount);
  
  return selected.map((freq, index) => ({
    freq,
    duration: 25000 + Math.random() * 35000, // 25-60 seconds per phase
    intensity: Math.max(0.1, 0.9 - (index * 0.15) + (Math.random() * 0.2 - 0.1)), // Decreasing with variation
    harmonicVariation: Math.random() * 0.3 + 0.1, // Unique harmonic ratios
    modulationDepth: Math.random() * 2 + 0.5, // Varying modulation
    layerCount: Math.floor(Math.random() * 3) + 2, // 2-4 layers per phase
  }));
};

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

  // Add a new healing layer with intelligent frequency selection
  const addHealingLayer = useCallback(() => {
    const currentFreqs = currentLayers.map(layer => layer.frequency);
    const allFrequencies = Object.values(HEALING_FREQUENCIES);
    
    // Select frequency that harmonizes with current layers
    let selectedFreq: number;
    if (currentFreqs.length > 0) {
      const baseFreq = currentFreqs[0];
      const harmonicOptions = [
        baseFreq * 0.5,   // Octave down
        baseFreq * 0.75,  // Perfect fourth down
        baseFreq * 1.25,  // Perfect fourth up
        baseFreq * 1.5,   // Perfect fifth up
        baseFreq * 2,     // Octave up
        ...allFrequencies.filter(f => Math.abs(f - baseFreq) > 50) // Avoid too close frequencies
      ];
      selectedFreq = harmonicOptions[Math.floor(Math.random() * harmonicOptions.length)];
    } else {
      selectedFreq = allFrequencies[Math.floor(Math.random() * allFrequencies.length)];
    }
    
    const waveTypes: OscillatorType[] = ['sine', 'triangle', 'sawtooth'];
    const randomWave = waveTypes[Math.floor(Math.random() * waveTypes.length)];
    
    // Create more sophisticated modulation
    const modulationTypes = [
      { frequency: 0.05 + Math.random() * 0.1, depth: 0.5 + Math.random() * 1 }, // Slow drift
      { frequency: 0.2 + Math.random() * 0.3, depth: 1 + Math.random() * 2 },   // Medium pulse
      { frequency: 0.8 + Math.random() * 1.2, depth: 0.3 + Math.random() * 0.7 }, // Fast shimmer
    ];
    const selectedModulation = modulationTypes[Math.floor(Math.random() * modulationTypes.length)];
    
    const newLayer: MusicLayer = {
      id: `healing_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      frequency: selectedFreq,
      volume: 0.08 + Math.random() * 0.15, // Softer volumes for ambient layers
      waveType: randomWave,
      modulation: Math.random() > 0.2 ? selectedModulation : undefined // 80% chance of modulation
    };
    
    setCurrentLayers(prev => [...prev, newLayer]);
    createLayer(newLayer);
    
    // Auto-remove layer after some time to keep composition flowing
    const removeTimeout = setTimeout(() => {
      removeLayer(newLayer.id);
    }, 45000 + Math.random() * 60000); // 45-105 seconds
    
  }, [createLayer, currentLayers, removeLayer]);

  // Start the despair release journey with unique composition
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
    
    // Generate unique progression for this session
    const uniqueProgression = generateUniqueDespairProgression();
    console.log('Generated unique despair release journey:', uniqueProgression);
    
    // Start the healing progression
    const runProgression = () => {
      if (currentStepRef.current >= uniqueProgression.length) {
        // Journey complete, create ethereal ambient conclusion
        const conclusionLayers = [
          {
            id: 'conclusion_1',
            frequency: HEALING_FREQUENCIES.CROWN_CHAKRA,
            volume: 0.15,
            waveType: 'sine' as OscillatorType,
            modulation: { frequency: 0.05, depth: 0.5 }
          },
          {
            id: 'conclusion_2', 
            frequency: HEALING_FREQUENCIES.SCHUMANN,
            volume: 0.1,
            waveType: 'triangle' as OscillatorType,
            modulation: { frequency: 0.03, depth: 0.3 }
          }
        ];
        
        setCurrentLayers(conclusionLayers);
        conclusionLayers.forEach(layer => createLayer(layer));
        
        // Gradually add more ethereal layers
        progressionTimeoutRef.current = setTimeout(() => {
          addHealingLayer();
          setTimeout(() => addHealingLayer(), 15000);
        }, 10000);
        return;
      }
      
      const step = uniqueProgression[currentStepRef.current];
      setIntensity(step.intensity);
      
      // Create unique layer composition for this step
      const stepLayers: MusicLayer[] = [];
      
      // Main healing frequency
      stepLayers.push({
        id: `main_${currentStepRef.current}_${Date.now()}`,
        frequency: step.freq,
        volume: 0.3 + step.intensity * 0.2,
        waveType: 'sine',
        modulation: {
          frequency: 0.1 + Math.random() * 0.3,
          depth: step.modulationDepth
        }
      });
      
      // Generate unique harmonic relationships
      const harmonicRatios = [1.5, 1.618, 2, 2.5, 3]; // Golden ratio, octaves, fifths
      const selectedRatio = harmonicRatios[Math.floor(Math.random() * harmonicRatios.length)];
      
      stepLayers.push({
        id: `harmonic_${currentStepRef.current}_${Date.now()}`,
        frequency: step.freq * (selectedRatio + step.harmonicVariation),
        volume: 0.15 + step.intensity * 0.1,
        waveType: Math.random() > 0.5 ? 'triangle' : 'sawtooth',
        modulation: {
          frequency: 0.08 + Math.random() * 0.2,
          depth: step.modulationDepth * 0.7
        }
      });
      
      // Sub-harmonic for depth (unique ratio each time)
      const subRatio = 0.5 + Math.random() * 0.3; // 0.5 to 0.8
      stepLayers.push({
        id: `sub_${currentStepRef.current}_${Date.now()}`,
        frequency: step.freq * subRatio,
        volume: 0.1 + step.intensity * 0.05,
        waveType: 'sawtooth',
        modulation: {
          frequency: 0.05 + Math.random() * 0.1,
          depth: step.modulationDepth * 0.5
        }
      });
      
      // Add additional layers based on step configuration
      for (let i = 3; i < step.layerCount; i++) {
        const additionalFreq = step.freq * (0.25 + Math.random() * 1.5);
        stepLayers.push({
          id: `extra_${i}_${currentStepRef.current}_${Date.now()}`,
          frequency: additionalFreq,
          volume: 0.05 + Math.random() * 0.1,
          waveType: ['sine', 'triangle', 'sawtooth'][Math.floor(Math.random() * 3)] as OscillatorType,
          modulation: {
            frequency: Math.random() * 0.4,
            depth: Math.random() * 2
          }
        });
      }
      
      setCurrentLayers(stepLayers);
      stepLayers.forEach(layer => createLayer(layer));
      
      // Add evolving layers during the step
      const addEvolvingLayers = () => {
        if (Math.random() > 0.4) {
          // Create contextual healing layer based on current step
          const contextualFreq = step.freq * (0.8 + Math.random() * 0.4);
          const contextualLayer: MusicLayer = {
            id: `evolving_${Date.now()}_${Math.random()}`,
            frequency: contextualFreq,
            volume: 0.08 + Math.random() * 0.12,
            waveType: ['sine', 'triangle'][Math.floor(Math.random() * 2)] as OscillatorType,
            modulation: {
              frequency: 0.1 + Math.random() * 0.3,
              depth: 0.5 + Math.random() * 1.5
            }
          };
          
          setCurrentLayers(prev => [...prev, contextualLayer]);
          createLayer(contextualLayer);
        }
      };
      
      const randomInterval = setInterval(addEvolvingLayers, 6000 + Math.random() * 14000);
      
      progressionTimeoutRef.current = setTimeout(() => {
        clearInterval(randomInterval);
        // Fade out current step layers
        stepLayers.forEach(layer => {
          const gainNode = gainNodesRef.current.get(layer.id);
          if (gainNode && audioContextRef.current) {
            gainNode.gain.linearRampToValueAtTime(0, audioContextRef.current.currentTime + 3);
          }
        });
        
        // Clean up after fade
        setTimeout(() => {
          stepLayers.forEach(layer => removeLayer(layer.id));
        }, 3000);
        
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