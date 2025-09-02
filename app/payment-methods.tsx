import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Alert,
  Platform,
  TextInput,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  CreditCard,
  Plus,
  Trash2,
  Check,
  Star,
  Smartphone,
  Shield,
} from "lucide-react-native";
import { usePayment, PaymentMethod } from "@/providers/PaymentProvider";
import { useAuth } from "@/providers/AuthProvider";
import * as Haptics from "expo-haptics";

export default function PaymentMethodsScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const {
    paymentMethods,
    addPaymentMethod,
    removePaymentMethod,
    setDefaultPaymentMethod,
    isLoading,
  } = usePayment();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    type: 'card' as const,
    last4: '',
    brand: '',
    expiryMonth: '',
    expiryYear: '',
    isDefault: false,
  });

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  

  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      console.log("User not authenticated, redirecting to login");
      router.replace("/login");
    }
  }, [isAuthenticated, isLoading, router]);
  
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
  }, [fadeAnim, scaleAnim, slideAnim]);
  
  // Show loading screen while checking authentication
  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient colors={["#1a1a2e", "#16213e"]} style={styles.gradient}>
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  const handleAddPaymentMethod = async () => {
    if (!formData.last4 || !formData.brand || !formData.expiryMonth || !formData.expiryYear) {
      Alert.alert("Missing Information", "Please fill in all card details.");
      return;
    }

    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    setIsProcessing(true);

    try {
      const result = await addPaymentMethod({
        type: formData.type,
        last4: formData.last4,
        brand: formData.brand,
        expiryMonth: parseInt(formData.expiryMonth),
        expiryYear: parseInt(formData.expiryYear),
        isDefault: formData.isDefault,
      });

      if (result.success) {
        setShowAddForm(false);
        setFormData({
          type: 'card',
          last4: '',
          brand: '',
          expiryMonth: '',
          expiryYear: '',
          isDefault: false,
        });
        Alert.alert("Success", "Payment method added successfully!");
      } else {
        Alert.alert("Error", result.error || "Failed to add payment method.");
      }
    } catch {
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemovePaymentMethod = (methodId: string) => {
    Alert.alert(
      "Remove Payment Method",
      "Are you sure you want to remove this payment method?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            if (Platform.OS !== "web") {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }
            
            const result = await removePaymentMethod(methodId);
            if (result.success) {
              Alert.alert("Success", "Payment method removed successfully!");
            } else {
              Alert.alert("Error", result.error || "Failed to remove payment method.");
            }
          },
        },
      ]
    );
  };

  const handleSetDefault = async (methodId: string) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    const result = await setDefaultPaymentMethod(methodId);
    if (!result.success) {
      Alert.alert("Error", result.error || "Failed to set default payment method.");
    }
  };

  const getCardIcon = (brand: string) => {
    switch (brand.toLowerCase()) {
      case 'visa':
      case 'mastercard':
      case 'amex':
      case 'discover':
        return <CreditCard size={24} color="#4ade80" />;
      default:
        return <CreditCard size={24} color="#4ade80" />;
    }
  };

  const renderPaymentMethod = (method: PaymentMethod, index: number) => (
    <Animated.View
      key={method.id}
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
      <View style={[styles.paymentMethodCard, method.isDefault && styles.defaultCard]}>
        <LinearGradient
          colors={method.isDefault ? ["#667eea", "#764ba2"] : ["#2a2a3e", "#1f1f2e"]}
          style={styles.cardGradient}
        >
          <View style={styles.cardHeader}>
            <View style={styles.cardInfo}>
              {getCardIcon(method.brand || '')}
              <View style={styles.cardDetails}>
                <Text style={styles.cardBrand}>
                  {method.brand?.toUpperCase()} •••• {method.last4}
                </Text>
                <Text style={styles.cardExpiry}>
                  Expires {method.expiryMonth?.toString().padStart(2, '0')}/{method.expiryYear}
                </Text>
              </View>
            </View>
            
            <View style={styles.cardActions}>
              {method.isDefault ? (
                <View style={styles.defaultBadge}>
                  <Star size={16} color="#fbbf24" />
                  <Text style={styles.defaultText}>Default</Text>
                </View>
              ) : (
                <TouchableOpacity
                  onPress={() => handleSetDefault(method.id)}
                  style={styles.setDefaultButton}
                >
                  <Text style={styles.setDefaultText}>Set Default</Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity
                onPress={() => handleRemovePaymentMethod(method.id)}
                style={styles.removeButton}
              >
                <Trash2 size={20} color="#ef4444" />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </View>
    </Animated.View>
  );

  const renderAddForm = () => (
    <Animated.View
      style={[
        styles.addForm,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <LinearGradient colors={["#2a2a3e", "#1f1f2e"]} style={styles.formGradient}>
        <Text style={styles.formTitle}>Add Payment Method</Text>
        
        <View style={styles.formField}>
          <Text style={styles.fieldLabel}>Card Number (Last 4 digits)</Text>
          <TextInput
            style={styles.textInput}
            value={formData.last4}
            onChangeText={(text) => setFormData({ ...formData, last4: text })}
            placeholder="1234"
            placeholderTextColor="rgba(255,255,255,0.5)"
            maxLength={4}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.formField}>
          <Text style={styles.fieldLabel}>Card Brand</Text>
          <TextInput
            style={styles.textInput}
            value={formData.brand}
            onChangeText={(text) => setFormData({ ...formData, brand: text })}
            placeholder="Visa, Mastercard, etc."
            placeholderTextColor="rgba(255,255,255,0.5)"
          />
        </View>

        <View style={styles.formRow}>
          <View style={[styles.formField, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.fieldLabel}>Month</Text>
            <TextInput
              style={styles.textInput}
              value={formData.expiryMonth}
              onChangeText={(text) => setFormData({ ...formData, expiryMonth: text })}
              placeholder="12"
              placeholderTextColor="rgba(255,255,255,0.5)"
              maxLength={2}
              keyboardType="numeric"
            />
          </View>
          
          <View style={[styles.formField, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.fieldLabel}>Year</Text>
            <TextInput
              style={styles.textInput}
              value={formData.expiryYear}
              onChangeText={(text) => setFormData({ ...formData, expiryYear: text })}
              placeholder="2025"
              placeholderTextColor="rgba(255,255,255,0.5)"
              maxLength={4}
              keyboardType="numeric"
            />
          </View>
        </View>

        <TouchableOpacity
          onPress={() => setFormData({ ...formData, isDefault: !formData.isDefault })}
          style={styles.checkboxRow}
        >
          <View style={[styles.checkbox, formData.isDefault && styles.checkboxChecked]}>
            {formData.isDefault && <Check size={16} color="#fff" />}
          </View>
          <Text style={styles.checkboxLabel}>Set as default payment method</Text>
        </TouchableOpacity>

        <View style={styles.formActions}>
          <TouchableOpacity
            onPress={() => setShowAddForm(false)}
            style={styles.cancelButton}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={handleAddPaymentMethod}
            style={styles.addButton}
            disabled={isProcessing}
          >
            <LinearGradient colors={["#4ade80", "#22c55e"]} style={styles.addButtonGradient}>
              <Text style={styles.addButtonText}>
                {isProcessing ? "Adding..." : "Add Card"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#1a1a2e", "#16213e"]} style={styles.gradient}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => {
                if (router.canGoBack()) {
                  router.back();
                } else {
                  router.replace("/profile");
                }
              }}
              style={styles.backButton}
            >
              <ArrowLeft size={24} color="#ffffff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Payment Methods</Text>
            <TouchableOpacity
              onPress={() => setShowAddForm(!showAddForm)}
              style={styles.addHeaderButton}
            >
              <Plus size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>

          {/* Security Notice */}
          <Animated.View
            style={[
              styles.securityNotice,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <LinearGradient colors={["#10b981", "#059669"]} style={styles.securityGradient}>
              <Shield size={24} color="#fff" />
              <View style={styles.securityText}>
                <Text style={styles.securityTitle}>Secure & Encrypted</Text>
                <Text style={styles.securitySubtitle}>
                  Your payment information is protected with bank-level security
                </Text>
              </View>
            </LinearGradient>
          </Animated.View>

          {/* Add Form */}
          {showAddForm && renderAddForm()}

          {/* Payment Methods List */}
          <View style={styles.methodsList}>
            {paymentMethods.length > 0 ? (
              <>
                <Animated.Text
                  style={[
                    styles.sectionTitle,
                    {
                      opacity: fadeAnim,
                      transform: [{ translateY: slideAnim }],
                    },
                  ]}
                >
                  Your Payment Methods
                </Animated.Text>
                {paymentMethods.map((method, index) => renderPaymentMethod(method, index))}
              </>
            ) : (
              <Animated.View
                style={[
                  styles.emptyState,
                  {
                    opacity: fadeAnim,
                    transform: [{ scale: scaleAnim }],
                  },
                ]}
              >
                <CreditCard size={48} color="rgba(255,255,255,0.3)" />
                <Text style={styles.emptyTitle}>No Payment Methods</Text>
                <Text style={styles.emptySubtitle}>
                  Add a payment method to subscribe to premium features
                </Text>
                <TouchableOpacity
                  onPress={() => setShowAddForm(true)}
                  style={styles.emptyButton}
                >
                  <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.emptyButtonGradient}>
                    <Plus size={20} color="#fff" />
                    <Text style={styles.emptyButtonText}>Add Payment Method</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            )}
          </View>

          {/* Alternative Payment Methods */}
          <Animated.View
            style={[
              styles.alternativeSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={styles.sectionTitle}>Alternative Payment Options</Text>
            <View style={styles.alternativeOptions}>
              <TouchableOpacity style={styles.alternativeOption}>
                <Smartphone size={24} color="#4ade80" />
                <Text style={styles.alternativeText}>Apple Pay / Google Pay</Text>
                <Text style={styles.alternativeSubtext}>Quick & secure mobile payments</Text>
              </TouchableOpacity>
            </View>
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
  addHeaderButton: {
    padding: 8,
  },
  securityNotice: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    overflow: "hidden",
  },
  securityGradient: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  securityText: {
    flex: 1,
  },
  securityTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#ffffff",
    marginBottom: 4,
  },
  securitySubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
  },
  addForm: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    overflow: "hidden",
  },
  formGradient: {
    padding: 20,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: "bold" as const,
    color: "#ffffff",
    marginBottom: 20,
  },
  formField: {
    marginBottom: 16,
  },
  formRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    padding: 16,
    color: "#ffffff",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: "#4ade80",
    borderColor: "#4ade80",
  },
  checkboxLabel: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    flex: 1,
  },
  formActions: {
    flexDirection: "row",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "rgba(255,255,255,0.7)",
  },
  addButton: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
  },
  addButtonGradient: {
    padding: 16,
    alignItems: "center",
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#ffffff",
  },
  methodsList: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold" as const,
    color: "#ffffff",
    marginBottom: 16,
  },
  paymentMethodCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "transparent",
  },
  defaultCard: {
    borderColor: "#667eea",
  },
  cardGradient: {
    padding: 20,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  cardDetails: {
    flex: 1,
  },
  cardBrand: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#ffffff",
    marginBottom: 4,
  },
  cardExpiry: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
  },
  cardActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  defaultBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(251, 191, 36, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  defaultText: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: "#fbbf24",
  },
  setDefaultButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 8,
  },
  setDefaultText: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: "rgba(255,255,255,0.7)",
  },
  removeButton: {
    padding: 8,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold" as const,
    color: "#ffffff",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.6)",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 24,
  },
  emptyButton: {
    borderRadius: 12,
    overflow: "hidden",
  },
  emptyButtonGradient: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  emptyButtonText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#ffffff",
  },
  alternativeSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  alternativeOptions: {
    gap: 12,
  },
  alternativeOption: {
    backgroundColor: "rgba(255,255,255,0.05)",
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    gap: 8,
  },
  alternativeText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#ffffff",
  },
  alternativeSubtext: {
    fontSize: 14,
    color: "rgba(255,255,255,0.6)",
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    color: "#ffffff",
    fontWeight: "500" as const,
  },
});