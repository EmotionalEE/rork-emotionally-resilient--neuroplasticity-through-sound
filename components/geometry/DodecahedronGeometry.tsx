import React from 'react';
import Svg, { Polygon, Line } from 'react-native-svg';

interface DodecahedronGeometryProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

const DodecahedronGeometry: React.FC<DodecahedronGeometryProps> = ({
  size = 100,
  color = 'rgba(255,255,255,0.8)',
  strokeWidth = 1,
}) => {
  const center = 50;
  const radius = 40;
  const points = Array.from({ length: 12 }, (_, i) => {
    const angle = (i / 12) * 2 * Math.PI - Math.PI / 2;
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    return `${x},${y}`;
  }).join(' ');

  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Polygon points={points} stroke={color} strokeWidth={strokeWidth} fill="none" />
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * 2 * Math.PI - Math.PI / 2;
        const x = center + radius * Math.cos(angle);
        const y = center + radius * Math.sin(angle);
        return (
          <Line
            key={i}
            x1={center}
            y1={center}
            x2={x}
            y2={y}
            stroke={color}
            strokeWidth={strokeWidth}
          />
        );
      })}
    </Svg>
  );
};

export default DodecahedronGeometry;
