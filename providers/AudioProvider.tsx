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

  const stopSound = useCallback(async () => {
    try {
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
          // Try to force unload even if status check fails
          try {
            await sound.unloadAsync();
          } catch (unloadError) {
            console.warn("Error force unloading sound:", unloadError);
          }
        }
      }
    } catch (error) {
      console.warn("Error in stopSound:", error);
    } finally {
      // Always reset state regardless of errors
      setSound(null);
      setIsPlaying(false);
    }
  }, [sound]);

  const playSound = useCallback(async (url: string) => {
    try {
      // Stop current sound if playing
      await stopSound();

      console.log("Loading sound from:", url);
      
      // Add timeout for loading
      const loadPromise = Audio.Sound.createAsync(
        { uri: url },
        { shouldPlay: false, isLooping: true }
      );
      
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Audio loading timeout')), 10000);
      });
      
      const { sound: newSound } = await Promise.race([loadPromise, timeoutPromise]) as { sound: Audio.Sound };
      
      console.log("Sound loaded successfully, starting playback...");
      
      // Set up playback status update before playing
      newSound.setOnPlaybackStatusUpdate((status) => {
        console.log("Playback status:", status);
        if (status.isLoaded) {
          setIsPlaying(status.isPlaying || false);
        } else {
          setIsPlaying(false);
          if ('error' in status && status.error) {
            console.error("Loading error:", status.error);
          }
        }
      });
      
      setSound(newSound);
      
      // Start playing
      await newSound.playAsync();
      setIsPlaying(true);
      
      console.log("Playback started successfully");
    } catch (error) {
      console.error("Error playing sound:", error);
      setIsPlaying(false);
      setSound(null);
      throw error; // Re-throw to let the caller handle it
    }
  }, [stopSound]);

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