import React from 'react';
import { GeometryConfig } from '@/types/session';
import MandalaGeometry from './MandalaGeometry';
import FlowerGeometry from './FlowerGeometry';
import SpiralGeometry from './SpiralGeometry';
import TriangleGeometry from './TriangleGeometry';
import HexagonGeometry from './HexagonGeometry';
import StarGeometry from './StarGeometry';
import LotusGeometry from './LotusGeometry';
import MerkabaGeometry from './MerkabaGeometry';
import SriYantraGeometry from './SriYantraGeometry';

interface SacredGeometryRendererProps {
  geometry: GeometryConfig;
  rotationSpeed?: number;
  pulseIntensity?: number;
  colors?: string[];
  size?: number;
}

const components = {
  mandala: MandalaGeometry,
  flower: FlowerGeometry,
  spiral: SpiralGeometry,
  triangle: TriangleGeometry,
  hexagon: HexagonGeometry,
  star: StarGeometry,
  lotus: LotusGeometry,
  merkaba: MerkabaGeometry,
  sri_yantra: SriYantraGeometry,
} as const;

const SacredGeometryRenderer: React.FC<SacredGeometryRendererProps> = ({
  geometry,
  rotationSpeed,
  pulseIntensity,
  colors,
  size,
}) => {
  const Component = components[geometry.type];
  if (!Component) return null;
  return (
    <Component
      geometry={geometry}
      rotationSpeed={rotationSpeed}
      pulseIntensity={pulseIntensity}
      colors={colors}
      size={size}
    />
  );
};

export default SacredGeometryRenderer;
