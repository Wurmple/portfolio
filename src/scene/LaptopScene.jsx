import React, { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';
import { Suspense } from 'react';

function LaptopModel() {
  const [hovered, setHovered] = useState(false);
  const [isFacingUser, setIsFacingUser] = useState(false);
  const sceneRef = useRef();
  const { scene } = useGLTF('laptop.glb');

  useFrame(() => {
    if (sceneRef.current) {
      if (isFacingUser) {
        sceneRef.current.rotation.y = 0;
      } else {
        const time = Date.now() * 0.001;
        sceneRef.current.rotation.y = Math.sin(time) * (Math.PI / 4);
      }
    }
  });

  const handleClick = () => {
    setIsFacingUser(true);
    setTimeout(() => setIsFacingUser(false), 3000);
  };

  const handlePointerOver = () => setHovered(true);
  const handlePointerOut = () => setHovered(false);

  return (
    <group
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
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
    <div className='h-screen'>
      <Canvas camera={{ position: [0, 4, 13], fov: 45 }} gl={{ antialias: true }}>
        <ambientLight intensity={2} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} />
        <Suspense fallback={null}>
          <LaptopModel />
        </Suspense>
        {/* <OrbitControls /> */}
      </Canvas>
    </div>
  );
}