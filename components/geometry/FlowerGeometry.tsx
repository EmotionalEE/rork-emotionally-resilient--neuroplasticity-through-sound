import React from 'react';
import Svg, { Circle } from 'react-native-svg';
import AnimatedGeometry from './AnimatedGeometry';
import { GeometryConfig } from '@/types/session';

interface FlowerGeometryProps {
  geometry: GeometryConfig;
  rotationSpeed?: number;
  pulseIntensity?: number;
  colors?: string[];
  size?: number;
}

const FlowerGeometry: React.FC<FlowerGeometryProps> = ({
  geometry,
  rotationSpeed,
  pulseIntensity,
  colors,
  size = 200,
}) => {
  const rot = rotationSpeed ?? geometry.rotationSpeed;
  const pulse = pulseIntensity ?? geometry.pulseIntensity;
  const palette = colors ?? geometry.colors;

  return (
    <AnimatedGeometry rotationSpeed={rot} pulseIntensity={pulse}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Circle cx="50" cy="50" r="15" stroke={palette[0] || '#fff'} strokeWidth={1} fill="none" />
        {Array.from({ length: geometry.elements }).map((_, i) => (
          <Circle
            key={i}
            cx="50"
            cy="20"
            r="15"
            stroke={palette[(i + 1) % palette.length] || '#fff'}
            strokeWidth={1}
            fill="none"
            transform={`rotate(${(360 / geometry.elements) * i},50,50)`}
          />
        ))}
      </Svg>
    </AnimatedGeometry>
  );
};

export default FlowerGeometry;
