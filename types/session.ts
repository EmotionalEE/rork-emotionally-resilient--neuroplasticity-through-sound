export interface EmotionalState {
  id: string;
  label: string;
  gradient: string[];
  intensity: number; // 1-10 scale (1 = low, 10 = high)
  category: 'negative' | 'neutral' | 'positive';
}

export interface EmotionEntry {
  id: string;
  emotionId: string;
  intensity: number;
  timestamp: Date;
  sessionId?: string;
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
  preSessionEmotion?: EmotionEntry;
  postSessionEmotion?: EmotionEntry;
}