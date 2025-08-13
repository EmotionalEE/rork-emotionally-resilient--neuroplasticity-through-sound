import React, { useEffect, useRef } from 'react';
import { StyleSheet, Animated } from 'react-native';
import Svg, { Circle, Path, Polygon, G, Defs, LinearGradient, Stop } from 'react-native-svg';

interface SacredGeometryProps {
  type: 'flowerOfLife' | 'metatronsCube' | 'sriYantra' | 'vesicaPiscis' | 'goldenSpiral';
  size?: number;
  color?: string;
  animated?: boolean;
  opacity?: number;
}

export default function SacredGeometry({ 
  type, 
  size = 200, 
  color = '#ffffff', 
  animated = true,
  opacity = 0.3 
}: SacredGeometryProps) {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (animated) {
      // Rotation animation
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 30000,
          useNativeDriver: true,
        })
      ).start();

      // Pulse animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [animated, rotateAnim, pulseAnim]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const renderFlowerOfLife = () => {
    const radius = size / 8;
    const centerX = size / 2;
    const centerY = size / 2;
    
    const circles = [];
    
    // Center circle
    circles.push(
      <Circle
        key="center"
        cx={centerX}
        cy={centerY}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth="2"
        opacity={opacity}
      />
    );
    
    // Six surrounding circles
    for (let i = 0; i < 6; i++) {
      const angle = (i * 60) * (Math.PI / 180);
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      
      circles.push(
        <Circle
          key={`circle-${i}`}
          cx={x}
          cy={y}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="2"
          opacity={opacity}
        />
      );
    }
    
    // Outer ring of circles
    for (let i = 0; i < 12; i++) {
      const angle = (i * 30) * (Math.PI / 180);
      const distance = radius * 2;
      const x = centerX + distance * Math.cos(angle);
      const y = centerY + distance * Math.sin(angle);
      
      circles.push(
        <Circle
          key={`outer-${i}`}
          cx={x}
          cy={y}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          opacity={opacity * 0.7}
        />
      );
    }
    
    return circles;
  };

  const renderMetatronsCube = () => {
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 6;
    
    const points: React.ReactElement[] = [];
    const lines: React.ReactElement[] = [];
    
    // Generate 13 circles (Metatron's Cube)
    const positions = [
      { x: centerX, y: centerY }, // Center
      // Inner hexagon
      ...Array.from({ length: 6 }, (_, i) => {
        const angle = (i * 60) * (Math.PI / 180);
        return {
          x: centerX + radius * Math.cos(angle),
          y: centerY + radius * Math.sin(angle)
        };
      }),
      // Outer hexagon
      ...Array.from({ length: 6 }, (_, i) => {
        const angle = (i * 60) * (Math.PI / 180);
        return {
          x: centerX + radius * 2 * Math.cos(angle),
          y: centerY + radius * 2 * Math.sin(angle)
        };
      })
    ];
    
    // Draw circles
    positions.forEach((pos, index) => {
      points.push(
        <Circle
          key={`point-${index}`}
          cx={pos.x}
          cy={pos.y}
          r={8}
          fill={color}
          opacity={opacity}
        />
      );
    });
    
    // Draw connecting lines
    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        lines.push(
          <Path
            key={`line-${i}-${j}`}
            d={`M ${positions[i].x} ${positions[i].y} L ${positions[j].x} ${positions[j].y}`}
            stroke={color}
            strokeWidth="1"
            opacity={opacity * 0.5}
          />
        );
      }
    }
    
    return [...lines, ...points];
  };

  const renderSriYantra = () => {
    const centerX = size / 2;
    const centerY = size / 2;
    const baseSize = size / 3;
    
    const triangles: React.ReactElement[] = [];
    
    // Upward triangles (Shiva)
    for (let i = 0; i < 5; i++) {
      const scale = 1 - (i * 0.15);
      const triangleSize = baseSize * scale;
      const points = `${centerX},${centerY - triangleSize} ${centerX - triangleSize * 0.866},${centerY + triangleSize * 0.5} ${centerX + triangleSize * 0.866},${centerY + triangleSize * 0.5}`;
      
      triangles.push(
        <Polygon
          key={`up-${i}`}
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          opacity={opacity - (i * 0.05)}
        />
      );
    }
    
    // Downward triangles (Shakti)
    for (let i = 0; i < 4; i++) {
      const scale = 0.9 - (i * 0.15);
      const triangleSize = baseSize * scale;
      const points = `${centerX},${centerY + triangleSize} ${centerX - triangleSize * 0.866},${centerY - triangleSize * 0.5} ${centerX + triangleSize * 0.866},${centerY - triangleSize * 0.5}`;
      
      triangles.push(
        <Polygon
          key={`down-${i}`}
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          opacity={opacity - (i * 0.05)}
        />
      );
    }
    
    return triangles;
  };

  const renderVesicaPiscis = () => {
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 4;
    const offset = radius * 0.6;
    
    return [
      <Circle
        key="left"
        cx={centerX - offset}
        cy={centerY}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth="3"
        opacity={opacity}
      />,
      <Circle
        key="right"
        cx={centerX + offset}
        cy={centerY}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth="3"
        opacity={opacity}
      />
    ];
  };

  const renderGoldenSpiral = () => {
    const centerX = size / 2;
    const centerY = size / 2;
    const phi = 1.618033988749;
    
    let pathData = '';
    let currentSize = 5;
    let x = centerX;
    let y = centerY;
    
    for (let i = 0; i < 8; i++) {
      const nextSize = currentSize * phi;
      
      // Create quarter circle arc
      const direction = i % 4;
      let startX = x, startY = y, endX = x, endY = y;
      
      switch (direction) {
        case 0: // Right
          endX = x + currentSize;
          pathData += `M ${startX} ${startY} A ${currentSize} ${currentSize} 0 0 1 ${endX} ${endY}`;
          x = endX;
          break;
        case 1: // Down
          endY = y + currentSize;
          pathData += ` A ${currentSize} ${currentSize} 0 0 1 ${endX} ${endY}`;
          y = endY;
          break;
        case 2: // Left
          endX = x - currentSize;
          pathData += ` A ${currentSize} ${currentSize} 0 0 1 ${endX} ${endY}`;
          x = endX;
          break;
        case 3: // Up
          endY = y - currentSize;
          pathData += ` A ${currentSize} ${currentSize} 0 0 1 ${endX} ${endY}`;
          y = endY;
          break;
      }
      
      currentSize = nextSize;
    }
    
    return [
      <Path
        key="spiral"
        d={pathData}
        fill="none"
        stroke={color}
        strokeWidth="2"
        opacity={opacity}
      />
    ];
  };

  const renderGeometry = () => {
    switch (type) {
      case 'flowerOfLife':
        return renderFlowerOfLife();
      case 'metatronsCube':
        return renderMetatronsCube();
      case 'sriYantra':
        return renderSriYantra();
      case 'vesicaPiscis':
        return renderVesicaPiscis();
      case 'goldenSpiral':
        return renderGoldenSpiral();
      default:
        return renderFlowerOfLife();
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          transform: [
            { rotate: animated ? rotation : '0deg' },
            { scale: animated ? pulseAnim : 1 }
          ]
        }
      ]}
    >
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Defs>
          <LinearGradient id="geometryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={color} stopOpacity={opacity} />
            <Stop offset="100%" stopColor={color} stopOpacity={opacity * 0.5} />
          </LinearGradient>
        </Defs>
        <G>
          {renderGeometry()}
        </G>
      </Svg>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});