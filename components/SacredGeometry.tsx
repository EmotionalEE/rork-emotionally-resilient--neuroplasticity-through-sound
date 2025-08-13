import React, { useEffect, useRef } from 'react';
import { StyleSheet, Animated } from 'react-native';
import Svg, { Circle, Path, Polygon, G, Defs, LinearGradient, Stop } from 'react-native-svg';

interface SacredGeometryProps {
  type: 'flowerOfLife' | 'metatronsCube' | 'sriYantra' | 'vesicaPiscis' | 'goldenSpiral' | 'merkaba' | 'treeOfLife' | 'seedOfLife' | 'platonic' | 'mandala' | 'fibonacci' | 'torusField';
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
    
    const circles: React.ReactElement[] = [];
    
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

  const renderMerkaba = () => {
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 4;
    const height = radius * Math.sqrt(3);
    
    // Upward tetrahedron
    const upTriangle1 = `${centerX},${centerY - height/2} ${centerX - radius},${centerY + height/4} ${centerX + radius},${centerY + height/4}`;
    const upTriangle2 = `${centerX},${centerY + height/3} ${centerX - radius*0.7},${centerY - height/6} ${centerX + radius*0.7},${centerY - height/6}`;
    
    // Downward tetrahedron
    const downTriangle1 = `${centerX},${centerY + height/2} ${centerX - radius},${centerY - height/4} ${centerX + radius},${centerY - height/4}`;
    const downTriangle2 = `${centerX},${centerY - height/3} ${centerX - radius*0.7},${centerY + height/6} ${centerX + radius*0.7},${centerY + height/6}`;
    
    return [
      <Polygon key="up1" points={upTriangle1} fill="none" stroke={color} strokeWidth="2" opacity={opacity} />,
      <Polygon key="up2" points={upTriangle2} fill="none" stroke={color} strokeWidth="1.5" opacity={opacity * 0.7} />,
      <Polygon key="down1" points={downTriangle1} fill="none" stroke={color} strokeWidth="2" opacity={opacity} />,
      <Polygon key="down2" points={downTriangle2} fill="none" stroke={color} strokeWidth="1.5" opacity={opacity * 0.7} />,
    ];
  };

  const renderTreeOfLife = () => {
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 12;
    
    // Sephirot positions (10 spheres)
    const sephirot = [
      { x: centerX, y: centerY - radius * 4, name: 'Kether' },
      { x: centerX - radius * 2, y: centerY - radius * 2.5, name: 'Binah' },
      { x: centerX + radius * 2, y: centerY - radius * 2.5, name: 'Chokmah' },
      { x: centerX - radius * 1.5, y: centerY - radius, name: 'Geburah' },
      { x: centerX + radius * 1.5, y: centerY - radius, name: 'Chesed' },
      { x: centerX, y: centerY, name: 'Tiphereth' },
      { x: centerX - radius * 1.5, y: centerY + radius, name: 'Hod' },
      { x: centerX + radius * 1.5, y: centerY + radius, name: 'Netzach' },
      { x: centerX, y: centerY + radius * 2.5, name: 'Yesod' },
      { x: centerX, y: centerY + radius * 4, name: 'Malkuth' },
    ];
    
    const connections = [
      [0, 1], [0, 2], [1, 2], [1, 3], [2, 4], [3, 4], [3, 5], [4, 5],
      [5, 6], [5, 7], [6, 7], [6, 8], [7, 8], [8, 9]
    ];
    
    const elements: React.ReactElement[] = [];
    
    // Draw connections
    connections.forEach(([i, j], index) => {
      elements.push(
        <Path
          key={`connection-${index}`}
          d={`M ${sephirot[i].x} ${sephirot[i].y} L ${sephirot[j].x} ${sephirot[j].y}`}
          stroke={color}
          strokeWidth="1.5"
          opacity={opacity * 0.6}
        />
      );
    });
    
    // Draw sephirot
    sephirot.forEach((seph, index) => {
      elements.push(
        <Circle
          key={`seph-${index}`}
          cx={seph.x}
          cy={seph.y}
          r={radius * 0.8}
          fill="none"
          stroke={color}
          strokeWidth="2"
          opacity={opacity}
        />
      );
    });
    
    return elements;
  };

  const renderSeedOfLife = () => {
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 8;
    
    const circles: React.ReactElement[] = [];
    
    // Center circle
    circles.push(
      <Circle key="center" cx={centerX} cy={centerY} r={radius} fill="none" stroke={color} strokeWidth="2" opacity={opacity} />
    );
    
    // Six surrounding circles
    for (let i = 0; i < 6; i++) {
      const angle = (i * 60) * (Math.PI / 180);
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      
      circles.push(
        <Circle key={`seed-${i}`} cx={x} cy={y} r={radius} fill="none" stroke={color} strokeWidth="2" opacity={opacity} />
      );
    }
    
    return circles;
  };

  const renderPlatonic = () => {
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 4;
    
    // Dodecahedron projection (pentagon-based)
    const elements: React.ReactElement[] = [];
    
    // Outer pentagon
    const outerPoints: string[] = [];
    for (let i = 0; i < 5; i++) {
      const angle = (i * 72 - 90) * (Math.PI / 180);
      outerPoints.push(`${centerX + radius * Math.cos(angle)},${centerY + radius * Math.sin(angle)}`);
    }
    
    // Inner pentagon
    const innerPoints: string[] = [];
    for (let i = 0; i < 5; i++) {
      const angle = (i * 72 - 90) * (Math.PI / 180);
      innerPoints.push(`${centerX + radius * 0.6 * Math.cos(angle)},${centerY + radius * 0.6 * Math.sin(angle)}`);
    }
    
    elements.push(
      <Polygon key="outer-pentagon" points={outerPoints.join(' ')} fill="none" stroke={color} strokeWidth="2" opacity={opacity} />
    );
    
    elements.push(
      <Polygon key="inner-pentagon" points={innerPoints.join(' ')} fill="none" stroke={color} strokeWidth="2" opacity={opacity * 0.7} />
    );
    
    // Connect outer to inner
    for (let i = 0; i < 5; i++) {
      const outerAngle = (i * 72 - 90) * (Math.PI / 180);
      const innerAngle = (i * 72 - 90) * (Math.PI / 180);
      
      elements.push(
        <Path
          key={`connection-${i}`}
          d={`M ${centerX + radius * Math.cos(outerAngle)} ${centerY + radius * Math.sin(outerAngle)} L ${centerX + radius * 0.6 * Math.cos(innerAngle)} ${centerY + radius * 0.6 * Math.sin(innerAngle)}`}
          stroke={color}
          strokeWidth="1.5"
          opacity={opacity * 0.5}
        />
      );
    }
    
    return elements;
  };

  const renderMandala = () => {
    const centerX = size / 2;
    const centerY = size / 2;
    const elements: React.ReactElement[] = [];
    
    // Multiple concentric patterns
    for (let layer = 1; layer <= 4; layer++) {
      const layerRadius = (size / 8) * layer;
      const petals = layer * 8;
      
      for (let i = 0; i < petals; i++) {
        const angle = (i * (360 / petals)) * (Math.PI / 180);
        const x = centerX + layerRadius * Math.cos(angle);
        const y = centerY + layerRadius * Math.sin(angle);
        
        // Petal shape
        const petalSize = layerRadius * 0.3;
        const petalPath = `M ${x} ${y} Q ${x + petalSize * Math.cos(angle + Math.PI/4)} ${y + petalSize * Math.sin(angle + Math.PI/4)} ${x + petalSize * Math.cos(angle)} ${y + petalSize * Math.sin(angle)} Q ${x + petalSize * Math.cos(angle - Math.PI/4)} ${y + petalSize * Math.sin(angle - Math.PI/4)} ${x} ${y}`;
        
        elements.push(
          <Path
            key={`petal-${layer}-${i}`}
            d={petalPath}
            fill="none"
            stroke={color}
            strokeWidth="1"
            opacity={opacity * (0.8 - layer * 0.1)}
          />
        );
      }
      
      // Layer circle
      elements.push(
        <Circle
          key={`layer-${layer}`}
          cx={centerX}
          cy={centerY}
          r={layerRadius}
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          opacity={opacity * 0.4}
        />
      );
    }
    
    return elements;
  };

  const renderFibonacci = () => {
    const centerX = size / 2;
    const centerY = size / 2;
    const elements: React.ReactElement[] = [];
    
    // Fibonacci sequence visualization
    const fib = [1, 1, 2, 3, 5, 8, 13, 21];
    let currentAngle = 0;
    
    for (let i = 0; i < fib.length; i++) {
      const radius = fib[i] * 3;
      const x = centerX + radius * Math.cos(currentAngle);
      const y = centerY + radius * Math.sin(currentAngle);
      
      elements.push(
        <Circle
          key={`fib-${i}`}
          cx={x}
          cy={y}
          r={fib[i] * 2}
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          opacity={opacity * (1 - i * 0.1)}
        />
      );
      
      // Golden angle
      currentAngle += 137.5 * (Math.PI / 180);
    }
    
    return elements;
  };

  const renderTorusField = () => {
    const centerX = size / 2;
    const centerY = size / 2;
    const elements: React.ReactElement[] = [];
    
    // Torus field lines
    for (let i = 0; i < 12; i++) {
      const angle = (i * 30) * (Math.PI / 180);
      const majorRadius = size / 4;
      const minorRadius = size / 12;
      
      // Create torus-like curves
      let pathData = '';
      for (let t = 0; t <= 2 * Math.PI; t += 0.1) {
        const x = centerX + (majorRadius + minorRadius * Math.cos(t)) * Math.cos(angle);
        const y = centerY + (majorRadius + minorRadius * Math.cos(t)) * Math.sin(angle) + minorRadius * Math.sin(t) * 0.5;
        
        if (t === 0) {
          pathData += `M ${x} ${y}`;
        } else {
          pathData += ` L ${x} ${y}`;
        }
      }
      
      elements.push(
        <Path
          key={`torus-${i}`}
          d={pathData}
          fill="none"
          stroke={color}
          strokeWidth="1"
          opacity={opacity * 0.6}
        />
      );
    }
    
    return elements;
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
      case 'merkaba':
        return renderMerkaba();
      case 'treeOfLife':
        return renderTreeOfLife();
      case 'seedOfLife':
        return renderSeedOfLife();
      case 'platonic':
        return renderPlatonic();
      case 'mandala':
        return renderMandala();
      case 'fibonacci':
        return renderFibonacci();
      case 'torusField':
        return renderTorusField();
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