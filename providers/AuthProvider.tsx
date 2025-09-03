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

  const loadUser = useCallback(async () => {
    try {
      console.log("Loading user from AsyncStorage...");
      const stored = await AsyncStorage.getItem(AUTH_KEY);
      console.log("Raw stored data:", stored);
      if (stored) {
        const userData = JSON.parse(stored);
        console.log("User loaded from storage:", userData);
        setUser(userData);
      } else {
        console.log("No user found in storage");
      }
    } catch (error) {
      console.error("Error loading user:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    console.log("AuthProvider initializing...");
    loadUser();
  }, [loadUser]);

  const saveUser = useCallback(async (userData: User) => {
    try {
      console.log("Saving user to AsyncStorage:", userData);
      const serializedData = JSON.stringify(userData);
      await AsyncStorage.setItem(AUTH_KEY, serializedData);
      
      // Verify the save worked
      const verification = await AsyncStorage.getItem(AUTH_KEY);
      console.log("Verification after save:", verification);
      
      setUser(userData);
      console.log("User saved successfully and state updated");
    } catch (error) {
      console.error("Error saving user:", error);
      throw error;
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
      setIsLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const users = await getMockUsers();
      const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (!foundUser) {
        return { success: false, error: "User not found" };
      }
      
      // In a real app, you'd verify the password hash
      // For demo purposes, we'll accept any password
      
      await saveUser(foundUser);
      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
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
      await AsyncStorage.removeItem(AUTH_KEY);
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  }, []);

  return useMemo(() => ({
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  }), [user, isLoading, login, register, logout]);
});