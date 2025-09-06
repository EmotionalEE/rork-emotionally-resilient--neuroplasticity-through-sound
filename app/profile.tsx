import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { ArrowLeft, User, Calendar, Clock, Flame, TrendingUp, Award, Target, Crown, CreditCard, Settings, Share } from "lucide-react-native";
import { useAuth } from "@/providers/AuthProvider";
import { useUserProgress } from "@/providers/UserProgressProvider";
import { usePayment } from "@/providers/PaymentProvider";
import { emotionalStates } from "@/constants/sessions";
import SocialShare from "@/components/SocialShare";

const { width } = Dimensions.get("window");



export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { progress } = useUserProgress();
  const { isPremium, subscription, trialDaysLeft } = usePayment();
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const [progressAnimations, setProgressAnimations] = useState<{[key: string]: Animated.Value}>({});
  const [shareModalVisible, setShareModalVisible] = useState<boolean>(false);
  const [shareData, setShareData] = useState<{
    type: 'progress' | 'achievement' | 'streak' | 'session';
    title: string;
    description: string;
    stats?: {
      sessions?: number;
      streak?: number;
      minutes?: number;
      improvement?: number;
    };
  } | null>(null);
  
  // Initialize progress animations
  useEffect(() => {
    const animations: {[key: string]: Animated.Value} = {};
    progress.emotionProgress.forEach((emotion) => {
      animations[emotion.emotionId] = new Animated.Value(0);
    });
    setProgressAnimations(animations);
  }, [progress.emotionProgress]);
  
  // Start entrance animations
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
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Animate progress circles
    Object.entries(progressAnimations).forEach(([emotionId, animation], index) => {
      const emotionProgress = progress.emotionProgress.find(e => e.emotionId === emotionId);
      if (emotionProgress) {
        Animated.timing(animation, {
          toValue: emotionProgress.improvementPercentage / 100,
          duration: 1000 + (index * 200),
          delay: 400 + (index * 100),
          useNativeDriver: false,
        }).start();
      }
    });
    
    // Continuous rotation for avatar
    const rotateAnimation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
      })
    );
    rotateAnimation.start();
    
    return () => rotateAnimation.stop();
  }, [fadeAnim, slideAnim, scaleAnim, rotateAnim, progressAnimations, progress.emotionProgress]);

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  const getEmotionLabel = (emotionId: string) => {
    return emotionalStates.find(state => state.id === emotionId)?.label || emotionId;
  };

  const getEmotionGradient = (emotionId: string): [string, string] => {
    const gradient = emotionalStates.find(state => state.id === emotionId)?.gradient;
    return gradient ? [gradient[0], gradient[1]] : ["#667eea", "#764ba2"];
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const sortedEmotionProgress = progress.emotionProgress
    .sort((a, b) => b.improvementPercentage - a.improvementPercentage)
    .slice(0, 6); // Show top 6 emotions
    
  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  
  const handleStatPress = (statType: string) => {
    const pulseAnim = new Animated.Value(1);
    Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 1.1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleShare = (type: 'progress' | 'achievement' | 'streak' | 'session', customData?: any) => {
    let title = '';
    let description = '';
    let stats = {};

    switch (type) {
      case 'progress':
        title = 'My Emotional Training Journey';
        description = 'Tracking my mindfulness progress and celebrating every step forward!';
        stats = {
          sessions: progress.totalSessions,
          minutes: progress.totalMinutes,
          improvement: Math.round(progress.emotionProgress.reduce((acc, curr) => acc + curr.improvementPercentage, 0) / progress.emotionProgress.length) || 0,
        };
        break;
      case 'achievement':
        title = customData?.title || 'New Milestone Reached!';
        description = customData?.description || 'Just hit a new personal record in my emotional training practice!';
        stats = customData?.stats || {};
        break;
      case 'streak':
        title = `${progress.streak} Day Emotional Training Streak!`;
        description = 'Consistency is the key to inner peace. Every day counts!';
        stats = {
          streak: progress.streak,
          sessions: progress.totalSessions,
        };
        break;
      case 'session':
        title = 'Mindful Moment Complete';
        description = 'Just finished another peaceful emotional training session. Feeling centered and grateful!';
        break;
    }

    setShareData({ type, title, description, stats });
    setShareModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#1a1a2e", "#16213e"]} style={styles.gradient}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => {
              router.replace("/home");
            }} style={styles.backButton}>
              <ArrowLeft size={24} color="#ffffff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Profile</Text>
            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>

          {/* User Info */}
          <Animated.View 
            style={[
              styles.userSection,
              {
                opacity: fadeAnim,
                transform: [
                  { translateY: slideAnim },
                  { scale: scaleAnim }
                ]
              }
            ]}
          >
            <View style={styles.avatarContainer}>
              <Animated.View style={{ transform: [{ rotate: spin }] }}>
                <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.avatar}>
                  <User size={32} color="#ffffff" />
                </LinearGradient>
              </Animated.View>
              <View style={styles.statusIndicator}>
                <Animated.View 
                  style={[
                    styles.statusDot,
                    {
                      transform: [{
                        scale: fadeAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, 1],
                        })
                      }]
                    }
                  ]}
                />
              </View>
            </View>
            <Animated.Text 
              style={[
                styles.userName,
                {
                  opacity: fadeAnim,
                  transform: [{
                    translateY: slideAnim.interpolate({
                      inputRange: [0, 50],
                      outputRange: [0, 20],
                    })
                  }]
                }
              ]}
            >
              {user?.name || "User"}
            </Animated.Text>
            <Animated.Text 
              style={[
                styles.userEmail,
                {
                  opacity: fadeAnim,
                  transform: [{
                    translateY: slideAnim.interpolate({
                      inputRange: [0, 50],
                      outputRange: [0, 30],
                    })
                  }]
                }
              ]}
            >
              {user?.email}
            </Animated.Text>
          </Animated.View>

          {/* Stats Overview */}
          <Animated.View 
            style={[
              styles.statsContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <TouchableOpacity 
              style={styles.statCard} 
              onPress={() => handleStatPress('sessions')}
              onLongPress={() => handleShare('progress')}
              activeOpacity={0.8}
            >
              <Animated.View
                style={{
                  transform: [{
                    scale: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.5, 1],
                    })
                  }]
                }}
              >
                <Calendar size={24} color="#4facfe" />
              </Animated.View>
              <Animated.Text 
                style={[
                  styles.statNumber,
                  {
                    transform: [{
                      scale: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.8, 1],
                      })
                    }]
                  }
                ]}
              >
                {progress.totalSessions}
              </Animated.Text>
              <Text style={styles.statLabel}>Sessions</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.statCard} 
              onPress={() => handleStatPress('time')}
              activeOpacity={0.8}
            >
              <Animated.View
                style={{
                  transform: [{
                    scale: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.5, 1],
                    })
                  }]
                }}
              >
                <Clock size={24} color="#43e97b" />
              </Animated.View>
              <Animated.Text 
                style={[
                  styles.statNumber,
                  {
                    transform: [{
                      scale: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.8, 1],
                      })
                    }]
                  }
                ]}
              >
                {formatDuration(progress.totalMinutes)}
              </Animated.Text>
              <Text style={styles.statLabel}>Total Time</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.statCard} 
              onPress={() => handleStatPress('streak')}
              onLongPress={() => handleShare('streak')}
              activeOpacity={0.8}
            >
              <Animated.View
                style={{
                  transform: [{
                    scale: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.5, 1],
                    }),
                    rotate: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '360deg'],
                    })
                  }]
                }}
              >
                <Flame size={24} color="#fa709a" />
              </Animated.View>
              <Animated.Text 
                style={[
                  styles.statNumber,
                  {
                    transform: [{
                      scale: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.8, 1],
                      })
                    }]
                  }
                ]}
              >
                {progress.streak}
              </Animated.Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Emotion Progress */}
          <Animated.View 
            style={[
              styles.section,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <View style={styles.sectionHeader}>
              <Animated.View
                style={{
                  transform: [{
                    rotate: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '360deg'],
                    })
                  }]
                }}
              >
                <TrendingUp size={20} color="#ffffff" />
              </Animated.View>
              <Text style={styles.sectionTitle}>Emotional Progress</Text>
            </View>
            
            {sortedEmotionProgress.length > 0 ? (
              <View style={styles.emotionGrid}>
                {sortedEmotionProgress.map((emotionProgress, index) => {
                  const gradient = getEmotionGradient(emotionProgress.emotionId);
                  const progressAnim = progressAnimations[emotionProgress.emotionId] || new Animated.Value(0);
                  
                  return (
                    <Animated.View 
                      key={emotionProgress.emotionId} 
                      style={[
                        styles.emotionCard,
                        {
                          opacity: fadeAnim,
                          transform: [{
                            translateY: slideAnim.interpolate({
                              inputRange: [0, 50],
                              outputRange: [0, 20 + (index * 10)],
                            }),
                            scale: scaleAnim.interpolate({
                              inputRange: [0.8, 1],
                              outputRange: [0.9, 1],
                            })
                          }]
                        }
                      ]}
                    >
                      <LinearGradient colors={gradient} style={styles.emotionCardGradient}>
                        <View style={styles.emotionCardContent}>
                          <Text style={styles.emotionName}>
                            {getEmotionLabel(emotionProgress.emotionId)}
                          </Text>
                          <View style={styles.progressContainer}>
                            <View style={styles.progressCircle}>
                              <Animated.View
                                style={[
                                  styles.progressRing,
                                  {
                                    transform: [{
                                      rotate: progressAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: ['0deg', '360deg'],
                                      })
                                    }]
                                  }
                                ]}
                              />
                              <View style={styles.progressInner}>
                                <Text style={styles.progressPercentage}>
                                  {Math.round(emotionProgress.improvementPercentage)}%
                                </Text>
                              </View>
                            </View>
                          </View>
                          <View style={styles.emotionStats}>
                            <View style={styles.statRow}>
                              <Award size={12} color="rgba(255,255,255,0.8)" />
                              <Text style={styles.emotionStatText}>
                                {emotionProgress.sessionsCompleted} sessions
                              </Text>
                            </View>
                            <View style={styles.statRow}>
                              <Clock size={12} color="rgba(255,255,255,0.8)" />
                              <Text style={styles.emotionStatText}>
                                {formatDuration(emotionProgress.totalMinutes)}
                              </Text>
                            </View>
                            <View style={styles.statRow}>
                              <Target size={12} color="rgba(255,255,255,0.8)" />
                              <Text style={styles.emotionStatText}>
                                {formatDate(emotionProgress.lastWorkedOn)}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </LinearGradient>
                    </Animated.View>
                  );
                })}
              </View>
            ) : (
              <Animated.View 
                style={[
                  styles.emptyState,
                  {
                    opacity: fadeAnim,
                    transform: [{ scale: scaleAnim }]
                  }
                ]}
              >
                <Text style={styles.emptyStateText}>Start your first session to see progress</Text>
              </Animated.View>
            )}
          </Animated.View>

          {/* Subscription Status */}
          <Animated.View 
            style={[
              styles.section,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <View style={styles.sectionHeader}>
              <Crown size={20} color={isPremium ? "#fbbf24" : "#ffffff"} />
              <Text style={styles.sectionTitle}>Subscription</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.subscriptionCard}
              onPress={() => router.push('/subscription')}
              activeOpacity={0.8}
            >
              <LinearGradient 
                colors={isPremium ? ["#fbbf24", "#f59e0b"] : ["#667eea", "#764ba2"]} 
                style={styles.subscriptionGradient}
              >
                <View style={styles.subscriptionContent}>
                  <View style={styles.subscriptionInfo}>
                    <Text style={styles.subscriptionStatus}>
                      {isPremium ? "Premium Active" : "Free Plan"}
                    </Text>
                    <Text style={styles.subscriptionDetails}>
                      {isPremium 
                        ? subscription?.status === 'trialing' 
                          ? `${trialDaysLeft} days left in trial`
                          : "All premium features unlocked"
                        : "Upgrade to unlock all features"
                      }
                    </Text>
                  </View>
                  <Crown size={24} color="#fff" />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          {/* Payment Methods */}
          <Animated.View 
            style={[
              styles.section,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <View style={styles.sectionHeader}>
              <CreditCard size={20} color="#ffffff" />
              <Text style={styles.sectionTitle}>Payment & Billing</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.settingCard}
              onPress={() => {
                console.log('Payment methods button pressed');
                router.push('/payment-methods');
              }}
              activeOpacity={0.8}
            >
              <View style={styles.settingContent}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Payment Methods</Text>
                  <Text style={styles.settingSubtitle}>Manage your cards and billing</Text>
                </View>
                <Settings size={20} color="rgba(255,255,255,0.6)" />
              </View>
            </TouchableOpacity>
          </Animated.View>

          {/* Social Sharing */}
          <Animated.View 
            style={[
              styles.section,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <View style={styles.sectionHeader}>
              <Share size={20} color="#ffffff" />
              <Text style={styles.sectionTitle}>Share Your Journey</Text>
            </View>
            
            <View style={styles.shareButtonsContainer}>
              <TouchableOpacity 
                style={styles.shareButton}
                onPress={() => handleShare('progress')}
                activeOpacity={0.8}
              >
                <LinearGradient colors={['#667eea', '#764ba2']} style={styles.shareButtonGradient}>
                  <Target size={20} color="#ffffff" />
                  <Text style={styles.shareButtonText}>Share Progress</Text>
                </LinearGradient>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.shareButton}
                onPress={() => handleShare('streak')}
                activeOpacity={0.8}
              >
                <LinearGradient colors={['#fa709a', '#fee140']} style={styles.shareButtonGradient}>
                  <Flame size={20} color="#ffffff" />
                  <Text style={styles.shareButtonText}>Share Streak</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Recent Activity */}
          <Animated.View 
            style={[
              styles.section,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <Animated.View 
              style={[
                styles.activityCard,
                {
                  transform: [{ scale: scaleAnim }]
                }
              ]}
            >
              <Animated.Text 
                style={[
                  styles.activityText,
                  {
                    opacity: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 1],
                    })
                  }
                ]}
              >
                <Text>Last session: </Text>{formatDate(progress.lastSessionDate)}
              </Animated.Text>
              <Animated.Text 
                style={[
                  styles.activityText,
                  {
                    opacity: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 1],
                    })
                  }
                ]}
              >
                <Text>Total sessions completed: </Text>{progress.totalSessions}
              </Animated.Text>
              <Animated.Text 
                style={[
                  styles.activityText,
                  {
                    opacity: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 1],
                    })
                  }
                ]}
              >
                <Text>Emotions worked on: </Text>{progress.emotionProgress.length}
              </Animated.Text>
            </Animated.View>
          </Animated.View>
        </ScrollView>
        
        {/* Social Share Modal */}
        {shareData && (
          <SocialShare
            visible={shareModalVisible}
            onClose={() => {
              setShareModalVisible(false);
              setShareData(null);
            }}
            shareType={shareData.type}
            data={shareData}
          />
        )}
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
  logoutButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 20,
  },
  logoutText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "500" as const,
  },
  userSection: {
    alignItems: "center",
    paddingVertical: 30,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#667eea",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  statusIndicator: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#1a1a2e",
    borderRadius: 12,
    padding: 2,
  },
  statusDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#43e97b",
  },
  userName: {
    fontSize: 24,
    fontWeight: "600" as const,
    color: "#ffffff",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: "#a0a0a0",
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 30,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: "#ffffff",
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#a0a0a0",
    textAlign: "center",
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: "#ffffff",
  },
  emotionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  emotionCard: {
    width: (width - 52) / 2,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  emotionCardGradient: {
    padding: 16,
    minHeight: 160,
  },
  emotionCardContent: {
    flex: 1,
    alignItems: "center",
  },
  emotionName: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 12,
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  progressRing: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.6)",
    borderTopColor: "transparent",
  },
  progressInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  progressPercentage: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700" as const,
  },
  emotionStats: {
    alignItems: "center",
    gap: 4,
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  emotionStatText: {
    fontSize: 11,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
  },
  emptyState: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 16,
    padding: 40,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  emptyStateText: {
    color: "#a0a0a0",
    fontSize: 16,
    textAlign: "center",
  },
  activityCard: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  activityText: {
    color: "#ffffff",
    fontSize: 14,
    marginBottom: 8,
  },
  subscriptionCard: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 8,
  },
  subscriptionGradient: {
    padding: 20,
  },
  subscriptionContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  subscriptionInfo: {
    flex: 1,
  },
  subscriptionStatus: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: "#ffffff",
    marginBottom: 4,
  },
  subscriptionDetails: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
  },
  settingCard: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  settingContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#ffffff",
    marginBottom: 4,
  },
  settingSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.6)",
  },
  shareButtonsContainer: {
    flexDirection: "row",
    gap: 12,
  },
  shareButton: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
  },
  shareButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 8,
  },
  shareButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600" as const,
  },
});