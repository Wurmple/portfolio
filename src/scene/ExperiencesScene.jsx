import { useEffect, useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import experiencesData from '../data/experiences';

const baseUrl = import.meta.env.BASE_URL || '/';
const fontUrl = `${baseUrl}fonts/Impact.ttf`;

function wrapText(ctx, text, maxWidth, y, fontSize, stroke = false) {
  const words = text.split(' ');
  let line = '';
  const lines = [];
  for (const word of words) {
    const testLine = line + word + ' ';
    if (ctx.measureText(testLine).width > maxWidth && line) {
      lines.push(line.trim());
      line = word + ' ';
    } else {
      line = testLine;
    }
  }
  lines.push(line.trim());
  lines.forEach((l, i) => {
    const textY = y + i * 1.2 * fontSize;
    if (stroke) {
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 3;
      ctx.strokeText(l, ctx.canvas.width / 2, textY);
    }
    ctx.fillText(l, ctx.canvas.width / 2, textY);
  });
}

function ExperienceCube({ position, exp, onClick }) {
  const meshRef = useRef();
  const [isHovered, setIsHovered] = useState(false);
  const initialY = useRef(position[1]);
  const baseColor = useMemo(() => new THREE.Color(exp.color), [exp.color]);
  const frontColor = useMemo(() => new THREE.Color(exp.color).multiplyScalar(1.25), [exp.color]);
  const [texture, setTexture] = useState(null);

  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = frontColor.getStyle();
    ctx.fillRect(0, 0, 1024, 1024);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 20;
    ctx.strokeRect(0, 0, 1024, 1024);

    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const cx = 512, cy = 290, maxS = 480;
      const r = img.width / img.height;
      const dw = r > 1 ? maxS : maxS * r;
      const dh = r > 1 ? maxS / r : maxS;
      const px = cx - dw / 2, py = cy - dh / 2;
      const pad = 18;
      ctx.fillStyle = '#fff';
      ctx.fillRect(px - pad, py - pad, dw + pad * 2, dh + pad * 2);
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 10;
      ctx.strokeRect(px - pad, py - pad, dw + pad * 2, dh + pad * 2);
      ctx.drawImage(img, px, py, dw, dh);
      drawLabels();
    };
    img.onerror = () => drawLabels();
    img.src = `${baseUrl}${exp.imageUrl}`;

    function drawLabels() {
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      let y = 540;

      ctx.fillStyle = '#000';
      ctx.font = 'bold 90px Oswald, Impact, sans-serif';
      wrapText(ctx, exp.company, 900, y, 90, true);
      y += 90 * 1.2 + 36;

      ctx.font = 'bold 68px Oswald, Impact, sans-serif';
      wrapText(ctx, exp.role, 900, y, 68, true);
      y += 68 * 1.2 + 24;

      ctx.font = 'bold 50px Oswald, Impact, sans-serif';
      wrapText(ctx, exp.period, 900, y, 50);
      y += 50 * 1.2 + 18;

      ctx.font = 'italic bold 42px Oswald, Impact, sans-serif';
      wrapText(ctx, exp.location, 900, y, 42);

      const tex = new THREE.CanvasTexture(canvas);
      tex.needsUpdate = true;
      setTexture(tex);
    }

    return () => {
      if (texture) texture.dispose();
    };
  }, [exp, frontColor]);

  useFrame(() => {
    if (!meshRef.current) return;
    meshRef.current.position.y = THREE.MathUtils.lerp(
      meshRef.current.position.y,
      isHovered ? initialY.current + 0.35 : initialY.current,
      0.1
    );
    meshRef.current.rotation.x = 0;
    meshRef.current.rotation.y = 0;
    const front = meshRef.current.material[4];
    front.emissive.set(isHovered ? '#ffffff' : '#000000');
    front.emissiveIntensity = isHovered ? 0.12 : 0;
  });

  const materials = useMemo(() => [
    new THREE.MeshStandardMaterial({ color: baseColor }),
    new THREE.MeshStandardMaterial({ color: baseColor }),
    new THREE.MeshStandardMaterial({ color: baseColor }),
    new THREE.MeshStandardMaterial({ color: baseColor }),
    new THREE.MeshStandardMaterial({ color: frontColor, map: texture, emissive: '#000', emissiveIntensity: 0 }),
    new THREE.MeshStandardMaterial({ color: baseColor }),
  ], [baseColor, frontColor, texture]);

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        scale={isHovered ? [1.1, 1.1, 1.1] : [1, 1, 1]}
        material={materials}
        onPointerOver={() => setIsHovered(true)}
        onPointerOut={() => setIsHovered(false)}
        onClick={() => onClick(exp)}
      >
        <boxGeometry args={[3, 3, 3]} />
      </mesh>
    </group>
  );
}

function Scene({ onSelect }) {
  const { width } = useThree((s) => s.size);
  const spacing = width < 768 ? 3.5 : 5;
  const total = experiencesData.length;
  const startX = -((total - 1) * spacing) / 2;

  return (
    <group>
      {experiencesData.map((exp, i) => (
        <ExperienceCube
          key={exp.company}
          position={[startX + i * spacing, 0, 0]}
          exp={exp}
          onClick={onSelect}
        />
      ))}
      <Text position={[0, 4.2, 0]} font={fontUrl} fontSize={0.85} color="#000" anchorX="center" anchorY="middle">
        Work Experience
      </Text>
      <Text position={[startX - 2.5, 0, 0]} font={fontUrl} fontSize={0.45} color="#555" anchorX="right" anchorY="middle">
        Earlier
      </Text>
      <Text position={[startX + (total - 1) * spacing + 2.5, 0, 0]} font={fontUrl} fontSize={0.45} color="#555" anchorX="left" anchorY="middle">
        Recent
      </Text>
    </group>
  );
}

/* ── Mobile accordion cards ─────────────────────────────────── */
function MobileCards({ onSelect }) {
  const [open, setOpen] = useState(null);

  return (
    <div className="flex flex-col gap-3 p-5 overflow-y-auto h-full">
      <h2 className="font-k2d font-extrabold text-2xl uppercase border-b-4 border-black pb-2 mb-1">
        Work Experience
      </h2>
      {[...experiencesData].reverse().map((exp, i) => (
        <div
          key={exp.company}
          className="border-4 border-black bg-white shadow-brutal"
        >
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between px-4 py-3 text-left"
          >
            <div className="flex items-center gap-3">
              <img
                src={`${baseUrl}${exp.imageUrl}`}
                alt={exp.company}
                className="h-8 w-16 object-contain border-2 border-black p-1 bg-white"
              />
              <div>
                <p className="font-k2d font-extrabold text-base leading-tight">{exp.company}</p>
                <p className="font-jetbrains text-xs text-gray-600">{exp.role} · {exp.period}</p>
              </div>
            </div>
            <span className="font-jetbrains font-bold text-lg">{open === i ? '−' : '+'}</span>
          </button>
          {open === i && (
            <ul className="border-t-2 border-black px-4 py-3 flex flex-col gap-1.5 bg-gray-50">
              {exp.highlights.map((h, j) => (
                <li key={j} className="font-jetbrains text-sm flex gap-2">
                  <span className="text-gray-400 shrink-0">→</span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}

/* ── Modal ───────────────────────────────────────────────────── */
function Modal({ exp, onClose }) {
  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white border-4 border-black shadow-[8px_8px_0_0_#000] p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={`${baseUrl}${exp.imageUrl}`}
          alt={exp.company}
          className="h-16 object-contain mb-4 border-2 border-black p-2"
        />
        <h2 className="font-k2d font-extrabold text-2xl sm:text-3xl mb-1">{exp.company}</h2>
        <h3 className="font-jetbrains font-semibold text-lg mb-1">{exp.role}</h3>
        <p className="font-jetbrains text-sm text-gray-600 mb-1">{exp.period}</p>
        <p className="font-jetbrains text-sm text-gray-600 mb-4">{exp.location}</p>
        <ul className="flex flex-col gap-2 mb-4">
          {exp.highlights.map((h, i) => (
            <li key={i} className="font-jetbrains text-sm flex gap-2">
              <span className="text-gray-400 shrink-0">→</span>
              <span>{h}</span>
            </li>
          ))}
        </ul>
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

export default function ExperiencesScene({ id }) {
  const [selected, setSelected] = useState(null);

  return (
    <section id={id} className="section-snap relative w-screen bg-teal-200 border-b-4 border-black pt-16">
      {/* Desktop 3D */}
      <div className="hidden md:block h-full">
        <Canvas
          camera={{ position: [0, 2, 18], fov: 50 }}
          className="w-full h-full"
          gl={{ antialias: true, powerPreference: 'high-performance' }}
        >
          <ambientLight intensity={1} />
          <directionalLight position={[5, 5, 5]} intensity={4} />
          <Scene onSelect={setSelected} />
        </Canvas>
      </div>

      {/* Mobile HTML cards */}
      <div className="md:hidden h-full">
        <MobileCards onSelect={setSelected} />
      </div>

      {selected && <Modal exp={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}
