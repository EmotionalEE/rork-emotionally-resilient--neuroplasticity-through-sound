import React from 'react';
import Svg, { Polygon } from 'react-native-svg';
import AnimatedGeometry from './AnimatedGeometry';
import { GeometryConfig } from '@/types/session';

interface HexagonGeometryProps {
  geometry: GeometryConfig;
  rotationSpeed?: number;
  pulseIntensity?: number;
  colors?: string[];
  size?: number;
}

const HexagonGeometry: React.FC<HexagonGeometryProps> = ({
  geometry,
  rotationSpeed,
  pulseIntensity,
  colors,
  size = 200,
}) => {
  const rot = rotationSpeed ?? geometry.rotationSpeed;
  const pulse = pulseIntensity ?? geometry.pulseIntensity;
  const palette = colors ?? geometry.colors;
  const radius = 40;
  const points = Array.from({ length: 6 })
    .map((_, i) => {
      const angle = (Math.PI / 3) * i;
      const x = 50 + radius * Math.cos(angle);
      const y = 50 + radius * Math.sin(angle);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <AnimatedGeometry rotationSpeed={rot} pulseIntensity={pulse}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Polygon points={points} stroke={palette[0] || '#fff'} strokeWidth={2} fill="none" />
      </Svg>
    </AnimatedGeometry>
  );
};

export default HexagonGeometry;
