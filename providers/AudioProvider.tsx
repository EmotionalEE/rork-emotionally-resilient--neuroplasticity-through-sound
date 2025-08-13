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
    // Configure audio mode only on native platforms
    if (Platform.OS !== 'web') {
      Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
      }).catch(error => {
        console.warn('Failed to set audio mode:', error);
      });
    }

    return () => {
      if (sound) {
        sound.unloadAsync().catch(error => {
          console.warn('Failed to unload sound:', error);
        });
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
            await sound.unloadAsync();
          }
        } catch (error) {
          console.warn("Error unloading previous sound:", error);
        }
      }

      console.log("Loading sound from:", url);
      
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: url },
        { shouldPlay: true, isLooping: true }
      );

      setSound(newSound);
      setIsPlaying(true);

      // Set up playback status update
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          setIsPlaying(status.isPlaying || false);
        }
      });
    } catch (error) {
      console.error("Error playing sound:", error);
      setIsPlaying(false);
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
        console.warn("Error stopping sound:", error);
        // Continue with cleanup even if there's an error
      } finally {
        // Always reset state
        setSound(null);
        setIsPlaying(false);
      }
    } else {
      // Reset state even if no sound object exists
      setIsPlaying(false);
    }
  }, [sound]);

  const setVolume = useCallback(async (volume: number) => {
    if (sound) {
      try {
        await sound.setVolumeAsync(volume);
      } catch (error) {
        console.error("Error setting volume:", error);
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