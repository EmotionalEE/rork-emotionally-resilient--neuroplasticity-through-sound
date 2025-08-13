export interface EmotionalState {
  id: string;
  label: string;
  gradient: string[];
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
}

export interface SessionProgress {
  sessionId: string;
  completedAt: Date;
  duration: number;
}