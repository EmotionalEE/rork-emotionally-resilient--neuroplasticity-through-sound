import React, { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';
import Svg, { Circle, Path, Line, Polygon, G } from 'react-native-svg';

interface SacredGeometryProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

// Egg of Life
export const EggOfLife: React.FC<SacredGeometryProps> = ({ 
  size = 40, 
  color = 'rgba(255,255,255,0.6)', 
  strokeWidth = 1 
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <G stroke={color} strokeWidth={strokeWidth} fill="none">
        {/* Center circle */}
        <Circle cx="50" cy="50" r="12" />
        {/* Surrounding circles */}
        <Circle cx="50" cy="26" r="12" />
        <Circle cx="71" cy="38" r="12" />
        <Circle cx="71" cy="62" r="12" />
        <Circle cx="50" cy="74" r="12" />
        <Circle cx="29" cy="62" r="12" />
        <Circle cx="29" cy="38" r="12" />
      </G>
    </Svg>
  );
};

// Fruit of Life
export const FruitOfLife: React.FC<SacredGeometryProps> = ({ 
  size = 40, 
  color = 'rgba(255,255,255,0.6)', 
  strokeWidth = 1 
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <G stroke={color} strokeWidth={strokeWidth} fill="none">
        {/* Inner Egg of Life */}
        <Circle cx="50" cy="50" r="8" />
        <Circle cx="50" cy="34" r="8" />
        <Circle cx="64" cy="42" r="8" />
        <Circle cx="64" cy="58" r="8" />
        <Circle cx="50" cy="66" r="8" />
        <Circle cx="36" cy="58" r="8" />
        <Circle cx="36" cy="42" r="8" />
        {/* Outer ring */}
        <Circle cx="50" cy="18" r="8" />
        <Circle cx="72" cy="26" r="8" />
        <Circle cx="82" cy="50" r="8" />
        <Circle cx="72" cy="74" r="8" />
        <Circle cx="50" cy="82" r="8" />
        <Circle cx="28" cy="74" r="8" />
        <Circle cx="18" cy="50" r="8" />
        <Circle cx="28" cy="26" r="8" />
      </G>
    </Svg>
  );
};

// Metatron's Cube
export const MetatronsCube: React.FC<SacredGeometryProps> = ({ 
  size = 40, 
  color = 'rgba(255,255,255,0.6)', 
  strokeWidth = 1 
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <G stroke={color} strokeWidth={strokeWidth} fill="none">
        {/* Outer circles */}
        <Circle cx="50" cy="15" r="6" />
        <Circle cx="75" cy="25" r="6" />
        <Circle cx="85" cy="50" r="6" />
        <Circle cx="75" cy="75" r="6" />
        <Circle cx="50" cy="85" r="6" />
        <Circle cx="25" cy="75" r="6" />
        <Circle cx="15" cy="50" r="6" />
        <Circle cx="25" cy="25" r="6" />
        {/* Inner circles */}
        <Circle cx="50" cy="35" r="6" />
        <Circle cx="65" cy="50" r="6" />
        <Circle cx="50" cy="65" r="6" />
        <Circle cx="35" cy="50" r="6" />
        <Circle cx="50" cy="50" r="6" />
        {/* Connecting lines */}
        <Line x1="50" y1="15" x2="50" y2="85" />
        <Line x1="15" y1="50" x2="85" y2="50" />
        <Line x1="25" y1="25" x2="75" y2="75" />
        <Line x1="75" y1="25" x2="25" y2="75" />
        {/* Inner connections */}
        <Line x1="50" y1="35" x2="65" y2="50" />
        <Line x1="65" y1="50" x2="50" y2="65" />
        <Line x1="50" y1="65" x2="35" y2="50" />
        <Line x1="35" y1="50" x2="50" y2="35" />
      </G>
    </Svg>
  );
};

// Vesica Piscis
export const VesicaPiscis: React.FC<SacredGeometryProps> = ({ 
  size = 40, 
  color = 'rgba(255,255,255,0.6)', 
  strokeWidth = 1 
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <G stroke={color} strokeWidth={strokeWidth} fill="none">
        <Circle cx="40" cy="50" r="25" />
        <Circle cx="60" cy="50" r="25" />
        <Circle cx="50" cy="50" r="8" />
      </G>
    </Svg>
  );
};

// Seed of Life
export const SeedOfLife: React.FC<SacredGeometryProps> = ({ 
  size = 40, 
  color = 'rgba(255,255,255,0.6)', 
  strokeWidth = 1 
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <G stroke={color} strokeWidth={strokeWidth} fill="none">
        {/* Center circle */}
        <Circle cx="50" cy="50" r="15" />
        {/* Six petals */}
        <Circle cx="50" cy="35" r="15" />
        <Circle cx="63" cy="42.5" r="15" />
        <Circle cx="63" cy="57.5" r="15" />
        <Circle cx="50" cy="65" r="15" />
        <Circle cx="37" cy="57.5" r="15" />
        <Circle cx="37" cy="42.5" r="15" />
      </G>
    </Svg>
  );
};

// Six-Petal Rosette
export const SixPetalRosette: React.FC<SacredGeometryProps> = ({ 
  size = 40, 
  color = 'rgba(255,255,255,0.6)', 
  strokeWidth = 1 
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <G stroke={color} strokeWidth={strokeWidth} fill="none">
        <Circle cx="50" cy="50" r="30" />
        {/* Six petals */}
        <Path d="M 50 20 A 15 15 0 0 1 65 35 A 15 15 0 0 1 50 50 A 15 15 0 0 1 35 35 A 15 15 0 0 1 50 20" />
        <Path d="M 65 35 A 15 15 0 0 1 80 50 A 15 15 0 0 1 65 65 A 15 15 0 0 1 50 50 A 15 15 0 0 1 65 35" />
        <Path d="M 65 65 A 15 15 0 0 1 50 80 A 15 15 0 0 1 35 65 A 15 15 0 0 1 50 50 A 15 15 0 0 1 65 65" />
        <Path d="M 35 65 A 15 15 0 0 1 20 50 A 15 15 0 0 1 35 35 A 15 15 0 0 1 50 50 A 15 15 0 0 1 35 65" />
        <Path d="M 35 35 A 15 15 0 0 1 50 20 A 15 15 0 0 1 65 35 A 15 15 0 0 1 50 50 A 15 15 0 0 1 35 35" />
        <Path d="M 65 35 A 15 15 0 0 1 80 50 A 15 15 0 0 1 65 65 A 15 15 0 0 1 50 50 A 15 15 0 0 1 65 35" />
      </G>
    </Svg>
  );
};

// Tree of Life
export const TreeOfLife: React.FC<SacredGeometryProps> = ({ 
  size = 40, 
  color = 'rgba(255,255,255,0.6)', 
  strokeWidth = 1 
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <G stroke={color} strokeWidth={strokeWidth} fill={color}>
        {/* Sephiroth (circles) */}
        <Circle cx="50" cy="15" r="4" />
        <Circle cx="35" cy="25" r="4" />
        <Circle cx="65" cy="25" r="4" />
        <Circle cx="50" cy="35" r="4" />
        <Circle cx="25" cy="45" r="4" />
        <Circle cx="75" cy="45" r="4" />
        <Circle cx="50" cy="55" r="4" />
        <Circle cx="35" cy="70" r="4" />
        <Circle cx="65" cy="70" r="4" />
        <Circle cx="50" cy="85" r="4" />
        {/* Paths connecting the sephiroth */}
        <Line x1="50" y1="15" x2="35" y2="25" />
        <Line x1="50" y1="15" x2="65" y2="25" />
        <Line x1="35" y1="25" x2="65" y2="25" />
        <Line x1="35" y1="25" x2="50" y2="35" />
        <Line x1="65" y1="25" x2="50" y2="35" />
        <Line x1="50" y1="35" x2="25" y2="45" />
        <Line x1="50" y1="35" x2="75" y2="45" />
        <Line x1="25" y1="45" x2="75" y2="45" />
        <Line x1="25" y1="45" x2="50" y2="55" />
        <Line x1="75" y1="45" x2="50" y2="55" />
        <Line x1="50" y1="55" x2="35" y2="70" />
        <Line x1="50" y1="55" x2="65" y2="70" />
        <Line x1="35" y1="70" x2="65" y2="70" />
        <Line x1="35" y1="70" x2="50" y2="85" />
        <Line x1="65" y1="70" x2="50" y2="85" />
      </G>
    </Svg>
  );
};

// Merkabah (Star Tetrahedron)
export const Merkabah: React.FC<SacredGeometryProps> = ({ 
  size = 40, 
  color = 'rgba(255,255,255,0.6)', 
  strokeWidth = 1 
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <G stroke={color} strokeWidth={strokeWidth} fill="none">
        {/* Upward triangle */}
        <Polygon points="50,20 20,70 80,70" />
        {/* Downward triangle */}
        <Polygon points="50,80 20,30 80,30" />
        {/* Inner lines */}
        <Line x1="50" y1="20" x2="50" y2="80" />
        <Line x1="20" y1="30" x2="80" y2="70" />
        <Line x1="80" y1="30" x2="20" y2="70" />
      </G>
    </Svg>
  );
};

// Flower of Life
export const FlowerOfLife: React.FC<SacredGeometryProps> = ({ 
  size = 40, 
  color = 'rgba(255,255,255,0.6)', 
  strokeWidth = 1 
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <G stroke={color} strokeWidth={strokeWidth} fill="none">
        {/* Outer circle */}
        <Circle cx="50" cy="50" r="40" />
        {/* Inner pattern - simplified version */}
        <Circle cx="50" cy="50" r="10" />
        <Circle cx="50" cy="35" r="10" />
        <Circle cx="62" cy="42.5" r="10" />
        <Circle cx="62" cy="57.5" r="10" />
        <Circle cx="50" cy="65" r="10" />
        <Circle cx="38" cy="57.5" r="10" />
        <Circle cx="38" cy="42.5" r="10" />
        {/* Second ring */}
        <Circle cx="50" cy="20" r="10" />
        <Circle cx="67" cy="27.5" r="10" />
        <Circle cx="74" cy="50" r="10" />
        <Circle cx="67" cy="72.5" r="10" />
        <Circle cx="50" cy="80" r="10" />
        <Circle cx="33" cy="72.5" r="10" />
        <Circle cx="26" cy="50" r="10" />
        <Circle cx="33" cy="27.5" r="10" />
      </G>
    </Svg>
  );
};

// Cubeoctahedron
export const Cubeoctahedron: React.FC<SacredGeometryProps> = ({ 
  size = 40, 
  color = 'rgba(255,255,255,0.6)', 
  strokeWidth = 1 
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <G stroke={color} strokeWidth={strokeWidth} fill="none">
        {/* Outer hexagon */}
        <Polygon points="50,15 75,30 75,70 50,85 25,70 25,30" />
        {/* Inner star pattern */}
        <Line x1="50" y1="15" x2="50" y2="85" />
        <Line x1="25" y1="30" x2="75" y2="70" />
        <Line x1="75" y1="30" x2="25" y2="70" />
        {/* Inner hexagon */}
        <Polygon points="50,35 65,42.5 65,57.5 50,65 35,57.5 35,42.5" />
        {/* Connecting lines */}
        <Line x1="50" y1="15" x2="35" y2="42.5" />
        <Line x1="50" y1="15" x2="65" y2="42.5" />
        <Line x1="75" y1="30" x2="65" y2="42.5" />
        <Line x1="75" y1="70" x2="65" y2="57.5" />
        <Line x1="50" y1="85" x2="65" y2="57.5" />
        <Line x1="50" y1="85" x2="35" y2="57.5" />
        <Line x1="25" y1="70" x2="35" y2="57.5" />
        <Line x1="25" y1="30" x2="35" y2="42.5" />
      </G>
    </Svg>
  );
};

// Vector Equilibrium
export const VectorEquilibrium: React.FC<SacredGeometryProps> = ({ 
  size = 40, 
  color = 'rgba(255,255,255,0.6)', 
  strokeWidth = 1 
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <G stroke={color} strokeWidth={strokeWidth} fill="none">
        {/* Outer circle */}
        <Circle cx="50" cy="50" r="40" />
        {/* Inner star pattern */}
        <Polygon points="50,20 70,35 70,65 50,80 30,65 30,35" />
        {/* Inner lines creating the equilibrium pattern */}
        <Line x1="50" y1="20" x2="50" y2="80" />
        <Line x1="30" y1="35" x2="70" y2="65" />
        <Line x1="70" y1="35" x2="30" y2="65" />
        {/* Center hexagon */}
        <Polygon points="50,35 60,42.5 60,57.5 50,65 40,57.5 40,42.5" />
        {/* Radiating lines */}
        <Line x1="50" y1="50" x2="50" y2="20" />
        <Line x1="50" y1="50" x2="70" y2="35" />
        <Line x1="50" y1="50" x2="70" y2="65" />
        <Line x1="50" y1="50" x2="50" y2="80" />
        <Line x1="50" y1="50" x2="30" y2="65" />
        <Line x1="50" y1="50" x2="30" y2="35" />
      </G>
    </Svg>
  );
};

// 64-Tetrahedron Grid (simplified)
export const TetrahedronGrid: React.FC<SacredGeometryProps> = ({ 
  size = 40, 
  color = 'rgba(255,255,255,0.6)', 
  strokeWidth = 1 
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <G stroke={color} strokeWidth={strokeWidth} fill="none">
        {/* Complex geometric grid - simplified representation */}
        <Circle cx="50" cy="50" r="35" />
        {/* Inner triangular grid */}
        <Polygon points="50,25 70,60 30,60" />
        <Polygon points="50,75 30,40 70,40" />
        {/* Intersecting lines */}
        <Line x1="20" y1="50" x2="80" y2="50" />
        <Line x1="35" y1="25" x2="65" y2="75" />
        <Line x1="65" y1="25" x2="35" y2="75" />
        {/* Inner pattern */}
        <Circle cx="50" cy="50" r="15" />
        <Polygon points="50,40 58,55 42,55" />
        <Polygon points="50,60 42,45 58,45" />
      </G>
    </Svg>
  );
};

// Circle of Life - Pulsating breathing circle for sadness transformation
export const CircleOfLife: React.FC<SacredGeometryProps & { isActive?: boolean }> = ({ 
  size = 200, 
  color = 'rgba(255,255,255,0.8)', 
  strokeWidth = 2,
  isActive = false
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    if (isActive) {
      // Breathing animation - 4 seconds inhale, 4 seconds exhale
      const breathingAnimation = Animated.loop(
        Animated.sequence([
          // Inhale - expand
          Animated.parallel([
            Animated.timing(scaleAnim, {
              toValue: 1.3,
              duration: 4000,
              useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
              toValue: 0.9,
              duration: 4000,
              useNativeDriver: true,
            }),
          ]),
          // Exhale - contract
          Animated.parallel([
            Animated.timing(scaleAnim, {
              toValue: 0.8,
              duration: 4000,
              useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
              toValue: 0.4,
              duration: 4000,
              useNativeDriver: true,
            }),
          ]),
        ])
      );
      
      breathingAnimation.start();
      
      return () => {
        breathingAnimation.stop();
      };
    } else {
      // Reset to default state
      scaleAnim.setValue(1);
      opacityAnim.setValue(0.6);
    }
  }, [isActive, scaleAnim, opacityAnim]);

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        }}
      >
        <Svg width={size} height={size} viewBox="0 0 200 200">
          <G stroke={color} strokeWidth={strokeWidth} fill="none">
            {/* Outer circle - the cycle of life */}
            <Circle cx="100" cy="100" r="80" strokeOpacity="0.8" />

            {/* Inner circles representing the eternal cycle */}
            <Circle cx="100" cy="100" r="60" strokeOpacity="0.6" />
            <Circle cx="100" cy="100" r="40" strokeOpacity="0.4" />

            {/* Center breathing circle */}
            <Circle cx="100" cy="100" r="20" strokeOpacity="1" strokeWidth={strokeWidth * 1.5} />

            {/* Connecting lines showing the flow of life energy */}
            <Line x1="100" y1="20" x2="100" y2="40" strokeOpacity="0.5" />
            <Line x1="100" y1="160" x2="100" y2="180" strokeOpacity="0.5" />
            <Line x1="20" y1="100" x2="40" y2="100" strokeOpacity="0.5" />
            <Line x1="160" y1="100" x2="180" y2="100" strokeOpacity="0.5" />

            {/* Diagonal flow lines */}
            <Line x1="41.4" y1="41.4" x2="58.6" y2="58.6" strokeOpacity="0.3" />
            <Line x1="158.6" y1="41.4" x2="141.4" y2="58.6" strokeOpacity="0.3" />
            <Line x1="158.6" y1="158.6" x2="141.4" y2="141.4" strokeOpacity="0.3" />
            <Line x1="41.4" y1="158.6" x2="58.6" y2="141.4" strokeOpacity="0.3" />
          </G>
        </Svg>
      </Animated.View>
    </View>
  );
};

const geometryComponents = {
  eggOfLife: EggOfLife,
  fruitOfLife: FruitOfLife,
  metatronsCube: MetatronsCube,
  vesicaPiscis: VesicaPiscis,
  seedOfLife: SeedOfLife,
  sixPetalRosette: SixPetalRosette,
  treeOfLife: TreeOfLife,
  merkabah: Merkabah,
  flowerOfLife: FlowerOfLife,
  cubeoctahedron: Cubeoctahedron,
  vectorEquilibrium: VectorEquilibrium,
  tetrahedronGrid: TetrahedronGrid,
  circleOfLife: CircleOfLife,
};

type GeometryType = keyof typeof geometryComponents;

interface DefaultSacredGeometryProps extends SacredGeometryProps {
  type: GeometryType;
  animated?: boolean;
  opacity?: number;
  [key: string]: any;
}

const SacredGeometry: React.FC<DefaultSacredGeometryProps> = ({
  type,
  animated = false,
  opacity = 1,
  size,
  color,
  ...rest
}) => {
  const Component = geometryComponents[type] || FlowerOfLife;
  const Wrapper: React.ComponentType<any> = animated ? Animated.View : View;

  return (
    <Wrapper style={{ opacity }}>
      <Component size={size} color={color} {...rest} />
    </Wrapper>
  );
};

export default SacredGeometry;
