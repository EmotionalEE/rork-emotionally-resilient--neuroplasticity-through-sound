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
      console.log("🎵 AudioProvider: Starting playSound with URL:", url);
      
      // Stop current sound if playing
      if (sound) {
        try {
          console.log("🔄 AudioProvider: Stopping current sound...");
          const status = await sound.getStatusAsync();
          if (status.isLoaded) {
            await sound.stopAsync();
          }
          await sound.unloadAsync();
          console.log("✅ AudioProvider: Current sound stopped and unloaded");
        } catch (cleanupError) {
          console.log("⚠️ AudioProvider: Sound cleanup error (non-critical):", cleanupError);
        }
      }
      
      // Fallback URLs for better reliability
      const fallbackUrls = [
        url,
        // Reliable audio sources
        "https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav",
        "https://www2.cs.uic.edu/~i101/SoundFiles/CantinaBand60.wav",
        "https://www2.cs.uic.edu/~i101/SoundFiles/ImperialMarch60.wav",
      ];
      
      let newSound: Audio.Sound | null = null;
      let lastError: Error | null = null;
      
      // Try each URL until one works
      for (let i = 0; i < fallbackUrls.length; i++) {
        const tryUrl = fallbackUrls[i];
        try {
          console.log(`🔄 AudioProvider: Trying audio URL ${i + 1}/${fallbackUrls.length}:`, tryUrl.substring(0, 60) + "...");
          
          const result = await Audio.Sound.createAsync(
            { uri: tryUrl },
            {
              shouldPlay: false, // Don't auto-play until we confirm it loaded
              isLooping: true,
              volume: 0.8,
              // Add web-specific options
              ...(Platform.OS === 'web' && {
                progressUpdateIntervalMillis: 1000,
                positionMillis: 0
              })
            }
          );
          
          newSound = result.sound;
          console.log(`✅ AudioProvider: Successfully loaded audio from URL ${i + 1}:`, tryUrl.substring(0, 60) + "...");
          break;
        } catch (urlError) {
          console.log(`❌ AudioProvider: Failed to load from URL ${i + 1}:`, tryUrl.substring(0, 60) + "...", urlError);
          lastError = urlError as Error;
          continue;
        }
      }
      
      if (!newSound) {
        console.log("❌ AudioProvider: All audio URLs failed to load. Last error:", lastError);
        throw lastError || new Error("All audio URLs failed to load");
      }

      // Set the sound first
      setSound(newSound);
      console.log("✅ AudioProvider: Sound object set in state");
      
      // Set up playback status update before playing
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          const wasPlaying = status.isPlaying;
          setIsPlaying(wasPlaying);
          if (wasPlaying) {
            console.log("🎵 AudioProvider: Playback status - PLAYING");
          } else {
            console.log("⏸️ AudioProvider: Playback status - PAUSED/STOPPED");
          }
          
          if ('error' in status && status.error) {
            console.log("❌ AudioProvider: Playback status error:", status.error);
            setIsPlaying(false);
          }
        } else {
          console.log("⚠️ AudioProvider: Sound not loaded in status update");
          setIsPlaying(false);
          if ('error' in status && status.error) {
            console.log("❌ AudioProvider: Sound loading error:", status.error);
          }
        }
      });
      
      // Try to play the sound immediately
      try {
        console.log("🔄 AudioProvider: Attempting to start playback...");
        
        // Add a small delay to ensure the sound is fully loaded
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Check if the sound is still loaded before playing
        const status = await newSound.getStatusAsync();
        console.log("📊 AudioProvider: Sound status before play:", {
          isLoaded: status.isLoaded,
          uri: status.isLoaded ? (status as any).uri : 'N/A'
        });
        
        if (status.isLoaded) {
          await newSound.playAsync();
          setIsPlaying(true);
          console.log("✅ AudioProvider: Audio playback started successfully!");
        } else {
          console.log("❌ AudioProvider: Sound not loaded, cannot play");
          setIsPlaying(false);
        }
      } catch (playError) {
        console.log("❌ AudioProvider: Error starting playback:", playError);
        setIsPlaying(false);
        
        // For web, AbortError is common due to autoplay policies
        if (playError instanceof Error) {
          if (playError.name === 'AbortError' || playError.name === 'NotAllowedError') {
            console.log("🚫 AudioProvider: Playback was blocked - this is normal on web due to autoplay policies");
            console.log("👆 AudioProvider: User needs to interact with the page first before audio can play");
            console.log("🔄 AudioProvider: The audio is loaded and ready, just click play again to start");
          } else {
            console.log("❌ AudioProvider: Playback error:", playError.name, playError.message);
          }
        }
      }

    } catch (error) {
      console.log("❌ AudioProvider: Error in playSound function:", error);
      setIsPlaying(false);
      
      // Provide more specific error information but don't crash
      if (error instanceof Error) {
        if (error.message.includes('NotSupportedError') || error.name === 'NotSupportedError') {
          console.log("🚫 AudioProvider: Audio format not supported on this platform. This may be due to:");
          console.log("   - Unsupported audio format (try MP3, WAV, or OGG)");
          console.log("   - CORS restrictions on the audio URL");
          console.log("   - Network connectivity issues");
        } else if (error.message.includes('NetworkError') || error.name === 'NetworkError') {
          console.log("🌐 AudioProvider: Network error loading audio - check internet connection and URL accessibility");
        } else if (error.message.includes('AbortError') || error.name === 'AbortError') {
          console.log("🚫 AudioProvider: Audio loading was aborted - this may be due to user interaction requirements");
          console.log("👆 AudioProvider: On web browsers, user must interact with the page before audio can play");
        } else {
          console.log("❌ AudioProvider: Audio error:", error.name, error.message);
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