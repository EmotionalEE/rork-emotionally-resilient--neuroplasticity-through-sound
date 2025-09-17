import { useState, useEffect, useCallback, useMemo } from "react";
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
  const [isPlaying, setIsPlaying] = useState(false);

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

  const playSound = useCallback(async (url: string) => {
    try {
      // Stop current sound if playing
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

      console.log("Loading sound from:", url);
      
      // Fallback URLs for better reliability
      const fallbackUrls = [
        url,
        "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        "https://actions.google.com/sounds/v1/alarms/beep_short.ogg",
        "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT"
      ];
      
      let newSound: Audio.Sound | null = null;
      let lastError: Error | null = null;
      
      // Try each URL until one works
      for (const tryUrl of fallbackUrls) {
        try {
          console.log("Trying audio URL:", tryUrl.substring(0, 50) + "...");
          
          const result = await Audio.Sound.createAsync(
            { uri: tryUrl },
            {
              shouldPlay: false, // Don't auto-play until we confirm it loaded
              isLooping: true,
              volume: 0.7,
              // Add web-specific options
              ...(Platform.OS === 'web' && {
                progressUpdateIntervalMillis: 1000,
                positionMillis: 0
              })
            }
          );
          
          newSound = result.sound;
          console.log("Successfully loaded audio from:", tryUrl.substring(0, 50) + "...");
          break;
        } catch (urlError) {
          console.log("Failed to load from URL:", tryUrl.substring(0, 50) + "...", urlError);
          lastError = urlError as Error;
          continue;
        }
      }
      
      if (!newSound) {
        throw lastError || new Error("All audio URLs failed to load");
      }

      setSound(newSound);

      try {
        await newSound.playAsync();
        setIsPlaying(true);
        console.log("Audio playback started successfully");
      } catch (playError) {
        console.error("Error starting playback:", playError);
        setIsPlaying(false);
        throw playError;
      }

      // Set up playback status update
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          setIsPlaying(status.isPlaying);
          if ('error' in status && status.error) {
            console.error("Playback status error:", status.error);
            setIsPlaying(false);
          }
        } else {
          // Handle loading errors
          setIsPlaying(false);
          if ('error' in status && status.error) {
            console.error("Sound loading error:", status.error);
          }
        }
      });
    } catch (error) {
      console.error("Error playing sound:", error);
      setIsPlaying(false);
      
      // Provide more specific error information
      if (error instanceof Error) {
        if (error.message.includes('NotSupportedError') || error.name === 'NotSupportedError') {
          console.error("Audio format not supported on this platform. This may be due to:");
          console.error("- Unsupported audio format (try MP3, WAV, or OGG)");
          console.error("- CORS restrictions on the audio URL");
          console.error("- Network connectivity issues");
        } else if (error.message.includes('NetworkError') || error.name === 'NetworkError') {
          console.error("Network error loading audio - check internet connection and URL accessibility");
        } else if (error.message.includes('AbortError') || error.name === 'AbortError') {
          console.error("Audio loading was aborted - this may be due to user interaction requirements");
        } else {
          console.error("Unknown audio error:", error.name, error.message);
        }
      }
      
      // Don't throw the error, just log it and set playing to false
      // This prevents the app from crashing
    }
  }, [sound]);

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
        // Continue with cleanup even if stop/unload fails
      } finally {
        // Always clean up state
        setSound(null);
        setIsPlaying(false);
      }
    } else {
      // Ensure state is clean even if no sound object
      setIsPlaying(false);
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