import React from 'react';
import Svg, { Polygon } from 'react-native-svg';
import AnimatedGeometry from './AnimatedGeometry';
import { GeometryConfig } from '@/types/session';

interface StarGeometryProps {
  geometry: GeometryConfig;
  rotationSpeed?: number;
  pulseIntensity?: number;
  colors?: string[];
  size?: number;
}

const StarGeometry: React.FC<StarGeometryProps> = ({
  geometry,
  rotationSpeed,
  pulseIntensity,
  colors,
  size = 200,
}) => {
  const rot = rotationSpeed ?? geometry.rotationSpeed;
  const pulse = pulseIntensity ?? geometry.pulseIntensity;
  const palette = colors ?? geometry.colors;
  const outer = 40;
  const inner = 15;
  const points = Array.from({ length: geometry.elements * 2 })
    .map((_, i) => {
      const angle = (Math.PI / geometry.elements) * i;
      const r = i % 2 === 0 ? outer : inner;
      const x = 50 + r * Math.sin(angle);
      const y = 50 - r * Math.cos(angle);
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

export default StarGeometry;
