import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
  ActivityIndicator,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Music, Upload, X, Play, Pause, Trash2, Link, Check } from "lucide-react-native";
import { useCustomMusic } from "@/providers/CustomMusicProvider";
import { useAudio } from "@/providers/AudioProvider";
import { sessions } from "@/constants/sessions";
import { Stack } from "expo-router";

export default function MusicLibrary() {
  const { customMusic, addCustomMusic, removeCustomMusic, assignMusicToSession, getSessionMusic } = useCustomMusic();
  const { playSound, stopSound, isPlaying } = useAudio();
  const [showAddModal, setShowAddModal] = useState(false);
  const [musicName, setMusicName] = useState("");
  const [musicUrl, setMusicUrl] = useState("");
  const [selectedSessionId, setSelectedSessionId] = useState<string>("");
  const [playingMusicId, setPlayingMusicId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleAddMusic = async () => {
    if (!musicName.trim() || !musicUrl.trim()) {
      Alert.alert("Error", "Please provide both name and URL");
      return;
    }

    await addCustomMusic({
      name: musicName,
      url: musicUrl,
      sessionId: selectedSessionId || undefined,
      isCustom: true,
    });

    setMusicName("");
    setMusicUrl("");
    setSelectedSessionId("");
    setShowAddModal(false);
  };

  const handleFileUpload = async () => {
    if (Platform.OS === 'web') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'audio/*';
      input.onchange = async (e: any) => {
        const file = e.target.files[0];
        if (file) {
          setIsUploading(true);
          try {
            const url = URL.createObjectURL(file);
            setMusicUrl(url);
            setMusicName(file.name.replace(/\.[^/.]+$/, "")); // Remove extension
            Alert.alert("Success", "File uploaded successfully. Now add it to your library.");
          } catch (error) {
            Alert.alert("Error", "Failed to upload file");
          } finally {
            setIsUploading(false);
          }
        }
      };
      input.click();
    } else {
      Alert.alert("Info", "File upload is currently only supported on web");
    }
  };

  const handlePlayMusic = async (music: { id: string; url: string }) => {
    if (playingMusicId === music.id) {
      await stopSound();
      setPlayingMusicId(null);
    } else {
      await stopSound();
      await playSound(music.url);
      setPlayingMusicId(music.id);
    }
  };

  const handleDeleteMusic = (id: string) => {
    Alert.alert(
      "Delete Music",
      "Are you sure you want to delete this music?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: async () => {
            if (playingMusicId === id) {
              await stopSound();
              setPlayingMusicId(null);
            }
            await removeCustomMusic(id);
          }
        }
      ]
    );
  };

  const handleAssignToSession = async (musicId: string, sessionId: string) => {
    await assignMusicToSession(musicId, sessionId);
    Alert.alert("Success", "Music assigned to session");
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <LinearGradient
        colors={["#1a1a2e", "#16213e", "#0f3460"]}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={styles.header}>
        <Music size={28} color="#fff" />
        <Text style={styles.title}>Music Library</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Upload size={24} color="#fff" />
          <Text style={styles.addButtonText}>Add Music</Text>
        </TouchableOpacity>

        {customMusic.length === 0 ? (
          <View style={styles.emptyState}>
            <Music size={48} color="#666" />
            <Text style={styles.emptyText}>No custom music yet</Text>
            <Text style={styles.emptySubtext}>Add your own music to personalize sessions</Text>
          </View>
        ) : (
          <View style={styles.musicList}>
            {customMusic.map((music) => {
              const assignedSession = sessions.find(s => s.id === music.sessionId);
              const isCurrentlyPlaying = playingMusicId === music.id && isPlaying;
              
              return (
                <View key={music.id} style={styles.musicItem}>
                  <View style={styles.musicInfo}>
                    <Text style={styles.musicName}>{music.name}</Text>
                    {assignedSession && (
                      <Text style={styles.sessionLabel}>
                        Assigned to: {assignedSession.title}
                      </Text>
                    )}
                  </View>

                  <View style={styles.musicActions}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handlePlayMusic(music)}
                    >
                      {isCurrentlyPlaying ? (
                        <Pause size={20} color="#4facfe" />
                      ) : (
                        <Play size={20} color="#4facfe" />
                      )}
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => {
                        setSelectedSessionId(music.sessionId || "");
                        Alert.alert(
                          "Assign to Session",
                          "Select a session for this music",
                          [
                            ...sessions.map(session => ({
                              text: session.title,
                              onPress: () => handleAssignToSession(music.id, session.id)
                            })),
                            { text: "Cancel", style: "cancel" }
                          ]
                        );
                      }}
                    >
                      <Link size={20} color="#43e97b" />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleDeleteMusic(music.id)}
                    >
                      <Trash2 size={20} color="#ff6b6b" />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      <Modal
        visible={showAddModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Custom Music</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <X size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Music Name"
              placeholderTextColor="#666"
              value={musicName}
              onChangeText={setMusicName}
            />

            <View style={styles.urlInputContainer}>
              <TextInput
                style={[styles.input, styles.urlInput]}
                placeholder="Music URL or Upload File"
                placeholderTextColor="#666"
                value={musicUrl}
                onChangeText={setMusicUrl}
              />
              {Platform.OS === 'web' && (
                <TouchableOpacity
                  style={styles.uploadButton}
                  onPress={handleFileUpload}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Upload size={20} color="#fff" />
                  )}
                </TouchableOpacity>
              )}
            </View>

            <Text style={styles.sectionTitle}>Assign to Session (Optional)</Text>
            <ScrollView style={styles.sessionList} horizontal showsHorizontalScrollIndicator={false}>
              {sessions.map((session) => (
                <TouchableOpacity
                  key={session.id}
                  style={[
                    styles.sessionChip,
                    selectedSessionId === session.id && styles.sessionChipSelected
                  ]}
                  onPress={() => setSelectedSessionId(
                    selectedSessionId === session.id ? "" : session.id
                  )}
                >
                  <Text style={[
                    styles.sessionChipText,
                    selectedSessionId === session.id && styles.sessionChipTextSelected
                  ]}>
                    {session.title}
                  </Text>
                  {selectedSessionId === session.id && (
                    <Check size={16} color="#fff" style={styles.checkIcon} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleAddMusic}
              >
                <Text style={styles.buttonText}>Add Music</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(79, 172, 254, 0.2)",
    borderRadius: 12,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: "rgba(79, 172, 254, 0.3)",
    marginBottom: 24,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
  },
  emptySubtext: {
    color: "#666",
    fontSize: 14,
    marginTop: 8,
  },
  musicList: {
    gap: 12,
  },
  musicItem: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  musicInfo: {
    flex: 1,
  },
  musicName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  sessionLabel: {
    color: "#43e97b",
    fontSize: 12,
    marginTop: 4,
  },
  musicActions: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#1a1a2e",
    borderRadius: 20,
    padding: 24,
    width: "100%",
    maxWidth: 400,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 16,
    color: "#fff",
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  urlInputContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  urlInput: {
    flex: 1,
    marginBottom: 0,
  },
  uploadButton: {
    backgroundColor: "rgba(79, 172, 254, 0.3)",
    borderRadius: 12,
    width: 52,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(79, 172, 254, 0.5)",
  },
  sectionTitle: {
    color: "#999",
    fontSize: 14,
    marginBottom: 12,
  },
  sessionList: {
    maxHeight: 100,
    marginBottom: 24,
  },
  sessionChip: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sessionChipSelected: {
    backgroundColor: "rgba(67, 233, 123, 0.3)",
    borderWidth: 1,
    borderColor: "rgba(67, 233, 123, 0.5)",
  },
  sessionChipText: {
    color: "#999",
    fontSize: 14,
  },
  sessionChipTextSelected: {
    color: "#fff",
  },
  checkIcon: {
    marginLeft: 4,
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  confirmButton: {
    backgroundColor: "rgba(79, 172, 254, 0.3)",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});