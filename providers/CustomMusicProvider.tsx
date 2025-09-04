import { useState, useCallback, useEffect, useMemo } from "react";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import createContextHook from "@nkzw/create-context-hook";

export interface CustomMusic {
  id: string;
  name: string;
  url: string;
  sessionId?: string;
  isCustom: boolean;
  createdAt: number;
}

interface CustomMusicContextType {
  customMusic: CustomMusic[];
  addCustomMusic: (music: Omit<CustomMusic, 'id' | 'createdAt'>) => Promise<void>;
  removeCustomMusic: (id: string) => Promise<void>;
  assignMusicToSession: (musicId: string, sessionId: string) => Promise<void>;
  getSessionMusic: (sessionId: string) => CustomMusic | undefined;
  uploadMusic: (file: File) => Promise<string>;
  isLoading: boolean;
}

const STORAGE_KEY = 'custom_music_library';

export const [CustomMusicProvider, useCustomMusic] = createContextHook<CustomMusicContextType>(() => {
  const [customMusic, setCustomMusic] = useState<CustomMusic[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved music from storage
  useEffect(() => {
    const loadMusic = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setCustomMusic(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Error loading custom music:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadMusic();
  }, []);

  // Save music to storage
  const saveMusic = useCallback(async (music: CustomMusic[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(music));
    } catch (error) {
      console.error('Error saving custom music:', error);
    }
  }, []);

  // Add custom music
  const addCustomMusic = useCallback(async (music: Omit<CustomMusic, 'id' | 'createdAt'>) => {
    const newMusic: CustomMusic = {
      ...music,
      id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: Date.now(),
    };
    
    const updated = [...customMusic, newMusic];
    setCustomMusic(updated);
    await saveMusic(updated);
  }, [customMusic, saveMusic]);

  // Remove custom music
  const removeCustomMusic = useCallback(async (id: string) => {
    const updated = customMusic.filter(m => m.id !== id);
    setCustomMusic(updated);
    await saveMusic(updated);
  }, [customMusic, saveMusic]);

  // Assign music to a session
  const assignMusicToSession = useCallback(async (musicId: string, sessionId: string) => {
    const updated = customMusic.map(m => {
      if (m.id === musicId) {
        return { ...m, sessionId };
      }
      // Remove assignment from other music for this session
      if (m.sessionId === sessionId) {
        return { ...m, sessionId: undefined };
      }
      return m;
    });
    
    setCustomMusic(updated);
    await saveMusic(updated);
  }, [customMusic, saveMusic]);

  // Get music for a specific session
  const getSessionMusic = useCallback((sessionId: string) => {
    return customMusic.find(m => m.sessionId === sessionId);
  }, [customMusic]);

  // Upload music file (for web platform)
  const uploadMusic = useCallback(async (file: File): Promise<string> => {
    if (Platform.OS === 'web') {
      // For web, create a blob URL
      return URL.createObjectURL(file);
    } else {
      // For mobile, you would need to handle file differently
      // This is a placeholder - in production you'd upload to a server
      throw new Error('File upload not supported on mobile yet');
    }
  }, []);

  return useMemo(() => ({
    customMusic,
    addCustomMusic,
    removeCustomMusic,
    assignMusicToSession,
    getSessionMusic,
    uploadMusic,
    isLoading,
  }), [customMusic, addCustomMusic, removeCustomMusic, assignMusicToSession, getSessionMusic, uploadMusic, isLoading]);
});