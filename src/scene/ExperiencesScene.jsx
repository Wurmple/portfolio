import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';

const experiences = [
  {
    company: 'Piramal Group',
    role: 'Data Analyst Intern',
    period: 'July 2023 – Dec 2023',
    location: 'Mumbai, Maharashtra',
    color: new THREE.Color('#EF5350'),
    highlights: [
      'Analyzed sales/HR data with Python',
      'Developed automated reporting system',
      'Created interactive dashboards'
    ],
    imageUrl: 'piramal.svg'
  },
  {
    company: 'Germin8',
    role: 'Fullstack Engineer',
    period: 'July 2024 – Present',
    location: 'Panaji, Goa',
    color: new THREE.Color('#66BB6A'),
    highlights: [
      'Developed data enrichment microservice',
      'Built Voice Agent with React/GenAI',
      'Optimized cloud infrastructure'
    ],
    imageUrl: 'germin8.svg'
  }
];

function ExperienceCube({ position, exp, index, onClick }) {
  const meshRef = useRef();
  const [isHovered, setIsHovered] = useState(false);
  const initialY = useRef(position[1]);
  const frontColor = useMemo(() => new THREE.Color().copy(exp.color).multiplyScalar(1.2), [exp.color]);
  const [texture, setTexture] = useState(null);

  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = frontColor.getStyle();
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 20;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    drawText();

    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const centerX = canvas.width / 2;
      const centerY = 300;
      const maxSize = 500;
      const imgRatio = img.width / img.height;
      let drawWidth = imgRatio > 1 ? maxSize : maxSize * imgRatio;
      let drawHeight = imgRatio > 1 ? maxSize / imgRatio : maxSize;
      const x = centerX - drawWidth / 2;
      const y = centerY - drawHeight / 2;

      const padding = 20;
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(x - padding, y - padding, drawWidth + 2 * padding, drawHeight + 2 * padding);
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 10;
      ctx.strokeRect(x - padding, y - padding, drawWidth + 2 * padding, drawHeight + 2 * padding);

      ctx.drawImage(img, x, y, drawWidth, drawHeight);
      updateTexture();
    };
    img.onerror = () => {
      console.warn(`Failed to load image: ${exp.imageUrl}`);
      updateTexture();
    };
    img.src = exp.imageUrl;

    function drawText() {
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      let currentY = 500;

      ctx.fillStyle = '#000000';
      ctx.font = 'bold 100px Oswald, sans-serif';
      wrapText(ctx, exp.company, 900, currentY, 100, true);
      currentY += 100 * 1.2 + 40;

      ctx.font = 'bold 80px Oswald, sans-serif';
      wrapText(ctx, exp.role, 900, currentY, 80, true);
      currentY += 80 * 1.2 + 25;

      ctx.fillStyle = '#000000';
      ctx.font = 'bold 60px Oswald, sans-serif';
      wrapText(ctx, exp.period, 900, currentY, 60);
      currentY += 60 * 1.2 + 20;

      ctx.fillStyle = '#000000';
      ctx.font = 'italic bold 50px Oswald, sans-serif';
      wrapText(ctx, exp.location, 900, currentY, 50);

      updateTexture();
    }

    function wrapText(ctx, text, maxWidth, y, fontSize, stroke = false) {
      const words = text.split(' ');
      let line = '';
      let lines = [];
      for (const word of words) {
        const testLine = line + word + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && line) {
          lines.push(line.trim());
          line = word + ' ';
        } else {
          line = testLine;
        }
      }
      lines.push(line.trim());
      lines.forEach((line, i) => {
        const textY = y + i * 1.2 * fontSize;
        if (stroke) {
          ctx.strokeStyle = 'black';
          ctx.lineWidth = 3;
          ctx.strokeText(line, canvas.width / 2, textY);
        }
        ctx.fillText(line, canvas.width / 2, textY);
      });
    }

    function updateTexture() {
      const newTexture = new THREE.CanvasTexture(canvas);
      newTexture.needsUpdate = true;
      setTexture(newTexture);
    }

    return () => {
      if (texture) texture.dispose();
    };
  }, [exp, frontColor]);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.position.y = THREE.MathUtils.lerp(
      meshRef.current.position.y,
      isHovered ? initialY.current + 0.3 : initialY.current,
      0.1
    );
    meshRef.current.rotation.x = 0;
    meshRef.current.rotation.y = 0;

    const frontMaterial = meshRef.current.material[4];
    frontMaterial.emissive = new THREE.Color(isHovered ? '#ffffff' : '#000000');
    frontMaterial.emissiveIntensity = isHovered ? 0.1 : 0;
  });

  const materials = useMemo(() => [
    new THREE.MeshStandardMaterial({ color: exp.color }),
    new THREE.MeshStandardMaterial({ color: exp.color }),
    new THREE.MeshStandardMaterial({ color: exp.color }),
    new THREE.MeshStandardMaterial({ color: exp.color }),
    new THREE.MeshStandardMaterial({ color: frontColor, map: texture, emissive: '#000000', emissiveIntensity: 0 }),
    new THREE.MeshStandardMaterial({ color: exp.color }),
  ], [exp.color, frontColor, texture]);

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        scale={isHovered ? [1.1, 1.1, 1.1] : [1, 1, 1]}
        onPointerOver={() => setIsHovered(true)}
        onPointerOut={() => setIsHovered(false)}
        onClick={() => onClick(exp)}
        material={materials}
      >
        <boxGeometry args={[3, 3, 3]} />
      </mesh>
    </group>
  );
}

function ExperienceScene({ onSelect }) {
  const { width } = useThree((state) => state.size);
  const spacing = width < 640 ? 3 : 7;
  const startX = -((experiences.length - 1) * spacing) / 2;
  const baseUrl = import.meta.env.BASE_URL || '/';
  const fontUrl = `${baseUrl}fonts/Impact.ttf`;

  return (
    <group position={[0, 0, 0]}>
      {experiences.map((exp, i) => (
        <ExperienceCube
          key={exp.company}
          position={[startX + i * spacing, 0, 0]}
          exp={exp}
          index={i}
          onClick={() => onSelect(exp)}
        />
      ))}
      <Text
        position={[0, 4, 0]}
        font={fontUrl}
        fontSize={1}
        color="#000000"
        anchorX="center"
        anchorY="middle"
      >
        Work Experience Timeline
      </Text>
      <Text
        position={[startX - 3, 0, 0]}
        font={fontUrl}
        fontSize={0.5}
        color="#000000"
        anchorX="right"
        anchorY="middle"
      >
        Earlier
      </Text>
      <Text
        position={[startX + (experiences.length - 1) * spacing + 3, 0, 0]}
        font={fontUrl}
        fontSize={0.5}
        color="#000000"
        anchorX="left"
        anchorY="middle"
      >
        Recent
      </Text>
    </group>
  );
}

export default function ExperiencesScene({ id, className }) {
  const [selectedExp, setSelectedExp] = useState(null);

  return (
    <div id={id} className={`relative h-[91vh] w-screen border-b-4 border-black bg-teal-200 ${className}`}>
      <Canvas
        camera={{ position: [0, 4, 15], fov: 45 }}
        className="h-screen w-screen"
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={1} />
        <directionalLight position={[5, 5, 5]} intensity={4} />
        <ExperienceScene onSelect={setSelectedExp} />
      </Canvas>
      {selectedExp && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setSelectedExp(null)}
        >
          <div
            className="bg-white border-4 border-black shadow-[8px_8px_0_0_#000] p-6 w-3/4 max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={selectedExp.imageUrl} alt={selectedExp.company} className="w-full h-48 object-contain mb-4" />
            <h2 className="text-3xl font-bold mb-2">{selectedExp.company}</h2>
            <h3 className="text-2xl font-semibold mb-1">{selectedExp.role}</h3>
            <p className="text-lg mb-1">{selectedExp.period}</p>
            <p className="text-lg mb-4">{selectedExp.location}</p>
            <ul className="list-disc list-inside">
              {selectedExp.highlights.map((highlight, index) => (
                <li key={index} className="text-base mb-1">{highlight}</li>
              ))}
            </ul>
            <button
              onClick={() => setSelectedExp(null)}
              className="mt-4 px-4 py-2 bg-black text-white font-bold border-2 border-black hover:bg-white hover:text-black transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}