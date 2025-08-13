import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { X } from 'lucide-react-native';
import { emotionalStates } from '@/constants/sessions';
import { EmotionalState } from '@/types/session';

interface EmotionSelectorProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (emotionId: string, intensity: number) => void;
  title?: string;
}

export default function EmotionSelector({ 
  visible, 
  onClose, 
  onSelect, 
  title = "How are you feeling?" 
}: EmotionSelectorProps) {
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionalState | null>(null);
  const [intensity, setIntensity] = useState(5);

  const handleEmotionSelect = (emotion: EmotionalState) => {
    setSelectedEmotion(emotion);
    setIntensity(emotion.intensity);
  };

  const handleConfirm = () => {
    if (selectedEmotion) {
      onSelect(selectedEmotion.id, intensity);
      onClose();
      setSelectedEmotion(null);
      setIntensity(5);
    }
  };

  const getCategoryEmotions = (category: 'negative' | 'neutral' | 'positive') => {
    return emotionalStates.filter(emotion => emotion.category === category);
  };

  const renderEmotionButton = (emotion: EmotionalState) => (
    <TouchableOpacity
      key={emotion.id}
      onPress={() => handleEmotionSelect(emotion)}
      style={[
        styles.emotionButton,
        selectedEmotion?.id === emotion.id && styles.selectedEmotion
      ]}
    >
      <LinearGradient
        colors={emotion.gradient as unknown as readonly [string, string, ...string[]]}
        style={styles.emotionGradient}
      >
        <Text style={styles.emotionText}>{emotion.label}</Text>
        <Text style={styles.intensityText}>Level {emotion.intensity}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderIntensitySlider = () => (
    <View style={styles.intensityContainer}>
      <Text style={styles.intensityLabel}>Intensity Level: {intensity}</Text>
      <View style={styles.sliderContainer}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
          <TouchableOpacity
            key={level}
            onPress={() => setIntensity(level)}
            style={[
              styles.intensityDot,
              intensity >= level && styles.activeDot,
              selectedEmotion && {
                backgroundColor: intensity >= level ? selectedEmotion.gradient[0] : '#E0E0E0'
              }
            ]}
          />
        ))}
      </View>
      <View style={styles.sliderLabels}>
        <Text style={styles.sliderLabel}>Low</Text>
        <Text style={styles.sliderLabel}>High</Text>
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.categorySection}>
            <Text style={styles.categoryTitle}>Challenging Emotions</Text>
            <View style={styles.emotionsGrid}>
              {getCategoryEmotions('negative').map(renderEmotionButton)}
            </View>
          </View>

          <View style={styles.categorySection}>
            <Text style={styles.categoryTitle}>Neutral</Text>
            <View style={styles.emotionsGrid}>
              {getCategoryEmotions('neutral').map(renderEmotionButton)}
            </View>
          </View>

          <View style={styles.categorySection}>
            <Text style={styles.categoryTitle}>Positive Emotions</Text>
            <View style={styles.emotionsGrid}>
              {getCategoryEmotions('positive').map(renderEmotionButton)}
            </View>
          </View>

          {selectedEmotion && (
            <View style={styles.selectedSection}>
              <Text style={styles.selectedTitle}>
                You selected: {selectedEmotion.label}
              </Text>
              {renderIntensitySlider()}
            </View>
          )}
        </ScrollView>

        {selectedEmotion && (
          <View style={styles.footer}>
            <TouchableOpacity onPress={handleConfirm} style={styles.confirmButton}>
              <LinearGradient
                colors={selectedEmotion.gradient as unknown as readonly [string, string, ...string[]]}
                style={styles.confirmGradient}
              >
                <Text style={styles.confirmText}>Confirm Selection</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold' as const,
    color: '#333',
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  categorySection: {
    marginVertical: 16,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#333',
    marginBottom: 12,
  },
  emotionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  emotionButton: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  selectedEmotion: {
    transform: [{ scale: 1.05 }],
    elevation: 4,
    shadowOpacity: 0.2,
  },
  emotionGradient: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    minWidth: 100,
    alignItems: 'center',
  },
  emotionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600' as const,
    textAlign: 'center',
  },
  intensityText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 11,
    marginTop: 2,
  },
  selectedSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginVertical: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  selectedTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  intensityContainer: {
    alignItems: 'center',
  },
  intensityLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  intensityDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#E0E0E0',
  },
  activeDot: {
    backgroundColor: '#4CAF50',
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
  },
  sliderLabel: {
    fontSize: 12,
    color: '#666',
  },
  footer: {
    padding: 20,
    paddingBottom: 40,
  },
  confirmButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  confirmGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  confirmText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600' as const,
  },
});