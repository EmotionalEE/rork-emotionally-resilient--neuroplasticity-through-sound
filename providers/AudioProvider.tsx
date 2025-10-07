import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Audio } from "expo-av";
import { Platform } from "react-native";
import createContextHook from "@nkzw/create-context-hook";

interface AudioContextType {
  playSound: (url: string) => Promise<void>;
  stopSound: () => void;
  isPlaying: boolean;
  setVolume: (volume: number) => Promise<void>;
}

export const [AudioProvider, useAudio] = createContextHook<AudioContextType>(() => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const objectUrlRef = useRef<string | null>(null);

  useEffect(() => {
    // Configure audio mode - only on native platforms
    if (Platform.OS !== 'web') {
      Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
      }).catch((error) => {
        console.log("Audio mode configuration error (non-critical):", error);
      });
    }

    return () => {
      if (sound) {
        sound.getStatusAsync().then((status) => {
          if (status.isLoaded) {
            sound.unloadAsync().catch(() => {});
          }
        }).catch(() => {});
      }
    };
  }, [sound]);

  const normalizeDropboxUrl = (input: string): string => {
    if (!input.includes("dropbox.com")) return input;
    try {
      const url = new URL(input);
      url.searchParams.set("dl", "1");
      return url.toString();
    } catch {
      return input;
    }
  };

  const resolvePlayableUrl = useCallback(async (rawUrl: string): Promise<string> => {
    const normalized = normalizeDropboxUrl(rawUrl);
    if (Platform.OS !== 'web') return normalized;

    try {
      const res = await fetch(normalized, { mode: 'cors' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      // store for cleanup
      if (objectUrlRef.current) {
        try { URL.revokeObjectURL(objectUrlRef.current); } catch {}
      }
      objectUrlRef.current = objectUrl;
      return objectUrl;
    } catch (e) {
      console.log('Falling back to direct URL due to blob fetch failure', e);
      return normalized;
    }
  }, []);

  const playSound = useCallback(async (url: string) => {
    try {
      if (sound) {
        try {
          const status = await sound.getStatusAsync();
          if (status.isLoaded) {
            await sound.stopAsync();
          }
          await sound.unloadAsync();
        } catch (cleanupError) {
          console.log("Sound cleanup error (non-critical):", cleanupError);
        }
      }

      const playableUrl = await resolvePlayableUrl(url);
      console.log("Loading sound from:", playableUrl);
      
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: playableUrl },
        {
          shouldPlay: true,
          isLooping: true,
          ...(Platform.OS === 'web' && {
            progressUpdateIntervalMillis: 1000,
            positionMillis: 0,
          })
        }
      );

      setSound(newSound);

      try {
        await newSound.playAsync();
        setIsPlaying(true);
      } catch (playError) {
        console.error("Error starting playback:", playError);
        setIsPlaying(false);
      }

      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          setIsPlaying(status.isPlaying);
        } else {
          setIsPlaying(false);
          if ('error' in status && status.error) {
            console.error("Sound loading error:", status.error);
          }
        }
      });
    } catch (error) {
      console.error("Error playing sound:", error);
      setIsPlaying(false);
      if (error instanceof Error) {
        if (error.message.includes('NotSupportedError')) {
          console.error("Audio format or CORS not supported in this environment");
        } else if (error.message.includes('NetworkError')) {
          console.error("Network error loading audio");
        }
      }
    }
  }, [sound, resolvePlayableUrl]);

  const stopSound = useCallback(async () => {
    if (sound) {
      try {
        const status = await sound.getStatusAsync();
        if (status.isLoaded) {
          if (status.isPlaying) {
            await sound.stopAsync();
          }
          await sound.unloadAsync();
        }
      } catch (error) {
        console.log("Error stopping sound (handled):", error);
      } finally {
        setSound(null);
        setIsPlaying(false);
        if (Platform.OS === 'web' && objectUrlRef.current) {
          try { URL.revokeObjectURL(objectUrlRef.current); } catch {}
          objectUrlRef.current = null;
        }
      }
    } else {
      setIsPlaying(false);
      if (Platform.OS === 'web' && objectUrlRef.current) {
        try { URL.revokeObjectURL(objectUrlRef.current); } catch {}
        objectUrlRef.current = null;
      }
    }
  }, [sound]);

  const setVolume = useCallback(async (volume: number) => {
    if (sound) {
      try {
        const status = await sound.getStatusAsync();
        if (status.isLoaded) {
          await sound.setVolumeAsync(volume);
        }
      } catch (error) {
        console.log("Error setting volume:", error);
      }
    }
  }, [sound]);

  return useMemo(() => ({
    playSound,
    stopSound,
    isPlaying,
    setVolume,
  }), [playSound, stopSound, isPlaying, setVolume]);
});