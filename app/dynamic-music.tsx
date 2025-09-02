import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import DynamicMusicPlayer from '@/components/DynamicMusicPlayer';

export default function DynamicMusicScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#0f0f23', '#1a1a2e', '#16213e']}
        style={styles.background}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Dynamic Healing Music</Text>
            <Text style={styles.subtitle}>
              Experience unique, AI-generated soundscapes for deep emotional release
            </Text>
          </View>

          <DynamicMusicPlayer style={styles.player} />

          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>How It Works</Text>
            
            <View style={styles.infoCard}>
              <Text style={styles.infoCardTitle}>🎵 Solfeggio Frequencies</Text>
              <Text style={styles.infoCardText}>
                Uses ancient healing frequencies like 396Hz (fear release), 528Hz (DNA repair), 
                and 741Hz (intuition awakening) to promote emotional healing.
              </Text>
            </View>

            <View style={styles.infoCard}>
              <Text style={styles.infoCardTitle}>🌊 Dynamic Composition</Text>
              <Text style={styles.infoCardText}>
                Each session generates a unique musical journey that evolves in real-time, 
                creating harmonics and layers that respond to your emotional state.
              </Text>
            </View>

            <View style={styles.infoCard}>
              <Text style={styles.infoCardTitle}>✨ Despair Release Journey</Text>
              <Text style={styles.infoCardText}>
                Follows a carefully crafted progression: Fear Release → Change Facilitation → 
                Transformation → Connection → Spiritual Awakening.
              </Text>
            </View>

            <View style={styles.infoCard}>
              <Text style={styles.infoCardTitle}>🎛️ Interactive Control</Text>
              <Text style={styles.infoCardText}>
                Adjust intensity levels and add healing layers during your session to 
                customize the experience to your needs.
              </Text>
            </View>
          </View>

          <View style={styles.benefitsSection}>
            <Text style={styles.sectionTitle}>Benefits</Text>
            <View style={styles.benefitsList}>
              <Text style={styles.benefitItem}>• Deep emotional release and healing</Text>
              <Text style={styles.benefitItem}>• Stress and anxiety reduction</Text>
              <Text style={styles.benefitItem}>• Enhanced meditation and mindfulness</Text>
              <Text style={styles.benefitItem}>• Improved sleep quality</Text>
              <Text style={styles.benefitItem}>• Increased spiritual awareness</Text>
              <Text style={styles.benefitItem}>• Unique experience every session</Text>
            </View>
          </View>

          <View style={styles.usageSection}>
            <Text style={styles.sectionTitle}>Best Practices</Text>
            <View style={styles.usageList}>
              <Text style={styles.usageItem}>🎧 Use headphones for optimal experience</Text>
              <Text style={styles.usageItem}>🧘 Find a quiet, comfortable space</Text>
              <Text style={styles.usageItem}>⏰ Allow 15-30 minutes for full journey</Text>
              <Text style={styles.usageItem}>💫 Focus on your breath and let go</Text>
              <Text style={styles.usageItem}>🌐 Use web version for full functionality</Text>
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
  },
  background: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#ffffff80',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  player: {
    marginBottom: 30,
  },
  infoSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: '#ffffff10',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ffffff20',
  },
  infoCardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 10,
  },
  infoCardText: {
    fontSize: 14,
    color: '#ffffff80',
    lineHeight: 20,
  },
  benefitsSection: {
    marginBottom: 30,
  },
  benefitsList: {
    backgroundColor: '#ffffff08',
    borderRadius: 15,
    padding: 20,
    borderWidth: 1,
    borderColor: '#ffffff15',
  },
  benefitItem: {
    fontSize: 16,
    color: '#ffffff90',
    marginBottom: 8,
    lineHeight: 22,
  },
  usageSection: {
    marginBottom: 20,
  },
  usageList: {
    backgroundColor: '#ffffff08',
    borderRadius: 15,
    padding: 20,
    borderWidth: 1,
    borderColor: '#ffffff15',
  },
  usageItem: {
    fontSize: 16,
    color: '#ffffff90',
    marginBottom: 8,
    lineHeight: 22,
  },
});