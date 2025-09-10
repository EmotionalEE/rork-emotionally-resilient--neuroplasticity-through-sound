import { useState, useEffect, useCallback, useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import createContextHook from "@nkzw/create-context-hook";

interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AUTH_KEY = "auth_user";

// Mock user database - in a real app, this would be handled by your backend
const MOCK_USERS_KEY = "mock_users";

export const [AuthProvider, useAuth] = createContextHook<AuthContextType>(() => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  const loadUser = useCallback(async () => {
    try {
      console.log("[AUTH] Loading user from AsyncStorage...");
      const stored = await AsyncStorage.getItem(AUTH_KEY);
      if (stored) {
        const userData = JSON.parse(stored);
        console.log("[AUTH] User loaded from storage:", userData.email);
        setUser(userData);
      } else {
        console.log("[AUTH] No user found in storage");
        setUser(null);
      }
    } catch (error) {
      console.error("[AUTH] Error loading user:", error);
      setUser(null);
    } finally {
      console.log("[AUTH] Loading complete, setting initialized to true");
      setIsLoading(false);
      setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    console.log("[AUTH] AuthProvider mounted, loading user...");
    loadUser();
  }, [loadUser]);

  const saveUser = useCallback(async (userData: User) => {
    try {
      console.log("[AUTH] Saving user to AsyncStorage:", userData.email);
      await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(userData));
      setUser(userData);
      console.log("[AUTH] User saved successfully and state updated");
      
      // Verify the save worked
      const verification = await AsyncStorage.getItem(AUTH_KEY);
      console.log("[AUTH] Verification - user persisted:", verification ? 'YES' : 'NO');
    } catch (error) {
      console.error("[AUTH] Error saving user:", error);
    }
  }, []);

  const getMockUsers = useCallback(async (): Promise<User[]> => {
    try {
      const stored = await AsyncStorage.getItem(MOCK_USERS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error getting mock users:", error);
      return [];
    }
  }, []);

  const saveMockUsers = useCallback(async (users: User[]) => {
    try {
      await AsyncStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
    } catch (error) {
      console.error("Error saving mock users:", error);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      console.log("[AUTH] Starting login for:", email);
      setIsLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const users = await getMockUsers();
      const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (!foundUser) {
        console.log("[AUTH] User not found:", email);
        return { success: false, error: "User not found" };
      }
      
      // In a real app, you'd verify the password hash
      // For demo purposes, we'll accept any password
      
      console.log("[AUTH] Login successful, saving user:", foundUser.email);
      await saveUser(foundUser);
      return { success: true };
    } catch (error) {
      console.error("[AUTH] Login error:", error);
      return { success: false, error: "Login failed" };
    } finally {
      setIsLoading(false);
    }
  }, [getMockUsers, saveUser]);

  const register = useCallback(async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      console.log("Starting registration for:", { name, email });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const users = await getMockUsers();
      console.log("Existing users:", users.length);
      const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (existingUser) {
        console.log("User already exists:", existingUser.email);
        return { success: false, error: "Email already exists" };
      }
      
      const newUser: User = {
        id: Date.now().toString(),
        email: email.toLowerCase(),
        name,
        createdAt: new Date().toISOString(),
      };
      
      console.log("Creating new user:", newUser);
      const updatedUsers = [...users, newUser];
      await saveMockUsers(updatedUsers);
      
      // Save user and verify it was saved
      await saveUser(newUser);
      
      // Verify the user was actually saved
      const savedUser = await AsyncStorage.getItem(AUTH_KEY);
      console.log("Verification - User saved to storage:", savedUser ? JSON.parse(savedUser) : 'null');
      
      console.log("Registration successful, user saved:", newUser);
      return { success: true };
    } catch (error) {
      console.error("Registration error:", error);
      return { success: false, error: "Registration failed" };
    } finally {
      setIsLoading(false);
    }
  }, [getMockUsers, saveMockUsers, saveUser]);

  const logout = useCallback(async () => {
    try {
      console.log("[AUTH] Logging out user");
      await AsyncStorage.removeItem(AUTH_KEY);
      setUser(null);
      console.log("[AUTH] User logged out successfully");
    } catch (error) {
      console.error("[AUTH] Logout error:", error);
    }
  }, []);

  return useMemo(() => {
    const authState = {
      user,
      isAuthenticated: !!user && isInitialized,
      isLoading: isLoading || !isInitialized,
      login,
      register,
      logout,
    };
    
    console.log("[AUTH] Current state:", {
      hasUser: !!user,
      isAuthenticated: authState.isAuthenticated,
      isLoading: authState.isLoading,
      isInitialized
    });
    
    return authState;
  }, [user, isLoading, isInitialized, login, register, logout]);
});