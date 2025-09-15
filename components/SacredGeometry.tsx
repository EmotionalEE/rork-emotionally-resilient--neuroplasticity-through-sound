import React, { useEffect, useRef } from "react";
import { Animated, View } from "react-native";
import Svg, { Circle, Path, Line, Polygon, G } from "react-native-svg";

interface SacredGeometryProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

// Egg of Life
export const EggOfLife: React.FC<SacredGeometryProps> = ({
  size = 40,
  color = "rgba(255,255,255,0.6)",
  strokeWidth = 1,
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
  color = "rgba(255,255,255,0.6)",
  strokeWidth = 1,
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
  color = "rgba(255,255,255,0.6)",
  strokeWidth = 1,
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
  color = "rgba(255,255,255,0.6)",
  strokeWidth = 1,
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
  color = "rgba(255,255,255,0.6)",
  strokeWidth = 1,
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
  color = "rgba(255,255,255,0.6)",
  strokeWidth = 1,
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
  color = "rgba(255,255,255,0.6)",
  strokeWidth = 1,
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
  color = "rgba(255,255,255,0.6)",
  strokeWidth = 1,
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
  color = "rgba(255,255,255,0.6)",
  strokeWidth = 1,
}) => {
  const viewBoxSize = 100;
  const center = viewBoxSize / 2;
  const outerRadius = 40;
  const circleRadius = 12;
  const latticeRadius = 2;
  const sqrt3Over2 = Math.sqrt(3) / 2;

  type CirclePosition = { cx: number; cy: number; ring: number };

  const circles: CirclePosition[] = [
    {
      cx: center,
      cy: center,
      ring: 0,
    },
  ];

  for (let q = -latticeRadius; q <= latticeRadius; q += 1) {
    for (let r = -latticeRadius; r <= latticeRadius; r += 1) {
      const s = -q - r;
      const hexDistance = Math.max(Math.abs(q), Math.abs(r), Math.abs(s));

      if (hexDistance === 0 || hexDistance > latticeRadius) {
        continue;
      }

      const cx = center + circleRadius * (q + r / 2);
      const cy = center + circleRadius * sqrt3Over2 * r;

      circles.push({
        cx,
        cy,
        ring: hexDistance,
      });
    }
  }

  const sortedCircles = [...circles].sort((a, b) => {
    if (a.ring !== b.ring) {
      return a.ring - b.ring;
    }

    const angleA = Math.atan2(a.cy - center, a.cx - center);
    const angleB = Math.atan2(b.cy - center, b.cx - center);

    return angleA - angleB;
  });

  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <G stroke={color} strokeWidth={strokeWidth} fill="none">
        {/* Outer circle */}
        <Circle cx={center} cy={center} r={outerRadius} />
        {/* Flower of Life lattice */}
        {sortedCircles.map(({ cx, cy }, index) => (
          <Circle key={`${index}-${cx}-${cy}`} cx={cx} cy={cy} r={circleRadius} />
        ))}
      </G>
    </Svg>
  );
};

// Cubeoctahedron
export const Cubeoctahedron: React.FC<SacredGeometryProps> = ({
  size = 40,
  color = "rgba(255,255,255,0.6)",
  strokeWidth = 1,
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
  color = "rgba(255,255,255,0.6)",
  strokeWidth = 1,
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
  color = "rgba(255,255,255,0.6)",
  strokeWidth = 1,
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

// Sri Yantra
export const SriYantra: React.FC<SacredGeometryProps> = ({
  size = 40,
  color = "rgba(255,255,255,0.6)",
  strokeWidth = 1,
}) => {
  const viewBoxSize = 100;
  const center = viewBoxSize / 2;
  const outerRadius = 45;
  const sqrtThreeOverTwo = Math.sqrt(3) / 2;

  const formatPoints = (points: { x: number; y: number }[]) =>
    points.map(({ x, y }) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" ");

  const createTrianglePoints = (orientation: "up" | "down", scale: number) => {
    const radius = outerRadius * scale;

    if (orientation === "up") {
      return formatPoints([
        { x: center, y: center - radius },
        { x: center + sqrtThreeOverTwo * radius, y: center + radius / 2 },
        { x: center - sqrtThreeOverTwo * radius, y: center + radius / 2 },
      ]);
    }

    return formatPoints([
      { x: center, y: center + radius },
      { x: center + sqrtThreeOverTwo * radius, y: center - radius / 2 },
      { x: center - sqrtThreeOverTwo * radius, y: center - radius / 2 },
    ]);
  };

  const upwardTriangles = [1, 0.82, 0.64, 0.4];
  const downwardTriangles = [0.94, 0.74, 0.56, 0.36, 0.18];

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}>
      <G stroke={color} strokeWidth={strokeWidth} fill="none">
        <Circle cx={center} cy={center} r={outerRadius} />
        {/* Upward-pointing triangles */}
        {upwardTriangles.map((scale, index) => (
          <Polygon key={`up-${index}`} points={createTrianglePoints("up", scale)} />
        ))}
        {/* Downward-pointing triangles */}
        {downwardTriangles.map((scale, index) => (
          <Polygon key={`down-${index}`} points={createTrianglePoints("down", scale)} />
        ))}
      </G>
    </Svg>
  );
};

// Golden Spiral (simplified)
export const GoldenSpiral: React.FC<SacredGeometryProps> = ({
  size = 40,
  color = "rgba(255,255,255,0.6)",
  strokeWidth = 1,
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <G stroke={color} strokeWidth={strokeWidth} fill="none">
        <Path
          d="M50 5
             A45 45 0 0 1 95 50
             A45 45 0 0 1 50 95
             A28 28 0 0 0 22 67
             A17 17 0 0 1 39 50
             A11 11 0 0 0 28 39
             A7 7 0 0 1 35 32
             A4 4 0 0 0 31 28"
        />
      </G>
    </Svg>
  );
};

// Circle of Life - Pulsating breathing circle for sadness transformation
export const CircleOfLife: React.FC<
  SacredGeometryProps & { isActive?: boolean }
> = ({
  size = 200,
  color = "rgba(255,255,255,0.8)",
  strokeWidth = 2,
  isActive = false,
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
        ]),
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
    <View style={{ alignItems: "center", justifyContent: "center" }}>
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
            <Circle
              cx="100"
              cy="100"
              r="20"
              strokeOpacity="1"
              strokeWidth={strokeWidth * 1.5}
            />

            {/* Connecting lines showing the flow of life energy */}
            <Line x1="100" y1="20" x2="100" y2="40" strokeOpacity="0.5" />
            <Line x1="100" y1="160" x2="100" y2="180" strokeOpacity="0.5" />
            <Line x1="20" y1="100" x2="40" y2="100" strokeOpacity="0.5" />
            <Line x1="160" y1="100" x2="180" y2="100" strokeOpacity="0.5" />

            {/* Diagonal flow lines */}
            <Line x1="41.4" y1="41.4" x2="58.6" y2="58.6" strokeOpacity="0.3" />
            <Line
              x1="158.6"
              y1="41.4"
              x2="141.4"
              y2="58.6"
              strokeOpacity="0.3"
            />
            <Line
              x1="158.6"
              y1="158.6"
              x2="141.4"
              y2="141.4"
              strokeOpacity="0.3"
            />
            <Line
              x1="41.4"
              y1="158.6"
              x2="58.6"
              y2="141.4"
              strokeOpacity="0.3"
            />
          </G>
        </Svg>
      </Animated.View>
    </View>
  );
};

// Default SacredGeometry wrapper placed after all individual components
interface SacredGeometryWrapperProps extends SacredGeometryProps {
  type:
    | "flowerOfLife"
    | "metatronsCube"
    | "sriYantra"
    | "vesicaPiscis"
    | "goldenSpiral"
    | "circleOfLife";
  animated?: boolean;
  opacity?: number;
  /** Optional flag for CircleOfLife breathing animation */
  isActive?: boolean;
  /** Enable pulsing animation that syncs with music */
  pulse?: boolean;
  /** Frequency for pulse animation (in Hz) */
  frequency?: number;
}

const SacredGeometry: React.FC<SacredGeometryWrapperProps> = ({
  type,
  size = 40,
  color = "rgba(255,255,255,0.6)",
  strokeWidth = 1,
  animated = false,
  opacity = 1,
  isActive = false,
  pulse = false,
  frequency = 440,
}) => {
  const rotationAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (animated) {
      const loop = Animated.loop(
        Animated.timing(rotationAnim, {
          toValue: 1,
          duration: 20000,
          useNativeDriver: true,
        }),
      );
      loop.start();
      return () => loop.stop();
    }
  }, [animated, rotationAnim]);

  useEffect(() => {
    if (pulse) {
      // Calculate pulse duration based on frequency
      // Higher frequency = faster pulse, lower frequency = slower pulse
      const baseDuration = 2000; // 2 seconds base
      const pulseDuration = Math.max(800, Math.min(3000, baseDuration - (frequency - 440) * 2));
      
      const pulseLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.3,
            duration: pulseDuration / 2,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0.8,
            duration: pulseDuration / 2,
            useNativeDriver: true,
          }),
        ]),
      );
      pulseLoop.start();
      return () => pulseLoop.stop();
    } else {
      // Reset pulse animation
      pulseAnim.setValue(1);
    }
  }, [pulse, frequency, pulseAnim]);

  const rotation = rotationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const pulseScale = pulseAnim.interpolate({
    inputRange: [0.8, 1, 1.3],
    outputRange: [0.8, 1, 1.3],
    extrapolate: 'clamp',
  });

  let GeometryComponent: React.FC<any> = FlowerOfLife;
  let componentProps: any = { size, color, strokeWidth };

  switch (type) {
    case "metatronsCube":
      GeometryComponent = MetatronsCube;
      break;
    case "vesicaPiscis":
      GeometryComponent = VesicaPiscis;
      break;
    case "sriYantra":
      GeometryComponent = SriYantra;
      break;
    case "goldenSpiral":
      GeometryComponent = GoldenSpiral;
      break;
    case "circleOfLife":
      GeometryComponent = CircleOfLife;
      componentProps = { ...componentProps, isActive };
      break;
    case "flowerOfLife":
    default:
      GeometryComponent = FlowerOfLife;
  }

  const content = <GeometryComponent {...componentProps} />;

  const transforms = [];
  if (animated) {
    transforms.push({ rotate: rotation });
  }
  if (pulse) {
    transforms.push({ scale: pulseScale });
  }

  if (transforms.length > 0) {
    return (
      <Animated.View style={{ transform: transforms, opacity }}>
        {content}
      </Animated.View>
    );
  }

  return <View style={{ opacity }}>{content}</View>;
};

export default SacredGeometry;
