import React from 'react';
import Svg, { Polygon } from 'react-native-svg';
import AnimatedGeometry from './AnimatedGeometry';
import { GeometryConfig } from '@/types/session';

interface TriangleGeometryProps {
  geometry: GeometryConfig;
  rotationSpeed?: number;
  pulseIntensity?: number;
  colors?: string[];
  size?: number;
}

const TriangleGeometry: React.FC<TriangleGeometryProps> = ({
  geometry,
  rotationSpeed,
  pulseIntensity,
  colors,
  size = 200,
}) => {
  const rot = rotationSpeed ?? geometry.rotationSpeed;
  const pulse = pulseIntensity ?? geometry.pulseIntensity;
  const palette = colors ?? geometry.colors;
  const points = `${size / 2},0 ${size},${size} 0,${size}`;

  return (
    <AnimatedGeometry rotationSpeed={rot} pulseIntensity={pulse}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Polygon points={points} stroke={palette[0] || '#fff'} strokeWidth={2} fill="none" />
      </Svg>
    </AnimatedGeometry>
  );
};

export default TriangleGeometry;
