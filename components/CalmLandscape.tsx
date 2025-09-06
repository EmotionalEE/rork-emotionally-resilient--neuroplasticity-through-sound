import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, Circle, Ellipse, G, Defs, LinearGradient, Stop } from 'react-native-svg';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface CalmLandscapeProps {
  opacity?: number;
}

export const CalmLandscape: React.FC<CalmLandscapeProps> = ({ opacity = 0.3 }) => {
  const cloudAnim1 = useRef(new Animated.Value(0)).current;
  const cloudAnim2 = useRef(new Animated.Value(0)).current;
  const cloudAnim3 = useRef(new Animated.Value(0)).current;
  const waveAnim = useRef(new Animated.Value(0)).current;


  useEffect(() => {
    // Cloud animations - slow moving clouds
    const cloudAnimation1 = Animated.loop(
      Animated.timing(cloudAnim1, {
        toValue: 1,
        duration: 45000, // 45 seconds for very slow movement
        useNativeDriver: true,
      })
    );
    
    const cloudAnimation2 = Animated.loop(
      Animated.timing(cloudAnim2, {
        toValue: 1,
        duration: 60000, // 60 seconds
        useNativeDriver: true,
      })
    );
    
    const cloudAnimation3 = Animated.loop(
      Animated.timing(cloudAnim3, {
        toValue: 1,
        duration: 35000, // 35 seconds
        useNativeDriver: true,
      })
    );

    // Gentle wave animation
    const waveAnimation = Animated.loop(
      Animated.timing(waveAnim, {
        toValue: 1,
        duration: 8000, // 8 seconds for gentle waves
        useNativeDriver: true,
      })
    );



    cloudAnimation1.start();
    cloudAnimation2.start();
    cloudAnimation3.start();
    waveAnimation.start();


    return () => {
      cloudAnimation1.stop();
      cloudAnimation2.stop();
      cloudAnimation3.stop();
      waveAnimation.stop();

    };
  }, [cloudAnim1, cloudAnim2, cloudAnim3, waveAnim]);

  // Animation interpolations
  const cloud1Transform = cloudAnim1.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, screenWidth + 100],
  });

  const cloud2Transform = cloudAnim2.interpolate({
    inputRange: [0, 1],
    outputRange: [-150, screenWidth + 150],
  });

  const cloud3Transform = cloudAnim3.interpolate({
    inputRange: [0, 1],
    outputRange: [-80, screenWidth + 80],
  });

  const waveTransform = waveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 20],
  });



  return (
    <View style={[styles.container, { opacity }]}>
      {/* Background gradient sky */}
      <View style={styles.sky}>
        <Svg width={screenWidth} height={screenHeight} style={styles.svg}>
          <Defs>
            <LinearGradient id="skyGradient" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="rgba(25, 25, 46, 0.8)" />
              <Stop offset="50%" stopColor="rgba(22, 33, 62, 0.6)" />
              <Stop offset="100%" stopColor="rgba(15, 52, 96, 0.4)" />
            </LinearGradient>
            <LinearGradient id="mountainGradient" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="rgba(60, 80, 120, 0.6)" />
              <Stop offset="100%" stopColor="rgba(30, 40, 60, 0.8)" />
            </LinearGradient>
            <LinearGradient id="waterGradient" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="rgba(100, 150, 200, 0.4)" />
              <Stop offset="100%" stopColor="rgba(50, 100, 150, 0.6)" />
            </LinearGradient>
          </Defs>
          
          {/* Sky background */}
          <Path
            d={`M 0 0 L ${screenWidth} 0 L ${screenWidth} ${screenHeight} L 0 ${screenHeight} Z`}
            fill="url(#skyGradient)"
          />
          
          {/* Distant mountains */}
          <Path
            d={`M 0 ${screenHeight * 0.4} Q ${screenWidth * 0.2} ${screenHeight * 0.3} ${screenWidth * 0.4} ${screenHeight * 0.35} Q ${screenWidth * 0.6} ${screenHeight * 0.4} ${screenWidth * 0.8} ${screenHeight * 0.32} Q ${screenWidth * 0.9} ${screenHeight * 0.35} ${screenWidth} ${screenHeight * 0.38} L ${screenWidth} ${screenHeight} L 0 ${screenHeight} Z`}
            fill="url(#mountainGradient)"
          />
          
          {/* Water/lake */}
          <Path
            d={`M 0 ${screenHeight * 0.7} Q ${screenWidth * 0.3} ${screenHeight * 0.68} ${screenWidth * 0.6} ${screenHeight * 0.72} Q ${screenWidth * 0.8} ${screenHeight * 0.69} ${screenWidth} ${screenHeight * 0.71} L ${screenWidth} ${screenHeight} L 0 ${screenHeight} Z`}
            fill="url(#waterGradient)"
          />
          
          {/* Twinkling stars */}
          <G>
            <Circle cx={screenWidth * 0.1} cy={screenHeight * 0.15} r="1" fill="rgba(255, 255, 255, 0.8)" />
            <Circle cx={screenWidth * 0.25} cy={screenHeight * 0.08} r="0.8" fill="rgba(255, 255, 255, 0.6)" />
            <Circle cx={screenWidth * 0.4} cy={screenHeight * 0.12} r="1.2" fill="rgba(255, 255, 255, 0.9)" />
            <Circle cx={screenWidth * 0.6} cy={screenHeight * 0.06} r="0.9" fill="rgba(255, 255, 255, 0.7)" />
            <Circle cx={screenWidth * 0.75} cy={screenHeight * 0.11} r="1.1" fill="rgba(255, 255, 255, 0.8)" />
            <Circle cx={screenWidth * 0.9} cy={screenHeight * 0.09} r="0.7" fill="rgba(255, 255, 255, 0.5)" />
          </G>
        </Svg>
      </View>

      {/* Animated clouds */}
      <Animated.View
        style={[
          styles.cloud,
          {
            top: screenHeight * 0.15,
            transform: [{ translateX: cloud1Transform }],
          },
        ]}
      >
        <Svg width={120} height={60} viewBox="0 0 120 60">
          <G fill="rgba(255, 255, 255, 0.1)">
            <Ellipse cx="30" cy="40" rx="25" ry="15" />
            <Ellipse cx="50" cy="35" rx="30" ry="18" />
            <Ellipse cx="70" cy="38" rx="28" ry="16" />
            <Ellipse cx="90" cy="42" rx="22" ry="14" />
          </G>
        </Svg>
      </Animated.View>

      <Animated.View
        style={[
          styles.cloud,
          {
            top: screenHeight * 0.25,
            transform: [{ translateX: cloud2Transform }],
          },
        ]}
      >
        <Svg width={100} height={50} viewBox="0 0 100 50">
          <G fill="rgba(255, 255, 255, 0.08)">
            <Ellipse cx="25" cy="35" rx="20" ry="12" />
            <Ellipse cx="45" cy="30" rx="25" ry="15" />
            <Ellipse cx="65" cy="33" rx="23" ry="13" />
            <Ellipse cx="80" cy="37" rx="18" ry="11" />
          </G>
        </Svg>
      </Animated.View>

      <Animated.View
        style={[
          styles.cloud,
          {
            top: screenHeight * 0.35,
            transform: [{ translateX: cloud3Transform }],
          },
        ]}
      >
        <Svg width={80} height={40} viewBox="0 0 80 40">
          <G fill="rgba(255, 255, 255, 0.06)">
            <Ellipse cx="20" cy="28" rx="16" ry="10" />
            <Ellipse cx="35" cy="25" rx="20" ry="12" />
            <Ellipse cx="50" cy="27" rx="18" ry="11" />
            <Ellipse cx="65" cy="30" rx="14" ry="9" />
          </G>
        </Svg>
      </Animated.View>

      {/* Animated water waves */}
      <Animated.View
        style={[
          styles.waves,
          {
            bottom: screenHeight * 0.28,
            transform: [{ translateY: waveTransform }],
          },
        ]}
      >
        <Svg width={screenWidth} height={30} viewBox={`0 0 ${screenWidth} 30`}>
          <Path
            d={`M 0 15 Q ${screenWidth * 0.25} 5 ${screenWidth * 0.5} 15 Q ${screenWidth * 0.75} 25 ${screenWidth} 15 L ${screenWidth} 30 L 0 30 Z`}
            fill="rgba(100, 150, 200, 0.2)"
          />
        </Svg>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  sky: {
    flex: 1,
  },
  svg: {
    position: 'absolute',
  },
  cloud: {
    position: 'absolute',
  },
  waves: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
});