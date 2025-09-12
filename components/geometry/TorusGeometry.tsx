import React from 'react';
import Svg, { Circle } from 'react-native-svg';

interface TorusGeometryProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

const TorusGeometry: React.FC<TorusGeometryProps> = ({
  size = 100,
  color = 'rgba(255,255,255,0.8)',
  strokeWidth = 8,
}) => {
  // Draw a simple torus as a thick ring
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Circle
        cx="50"
        cy="50"
        r={40}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
      />
    </Svg>
  );
};

export default TorusGeometry;
