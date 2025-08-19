import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { ArrowLeft, User, Calendar, Clock, Flame, TrendingUp } from "lucide-react-native";
import { useAuth } from "@/providers/AuthProvider";
import { useUserProgress } from "@/providers/UserProgressProvider";
import { emotionalStates } from "@/constants/sessions";

const { width } = Dimensions.get("window");



export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { progress } = useUserProgress();

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

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#1a1a2e", "#16213e"]} style={styles.gradient}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color="#ffffff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Profile</Text>
            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>

          {/* User Info */}
          <View style={styles.userSection}>
            <View style={styles.avatarContainer}>
              <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.avatar}>
                <User size={32} color="#ffffff" />
              </LinearGradient>
            </View>
            <Text style={styles.userName}>{user?.name || "User"}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
          </View>

          {/* Stats Overview */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Calendar size={24} color="#4facfe" />
              <Text style={styles.statNumber}>{progress.totalSessions}</Text>
              <Text style={styles.statLabel}>Sessions</Text>
            </View>
            <View style={styles.statCard}>
              <Clock size={24} color="#43e97b" />
              <Text style={styles.statNumber}>{formatDuration(progress.totalMinutes)}</Text>
              <Text style={styles.statLabel}>Total Time</Text>
            </View>
            <View style={styles.statCard}>
              <Flame size={24} color="#fa709a" />
              <Text style={styles.statNumber}>{progress.streak}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
          </View>

          {/* Emotion Progress */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <TrendingUp size={20} color="#ffffff" />
              <Text style={styles.sectionTitle}>Emotional Progress</Text>
            </View>
            
            {sortedEmotionProgress.length > 0 ? (
              <View style={styles.emotionGrid}>
                {sortedEmotionProgress.map((emotionProgress) => {
                  const gradient = getEmotionGradient(emotionProgress.emotionId);
                  return (
                    <View key={emotionProgress.emotionId} style={styles.emotionCard}>
                      <LinearGradient colors={gradient} style={styles.emotionCardGradient}>
                        <View style={styles.emotionCardContent}>
                          <Text style={styles.emotionName}>
                            {getEmotionLabel(emotionProgress.emotionId)}
                          </Text>
                          <View style={styles.progressContainer}>
                            <View style={styles.progressCircle}>
                              <Text style={styles.progressPercentage}>
                                {Math.round(emotionProgress.improvementPercentage)}%
                              </Text>
                            </View>
                          </View>
                          <View style={styles.emotionStats}>
                            <Text style={styles.emotionStatText}>
                              {emotionProgress.sessionsCompleted} sessions
                            </Text>
                            <Text style={styles.emotionStatText}>
                              {formatDuration(emotionProgress.totalMinutes)}
                            </Text>
                            <Text style={styles.emotionStatText}>
                              Last: {formatDate(emotionProgress.lastWorkedOn)}
                            </Text>
                          </View>
                        </View>
                      </LinearGradient>
                    </View>
                  );
                })}
              </View>
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>Start your first session to see progress</Text>
              </View>
            )}
          </View>

          {/* Recent Activity */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <View style={styles.activityCard}>
              <Text style={styles.activityText}>
                Last session: {formatDate(progress.lastSessionDate)}
              </Text>
              <Text style={styles.activityText}>
                Total sessions completed: {progress.totalSessions}
              </Text>
              <Text style={styles.activityText}>
                Emotions worked on: {progress.emotionProgress.length}
              </Text>
            </View>
          </View>
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
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.4)",
  },
  progressPercentage: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700" as const,
  },
  emotionStats: {
    alignItems: "center",
  },
  emotionStatText: {
    fontSize: 11,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
    marginBottom: 2,
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
});