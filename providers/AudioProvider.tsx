import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Audio } from "expo-av";
import { Platform } from "react-native";
import createContextHook from "@nkzw/create-context-hook";

interface AudioContextType {
  playSound: (url: string) => Promise<void>;
  stopSound: () => Promise<void>;
  isPlaying: boolean;
  setVolume: (volume: number) => Promise<void>;
  isLoading: boolean;
}

export const [AudioProvider, useAudio] = createContextHook<AudioContextType>(() => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const currentOperationRef = useRef<Promise<any> | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

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
    // Cancel any ongoing operations
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    // Wait for any current operation to complete
    if (currentOperationRef.current) {
      try {
        await currentOperationRef.current;
      } catch {
        // Ignore errors from cancelled operations
      }
    }

    const stopOperation = async () => {
      try {
        setIsLoading(true);
        
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
        setIsLoading(false);
      }
    };

    currentOperationRef.current = stopOperation();
    return currentOperationRef.current;
  }, [sound]);

  const playSound = useCallback(async (url: string) => {
    // Cancel any ongoing operations
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Create new abort controller for this operation
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    const playOperation = async () => {
      try {
        setIsLoading(true);
        
        // Stop current sound if playing
        await stopSound();
        
        // Check if operation was cancelled
        if (signal.aborted) {
          throw new Error('Operation cancelled');
        }

        console.log("Loading sound from:", url);
        
        // Add timeout for loading with abort signal
        const loadPromise = Audio.Sound.createAsync(
          { uri: url },
          { shouldPlay: false, isLooping: true }
        );
        
        const timeoutPromise = new Promise((_, reject) => {
          const timeout = setTimeout(() => {
            if (!signal.aborted) {
              reject(new Error('Audio loading timeout'));
            }
          }, 15000); // Increased timeout to 15 seconds
          
          signal.addEventListener('abort', () => {
            clearTimeout(timeout);
            reject(new Error('Operation cancelled'));
          });
        });
        
        const { sound: newSound } = await Promise.race([loadPromise, timeoutPromise]) as { sound: Audio.Sound };
        
        // Check if operation was cancelled after loading
        if (signal.aborted) {
          await newSound.unloadAsync();
          throw new Error('Operation cancelled');
        }
        
        console.log("Sound loaded successfully, starting playback...");
        
        // Set up playback status update before playing
        newSound.setOnPlaybackStatusUpdate((status) => {
          if (signal.aborted) return;
          
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
        
        // Check if operation was cancelled before playing
        if (signal.aborted) {
          await newSound.unloadAsync();
          throw new Error('Operation cancelled');
        }
        
        // Add a small delay before playing to ensure everything is ready
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Start playing
        await newSound.playAsync();
        
        if (!signal.aborted) {
          setIsPlaying(true);
          console.log("Playback started successfully");
        }
      } catch (error) {
        if (signal.aborted || (error instanceof Error && error.message === 'Operation cancelled')) {
          console.log('Audio operation was cancelled');
          return;
        }
        
        console.error("Error playing sound:", error);
        setIsPlaying(false);
        setSound(null);
        throw error;
      } finally {
        if (!signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    currentOperationRef.current = playOperation();
    return currentOperationRef.current;
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
    isLoading,
  }), [playSound, stopSound, isPlaying, setVolume, isLoading]);
});