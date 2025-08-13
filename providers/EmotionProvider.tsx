import { useState, useEffect, useCallback, useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import createContextHook from "@nkzw/create-context-hook";
import { EmotionEntry } from "@/types/session";

interface EmotionContextType {
  emotions: EmotionEntry[];
  addEmotion: (emotionId: string, intensity: number, sessionId?: string) => Promise<void>;
  getRecentEmotions: (days?: number) => EmotionEntry[];
  getEmotionTrend: () => 'improving' | 'declining' | 'stable';
  getCurrentMood: () => EmotionEntry | null;
  isLoading: boolean;
}

const EMOTIONS_STORAGE_KEY = '@emotions_data';

export const [EmotionProvider, useEmotions] = createContextHook<EmotionContextType>(() => {
  const [emotions, setEmotions] = useState<EmotionEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load emotions from storage
  useEffect(() => {
    const loadEmotions = async () => {
      try {
        const stored = await AsyncStorage.getItem(EMOTIONS_STORAGE_KEY);
        if (stored) {
          const parsedEmotions = JSON.parse(stored).map((emotion: any) => ({
            ...emotion,
            timestamp: new Date(emotion.timestamp),
          }));
          setEmotions(parsedEmotions);
        }
      } catch (error) {
        console.error('Failed to load emotions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadEmotions();
  }, []);

  // Save emotions to storage
  const saveEmotions = useCallback(async (emotionsToSave: EmotionEntry[]) => {
    try {
      await AsyncStorage.setItem(EMOTIONS_STORAGE_KEY, JSON.stringify(emotionsToSave));
    } catch (error) {
      console.error('Failed to save emotions:', error);
    }
  }, []);

  const addEmotion = useCallback(async (emotionId: string, intensity: number, sessionId?: string) => {
    const newEmotion: EmotionEntry = {
      id: Date.now().toString(),
      emotionId,
      intensity,
      timestamp: new Date(),
      sessionId,
    };

    const updatedEmotions = [...emotions, newEmotion];
    setEmotions(updatedEmotions);
    await saveEmotions(updatedEmotions);
  }, [emotions, saveEmotions]);

  const getRecentEmotions = useCallback((days: number = 7) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return emotions.filter(emotion => emotion.timestamp >= cutoffDate);
  }, [emotions]);

  const getEmotionTrend = useCallback((): 'improving' | 'declining' | 'stable' => {
    const recentEmotions = getRecentEmotions(7);
    if (recentEmotions.length < 3) return 'stable';

    // Sort by timestamp
    const sortedEmotions = recentEmotions.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    
    // Calculate average intensity for first half vs second half
    const midPoint = Math.floor(sortedEmotions.length / 2);
    const firstHalf = sortedEmotions.slice(0, midPoint);
    const secondHalf = sortedEmotions.slice(midPoint);

    const firstHalfAvg = firstHalf.reduce((sum, e) => sum + e.intensity, 0) / firstHalf.length;
    const secondHalfAvg = secondHalf.reduce((sum, e) => sum + e.intensity, 0) / secondHalf.length;

    const difference = secondHalfAvg - firstHalfAvg;
    
    if (difference > 0.5) return 'improving';
    if (difference < -0.5) return 'declining';
    return 'stable';
  }, [getRecentEmotions]);

  const getCurrentMood = useCallback((): EmotionEntry | null => {
    if (emotions.length === 0) return null;
    
    // Get the most recent emotion entry
    return emotions.reduce((latest, current) => 
      current.timestamp > latest.timestamp ? current : latest
    );
  }, [emotions]);

  return useMemo(() => ({
    emotions,
    addEmotion,
    getRecentEmotions,
    getEmotionTrend,
    getCurrentMood,
    isLoading,
  }), [emotions, addEmotion, getRecentEmotions, getEmotionTrend, getCurrentMood, isLoading]);
});