import { useState, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { Suspense } from 'react';

const baseUrl = import.meta.env.BASE_URL || '/';

function LaptopModel() {
  const [hovered, setHovered] = useState(false);
  const [isFacingUser, setIsFacingUser] = useState(false);
  const sceneRef = useRef();
  const { scene } = useGLTF(`${baseUrl}laptop.glb`);

  useFrame(() => {
    if (!sceneRef.current) return;
    if (isFacingUser) {
      sceneRef.current.rotation.y = THREE.MathUtils.lerp(sceneRef.current.rotation.y, 0, 0.05);
    } else {
      sceneRef.current.rotation.y = Math.sin(Date.now() * 0.0007) * 0.18;
    }
  });

  const handleClick = () => {
    setIsFacingUser(true);
    setTimeout(() => setIsFacingUser(false), 3000);
  };

  return (
    <group
      onClick={handleClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <primitive
        object={scene}
        ref={sceneRef}
        scale={hovered ? [1.1, 1.1, 1.1] : [1, 1, 1]}
      />
    </group>
  );
}

export default function LaptopScene() {
  return (
    <div className="h-full w-full">
      <Canvas camera={{ position: [0, 4, 15], fov: 45 }} gl={{ antialias: true }}>
        <ambientLight intensity={2} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} />
        <Suspense fallback={null}>
          <LaptopModel />
        </Suspense>
      </Canvas>
    </div>
  );
}
