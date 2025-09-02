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

// Session-specific musical configurations
const SESSION_CONFIGS = {
  '396hz-release': {
    name: 'Deep Despair Release',
    baseFrequencies: [HEALING_FREQUENCIES.UT, HEALING_FREQUENCIES.HEART_CHAKRA, HEALING_FREQUENCIES.THROAT_CHAKRA, HEALING_FREQUENCIES.THIRD_EYE],
    tempo: 'slow', // 25-60s per phase
    intensity: 'building', // Starts high, gradually decreases
    harmonicStyle: 'minor', // Minor keys for emotional release
    orchestration: 'strings_brass', // Deep, resonant instruments
    waveTypes: ['sine', 'triangle'] as OscillatorType[],
  },
  '741hz-detox': {
    name: 'Grief & Anger Cleanse',
    baseFrequencies: [HEALING_FREQUENCIES.SOL, HEALING_FREQUENCIES.STRESS_RELEASE, HEALING_FREQUENCIES.TRAUMA_HEALING, HEALING_FREQUENCIES.SOLAR_PLEXUS],
    tempo: 'medium', // 20-45s per phase
    intensity: 'wave', // Builds and releases in waves
    harmonicStyle: 'diminished', // Tension and resolution
    orchestration: 'percussion_winds', // Cleansing, rhythmic
    waveTypes: ['triangle', 'sawtooth'] as OscillatorType[],
  },
  'theta-healing': {
    name: 'Sadness Transformation',
    baseFrequencies: [HEALING_FREQUENCIES.THETA, HEALING_FREQUENCIES.LOVE_FREQUENCY, HEALING_FREQUENCIES.HEART_CHAKRA, HEALING_FREQUENCIES.SACRAL_CHAKRA],
    tempo: 'slow', // 30-50s per phase
    intensity: 'gentle', // Soft, nurturing progression
    harmonicStyle: 'major', // Uplifting, healing
    orchestration: 'strings_harp', // Gentle, flowing
    waveTypes: ['sine', 'triangle'] as OscillatorType[],
  },
  'delta-sleep': {
    name: 'Anxiety Dissolution',
    baseFrequencies: [HEALING_FREQUENCIES.DELTA, HEALING_FREQUENCIES.ANXIETY_RELIEF, HEALING_FREQUENCIES.SCHUMANN, HEALING_FREQUENCIES.ROOT_CHAKRA],
    tempo: 'very_slow', // 40-80s per phase
    intensity: 'descending', // Gradually decreasing to deep calm
    harmonicStyle: 'ambient', // Spacious, ethereal
    orchestration: 'ambient_pads', // Soft, enveloping
    waveTypes: ['sine'] as OscillatorType[],
  },
  'alpha-waves': {
    name: 'Peaceful Neutrality',
    baseFrequencies: [HEALING_FREQUENCIES.ALPHA, HEALING_FREQUENCIES.FOREST_CALM, HEALING_FREQUENCIES.HEART_CHAKRA, HEALING_FREQUENCIES.THROAT_CHAKRA],
    tempo: 'medium', // 20-40s per phase
    intensity: 'steady', // Consistent, balanced
    harmonicStyle: 'modal', // Natural, organic
    orchestration: 'woodwinds_strings', // Natural, flowing
    waveTypes: ['sine', 'triangle'] as OscillatorType[],
  },
  '528hz-love': {
    name: 'Heart Opening Love',
    baseFrequencies: [HEALING_FREQUENCIES.MI, HEALING_FREQUENCIES.HEART_CHAKRA, HEALING_FREQUENCIES.LOVE_FREQUENCY, HEALING_FREQUENCIES.SACRAL_CHAKRA],
    tempo: 'medium', // 25-45s per phase
    intensity: 'expanding', // Grows in warmth and openness
    harmonicStyle: 'major', // Joyful, loving
    orchestration: 'full_orchestra', // Rich, full sound
    waveTypes: ['sine', 'triangle'] as OscillatorType[],
  },
  'beta-focus': {
    name: 'Confident Clarity',
    baseFrequencies: [HEALING_FREQUENCIES.BETA, HEALING_FREQUENCIES.CLARITY_FOCUS, HEALING_FREQUENCIES.THIRD_EYE, HEALING_FREQUENCIES.CROWN_CHAKRA],
    tempo: 'fast', // 15-30s per phase
    intensity: 'energizing', // Builds energy and focus
    harmonicStyle: 'bright', // Clear, precise
    orchestration: 'brass_percussion', // Energetic, driving
    waveTypes: ['triangle', 'sawtooth'] as OscillatorType[],
  },
  'gamma-insight': {
    name: 'Blissful Enlightenment',
    baseFrequencies: [HEALING_FREQUENCIES.GAMMA, HEALING_FREQUENCIES.ENLIGHTENMENT, HEALING_FREQUENCIES.CROWN_CHAKRA, HEALING_FREQUENCIES.THIRD_EYE],
    tempo: 'fast', // 12-25s per phase
    intensity: 'transcendent', // Builds to peak awareness
    harmonicStyle: 'cosmic', // Otherworldly, expansive
    orchestration: 'ethereal_bells', // Crystalline, transcendent
    waveTypes: ['sine', 'triangle', 'sawtooth'] as OscillatorType[],
  },
};

// Generate unique progression for any session
const generateUniqueProgression = (sessionId: string) => {
  const config = SESSION_CONFIGS[sessionId as keyof typeof SESSION_CONFIGS];
  if (!config) {
    console.warn(`No configuration found for session ${sessionId}, using default`);
    return generateDefaultProgression();
  }
  
  const { baseFrequencies, tempo, intensity, harmonicStyle } = config;
  
  // Shuffle and select frequencies for unique journey
  const shuffled = [...baseFrequencies].sort(() => Math.random() - 0.5);
  const selectedCount = Math.min(baseFrequencies.length, 4 + Math.floor(Math.random() * 3)); // 4-6 steps max
  const selected = shuffled.slice(0, selectedCount);
  
  // Tempo mapping
  const tempoMap = {
    very_slow: { min: 40000, max: 80000 },
    slow: { min: 25000, max: 60000 },
    medium: { min: 20000, max: 45000 },
    fast: { min: 15000, max: 30000 },
  };
  const tempoRange = tempoMap[tempo as keyof typeof tempoMap] || tempoMap.medium;
  
  return selected.map((freq, index) => {
    let stepIntensity: number;
    
    // Intensity patterns based on session type
    switch (intensity) {
      case 'building':
        stepIntensity = Math.max(0.1, 0.9 - (index * 0.15) + (Math.random() * 0.2 - 0.1));
        break;
      case 'wave':
        stepIntensity = 0.5 + 0.4 * Math.sin((index / selected.length) * Math.PI * 2) + (Math.random() * 0.2 - 0.1);
        break;
      case 'gentle':
        stepIntensity = 0.3 + (Math.random() * 0.3);
        break;
      case 'descending':
        stepIntensity = Math.max(0.1, 0.8 - (index * 0.2));
        break;
      case 'steady':
        stepIntensity = 0.5 + (Math.random() * 0.2 - 0.1);
        break;
      case 'expanding':
        stepIntensity = 0.3 + (index / selected.length) * 0.5 + (Math.random() * 0.2 - 0.1);
        break;
      case 'energizing':
        stepIntensity = 0.4 + (index / selected.length) * 0.4 + (Math.random() * 0.2 - 0.1);
        break;
      case 'transcendent':
        stepIntensity = 0.6 + (index / selected.length) * 0.3 + (Math.random() * 0.2 - 0.1);
        break;
      default:
        stepIntensity = 0.5 + (Math.random() * 0.4 - 0.2);
    }
    
    return {
      freq,
      duration: tempoRange.min + Math.random() * (tempoRange.max - tempoRange.min),
      intensity: Math.max(0.1, Math.min(1.0, stepIntensity)),
      harmonicVariation: Math.random() * 0.3 + 0.1,
      modulationDepth: Math.random() * 2 + 0.5,
      layerCount: Math.floor(Math.random() * 3) + 2,
      config,
    };
  });
};

// Fallback for unknown sessions
const generateDefaultProgression = () => {
  const defaultFreqs = [HEALING_FREQUENCIES.ALPHA, HEALING_FREQUENCIES.HEART_CHAKRA, HEALING_FREQUENCIES.LOVE_FREQUENCY];
  return defaultFreqs.map((freq, index) => ({
    freq,
    duration: 30000 + Math.random() * 30000,
    intensity: 0.5 + (Math.random() * 0.3 - 0.15),
    harmonicVariation: Math.random() * 0.3 + 0.1,
    modulationDepth: Math.random() * 2 + 0.5,
    layerCount: Math.floor(Math.random() * 3) + 2,
    config: {
      name: 'Default Session',
      baseFrequencies: [HEALING_FREQUENCIES.ALPHA, HEALING_FREQUENCIES.HEART_CHAKRA, HEALING_FREQUENCIES.LOVE_FREQUENCY],
      tempo: 'medium',
      intensity: 'steady',
      harmonicStyle: 'major',
      orchestration: 'ambient_pads',
      waveTypes: ['sine', 'triangle'] as OscillatorType[],
    },
  }));
};

export const [DynamicMusicProvider, useDynamicMusic] = createContextHook<DynamicMusicContextType>(() => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [intensity, setIntensity] = useState(0.5);
  const [currentLayers, setCurrentLayers] = useState<MusicLayer[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  
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

  // Add a new healing layer with intelligent frequency selection based on current session
  const addHealingLayer = useCallback(() => {
    if (!currentSessionId) return;
    
    const config = SESSION_CONFIGS[currentSessionId as keyof typeof SESSION_CONFIGS];
    const currentFreqs = currentLayers.map(layer => layer.frequency);
    const sessionFrequencies = config?.baseFrequencies || Object.values(HEALING_FREQUENCIES);
    
    // Select frequency that harmonizes with current layers and session theme
    let selectedFreq: number;
    if (currentFreqs.length > 0) {
      const baseFreq = currentFreqs[0];
      const harmonicOptions = [
        baseFreq * 0.5,   // Octave down
        baseFreq * 0.75,  // Perfect fourth down
        baseFreq * 1.25,  // Perfect fourth up
        baseFreq * 1.5,   // Perfect fifth up
        baseFreq * 2,     // Octave up
        ...sessionFrequencies.filter(f => Math.abs(f - baseFreq) > 50) // Session-specific frequencies
      ];
      selectedFreq = harmonicOptions[Math.floor(Math.random() * harmonicOptions.length)];
    } else {
      selectedFreq = sessionFrequencies[Math.floor(Math.random() * sessionFrequencies.length)];
    }
    
    // Use session-specific wave types
    const waveTypes = config?.waveTypes || ['sine', 'triangle', 'sawtooth'];
    const randomWave = waveTypes[Math.floor(Math.random() * waveTypes.length)];
    
    // Create session-appropriate modulation
    const modulationTypes = {
      slow: [{ frequency: 0.02 + Math.random() * 0.08, depth: 0.3 + Math.random() * 0.7 }],
      medium: [{ frequency: 0.1 + Math.random() * 0.2, depth: 0.5 + Math.random() * 1 }],
      fast: [{ frequency: 0.3 + Math.random() * 0.7, depth: 0.2 + Math.random() * 0.8 }],
    };
    
    const sessionTempo = config?.tempo || 'medium';
    const tempoKey = sessionTempo === 'very_slow' ? 'slow' : sessionTempo === 'fast' ? 'fast' : 'medium';
    const availableModulations = modulationTypes[tempoKey as keyof typeof modulationTypes];
    const selectedModulation = availableModulations[Math.floor(Math.random() * availableModulations.length)];
    
    const newLayer: MusicLayer = {
      id: `healing_${currentSessionId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      frequency: selectedFreq,
      volume: 0.08 + Math.random() * 0.15, // Softer volumes for ambient layers
      waveType: randomWave,
      modulation: Math.random() > 0.2 ? selectedModulation : undefined // 80% chance of modulation
    };
    
    setCurrentLayers(prev => [...prev, newLayer]);
    createLayer(newLayer);
    
    // Auto-remove layer after session-appropriate time
    const sessionDuration = sessionTempo === 'fast' ? 30000 : sessionTempo === 'slow' ? 90000 : 60000;
    const removeTimeout = setTimeout(() => {
      removeLayer(newLayer.id);
    }, sessionDuration + Math.random() * 30000);
    
  }, [createLayer, currentLayers, removeLayer, currentSessionId]);

  // Start any session with unique orchestral composition
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
    
    setIsPlaying(true);
    setCurrentSessionId(sessionId);
    currentStepRef.current = 0;
    
    // Generate unique progression for this specific session
    const uniqueProgression = generateUniqueProgression(sessionId);
    const sessionConfig = SESSION_CONFIGS[sessionId as keyof typeof SESSION_CONFIGS];
    console.log(`Generated unique ${sessionConfig?.name || sessionId} journey:`, uniqueProgression);
    
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
      
      // Create unique orchestral layer composition for this step
      const stepLayers: MusicLayer[] = [];
      const sessionConfig = step.config || SESSION_CONFIGS[sessionId as keyof typeof SESSION_CONFIGS];
      const waveTypes = sessionConfig?.waveTypes || ['sine', 'triangle'];
      
      // Main healing frequency (lead instrument)
      stepLayers.push({
        id: `main_${sessionId}_${currentStepRef.current}_${Date.now()}`,
        frequency: step.freq,
        volume: 0.25 + step.intensity * 0.25,
        waveType: waveTypes[0],
        modulation: {
          frequency: 0.08 + Math.random() * 0.2,
          depth: step.modulationDepth
        }
      });
      
      // Generate session-specific harmonic relationships
      const harmonicRatios = {
        minor: [1.2, 1.5, 1.8], // Minor thirds, fifths
        major: [1.25, 1.5, 2], // Major thirds, fifths, octaves
        diminished: [1.189, 1.414, 1.682], // Diminished intervals
        modal: [1.125, 1.333, 1.875], // Natural harmonics
        ambient: [1.618, 2.618, 3.14], // Golden ratio, phi, pi
        bright: [2, 2.5, 3, 4], // Octaves and bright harmonics
        cosmic: [1.618, 2.236, 3.14, 5.236], // Mathematical constants
      };
      
      const harmonicStyle = sessionConfig?.harmonicStyle || 'major';
      const availableRatios = harmonicRatios[harmonicStyle as keyof typeof harmonicRatios] || harmonicRatios.major;
      const selectedRatio = availableRatios[Math.floor(Math.random() * availableRatios.length)];
      
      // Harmonic layer (supporting instrument)
      stepLayers.push({
        id: `harmonic_${sessionId}_${currentStepRef.current}_${Date.now()}`,
        frequency: step.freq * (selectedRatio + step.harmonicVariation * 0.1),
        volume: 0.12 + step.intensity * 0.08,
        waveType: waveTypes[Math.min(1, waveTypes.length - 1)],
        modulation: {
          frequency: 0.05 + Math.random() * 0.15,
          depth: step.modulationDepth * 0.6
        }
      });
      
      // Bass/foundation layer (varies by orchestration)
      const bassRatio = sessionConfig?.orchestration?.includes('percussion') ? 0.25 : 0.5;
      stepLayers.push({
        id: `bass_${sessionId}_${currentStepRef.current}_${Date.now()}`,
        frequency: step.freq * (bassRatio + Math.random() * 0.2),
        volume: 0.08 + step.intensity * 0.04,
        waveType: 'sawtooth',
        modulation: {
          frequency: 0.02 + Math.random() * 0.08,
          depth: step.modulationDepth * 0.3
        }
      });
      
      // Add orchestration-specific layers
      const orchestrationLayers = {
        strings_brass: [
          { ratio: 1.5, volume: 0.1, wave: 'triangle' }, // Strings
          { ratio: 2, volume: 0.08, wave: 'sawtooth' }, // Brass
        ],
        percussion_winds: [
          { ratio: 0.75, volume: 0.12, wave: 'sawtooth' }, // Percussion
          { ratio: 1.33, volume: 0.09, wave: 'triangle' }, // Winds
        ],
        strings_harp: [
          { ratio: 2, volume: 0.06, wave: 'sine' }, // Harp harmonics
          { ratio: 3, volume: 0.04, wave: 'triangle' }, // String harmonics
        ],
        ambient_pads: [
          { ratio: 0.5, volume: 0.08, wave: 'sine' }, // Deep pad
          { ratio: 4, volume: 0.03, wave: 'triangle' }, // High shimmer
        ],
        woodwinds_strings: [
          { ratio: 1.25, volume: 0.09, wave: 'triangle' }, // Woodwinds
          { ratio: 1.75, volume: 0.07, wave: 'sine' }, // Strings
        ],
        full_orchestra: [
          { ratio: 1.25, volume: 0.08, wave: 'triangle' }, // Woodwinds
          { ratio: 1.5, volume: 0.09, wave: 'sawtooth' }, // Brass
          { ratio: 2, volume: 0.06, wave: 'sine' }, // Strings
        ],
        brass_percussion: [
          { ratio: 0.5, volume: 0.11, wave: 'sawtooth' }, // Low brass
          { ratio: 1.5, volume: 0.09, wave: 'triangle' }, // High brass
        ],
        ethereal_bells: [
          { ratio: 2, volume: 0.05, wave: 'sine' }, // Bell harmonics
          { ratio: 3, volume: 0.04, wave: 'triangle' }, // Crystal tones
          { ratio: 5, volume: 0.03, wave: 'sine' }, // High bells
        ],
      };
      
      const orchestration = sessionConfig?.orchestration || 'ambient_pads';
      const orchestrationConfig = orchestrationLayers[orchestration as keyof typeof orchestrationLayers] || orchestrationLayers.ambient_pads;
      
      orchestrationConfig.forEach((layer, i) => {
        if (i < step.layerCount - 3) { // Don't exceed layer count
          stepLayers.push({
            id: `orch_${orchestration}_${i}_${sessionId}_${currentStepRef.current}_${Date.now()}`,
            frequency: step.freq * layer.ratio * (1 + (Math.random() * 0.1 - 0.05)), // Slight detuning
            volume: layer.volume * step.intensity,
            waveType: layer.wave as OscillatorType,
            modulation: {
              frequency: 0.03 + Math.random() * 0.1,
              depth: step.modulationDepth * (0.3 + Math.random() * 0.4)
            }
          });
        }
      });
      
      setCurrentLayers(stepLayers);
      stepLayers.forEach(layer => createLayer(layer));
      
      // Add evolving layers during the step
      const addEvolvingLayers = () => {
        if (Math.random() > 0.4) {
          // Create contextual healing layer based on current session and step
          const sessionFreqs = sessionConfig?.baseFrequencies || [step.freq];
          const contextualFreq = sessionFreqs[Math.floor(Math.random() * sessionFreqs.length)] * (0.8 + Math.random() * 0.4);
          const contextualLayer: MusicLayer = {
            id: `evolving_${sessionId}_${Date.now()}_${Math.random()}`,
            frequency: contextualFreq,
            volume: 0.06 + Math.random() * 0.08,
            waveType: waveTypes[Math.floor(Math.random() * waveTypes.length)],
            modulation: {
              frequency: 0.05 + Math.random() * 0.2,
              depth: 0.3 + Math.random() * 1.0
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