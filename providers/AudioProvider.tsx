import { useState, useEffect, useCallback, useMemo } from "react";
import { Audio } from "expo-av";
import { Platform } from "react-native";
import * as Haptics from "expo-haptics";
import createContextHook from "@nkzw/create-context-hook";

interface AudioContextType {
  playSound: (url: string) => Promise<void>;
  stopSound: () => void;
  isPlaying: boolean;
  setVolume: (volume: number) => Promise<void>;
  startVibroacoustics: (frequency: number) => void;
  stopVibroacoustics: () => void;
  isVibroacousticsActive: boolean;
  vibroacousticIntensity: number;
  setVibroacousticIntensity: (intensity: number) => void;
}

export const [AudioProvider, useAudio] = createContextHook<AudioContextType>(() => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [vibroacousticTimer, setVibroacousticTimer] = useState<NodeJS.Timeout | null>(null);
  const [isVibroacousticsActive, setIsVibroacousticsActive] = useState(false);
  const [vibroacousticIntensity, setVibroacousticIntensityState] = useState(0.7);

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
      if (vibroacousticTimer) {
        clearInterval(vibroacousticTimer);
      }
    };
  }, [sound, vibroacousticTimer]);

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
      
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: url },
        { shouldPlay: true, isLooping: true }
      );

      setSound(newSound);
      setIsPlaying(true);

      // Set up playback status update
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          setIsPlaying(status.isPlaying);
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
        setSound(null);
        setIsPlaying(false);
      } catch (error) {
        console.log("Error stopping sound (handled):", error);
        // Still clean up state even if stop fails
        setSound(null);
        setIsPlaying(false);
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

  const startVibroacoustics = useCallback((frequency: number) => {
    if (Platform.OS === 'web') {
      console.log(`Vibroacoustics started at ${frequency}Hz (web simulation)`);
      setIsVibroacousticsActive(true);
      return;
    }

    // Stop any existing vibroacoustic pattern
    if (vibroacousticTimer) {
      clearInterval(vibroacousticTimer);
    }

    setIsVibroacousticsActive(true);
    console.log(`Starting vibroacoustics at ${frequency}Hz with intensity ${vibroacousticIntensity}`);

    // Calculate vibration pattern based on frequency
    // Lower frequencies = longer, deeper vibrations
    // Higher frequencies = shorter, lighter vibrations
    const baseInterval = Math.max(50, Math.min(500, 1000 / frequency));

    const vibroacousticPattern = () => {
      if (!isVibroacousticsActive) return;
      
      // Vary haptic intensity based on frequency and user setting
      const hapticStyle = frequency < 40 
        ? Haptics.ImpactFeedbackStyle.Heavy
        : frequency < 80 
        ? Haptics.ImpactFeedbackStyle.Medium 
        : Haptics.ImpactFeedbackStyle.Light;

      Haptics.impactAsync(hapticStyle).catch(() => {});
    };

    // Start the vibroacoustic pattern
    vibroacousticPattern();
    const timer = setInterval(vibroacousticPattern, baseInterval);
    setVibroacousticTimer(timer);
  }, [vibroacousticTimer, vibroacousticIntensity, isVibroacousticsActive]);

  const stopVibroacoustics = useCallback(() => {
    if (vibroacousticTimer) {
      clearInterval(vibroacousticTimer);
      setVibroacousticTimer(null);
    }
    setIsVibroacousticsActive(false);
    console.log('Vibroacoustics stopped');
  }, [vibroacousticTimer]);

  const setVibroacousticIntensity = useCallback((intensity: number) => {
    setVibroacousticIntensityState(Math.max(0, Math.min(1, intensity)));
    console.log(`Vibroacoustic intensity set to ${intensity}`);
  }, []);

  return useMemo(() => ({
    playSound,
    stopSound,
    isPlaying,
    setVolume,
    startVibroacoustics,
    stopVibroacoustics,
    isVibroacousticsActive,
    vibroacousticIntensity,
    setVibroacousticIntensity,
  }), [playSound, stopSound, isPlaying, setVolume, startVibroacoustics, stopVibroacoustics, isVibroacousticsActive, vibroacousticIntensity, setVibroacousticIntensity]);
});