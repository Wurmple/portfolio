import React, { useEffect, useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import flash from '../assets/flash.svg';
import pulse from '../assets/pulse.svg';
import ball from '../assets/ball.svg';

const projects = [
  {
    title: 'PulseConnect: AI-Powered Meeting Room Web App',
    period: 'Dec 2024 – Jan 2025',
    highlights: [
      'Built full-stack platform using React/TypeScript, Node.js, and MongoDB with WebRTC for real-time video/audio streaming',
      'Implemented AI gesture detection (TensorFlow.js), speech-to-text transcription, and Docker containerization'
    ],
    imageUrl: pulse
  },
  {
    title: 'WattWise: Energy Management System',
    period: 'Feb 2024 – May 2024',
    highlights: [
      'Developed Django/React web application with JWT authentication and real-time energy consumption tracking',
      'Created interactive dashboards using Chart.js and implemented data analysis tools with Pandas for trend analysis'
    ],
    imageUrl: flash
  },
  {
    title: 'T20 World Cup Data Analysis',
    period: 'Nov 2023 – Dec 2023',
    highlights: [
      'Built ETL pipeline using Python/Pandas for cricket match data, implementing web scraping and normalized database schema',
      'Developed interactive Excel dashboard using pivot tables and VBA macros for comprehensive cricket analytics'
    ],
    imageUrl: ball
  }
];

function Card({ position, title, imageUrl, period, highlights, rotationSpeed, scaleSpeed, zOffset, onClick }) {
  const [texture, setTexture] = useState(null);
  const meshRef = useRef();
  const [isHovered, setIsHovered] = useState(false);
  const initialRotation = useRef([0, (Math.random() - 0.5) * 0.2, 0]); // Minimal Y-axis rotation

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();

    // Idle animations
    if (!isHovered) {
      // Scale pulse
      const scale = 1 + Math.sin(time * scaleSpeed) * 0.05;
      meshRef.current.scale.set(scale, scale, scale);

      // Controlled wobble (Y-axis only)
      meshRef.current.rotation.y = initialRotation.current[1] + Math.sin(time * rotationSpeed.y) * 0.05;

      // Position reset
      meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, zOffset, 0.1);
    } else {
      // Hover effects
      meshRef.current.scale.lerp(new THREE.Vector3(1.15, 1.15, 1.15), 0.1);
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, 0, 0.1);
      meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, zOffset + 0.3, 0.1);
    }

    // Material effects
    meshRef.current.material.emissiveIntensity = THREE.MathUtils.lerp(
      meshRef.current.material.emissiveIntensity,
      isHovered ? 0.4 : 0,
      0.1
    );
  });

  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 768;
    const ctx = canvas.getContext('2d');

    // Draw border
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 10; // Thicker for neobrutalism
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    // Draw background
    ctx.fillStyle = '#F5F5F5'; // Slightly off-white for contrast
    ctx.fillRect(5, 5, canvas.width - 10, canvas.height - 10);

    // Draw title
    ctx.textAlign = 'center';
    ctx.fillStyle = 'black';
    ctx.font = '900 36px Impact, Oswald, sans-serif';
    const maxWidth = canvas.width - 50;
    const lineHeight = 40;
    const words = title.split(' ');
    let lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = ctx.measureText(currentLine + ' ' + word).width;
      if (width < maxWidth) {
        currentLine += ' ' + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);

    lines.forEach((line, i) => {
      ctx.fillText(line, canvas.width / 2, 70 + (i * lineHeight));
    });

    // Draw image
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const imgSize = 300;
      const x = (canvas.width - imgSize) / 2;
      const y = (canvas.height - imgSize) / 2;

      // White background with black border for image
      const padding = 10;
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(x - padding, y - padding, imgSize + 2 * padding, imgSize + 2 * padding);
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 5;
      ctx.strokeRect(x - padding, y - padding, imgSize + 2 * padding, imgSize + 2 * padding);

      ctx.drawImage(img, x, y, imgSize, imgSize);
      const texture = new THREE.Texture(canvas);
      texture.needsUpdate = true;
      setTexture(texture);
    };
    img.onerror = () => {
      console.warn(`Failed to load image: ${imageUrl}`);
      const texture = new THREE.Texture(canvas);
      texture.needsUpdate = true;
      setTexture(texture);
    };
    img.src = imageUrl;

    return () => {
      if (texture) texture.dispose();
    };
  }, [title, imageUrl]);

  return texture ? (
    <mesh
      ref={meshRef}
      position={[position[0], position[1], zOffset]}
      rotation={initialRotation.current}
      onPointerOver={() => setIsHovered(true)}
      onPointerOut={() => setIsHovered(false)}
      onClick={() => onClick({ title, period, highlights, imageUrl })}
    >
      <boxGeometry args={[1, 1.5, 0.02]} />
      <meshStandardMaterial 
        map={texture} 
        emissive={new THREE.Color(0xffffff)}
        toneMapped={false}
      />
    </mesh>
  ) : null;
}

function CardsRow({ cardsData, onCardClick }) {
  const spacing = 2;
  const startX = -((cardsData.length - 1) * spacing) / 2;

  return (
    <group>
      {cardsData.map((data, i) => {
        const rotationSpeed = { x: 0, y: 0.3, z: 0 }; // Wobble on Y-axis only
        const scaleSpeed = 0.5; // Consistent scale speed
        const zOffset = 0; // Flat z-plane for simplicity

        return (
          <Card
            key={i}
            position={[startX + i * spacing, 0, zOffset]}
            title={data.title}
            imageUrl={data.imageUrl}
            period={data.period}
            highlights={data.highlights}
            rotationSpeed={rotationSpeed}
            scaleSpeed={scaleSpeed}
            zOffset={zOffset}
            onClick={onCardClick}
          />
        );
      })}
      <Text
        position={[0, 1.5, 0]}
        fontSize={0.5}
        color="#000000"
        anchorX="center"
        anchorY="middle"
      >
        Projects Showcase
      </Text>
    </group>
  );
}

const ProjectsScene = ({ id }) => {
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <div id={id} className='relative h-[91vh] w-screen border-b-4 border-black bg-lime-200'>
      <Canvas camera={{ position: [0, 0, 3], fov: 75 }} className="h-screen w-screen" gl={{ antialias: true }}>
        <ambientLight intensity={1} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} />
        <CardsRow cardsData={projects} onCardClick={setSelectedProject} />
        {/* <OrbitControls enableRotate={false} enableZoom={true} enablePan={true} minDistance={2} maxDistance={5} /> */}
      </Canvas>
      {selectedProject && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="bg-white border-4 border-black shadow-[8px_8px_0_0_#000] p-6 w-3/4 max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={selectedProject.imageUrl} alt={selectedProject.title} className="w-full h-48 object-contain mb-4" />
            <h2 className="text-3xl font-bold mb-2">{selectedProject.title}</h2>
            <p className="text-lg mb-1">{selectedProject.period}</p>
            <ul className="list-disc list-inside">
              {selectedProject.highlights.map((highlight, index) => (
                <li key={index} className="text-base mb-1">{highlight}</li>
              ))}
            </ul>
            <button
              onClick={() => setSelectedProject(null)}
              className="mt-4 px-4 py-2 bg-black text-white font-bold border-2 border-black hover:bg-white hover:text-black transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsScene;