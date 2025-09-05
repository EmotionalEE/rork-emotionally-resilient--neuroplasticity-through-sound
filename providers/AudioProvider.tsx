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
      
      // Create sound with better error handling
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: url },
        { 
          shouldPlay: true, 
          isLooping: true,
          // Add web-specific options
          ...(Platform.OS === 'web' && {
            progressUpdateIntervalMillis: 1000,
            positionMillis: 0
          })
        }
      );

      setSound(newSound);
      setIsPlaying(true);

      // Set up playback status update
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          setIsPlaying(status.isPlaying);
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
        if (error.message.includes('NotSupportedError')) {
          console.error("Audio format not supported on this platform");
        } else if (error.message.includes('NetworkError')) {
          console.error("Network error loading audio");
        }
      }
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