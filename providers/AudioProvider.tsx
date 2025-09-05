import { useState, useEffect, useCallback, useMemo } from "react";
import { Audio } from "expo-av";
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
    // Configure audio mode
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      shouldDuckAndroid: true,
    });

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
      
      // Test URL accessibility first
      try {
        const response = await fetch(url, { method: 'HEAD' });
        if (!response.ok) {
          throw new Error(`URL not accessible: ${response.status} ${response.statusText}`);
        }
        console.log("URL fetch test passed");
      } catch (fetchError) {
        console.error("URL fetch test failed:", fetchError);
        throw new Error(`Cannot access audio URL: ${fetchError}`);
      }
      
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: url },
        { shouldPlay: true, isLooping: true }
      );

      console.log("Sound created successfully, setting up playback...");
      setSound(newSound);
      setIsPlaying(true);

      // Set up playback status update
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          console.log("Playback status:", {
            isPlaying: status.isPlaying,
            positionMillis: status.positionMillis,
            durationMillis: status.durationMillis
          });
          setIsPlaying(status.isPlaying);
        } else {
          console.log("Sound not loaded:", status);
        }
      });
    } catch (error) {
      console.error("Failed to play audio:", error);
      setIsPlaying(false);
      throw error; // Re-throw to let the UI handle the error
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