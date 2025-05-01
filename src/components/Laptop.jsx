import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useState, useRef } from 'react';
import { useSpring, a } from '@react-spring/three';

export default function Laptop({ position }) {
  const { scene } = useGLTF(
    'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/macbook/model.gltf'
  );
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef();
  const { scale } = useSpring({ scale: hovered ? 1.1 : 1 });

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <a.primitive
      ref={meshRef}
      object={scene}
      position={position}
      scale={scale}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    />
  );
}