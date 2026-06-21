import { useEffect, useState, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import projectsData from '../data/projects';

const baseUrl = import.meta.env.BASE_URL || '/';
const fontUrl = `${baseUrl}fonts/Impact.ttf`;

function Card({ position, data, rotationSpeed, scaleSpeed, zOffset, onClick }) {
  const [texture, setTexture] = useState(null);
  const meshRef = useRef();
  const [isHovered, setIsHovered] = useState(false);
  const initialRotation = useRef([0, (Math.random() - 0.5) * 0.15, 0]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    if (!isHovered) {
      const s = 1 + Math.sin(t * scaleSpeed) * 0.04;
      meshRef.current.scale.set(s, s, s);
      meshRef.current.rotation.y = initialRotation.current[1] + Math.sin(t * rotationSpeed.y) * 0.04;
      meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, zOffset, 0.1);
    } else {
      meshRef.current.scale.lerp(new THREE.Vector3(1.15, 1.15, 1.15), 0.1);
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, 0, 0.1);
      meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, zOffset + 0.4, 0.1);
    }
    meshRef.current.material.emissiveIntensity = THREE.MathUtils.lerp(
      meshRef.current.material.emissiveIntensity,
      isHovered ? 0.35 : 0,
      0.1
    );
  });

  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 768;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#F5F5F5';
    ctx.fillRect(0, 0, 512, 768);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 10;
    ctx.strokeRect(5, 5, 502, 758);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#000';
    ctx.font = '900 32px Impact, sans-serif';
    const maxW = 462;
    const lh = 38;
    const words = data.title.split(' ');
    let lines = [];
    let cur = words[0];
    for (let i = 1; i < words.length; i++) {
      if (ctx.measureText(cur + ' ' + words[i]).width < maxW) {
        cur += ' ' + words[i];
      } else {
        lines.push(cur);
        cur = words[i];
      }
    }
    lines.push(cur);
    lines.forEach((l, i) => ctx.fillText(l, 256, 60 + i * lh));

    ctx.font = '500 22px Arial, sans-serif';
    ctx.fillStyle = '#555';
    ctx.fillText(data.subtitle, 256, 60 + lines.length * lh + 14);

    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const s = 260, x = (512 - s) / 2, y = (768 - s) / 2 - 10;
      const pad = 12;
      ctx.fillStyle = '#fff';
      ctx.fillRect(x - pad, y - pad, s + pad * 2, s + pad * 2);
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 5;
      ctx.strokeRect(x - pad, y - pad, s + pad * 2, s + pad * 2);
      ctx.drawImage(img, x, y, s, s);
      bake();
    };
    img.onerror = () => bake();
    img.src = data.imageUrl;

    function bake() {
      const tex = new THREE.Texture(canvas);
      tex.needsUpdate = true;
      setTexture(tex);
    }

    return () => {
      if (texture) texture.dispose();
    };
  }, [data]);

  if (!texture) return null;

  return (
    <mesh
      ref={meshRef}
      position={[position[0], position[1], zOffset]}
      rotation={initialRotation.current}
      onPointerOver={() => setIsHovered(true)}
      onPointerOut={() => setIsHovered(false)}
      onClick={() => onClick(data)}
    >
      <boxGeometry args={[1.4, 2.1, 0.02]} />
      <meshStandardMaterial
        map={texture}
        emissive={new THREE.Color(0xffffff)}
        emissiveIntensity={0}
        toneMapped={false}
      />
    </mesh>
  );
}

function CardsRow({ onCardClick }) {
  const { width } = useThree((s) => s.size);
  const spacing = width < 768 ? 1.6 : 2.4;
  const startX = -((projectsData.length - 1) * spacing) / 2;

  return (
    <group>
      {projectsData.map((data, i) => (
        <Card
          key={i}
          position={[startX + i * spacing, 0, 0]}
          data={data}
          rotationSpeed={{ y: 0.25 }}
          scaleSpeed={0.5}
          zOffset={0}
          onClick={onCardClick}
        />
      ))}
      <Text
        position={[0, 1.7, 0]}
        font={fontUrl}
        fontSize={0.42}
        color="#000"
        anchorX="center"
        anchorY="middle"
      >
        Projects
      </Text>
    </group>
  );
}

/* ── Mobile cards ────────────────────────────────────────────── */
function MobileCards({ onSelect }) {
  return (
    <div className="flex flex-col gap-3 p-5 overflow-y-auto h-full">
      <h2 className="font-k2d font-extrabold text-2xl uppercase border-b-4 border-black pb-2 mb-1">
        Projects
      </h2>
      {projectsData.map((p, i) => (
        <div key={i} className="border-4 border-black bg-white shadow-brutal">
          <div className="flex items-center gap-4 p-4">
            <img src={p.imageUrl} alt={p.title} className="h-14 w-14 object-contain border-2 border-black p-1" />
            <div className="flex-1 min-w-0">
              <p className="font-k2d font-extrabold text-base leading-tight">{p.title}</p>
              <p className="font-jetbrains text-xs text-gray-600 mt-0.5">{p.subtitle} · {p.period}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {p.tags.slice(0, 4).map((tag, j) => (
                  <span key={j} className="font-jetbrains text-[10px] border border-black px-1.5 py-0.5 bg-lime-100">{tag}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t-2 border-black px-4 py-3 bg-gray-50">
            {p.highlights.slice(0, 2).map((h, j) => (
              <p key={j} className="font-jetbrains text-xs flex gap-2 mb-1">
                <span className="text-gray-400 shrink-0">→</span>
                <span>{h}</span>
              </p>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Modal ───────────────────────────────────────────────────── */
function Modal({ project, onClose }) {
  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white border-4 border-black shadow-[8px_8px_0_0_#000] p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <img src={project.imageUrl} alt={project.title} className="h-20 object-contain mb-4" />
        <h2 className="font-k2d font-extrabold text-2xl mb-0.5">{project.title}</h2>
        <p className="font-jetbrains text-sm text-gray-600 mb-3">{project.subtitle} · {project.period}</p>
        <ul className="flex flex-col gap-2 mb-4">
          {project.highlights.map((h, i) => (
            <li key={i} className="font-jetbrains text-sm flex gap-2">
              <span className="text-gray-400 shrink-0">→</span>
              <span>{h}</span>
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.tags.map((tag, i) => (
            <span key={i} className="font-jetbrains text-xs border-2 border-black px-2 py-0.5 bg-lime-100">{tag}</span>
          ))}
        </div>
        <button
          onClick={onClose}
          className="px-5 py-2 bg-black text-white font-k2d font-bold border-2 border-black hover:bg-white hover:text-black transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default function ProjectsScene({ id }) {
  const [selected, setSelected] = useState(null);

  return (
    <section id={id} className="section-snap relative w-screen bg-lime-200 border-b-4 border-black pt-16">
      {/* Desktop 3D */}
      <div className="hidden md:block h-full">
        <Canvas
          camera={{ position: [0, 0, 4], fov: 70 }}
          className="w-full h-full"
          gl={{ antialias: true }}
        >
          <ambientLight intensity={2.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <CardsRow onCardClick={setSelected} />
        </Canvas>
      </div>

      {/* Mobile */}
      <div className="md:hidden h-full">
        <MobileCards onSelect={setSelected} />
      </div>

      {selected && <Modal project={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}
