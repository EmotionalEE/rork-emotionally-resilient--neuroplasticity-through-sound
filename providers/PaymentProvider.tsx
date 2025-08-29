import { useState, useEffect, useCallback, useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import createContextHook from "@nkzw/create-context-hook";
import { useAuth } from "./AuthProvider";

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'monthly' | 'yearly';
  features: string[];
  popular?: boolean;
  discount?: number;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'apple_pay' | 'google_pay';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
}

export interface Subscription {
  id: string;
  planId: string;
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  trialEnd?: string;
}

interface PaymentContextType {
  subscription: Subscription | null;
  paymentMethods: PaymentMethod[];
  availablePlans: SubscriptionPlan[];
  isLoading: boolean;
  isPremium: boolean;
  hasActiveSubscription: boolean;
  trialDaysLeft: number;
  subscribe: (planId: string, paymentMethodId?: string) => Promise<{ success: boolean; error?: string }>;
  cancelSubscription: () => Promise<{ success: boolean; error?: string }>;
  addPaymentMethod: (method: Omit<PaymentMethod, 'id'>) => Promise<{ success: boolean; error?: string }>;
  removePaymentMethod: (methodId: string) => Promise<{ success: boolean; error?: string }>;
  setDefaultPaymentMethod: (methodId: string) => Promise<{ success: boolean; error?: string }>;
  startFreeTrial: () => Promise<{ success: boolean; error?: string }>;
  restorePurchases: () => Promise<{ success: boolean; error?: string }>;
}

const SUBSCRIPTION_KEY = "user_subscription";
const PAYMENT_METHODS_KEY = "payment_methods";

const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: "basic_monthly",
    name: "Basic Monthly",
    price: 9.99,
    currency: "USD",
    interval: "monthly",
    features: [
      "Access to all meditation sessions",
      "Basic progress tracking",
      "Standard audio quality",
      "Email support"
    ]
  },
  {
    id: "premium_monthly",
    name: "Premium Monthly",
    price: 19.99,
    currency: "USD",
    interval: "monthly",
    popular: true,
    features: [
      "Everything in Basic",
      "Advanced sacred geometry visualizations",
      "High-quality binaural beats",
      "Personalized session recommendations",
      "Offline downloads",
      "Priority support",
      "Advanced progress analytics"
    ]
  },
  {
    id: "premium_yearly",
    name: "Premium Yearly",
    price: 199.99,
    currency: "USD",
    interval: "yearly",
    discount: 17,
    features: [
      "Everything in Premium Monthly",
      "2 months free (17% savings)",
      "Exclusive yearly content",
      "1-on-1 guidance sessions",
      "Early access to new features"
    ]
  }
];

export const [PaymentProvider, usePayment] = createContextHook<PaymentContextType>(() => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  


  const loadSubscription = useCallback(async () => {
    if (!user) return;
    
    try {
      const stored = await AsyncStorage.getItem(`${SUBSCRIPTION_KEY}_${user.id}`);
      if (stored) {
        const subData = JSON.parse(stored);
        setSubscription(subData);
      }
    } catch (error) {
      console.error("Error loading subscription:", error);
    }
  }, [user]);

  const loadPaymentMethods = useCallback(async () => {
    if (!user) return;
    
    try {
      const stored = await AsyncStorage.getItem(`${PAYMENT_METHODS_KEY}_${user.id}`);
      if (stored) {
        const methods = JSON.parse(stored);
        setPaymentMethods(methods);
      }
    } catch (error) {
      console.error("Error loading payment methods:", error);
    }
  }, [user]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([loadSubscription(), loadPaymentMethods()]);
      setIsLoading(false);
    };
    
    loadData();
  }, [loadSubscription, loadPaymentMethods]);

  const saveSubscription = useCallback(async (subData: Subscription | null) => {
    if (!user) return;
    
    try {
      if (subData) {
        await AsyncStorage.setItem(`${SUBSCRIPTION_KEY}_${user.id}`, JSON.stringify(subData));
      } else {
        await AsyncStorage.removeItem(`${SUBSCRIPTION_KEY}_${user.id}`);
      }
      setSubscription(subData);
    } catch (error) {
      console.error("Error saving subscription:", error);
    }
  }, [user]);

  const savePaymentMethods = useCallback(async (methods: PaymentMethod[]) => {
    if (!user) return;
    
    try {
      await AsyncStorage.setItem(`${PAYMENT_METHODS_KEY}_${user.id}`, JSON.stringify(methods));
      setPaymentMethods(methods);
    } catch (error) {
      console.error("Error saving payment methods:", error);
    }
  }, [user]);

  const subscribe = useCallback(async (planId: string, paymentMethodId?: string) => {
    if (!user) return { success: false, error: "User not authenticated" };
    
    try {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId);
      if (!plan) {
        return { success: false, error: "Plan not found" };
      }
      
      // Check if payment method is required and exists
      if (paymentMethodId && !paymentMethods.find(m => m.id === paymentMethodId)) {
        return { success: false, error: "Payment method not found" };
      }
      
      const now = new Date();
      const periodEnd = new Date(now);
      
      if (plan.interval === 'monthly') {
        periodEnd.setMonth(periodEnd.getMonth() + 1);
      } else {
        periodEnd.setFullYear(periodEnd.getFullYear() + 1);
      }
      
      const newSubscription: Subscription = {
        id: `sub_${Date.now()}`,
        planId,
        status: 'active',
        currentPeriodStart: now.toISOString(),
        currentPeriodEnd: periodEnd.toISOString(),
        cancelAtPeriodEnd: false
      };
      
      await saveSubscription(newSubscription);
      return { success: true };
    } catch (error) {
      console.error("Subscribe error:", error);
      return { success: false, error: "Subscription failed" };
    } finally {
      setIsLoading(false);
    }
  }, [user, paymentMethods, saveSubscription]);

  const cancelSubscription = useCallback(async () => {
    if (!subscription) return { success: false, error: "No active subscription" };
    
    try {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const updatedSubscription: Subscription = {
        ...subscription,
        cancelAtPeriodEnd: true
      };
      
      await saveSubscription(updatedSubscription);
      return { success: true };
    } catch (error) {
      console.error("Cancel subscription error:", error);
      return { success: false, error: "Cancellation failed" };
    } finally {
      setIsLoading(false);
    }
  }, [subscription, saveSubscription]);

  const addPaymentMethod = useCallback(async (method: Omit<PaymentMethod, 'id'>) => {
    try {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newMethod: PaymentMethod = {
        ...method,
        id: `pm_${Date.now()}`
      };
      
      // If this is the first payment method, make it default
      if (paymentMethods.length === 0) {
        newMethod.isDefault = true;
      }
      
      // If setting as default, update other methods
      const updatedMethods = newMethod.isDefault 
        ? paymentMethods.map(m => ({ ...m, isDefault: false }))
        : paymentMethods;
      
      const allMethods = [...updatedMethods, newMethod];
      await savePaymentMethods(allMethods);
      
      return { success: true };
    } catch (error) {
      console.error("Add payment method error:", error);
      return { success: false, error: "Failed to add payment method" };
    } finally {
      setIsLoading(false);
    }
  }, [paymentMethods, savePaymentMethods]);

  const removePaymentMethod = useCallback(async (methodId: string) => {
    try {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedMethods = paymentMethods.filter(m => m.id !== methodId);
      
      // If we removed the default method, make the first remaining method default
      if (updatedMethods.length > 0 && !updatedMethods.some(m => m.isDefault)) {
        updatedMethods[0].isDefault = true;
      }
      
      await savePaymentMethods(updatedMethods);
      return { success: true };
    } catch (error) {
      console.error("Remove payment method error:", error);
      return { success: false, error: "Failed to remove payment method" };
    } finally {
      setIsLoading(false);
    }
  }, [paymentMethods, savePaymentMethods]);

  const setDefaultPaymentMethod = useCallback(async (methodId: string) => {
    try {
      const updatedMethods = paymentMethods.map(m => ({
        ...m,
        isDefault: m.id === methodId
      }));
      
      await savePaymentMethods(updatedMethods);
      return { success: true };
    } catch (error) {
      console.error("Set default payment method error:", error);
      return { success: false, error: "Failed to set default payment method" };
    }
  }, [paymentMethods, savePaymentMethods]);

  const startFreeTrial = useCallback(async () => {
    if (!user) return { success: false, error: "User not authenticated" };
    
    try {
      setIsLoading(true);
      
      // Check if user already had a trial
      const trialKey = `trial_used_${user.id}`;
      const trialUsed = await AsyncStorage.getItem(trialKey);
      
      if (trialUsed) {
        return { success: false, error: "Free trial already used" };
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const now = new Date();
      const trialEnd = new Date(now);
      trialEnd.setDate(trialEnd.getDate() + 7); // 7-day trial
      
      const trialSubscription: Subscription = {
        id: `trial_${Date.now()}`,
        planId: 'premium_monthly',
        status: 'trialing',
        currentPeriodStart: now.toISOString(),
        currentPeriodEnd: trialEnd.toISOString(),
        cancelAtPeriodEnd: false,
        trialEnd: trialEnd.toISOString()
      };
      
      await AsyncStorage.setItem(trialKey, 'true');
      await saveSubscription(trialSubscription);
      
      return { success: true };
    } catch (error) {
      console.error("Start free trial error:", error);
      return { success: false, error: "Failed to start free trial" };
    } finally {
      setIsLoading(false);
    }
  }, [user, saveSubscription]);

  const restorePurchases = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Simulate API call to restore purchases
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, this would check with the app store/play store
      // For demo, we'll just reload existing data
      await loadSubscription();
      
      return { success: true };
    } catch (error) {
      console.error("Restore purchases error:", error);
      return { success: false, error: "Failed to restore purchases" };
    } finally {
      setIsLoading(false);
    }
  }, [loadSubscription]);

  const isPremium = useMemo(() => {
    if (!subscription) return false;
    
    const now = new Date();
    const periodEnd = new Date(subscription.currentPeriodEnd);
    
    return (
      (subscription.status === 'active' || subscription.status === 'trialing') &&
      periodEnd > now &&
      !subscription.cancelAtPeriodEnd
    );
  }, [subscription]);

  const hasActiveSubscription = useMemo(() => {
    if (!subscription) return false;
    
    const now = new Date();
    const periodEnd = new Date(subscription.currentPeriodEnd);
    
    return (
      (subscription.status === 'active' || subscription.status === 'trialing') &&
      periodEnd > now
    );
  }, [subscription]);

  const trialDaysLeft = useMemo(() => {
    if (!subscription || subscription.status !== 'trialing' || !subscription.trialEnd) {
      return 0;
    }
    
    const now = new Date();
    const trialEnd = new Date(subscription.trialEnd);
    const diffTime = trialEnd.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(0, diffDays);
  }, [subscription]);

  return useMemo(() => ({
    subscription,
    paymentMethods,
    availablePlans: SUBSCRIPTION_PLANS,
    isLoading,
    isPremium,
    hasActiveSubscription,
    trialDaysLeft,
    subscribe,
    cancelSubscription,
    addPaymentMethod,
    removePaymentMethod,
    setDefaultPaymentMethod,
    startFreeTrial,
    restorePurchases
  }), [
    subscription,
    paymentMethods,
    isLoading,
    isPremium,
    hasActiveSubscription,
    trialDaysLeft,
    subscribe,
    cancelSubscription,
    addPaymentMethod,
    removePaymentMethod,
    setDefaultPaymentMethod,
    startFreeTrial,
    restorePurchases
  ]);
});