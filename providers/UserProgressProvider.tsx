import { useState, useEffect, useCallback, useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import createContextHook from "@nkzw/create-context-hook";

interface UserProgress {
  totalSessions: number;
  totalMinutes: number;
  streak: number;
  lastSessionDate: string | null;
  completedSessions: string[];
}

interface UserProgressContextType {
  progress: UserProgress;
  hasCompletedOnboarding: boolean;
  hasSeenWelcome: boolean;
  completeOnboarding: () => Promise<void>;
  completeWelcome: () => Promise<void>;
  addSession: (sessionId: string, duration: number) => Promise<void>;
  resetProgress: () => Promise<void>;
  resetWelcomeAndOnboarding: () => Promise<void>;
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
};

export const [UserProgressProvider, useUserProgress] = createContextHook<UserProgressContextType>(() => {
  const [progress, setProgress] = useState<UserProgress>(defaultProgress);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [hasSeenWelcome, setHasSeenWelcome] = useState(false);

  const loadProgress = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(PROGRESS_KEY);
      if (stored) {
        setProgress(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading progress:", error);
    }
  }, []);

  const checkOnboarding = useCallback(async () => {
    try {
      const completed = await AsyncStorage.getItem(ONBOARDING_KEY);
      setHasCompletedOnboarding(completed === "true");
    } catch (error) {
      console.error("Error checking onboarding:", error);
    }
  }, []);

  const checkWelcome = useCallback(async () => {
    try {
      const seen = await AsyncStorage.getItem(WELCOME_KEY);
      setHasSeenWelcome(seen === "true");
    } catch (error) {
      console.error("Error checking welcome:", error);
    }
  }, []);

  useEffect(() => {
    loadProgress();
    checkOnboarding();
    checkWelcome();
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

  const addSession = useCallback(async (sessionId: string, duration: number) => {
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

    const newProgress: UserProgress = {
      totalSessions: progress.totalSessions + 1,
      totalMinutes: progress.totalMinutes + duration,
      streak: newStreak,
      lastSessionDate: today,
      completedSessions: [...progress.completedSessions, sessionId],
    };

    await saveProgress(newProgress);
  }, [progress, saveProgress]);

  const resetProgress = useCallback(async () => {
    await saveProgress(defaultProgress);
  }, [saveProgress]);

  const resetWelcomeAndOnboarding = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(WELCOME_KEY);
      await AsyncStorage.removeItem(ONBOARDING_KEY);
      setHasSeenWelcome(false);
      setHasCompletedOnboarding(false);
      console.log('Reset welcome and onboarding states');
    } catch (error) {
      console.error('Error resetting welcome and onboarding:', error);
    }
  }, []);

  return useMemo(() => ({
    progress,
    hasCompletedOnboarding,
    hasSeenWelcome,
    completeOnboarding,
    completeWelcome,
    addSession,
    resetProgress,
    resetWelcomeAndOnboarding,
  }), [progress, hasCompletedOnboarding, hasSeenWelcome, completeOnboarding, completeWelcome, addSession, resetProgress, resetWelcomeAndOnboarding]);
});