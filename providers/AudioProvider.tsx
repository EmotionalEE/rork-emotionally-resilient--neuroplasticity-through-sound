import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Audio } from "expo-av";
import { Platform } from "react-native";
import createContextHook from "@nkzw/create-context-hook";

interface AudioContextType {
  playSound: (url: string) => Promise<void>;
  stopSound: () => Promise<void>;
  isPlaying: boolean;
  setVolume: (volume: number) => Promise<void>;
}

export const [AudioProvider, useAudio] = createContextHook<AudioContextType>(() => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const objectUrlRef = useRef<string | null>(null);
  const autoResumeTriedRef = useRef<boolean>(false);

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
      // Force direct download host to avoid CORS and redirects
      if (url.hostname.endsWith("dropbox.com")) {
        url.hostname = "dl.dropboxusercontent.com";
      }
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
      console.log("[AudioProvider] Loading sound from:", playableUrl);
      
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: playableUrl },
        {
          shouldPlay: true,
          isLooping: true,
        },
        (status) => {
          try {
            if (!status.isLoaded) {
              setIsPlaying(false);
              if ('error' in status && status.error) {
                console.error('[AudioProvider] Sound loading error:', status.error);
              }
              return;
            }

            setIsPlaying(status.isPlaying ?? false);

            // Auto-resume once if playback is not running shortly after load
            if (!status.isPlaying && (status.positionMillis ?? 0) <= 50 && !autoResumeTriedRef.current) {
              autoResumeTriedRef.current = true;
              newSound.playAsync().catch(() => {});
            }

            if (status.didJustFinish) {
              newSound.setIsLoopingAsync(true).catch(() => {});
              newSound.playAsync().catch(() => {});
            }
          } catch (e) {
            console.log('[AudioProvider] status update safe log');
          }
        }
      );

      console.log('[AudioProvider] Sound object created');
      setSound(newSound);

      try {
        autoResumeTriedRef.current = false;
        await newSound.setProgressUpdateIntervalAsync(1000);
        await newSound.setIsLoopingAsync(true);
        await newSound.playAsync();
        console.log('[AudioProvider] playAsync called');
        setIsPlaying(true);
      } catch (playError) {
        console.error('[AudioProvider] Error starting playback:', playError);
        setIsPlaying(false);
        throw playError;
      }
    } catch (error) {
      console.error("[AudioProvider] Error playing sound:", error);
      setIsPlaying(false);
      if (error instanceof Error) {
        if (error.message.includes('NotSupportedError')) {
          console.error("[AudioProvider] Audio format or CORS not supported in this environment");
        } else if (error.message.includes('NetworkError')) {
          console.error("[AudioProvider] Network error loading audio");
        } else if (error.message.includes('-1100')) {
          console.error("[AudioProvider] File not found or inaccessible. Check URL:", url);
        }
      }
      throw error;
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