import React from 'react';
import Svg, { Polygon, Circle } from 'react-native-svg';
import AnimatedGeometry from './AnimatedGeometry';
import { GeometryConfig } from '@/types/session';

interface SriYantraGeometryProps {
  geometry: GeometryConfig;
  rotationSpeed?: number;
  pulseIntensity?: number;
  colors?: string[];
  size?: number;
}

const SriYantraGeometry: React.FC<SriYantraGeometryProps> = ({
  geometry,
  rotationSpeed,
  pulseIntensity,
  colors,
  size = 200,
}) => {
  const rot = rotationSpeed ?? geometry.rotationSpeed;
  const pulse = pulseIntensity ?? geometry.pulseIntensity;
  const palette = colors ?? geometry.colors;

  const up = '50,10 90,80 10,80';
  const down = '50,90 90,20 10,20';

  return (
    <AnimatedGeometry rotationSpeed={rot} pulseIntensity={pulse}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Circle cx="50" cy="50" r="5" fill={palette[2] || palette[0] || '#fff'} />
        <Polygon points={up} stroke={palette[0] || '#fff'} strokeWidth={1} fill="none" />
        <Polygon points={down} stroke={palette[1] || palette[0] || '#fff'} strokeWidth={1} fill="none" />
      </Svg>
    </AnimatedGeometry>
  );
};

export default SriYantraGeometry;
