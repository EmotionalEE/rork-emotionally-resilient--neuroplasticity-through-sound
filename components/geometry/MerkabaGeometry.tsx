import React from 'react';
import Svg, { Polygon } from 'react-native-svg';
import AnimatedGeometry from './AnimatedGeometry';
import { GeometryConfig } from '@/types/session';

interface MerkabaGeometryProps {
  geometry: GeometryConfig;
  rotationSpeed?: number;
  pulseIntensity?: number;
  colors?: string[];
  size?: number;
}

const MerkabaGeometry: React.FC<MerkabaGeometryProps> = ({
  geometry,
  rotationSpeed,
  pulseIntensity,
  colors,
  size = 200,
}) => {
  const rot = rotationSpeed ?? geometry.rotationSpeed;
  const pulse = pulseIntensity ?? geometry.pulseIntensity;
  const palette = colors ?? geometry.colors;
  const up = '50,15 90,85 10,85';
  const down = '50,85 90,15 10,15';

  return (
    <AnimatedGeometry rotationSpeed={rot} pulseIntensity={pulse}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Polygon points={up} stroke={palette[0] || '#fff'} strokeWidth={1} fill="none" />
        <Polygon points={down} stroke={palette[1] || palette[0] || '#fff'} strokeWidth={1} fill="none" />
      </Svg>
    </AnimatedGeometry>
  );
};

export default MerkabaGeometry;
