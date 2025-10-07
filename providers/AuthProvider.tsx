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
const GUEST_KEY = "guest_user";

// Mock user database - in a real app, this would be handled by your backend
const MOCK_USERS_KEY = "mock_users";

export const [AuthProvider, useAuth] = createContextHook<AuthContextType>(() => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const saveUser = useCallback(async (userData: User) => {
    try {
      console.log("Saving user to AsyncStorage:", userData);
      await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(userData));
      setUser(userData);
      console.log("User saved successfully and state updated");
    } catch (error) {
      console.error("Error saving user:", error);
    }
  }, []);

  const ensureGuestUser = useCallback(async () => {
    try {
      console.log("No auth user found. Ensuring guest profile exists...");
      const existingGuest = await AsyncStorage.getItem(GUEST_KEY);
      if (existingGuest) {
        const guestData: User = JSON.parse(existingGuest);
        await saveUser(guestData);
        return;
      }
      const guest: User = {
        id: `guest-${Date.now()}`,
        email: "guest@local",
        name: "Guest",
        createdAt: new Date().toISOString(),
      };
      await AsyncStorage.setItem(GUEST_KEY, JSON.stringify(guest));
      await saveUser(guest);
    } catch (e) {
      console.error("Failed to ensure guest user:", e);
    }
  }, [saveUser]);

  const loadUser = useCallback(async () => {
    try {
      console.log("Loading user from AsyncStorage...");
      const stored = await AsyncStorage.getItem(AUTH_KEY);
      if (stored) {
        const userData: User = JSON.parse(stored);
        console.log("User loaded from storage:", userData);
        setUser(userData);
      } else {
        console.log("No user found in storage");
        await ensureGuestUser();
      }
    } catch (error) {
      console.error("Error loading user:", error);
    } finally {
      setIsLoading(false);
    }
  }, [ensureGuestUser]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

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
      await new Promise(resolve => setTimeout(resolve, 500));
      const users = await getMockUsers();
      const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!foundUser) {
        return { success: false, error: "User not found" };
      }
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
      await new Promise(resolve => setTimeout(resolve, 500));
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
      await saveUser(newUser);
      await AsyncStorage.setItem(GUEST_KEY, JSON.stringify(newUser));
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
      const guest = await AsyncStorage.getItem(GUEST_KEY);
      if (guest) {
        const guestData: User = JSON.parse(guest);
        await saveUser(guestData);
      } else {
        await ensureGuestUser();
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  }, [ensureGuestUser, saveUser]);

  return useMemo(() => ({
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  }), [user, isLoading, login, register, logout]);
});