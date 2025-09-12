import React from 'react';
import Svg, { Line, Circle } from 'react-native-svg';
import AnimatedGeometry from './AnimatedGeometry';
import { GeometryConfig } from '@/types/session';

interface MandalaGeometryProps {
  geometry: GeometryConfig;
  rotationSpeed?: number;
  pulseIntensity?: number;
  colors?: string[];
  size?: number;
}

const MandalaGeometry: React.FC<MandalaGeometryProps> = ({
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
        {Array.from({ length: geometry.elements }).map((_, i) => (
          <Line
            key={i}
            x1="50"
            y1="50"
            x2="50"
            y2="5"
            stroke={palette[0] || '#fff'}
            strokeWidth={1}
            transform={`rotate(${(360 / geometry.elements) * i},50,50)`}
          />
        ))}
        <Circle cx="50" cy="50" r="10" stroke={palette[1] || palette[0] || '#fff'} strokeWidth={1} fill="none" />
      </Svg>
    </AnimatedGeometry>
  );
};

export default MandalaGeometry;
