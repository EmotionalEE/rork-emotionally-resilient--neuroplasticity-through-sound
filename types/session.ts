export interface EmotionalState {
  id: string;
  label: string;
  gradient: string[];
}

export interface GeometryConfig {
  type: 'mandala' | 'flower' | 'spiral' | 'triangle' | 'hexagon' | 'star' | 'lotus' | 'merkaba' | 'sri_yantra';
  elements: number;
  layers: number;
  rotationSpeed: number;
  pulseIntensity: number;
  colors: string[];
}

export interface Session {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  frequency: string; // in Hz
  gradient: string[];
  targetEmotions: string[];
  audioUrl: string;
  geometry: GeometryConfig;
}

export interface SessionProgress {
  sessionId: string;
  completedAt: Date;
  duration: number;
}