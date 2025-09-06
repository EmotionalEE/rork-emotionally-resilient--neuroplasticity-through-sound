import { EmotionalState, Session } from "@/types/session";

export const emotionalStates: EmotionalState[] = [
  {
    id: "anxious",
    label: "Anxious",
    gradient: ["#FF6B6B", "#C44569"],
  },
  {
    id: "stressed",
    label: "Stressed",
    gradient: ["#F7971E", "#FFD200"],
  },
  {
    id: "sad",
    label: "Sad",
    gradient: ["#667eea", "#764ba2"],
  },
  {
    id: "angry",
    label: "Angry",
    gradient: ["#f093fb", "#f5576c"],
  },
  {
    id: "calm",
    label: "Calm",
    gradient: ["#4facfe", "#00f2fe"],
  },
  {
    id: "focused",
    label: "Focused",
    gradient: ["#43e97b", "#38f9d7"],
  },
  {
    id: "happy",
    label: "Happy",
    gradient: ["#fa709a", "#fee140"],
  },
  {
    id: "energized",
    label: "Energized",
    gradient: ["#30cfd0", "#330867"],
  },
];

export const sessions: Session[] = [
  {
    id: "396hz-release",
    title: "Deep Despair Release",
    description: "Release fear and guilt with this powerful solfeggio frequency",
    duration: 15,
    frequency: "396",
    gradient: ["#a1c4fd", "#c2e9fb"],
    targetEmotions: ["anxious", "stressed", "angry"],
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
    geometry: {
      type: 'spiral',
      elements: 12,
      layers: 3,
      rotationSpeed: 6000,
      pulseIntensity: 1.4,
      colors: ['rgba(161,196,253,0.8)', 'rgba(194,233,251,0.6)', 'rgba(255,255,255,0.9)']
    },
  },
  {
    id: "741hz-detox",
    title: "Grief & Anger Cleanse",
    description: "Cleanse negative emotions and toxins from your energy field",
    duration: 22,
    frequency: "741",
    gradient: ["#d299c2", "#fef9d7"],
    targetEmotions: ["angry", "sad", "stressed"],
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
    geometry: {
      type: 'triangle',
      elements: 9,
      layers: 4,
      rotationSpeed: 8000,
      pulseIntensity: 1.6,
      colors: ['rgba(210,153,194,0.8)', 'rgba(254,249,215,0.6)', 'rgba(255,255,255,0.7)']
    },
  },
  {
    id: "theta-healing",
    title: "Sadness Transformation",
    description: "Deep emotional training and emotional healing with 6Hz theta waves",
    duration: 20,
    frequency: "6",
    gradient: ["#f093fb", "#f5576c"],
    targetEmotions: ["sad", "anxious", "calm"],
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    geometry: {
      type: 'lotus',
      elements: 8,
      layers: 5,
      rotationSpeed: 4000,
      pulseIntensity: 1.8,
      colors: ['rgba(240,147,251,0.8)', 'rgba(245,87,108,0.6)', 'rgba(255,255,255,0.9)']
    },
  },
  {
    id: "delta-sleep",
    title: "Anxiety Dissolution",
    description: "Dissolve anxiety with sacred geometry and 2Hz delta waves",
    duration: 30,
    frequency: "2",
    gradient: ["#a8e6cf", "#88d8a3"],
    targetEmotions: ["anxious", "stressed", "calm"],
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    geometry: {
      type: 'sri_yantra',
      elements: 9,
      layers: 4,
      rotationSpeed: 12000,
      pulseIntensity: 1.5,
      colors: ['rgba(255,255,255,0.9)', 'rgba(168,230,207,0.8)', 'rgba(136,216,163,0.7)']
    },
  },
  {
    id: "alpha-waves",
    title: "Peaceful Neutrality",
    description: "Promotes relaxation and reduces anxiety with 10Hz alpha waves",
    duration: 15,
    frequency: "10",
    gradient: ["#667eea", "#764ba2"],
    targetEmotions: ["anxious", "stressed", "calm"],
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    geometry: {
      type: 'hexagon',
      elements: 6,
      layers: 4,
      rotationSpeed: 7000,
      pulseIntensity: 1.3,
      colors: ['rgba(102,126,234,0.8)', 'rgba(118,75,162,0.6)', 'rgba(255,255,255,0.7)']
    },
  },
  {
    id: "528hz-love",
    title: "Heart Opening Love",
    description: "The miracle tone for transformation and DNA repair",
    duration: 18,
    frequency: "528",
    gradient: ["#ff9a9e", "#fecfef"],
    targetEmotions: ["sad", "angry", "happy", "calm"],
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
    geometry: {
      type: 'flower',
      elements: 12,
      layers: 6,
      rotationSpeed: 5000,
      pulseIntensity: 2.0,
      colors: ['rgba(255,154,158,0.8)', 'rgba(254,207,239,0.6)', 'rgba(255,255,255,0.9)']
    },
  },
  {
    id: "beta-focus",
    title: "Confident Clarity",
    description: "Enhance concentration and mental clarity with 20Hz beta waves",
    duration: 10,
    frequency: "20",
    gradient: ["#4facfe", "#00f2fe"],
    targetEmotions: ["focused", "energized"],
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    geometry: {
      type: 'star',
      elements: 8,
      layers: 3,
      rotationSpeed: 3000,
      pulseIntensity: 1.7,
      colors: ['rgba(79,172,254,0.8)', 'rgba(0,242,254,0.6)', 'rgba(255,255,255,0.8)']
    },
  },
  {
    id: "gamma-insight",
    title: "Blissful Enlightenment",
    description: "Heighten awareness and cognitive function with 40Hz gamma waves",
    duration: 12,
    frequency: "40",
    gradient: ["#ffecd2", "#fcb69f"],
    targetEmotions: ["focused", "energized", "happy"],
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    geometry: {
      type: 'merkaba',
      elements: 6,
      layers: 2,
      rotationSpeed: 4500,
      pulseIntensity: 1.9,
      colors: ['rgba(255,236,210,0.8)', 'rgba(252,182,159,0.6)', 'rgba(255,255,255,0.9)']
    },
  },
];