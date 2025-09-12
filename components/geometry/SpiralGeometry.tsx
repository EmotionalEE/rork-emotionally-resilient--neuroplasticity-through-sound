import React from 'react';
import Svg, { Path } from 'react-native-svg';
import AnimatedGeometry from './AnimatedGeometry';
import { GeometryConfig } from '@/types/session';

interface SpiralGeometryProps {
  geometry: GeometryConfig;
  rotationSpeed?: number;
  pulseIntensity?: number;
  colors?: string[];
  size?: number;
}

const SpiralGeometry: React.FC<SpiralGeometryProps> = ({
  geometry,
  rotationSpeed,
  pulseIntensity,
  colors,
  size = 200,
}) => {
  const rot = rotationSpeed ?? geometry.rotationSpeed;
  const pulse = pulseIntensity ?? geometry.pulseIntensity;
  const palette = colors ?? geometry.colors;
  const path = 'M50 50 m0 -40 a40 40 0 1 1 -40 40 a30 30 0 1 0 30 -30 a20 20 0 1 1 -20 20 a10 10 0 1 0 10 -10';

  return (
    <AnimatedGeometry rotationSpeed={rot} pulseIntensity={pulse}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Path d={path} stroke={palette[0] || '#fff'} strokeWidth={2} fill="none" />
      </Svg>
    </AnimatedGeometry>
  );
};

export default SpiralGeometry;
