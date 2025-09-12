import React from 'react';
import Svg, { Path } from 'react-native-svg';
import AnimatedGeometry from './AnimatedGeometry';
import { GeometryConfig } from '@/types/session';

interface LotusGeometryProps {
  geometry: GeometryConfig;
  rotationSpeed?: number;
  pulseIntensity?: number;
  colors?: string[];
  size?: number;
}

const LotusGeometry: React.FC<LotusGeometryProps> = ({
  geometry,
  rotationSpeed,
  pulseIntensity,
  colors,
  size = 200,
}) => {
  const rot = rotationSpeed ?? geometry.rotationSpeed;
  const pulse = pulseIntensity ?? geometry.pulseIntensity;
  const palette = colors ?? geometry.colors;
  const petalPath = 'M50 15 C60 40 60 60 50 85 C40 60 40 40 50 15';

  return (
    <AnimatedGeometry rotationSpeed={rot} pulseIntensity={pulse}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        {Array.from({ length: geometry.elements }).map((_, i) => (
          <Path
            key={i}
            d={petalPath}
            stroke={palette[i % palette.length] || '#fff'}
            strokeWidth={1}
            fill="none"
            transform={`rotate(${(360 / geometry.elements) * i},50,50)`}
          />
        ))}
      </Svg>
    </AnimatedGeometry>
  );
};

export default LotusGeometry;
