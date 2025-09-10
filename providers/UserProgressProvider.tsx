import { useState, useEffect, useCallback, useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import createContextHook from "@nkzw/create-context-hook";

interface EmotionProgress {
  emotionId: string;
  sessionsCompleted: number;
  totalMinutes: number;
  improvementPercentage: number;
  lastWorkedOn: string | null;
}

interface UserProgress {
  totalSessions: number;
  totalMinutes: number;
  streak: number;
  lastSessionDate: string | null;
  completedSessions: string[];
  emotionProgress: EmotionProgress[];
}

interface UserProgressContextType {
  progress: UserProgress;
  hasCompletedOnboarding: boolean;
  hasSeenWelcome: boolean;
  isLoading: boolean;
  completeOnboarding: () => Promise<void>;
  completeWelcome: () => Promise<void>;
  addSession: (sessionId: string, duration: number, targetEmotions: string[]) => Promise<void>;
  resetProgress: () => Promise<void>;
  getEmotionProgress: (emotionId: string) => EmotionProgress | null;
}

const PROGRESS_KEY = "user_progress";
const ONBOARDING_KEY = "onboarding_completed";
const WELCOME_KEY = "welcome_seen";

const defaultProgress: UserProgress = {
  totalSessions: 0,
  totalMinutes: 0,
  streak: 0,
  lastSessionDate: null,
  completedSessions: [],
  emotionProgress: [],
};

export const [UserProgressProvider, useUserProgress] = createContextHook<UserProgressContextType>(() => {
  const [progress, setProgress] = useState<UserProgress>(defaultProgress);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [hasSeenWelcome, setHasSeenWelcome] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadProgress = useCallback(async () => {
    try {
      console.log("[PROGRESS] Loading progress from AsyncStorage...");
      const stored = await AsyncStorage.getItem(PROGRESS_KEY);
      if (stored) {
        const progressData = JSON.parse(stored);
        console.log("[PROGRESS] Progress loaded:", progressData.totalSessions, "sessions");
        setProgress(progressData);
      } else {
        console.log("[PROGRESS] No progress found, using defaults");
      }
    } catch (error) {
      console.error("[PROGRESS] Error loading progress:", error);
    }
  }, []);

  const checkOnboarding = useCallback(async () => {
    try {
      console.log("[PROGRESS] Checking onboarding status...");
      const completed = await AsyncStorage.getItem(ONBOARDING_KEY);
      const hasCompleted = completed === "true";
      console.log("[PROGRESS] Onboarding completed:", hasCompleted);
      setHasCompletedOnboarding(hasCompleted);
    } catch (error) {
      console.error("[PROGRESS] Error checking onboarding:", error);
    }
  }, []);

  const checkWelcome = useCallback(async () => {
    try {
      console.log("[PROGRESS] Checking welcome status...");
      const seen = await AsyncStorage.getItem(WELCOME_KEY);
      const hasSeen = seen === "true";
      console.log("[PROGRESS] Welcome seen:", hasSeen);
      setHasSeenWelcome(hasSeen);
    } catch (error) {
      console.error("[PROGRESS] Error checking welcome:", error);
    }
  }, []);

  useEffect(() => {
    const loadAllData = async () => {
      console.log("[PROGRESS] UserProgressProvider mounted, loading all data...");
      setIsLoading(true);
      
      await Promise.all([
        loadProgress(),
        checkOnboarding(),
        checkWelcome()
      ]);
      
      console.log("[PROGRESS] All data loaded, setting loading to false");
      setIsLoading(false);
    };
    
    loadAllData();
  }, [loadProgress, checkOnboarding, checkWelcome]);

  const completeOnboarding = useCallback(async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, "true");
      setHasCompletedOnboarding(true);
    } catch (error) {
      console.error("Error completing onboarding:", error);
    }
  }, []);

  const completeWelcome = useCallback(async () => {
    try {
      await AsyncStorage.setItem(WELCOME_KEY, "true");
      setHasSeenWelcome(true);
    } catch (error) {
      console.error("Error completing welcome:", error);
    }
  }, []);

  const saveProgress = useCallback(async (newProgress: UserProgress) => {
    try {
      await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(newProgress));
      setProgress(newProgress);
    } catch (error) {
      console.error("Error saving progress:", error);
    }
  }, []);

  const addSession = useCallback(async (sessionId: string, duration: number, targetEmotions: string[] = []) => {
    const today = new Date().toDateString();
    const lastDate = progress.lastSessionDate;
    
    let newStreak = progress.streak;
    if (lastDate) {
      const lastSessionDate = new Date(lastDate);
      const todayDate = new Date(today);
      const diffTime = Math.abs(todayDate.getTime() - lastSessionDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        newStreak += 1;
      } else if (diffDays > 1) {
        newStreak = 1;
      }
    } else {
      newStreak = 1;
    }

    // Update emotion progress
    const updatedEmotionProgress = [...progress.emotionProgress];
    
    targetEmotions.forEach(emotionId => {
      const existingIndex = updatedEmotionProgress.findIndex(ep => ep.emotionId === emotionId);
      
      if (existingIndex >= 0) {
        const existing = updatedEmotionProgress[existingIndex];
        const newSessionsCompleted = existing.sessionsCompleted + 1;
        const newTotalMinutes = existing.totalMinutes + duration;
        
        // Calculate improvement percentage based on sessions completed (max 100%)
        const improvementPercentage = Math.min(newSessionsCompleted * 12.5, 100);
        
        updatedEmotionProgress[existingIndex] = {
          ...existing,
          sessionsCompleted: newSessionsCompleted,
          totalMinutes: newTotalMinutes,
          improvementPercentage,
          lastWorkedOn: today,
        };
      } else {
        updatedEmotionProgress.push({
          emotionId,
          sessionsCompleted: 1,
          totalMinutes: duration,
          improvementPercentage: 12.5,
          lastWorkedOn: today,
        });
      }
    });

    const newProgress: UserProgress = {
      totalSessions: progress.totalSessions + 1,
      totalMinutes: progress.totalMinutes + duration,
      streak: newStreak,
      lastSessionDate: today,
      completedSessions: [...progress.completedSessions, sessionId],
      emotionProgress: updatedEmotionProgress,
    };

    await saveProgress(newProgress);
  }, [progress, saveProgress]);

  const resetProgress = useCallback(async () => {
    await saveProgress(defaultProgress);
  }, [saveProgress]);

  const getEmotionProgress = useCallback((emotionId: string): EmotionProgress | null => {
    return progress.emotionProgress.find(ep => ep.emotionId === emotionId) || null;
  }, [progress.emotionProgress]);

  return useMemo(() => {
    const progressState = {
      progress,
      hasCompletedOnboarding,
      hasSeenWelcome,
      isLoading,
      completeOnboarding,
      completeWelcome,
      addSession,
      resetProgress,
      getEmotionProgress,
    };
    
    console.log("[PROGRESS] Current state:", {
      hasSeenWelcome,
      hasCompletedOnboarding,
      isLoading,
      totalSessions: progress.totalSessions
    });
    
    return progressState;
  }, [progress, hasCompletedOnboarding, hasSeenWelcome, isLoading, completeOnboarding, completeWelcome, addSession, resetProgress, getEmotionProgress]);
});