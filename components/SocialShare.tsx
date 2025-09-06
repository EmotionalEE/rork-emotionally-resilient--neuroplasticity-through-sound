import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
  Platform,
  Alert,
  Share,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Share as ShareIcon, 
  Twitter, 
  Facebook, 
  Instagram, 
  MessageCircle,
  Copy,
  X,
  Trophy,
  Target,
  Flame
} from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');

interface SocialShareProps {
  visible: boolean;
  onClose: () => void;
  shareType: 'progress' | 'achievement' | 'streak' | 'session';
  data: {
    title: string;
    description: string;
    stats?: {
      sessions?: number;
      streak?: number;
      minutes?: number;
      improvement?: number;
    };
  };
}

interface SocialPlatform {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  color: string;
  gradient: [string, string];
  action: (text: string, url?: string) => void;
}

export default function SocialShare({ visible, onClose, shareType, data }: SocialShareProps) {
  const [isSharing, setIsSharing] = useState<boolean>(false);

  const generateShareText = (): string => {
    const { title, description, stats } = data;
    
    switch (shareType) {
      case 'progress':
        return `🧘 ${title}\n\n${description}\n\n📊 My meditation progress:\n${stats?.sessions ? `• ${stats.sessions} sessions completed` : ''}\n${stats?.minutes ? `• ${Math.floor(stats.minutes / 60)}h ${stats.minutes % 60}m total time` : ''}\n${stats?.improvement ? `• ${stats.improvement}% improvement` : ''}\n\n#Meditation #Mindfulness #PersonalGrowth`;
      
      case 'achievement':
        return `🏆 ${title}\n\n${description}\n\nJust reached a new milestone in my meditation journey! 🌟\n\n#Achievement #Meditation #Mindfulness #PersonalGrowth`;
      
      case 'streak':
        return `🔥 ${title}\n\n${description}\n\n${stats?.streak ? `Maintained my meditation streak for ${stats.streak} days!` : ''} Consistency is key to inner peace. 🧘‍♀️\n\n#MeditationStreak #Mindfulness #DailyPractice #PersonalGrowth`;
      
      case 'session':
        return `✨ ${title}\n\n${description}\n\nJust completed another mindful session. Every moment of peace counts! 🙏\n\n#Meditation #Mindfulness #InnerPeace #SelfCare`;
      
      default:
        return `${title}\n\n${description}\n\n#Meditation #Mindfulness`;
    }
  };

  const shareToNative = async (text: string) => {
    try {
      setIsSharing(true);
      
      if (Platform.OS === 'web') {
        // For web, check if Web Share API is available and allowed
        if (navigator.share && navigator.canShare && navigator.canShare({ text })) {
          await navigator.share({
            title: data.title,
            text: text,
          });
        } else {
          // Fallback: copy to clipboard and show instructions
          await copyToClipboard(text);
          Alert.alert(
            'Content Copied!', 
            'The content has been copied to your clipboard. You can now paste it in your preferred social media app.'
          );
        }
      } else {
        // Native mobile sharing
        await Share.share({
          message: text,
          title: data.title,
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
      // Fallback to clipboard on any error
      try {
        await copyToClipboard(text);
        Alert.alert(
          'Copied to Clipboard', 
          'Content copied to clipboard. You can paste it in your preferred app.'
        );
      } catch {
        Alert.alert('Error', 'Unable to share or copy content');
      }
    } finally {
      setIsSharing(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      setIsSharing(true);
      await Clipboard.setStringAsync(text);
      Alert.alert('Copied!', 'Text copied to clipboard');
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      Alert.alert('Error', 'Failed to copy text');
    } finally {
      setIsSharing(false);
    }
  };

  const openURL = (url: string) => {
    if (Platform.OS === 'web') {
      window.open(url, '_blank');
    } else {
      // For mobile, we'll use the native share instead
      shareToNative(generateShareText());
    }
  };

  const socialPlatforms: SocialPlatform[] = [
    {
      id: 'twitter',
      name: 'Twitter',
      icon: Twitter,
      color: '#1DA1F2',
      gradient: ['#1DA1F2', '#0d8bd9'],
      action: (text: string) => {
        const encodedText = encodeURIComponent(text);
        openURL(`https://twitter.com/intent/tweet?text=${encodedText}`);
      },
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: Facebook,
      color: '#4267B2',
      gradient: ['#4267B2', '#365899'],
      action: (text: string) => {
        const encodedText = encodeURIComponent(text);
        openURL(`https://www.facebook.com/sharer/sharer.php?u=${encodedText}`);
      },
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: Instagram,
      color: '#E4405F',
      gradient: ['#E4405F', '#C13584'],
      action: () => {
        if (Platform.OS === 'web') {
          Alert.alert('Instagram', 'Please copy the text and share manually on Instagram');
          copyToClipboard(generateShareText());
        } else {
          shareToNative(generateShareText());
        }
      },
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: MessageCircle,
      color: '#25D366',
      gradient: ['#25D366', '#128C7E'],
      action: (text: string) => {
        const encodedText = encodeURIComponent(text);
        openURL(`https://wa.me/?text=${encodedText}`);
      },
    },
    {
      id: 'copy',
      name: 'Copy Text',
      icon: Copy,
      color: '#667eea',
      gradient: ['#667eea', '#764ba2'],
      action: (text: string) => copyToClipboard(text),
    },
    {
      id: 'more',
      name: 'More',
      icon: ShareIcon,
      color: '#8B5CF6',
      gradient: ['#8B5CF6', '#7C3AED'],
      action: (text: string) => shareToNative(text),
    },
  ];

  const getShareIcon = () => {
    switch (shareType) {
      case 'achievement':
        return Trophy;
      case 'streak':
        return Flame;
      case 'progress':
        return Target;
      default:
        return ShareIcon;
    }
  };

  const ShareIconComponent = getShareIcon();
  const shareText = generateShareText();

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {Platform.OS === 'ios' ? (
          <BlurView intensity={20} style={styles.blurOverlay}>
            <TouchableOpacity 
              style={styles.backdrop} 
              activeOpacity={1} 
              onPress={onClose}
            />
          </BlurView>
        ) : (
          <TouchableOpacity 
            style={styles.backdrop} 
            activeOpacity={1} 
            onPress={onClose}
          />
        )}
        
        <View style={styles.container}>
          <LinearGradient colors={['#1a1a2e', '#16213e']} style={styles.content}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <View style={styles.iconContainer}>
                  <LinearGradient colors={['#667eea', '#764ba2']} style={styles.iconGradient}>
                    <ShareIconComponent size={20} color="#ffffff" />
                  </LinearGradient>
                </View>
                <Text style={styles.title}>Share Your Progress</Text>
              </View>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <X size={24} color="#ffffff" />
              </TouchableOpacity>
            </View>

            {/* Preview */}
            <View style={styles.previewContainer}>
              <Text style={styles.previewTitle}>{data.title}</Text>
              <Text style={styles.previewDescription}>{data.description}</Text>
              {data.stats && (
                <View style={styles.statsPreview}>
                  {data.stats.sessions && (
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>{data.stats.sessions}</Text>
                      <Text style={styles.statLabel}>Sessions</Text>
                    </View>
                  )}
                  {data.stats.streak && (
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>{data.stats.streak}</Text>
                      <Text style={styles.statLabel}>Day Streak</Text>
                    </View>
                  )}
                  {data.stats.minutes && (
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>
                        {Math.floor(data.stats.minutes / 60)}h {data.stats.minutes % 60}m
                      </Text>
                      <Text style={styles.statLabel}>Total Time</Text>
                    </View>
                  )}
                  {data.stats.improvement && (
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>{data.stats.improvement}%</Text>
                      <Text style={styles.statLabel}>Improvement</Text>
                    </View>
                  )}
                </View>
              )}
            </View>

            {/* Social Platforms */}
            <View style={styles.platformsContainer}>
              <Text style={styles.platformsTitle}>Choose Platform</Text>
              <View style={styles.platformsGrid}>
                {socialPlatforms.map((platform) => {
                  const IconComponent = platform.icon;
                  return (
                    <TouchableOpacity
                      key={platform.id}
                      style={styles.platformButton}
                      onPress={() => {
                        if (!isSharing) {
                          platform.action(shareText);
                        }
                      }}
                      disabled={isSharing}
                      activeOpacity={0.8}
                    >
                      <LinearGradient colors={platform.gradient} style={styles.platformGradient}>
                        <IconComponent size={24} color="#ffffff" />
                      </LinearGradient>
                      <Text style={styles.platformName}>{platform.name}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </LinearGradient>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  blurOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backdrop: {
    flex: 1,
    backgroundColor: Platform.OS === 'ios' ? 'transparent' : 'rgba(0,0,0,0.5)',
  },
  container: {
    maxHeight: height * 0.8,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  content: {
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    marginRight: 12,
  },
  iconGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: '#ffffff',
  },
  closeButton: {
    padding: 8,
  },
  previewContainer: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#ffffff',
    marginBottom: 8,
  },
  previewDescription: {
    fontSize: 14,
    color: '#a0a0a0',
    lineHeight: 20,
    marginBottom: 16,
  },
  statsPreview: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#ffffff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#a0a0a0',
  },
  platformsContainer: {
    marginTop: 8,
  },
  platformsTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#ffffff',
    marginBottom: 16,
  },
  platformsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between',
  },
  platformButton: {
    alignItems: 'center',
    width: (width - 80) / 3,
    marginBottom: 16,
  },
  platformGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  platformName: {
    fontSize: 12,
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: '500' as const,
  },
});