import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Animated,
  Alert,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Check,
  Crown,
  Star,
  Sparkles,
  Shield,
  Zap,
  Heart,
  CreditCard,
  Smartphone,
} from "lucide-react-native";
import { usePayment, SubscriptionPlan } from "@/providers/PaymentProvider";
import * as Haptics from "expo-haptics";

const { width } = Dimensions.get("window");

export default function SubscriptionScreen() {
  const router = useRouter();
  const { availablePlans, subscribe, startFreeTrial, isPremium, trialDaysLeft, isLoading } = usePayment();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isSubscribing, setIsSubscribing] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePlanSelect = (planId: string) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelectedPlan(planId);
  };

  const handleSubscribe = async () => {
    if (!selectedPlan) {
      Alert.alert("Please select a plan", "Choose a subscription plan to continue.");
      return;
    }

    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    setIsSubscribing(true);
    
    try {
      const result = await subscribe(selectedPlan);
      
      if (result.success) {
        Alert.alert(
          "Subscription Successful!",
          "Welcome to Harmonia Premium! You now have access to all premium features.",
          [
            {
              text: "Continue",
              onPress: () => router.replace("/home"),
            },
          ]
        );
      } else {
        Alert.alert("Subscription Failed", result.error || "Please try again.");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setIsSubscribing(false);
    }
  };

  const handleStartTrial = async () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    setIsSubscribing(true);
    
    try {
      const result = await startFreeTrial();
      
      if (result.success) {
        Alert.alert(
          "Free Trial Started!",
          "Enjoy 7 days of Harmonia Premium for free! Your trial will automatically convert to a paid subscription unless you cancel.",
          [
            {
              text: "Start Exploring",
              onPress: () => router.replace("/home"),
            },
          ]
        );
      } else {
        Alert.alert("Trial Failed", result.error || "Please try again.");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setIsSubscribing(false);
    }
  };

  const renderPlanCard = (plan: SubscriptionPlan, index: number) => {
    const isSelected = selectedPlan === plan.id;
    const isPopular = plan.popular;
    
    return (
      <Animated.View
        key={plan.id}
        style={[
          {
            opacity: fadeAnim,
            transform: [
              {
                translateY: slideAnim.interpolate({
                  inputRange: [0, 50],
                  outputRange: [0, 20 + index * 10],
                }),
              },
              { scale: scaleAnim },
            ],
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => handlePlanSelect(plan.id)}
          activeOpacity={0.9}
          style={[
            styles.planCard,
            isSelected && styles.planCardSelected,
            isPopular && styles.planCardPopular,
          ]}
        >
          <LinearGradient
            colors={
              isSelected
                ? ["#667eea", "#764ba2"]
                : isPopular
                ? ["#f093fb", "#f5576c"]
                : ["#2a2a3e", "#1f1f2e"]
            }
            style={styles.planCardGradient}
          >
            {isPopular && (
              <View style={styles.popularBadge}>
                <Crown size={16} color="#fff" />
                <Text style={styles.popularText}>Most Popular</Text>
              </View>
            )}
            
            <View style={styles.planHeader}>
              <Text style={styles.planName}>{plan.name}</Text>
              <View style={styles.priceContainer}>
                <Text style={styles.currency}>$</Text>
                <Text style={styles.price}>{plan.price.toFixed(0)}</Text>
                <Text style={styles.period}>/{plan.interval}</Text>
              </View>
              {plan.discount && (
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>Save {plan.discount}%</Text>
                </View>
              )}
            </View>

            <View style={styles.featuresContainer}>
              {plan.features.map((feature, featureIndex) => (
                <View key={featureIndex} style={styles.featureRow}>
                  <Check size={16} color="#4ade80" />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>

            {isSelected && (
              <View style={styles.selectedIndicator}>
                <Animated.View
                  style={[
                    styles.selectedIcon,
                    {
                      transform: [
                        {
                          scale: scaleAnim.interpolate({
                            inputRange: [0.95, 1],
                            outputRange: [0, 1],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  <Check size={20} color="#fff" />
                </Animated.View>
              </View>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderPaymentMethods = () => (
    <Animated.View
      style={[
        styles.paymentSection,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <Text style={styles.sectionTitle}>Payment Methods</Text>
      <View style={styles.paymentMethods}>
        <View style={styles.paymentMethod}>
          <CreditCard size={24} color="#4ade80" />
          <Text style={styles.paymentMethodText}>Credit/Debit Card</Text>
        </View>
        <View style={styles.paymentMethod}>
          <Smartphone size={24} color="#4ade80" />
          <Text style={styles.paymentMethodText}>Apple Pay / Google Pay</Text>
        </View>
      </View>
    </Animated.View>
  );

  const renderTrialInfo = () => {
    if (isPremium) {
      return (
        <Animated.View
          style={[
            styles.trialInfo,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <LinearGradient colors={["#4ade80", "#22c55e"]} style={styles.trialInfoGradient}>
            <Crown size={24} color="#fff" />
            <Text style={styles.trialInfoText}>
              {trialDaysLeft > 0 
                ? `${trialDaysLeft} days left in your free trial`
                : "You have Harmonia Premium!"
              }
            </Text>
          </LinearGradient>
        </Animated.View>
      );
    }

    return (
      <Animated.View
        style={[
          styles.trialInfo,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.trialInfoGradient}>
          <Sparkles size={24} color="#fff" />
          <Text style={styles.trialInfoText}>Start your 7-day free trial</Text>
          <Text style={styles.trialInfoSubtext}>Cancel anytime, no commitment</Text>
        </LinearGradient>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#1a1a2e", "#16213e"]} style={styles.gradient}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.replace("/home")}
              style={styles.backButton}
            >
              <ArrowLeft size={24} color="#ffffff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Choose Your Plan</Text>
            <View style={styles.headerSpacer} />
          </View>

          {/* Hero Section */}
          <Animated.View
            style={[
              styles.heroSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={styles.heroIcon}>
              <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.heroIconGradient}>
                <Heart size={32} color="#fff" />
              </LinearGradient>
            </View>
            <Text style={styles.heroTitle}>Unlock Your Inner Peace</Text>
            <Text style={styles.heroSubtitle}>
              Access premium emotional training sessions, advanced visualizations, and personalized guidance
            </Text>
          </Animated.View>

          {/* Trial Info */}
          {renderTrialInfo()}

          {/* Plans */}
          <View style={styles.plansContainer}>
            {availablePlans.map((plan, index) => renderPlanCard(plan, index))}
          </View>

          {/* Payment Methods */}
          {renderPaymentMethods()}

          {/* Features Highlight */}
          <Animated.View
            style={[
              styles.featuresHighlight,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={styles.featuresTitle}>Premium Features</Text>
            <View style={styles.highlightGrid}>
              <View style={styles.highlightItem}>
                <Star size={24} color="#fbbf24" />
                <Text style={styles.highlightText}>Sacred Geometry</Text>
              </View>
              <View style={styles.highlightItem}>
                <Zap size={24} color="#8b5cf6" />
                <Text style={styles.highlightText}>Binaural Beats</Text>
              </View>
              <View style={styles.highlightItem}>
                <Shield size={24} color="#10b981" />
                <Text style={styles.highlightText}>Ad-Free Experience</Text>
              </View>
              <View style={styles.highlightItem}>
                <Heart size={24} color="#f43f5e" />
                <Text style={styles.highlightText}>Unlimited Sessions</Text>
              </View>
            </View>
          </Animated.View>

          {/* Action Buttons */}
          <Animated.View
            style={[
              styles.actionButtons,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            {!isPremium && (
              <TouchableOpacity
                onPress={handleStartTrial}
                style={styles.trialButton}
                disabled={isSubscribing || isLoading}
              >
                <LinearGradient colors={["#4ade80", "#22c55e"]} style={styles.buttonGradient}>
                  <Sparkles size={20} color="#fff" />
                  <Text style={styles.trialButtonText}>
                    {isSubscribing ? "Starting Trial..." : "Start Free Trial"}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={handleSubscribe}
              style={[styles.subscribeButton, !selectedPlan && styles.subscribeButtonDisabled]}
              disabled={!selectedPlan || isSubscribing || isLoading}
            >
              <LinearGradient
                colors={
                  selectedPlan
                    ? ["#667eea", "#764ba2"]
                    : ["#4a4a5a", "#3a3a4a"]
                }
                style={styles.buttonGradient}
              >
                <Crown size={20} color="#fff" />
                <Text style={styles.subscribeButtonText}>
                  {isSubscribing ? "Processing..." : "Subscribe Now"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          {/* Terms */}
          <Animated.View
            style={[
              styles.terms,
              {
                opacity: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.7],
                }),
              },
            ]}
          >
            <Text style={styles.termsText}>
              By subscribing, you agree to our Terms of Service and Privacy Policy.
              Subscriptions auto-renew unless canceled 24 hours before the end of the current period.
            </Text>
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600" as const,
    color: "#ffffff",
  },
  headerSpacer: {
    width: 40,
  },
  heroSection: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  heroIcon: {
    marginBottom: 20,
  },
  heroIconGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "bold" as const,
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 12,
  },
  heroSubtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.7)",
    textAlign: "center",
    lineHeight: 24,
  },
  trialInfo: {
    marginHorizontal: 20,
    marginBottom: 30,
    borderRadius: 16,
    overflow: "hidden",
  },
  trialInfoGradient: {
    padding: 20,
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
  },
  trialInfoText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#ffffff",
    flex: 1,
  },
  trialInfoSubtext: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginTop: 4,
  },
  plansContainer: {
    paddingHorizontal: 20,
    gap: 16,
    marginBottom: 30,
  },
  planCard: {
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "transparent",
  },
  planCardSelected: {
    borderColor: "#667eea",
  },
  planCardPopular: {
    borderColor: "#f5576c",
  },
  planCardGradient: {
    padding: 24,
    position: "relative",
  },
  popularBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#f5576c",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderBottomLeftRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  popularText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600" as const,
  },
  planHeader: {
    marginBottom: 20,
  },
  planName: {
    fontSize: 24,
    fontWeight: "bold" as const,
    color: "#ffffff",
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 8,
  },
  currency: {
    fontSize: 20,
    color: "#ffffff",
    fontWeight: "600" as const,
  },
  price: {
    fontSize: 36,
    fontWeight: "bold" as const,
    color: "#ffffff",
  },
  period: {
    fontSize: 16,
    color: "rgba(255,255,255,0.7)",
    marginLeft: 4,
  },
  discountBadge: {
    backgroundColor: "rgba(34, 197, 94, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  discountText: {
    color: "#22c55e",
    fontSize: 12,
    fontWeight: "600" as const,
  },
  featuresContainer: {
    gap: 12,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  featureText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    flex: 1,
  },
  selectedIndicator: {
    position: "absolute",
    top: 20,
    right: 20,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#4ade80",
    alignItems: "center",
    justifyContent: "center",
  },
  selectedIcon: {
    alignItems: "center",
    justifyContent: "center",
  },
  paymentSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold" as const,
    color: "#ffffff",
    marginBottom: 16,
  },
  paymentMethods: {
    gap: 12,
  },
  paymentMethod: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "rgba(255,255,255,0.05)",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  paymentMethodText: {
    fontSize: 16,
    color: "#ffffff",
    fontWeight: "500" as const,
  },
  featuresHighlight: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: "bold" as const,
    color: "#ffffff",
    marginBottom: 20,
    textAlign: "center",
  },
  highlightGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    justifyContent: "space-between",
  },
  highlightItem: {
    width: (width - 60) / 2,
    backgroundColor: "rgba(255,255,255,0.05)",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  highlightText: {
    fontSize: 14,
    color: "#ffffff",
    fontWeight: "500" as const,
    textAlign: "center",
  },
  actionButtons: {
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  trialButton: {
    borderRadius: 16,
    overflow: "hidden",
  },
  subscribeButton: {
    borderRadius: 16,
    overflow: "hidden",
  },
  subscribeButtonDisabled: {
    opacity: 0.5,
  },
  buttonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  trialButtonText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#ffffff",
  },
  subscribeButtonText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#ffffff",
  },
  terms: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  termsText: {
    fontSize: 12,
    color: "rgba(255,255,255,0.5)",
    textAlign: "center",
    lineHeight: 18,
  },
});