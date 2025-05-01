import { Text } from '@react-three/drei';
import { useState } from 'react';
import { useSpring, a } from '@react-spring/three';

export default function ExperienceCard({ position, data, onSelect }) {
  const [hovered, setHovered] = useState(false);
  const { scale, rotation } = useSpring({
    scale: hovered ? 1.1 : 1,
    rotation: hovered ? [0, 0, 0.1] : [0, 0, 0],
  });

  return (
    <a.mesh
      position={position}
      scale={scale}
      rotation={rotation}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={() => onSelect(data)}
    >
      <planeGeometry args={[3, 2]} />
      <meshStandardMaterial color="#3B82F6" />
      <Text position={[0, 0.5, 0.1]} fontSize={0.2} color="white">
        {data.title}
      </Text>
      <Text position={[0, 0, 0.1]} fontSize={0.15} color="white">
        {data.company}
      </Text>
    </a.mesh>
  );
}