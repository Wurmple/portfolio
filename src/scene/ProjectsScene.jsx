import { useEffect, useState, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import projectsData from '../data/projects';

const baseUrl = import.meta.env.BASE_URL || '/';
const fontUrl = `${baseUrl}fonts/Impact.ttf`;

let _fontReady = null;
function ensureFont() {
  if (_fontReady) return _fontReady;
  try {
    const ff = new FontFace('ImpactCanvas', `url(${fontUrl})`);
    document.fonts.add(ff);
    _fontReady = ff.load().catch(() => null);
  } catch {
    _fontReady = Promise.resolve(null);
  }
  return _fontReady;
}
const FONT = 'ImpactCanvas, Impact, Arial Black, sans-serif';

function wrapLines(ctx, text, maxW) {
  const words = text.split(' ');
  const lines = [];
  let line = '';
  for (const word of words) {
    const test = line ? line + ' ' + word : word;
    if (ctx.measureText(test).width > maxW && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

// Clean minimal card: coloured header + project image + one-line description
function buildCardTexture(data) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 768;
  const ctx = canvas.getContext('2d');
  const accent = data.color || '#aaa';

  // White base + outer border
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, 512, 768);
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 10;
  ctx.strokeRect(5, 5, 502, 758);

  // Coloured header strip
  ctx.fillStyle = accent;
  ctx.fillRect(10, 10, 492, 130);
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 6;
  ctx.strokeRect(10, 10, 492, 130);

  // Title — white on dark accent strip, with letter spacing for character
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = 'bold 34px Arial, Helvetica, sans-serif';
  ctx.letterSpacing = '4px';
  const titleLines = wrapLines(ctx, data.title.toUpperCase(), 450);
  const lh = 43;
  const blockMid = 75;
  titleLines.forEach((l, i) => {
    ctx.fillText(l, 256, blockMid + (i - (titleLines.length - 1) / 2) * lh);
  });
  ctx.letterSpacing = '0px';

  return new Promise((resolve) => {
    const drawSubtitle = (imgEl) => {
      // Large project icon — extra top margin below header strip
      const sz = 260, ix = (512 - sz) / 2, iy = 195;
      if (imgEl) {
        ctx.fillStyle = '#fff';
        ctx.fillRect(ix - 14, iy - 14, sz + 28, sz + 28);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 5;
        ctx.strokeRect(ix - 14, iy - 14, sz + 28, sz + 28);
        ctx.drawImage(imgEl, ix, iy, sz, sz);
      }

      // Divider
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(30, 488);
      ctx.lineTo(482, 488);
      ctx.stroke();

      // Subtitle — bold, dark, prominent
      ctx.fillStyle = '#111';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.font = 'bold 26px Arial, Helvetica, sans-serif';
      const subLines = wrapLines(ctx, data.subtitle, 462);
      subLines.slice(0, 2).forEach((l, i) => ctx.fillText(l, 256, 504 + i * 36));

      // Subtle "tap to explore" hint
      ctx.fillStyle = '#999';
      ctx.font = `bold 18px ${FONT}`;
      ctx.textBaseline = 'bottom';
      ctx.fillText('CLICK TO EXPLORE →', 256, 752);

      resolve(canvas);
    };

    if (!data.imageUrl) { drawSubtitle(null); return; }
    const img = new Image();
    img.onload = () => drawSubtitle(img);
    img.onerror = () => drawSubtitle(null);
    img.src = data.imageUrl;
  });
}

function Card({ position, data, rotationSpeed, scaleSpeed, zOffset, onClick }) {
  const [texture, setTexture] = useState(null);
  const meshRef = useRef();
  const [isHovered, setIsHovered] = useState(false);
  const initialRotation = useRef([0, (Math.random() - 0.5) * 0.08, 0]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    if (!isHovered) {
      const s = 1 + Math.sin(t * scaleSpeed) * 0.025;
      meshRef.current.scale.set(s, s, s);
      meshRef.current.rotation.y = initialRotation.current[1] + Math.sin(t * rotationSpeed.y) * 0.025;
      meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, zOffset, 0.1);
    } else {
      meshRef.current.scale.lerp(new THREE.Vector3(1.1, 1.1, 1.1), 0.1);
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, 0, 0.1);
      meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, zOffset + 0.3, 0.1);
    }
  });

  useEffect(() => {
    let mounted = true;
    ensureFont().then(() => buildCardTexture(data)).then((faceCanvas) => {
      if (!mounted) return;
      const tex = new THREE.CanvasTexture(faceCanvas);
      tex.needsUpdate = true;
      setTexture(tex);
    });
    return () => { mounted = false; };
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
      <boxGeometry args={[1.7, 2.55, 0.02]} />
      {/* MeshBasicMaterial — shows canvas texture at full brightness */}
      <meshBasicMaterial map={texture} />
    </mesh>
  );
}

function CardsRow({ onCardClick }) {
  const { width } = useThree((s) => s.size);
  const spacing = width < 768 ? 1.9 : 2.6;
  const startX = -((projectsData.length - 1) * spacing) / 2;

  return (
    <group>
      {projectsData.map((data, i) => (
        <Card
          key={i}
          position={[startX + i * spacing, 0, 0]}
          data={data}
          rotationSpeed={{ y: 0.2 }}
          scaleSpeed={0.4}
          zOffset={0}
          onClick={onCardClick}
        />
      ))}
      <Text
        position={[0, 1.9, 0]}
        font={fontUrl}
        fontSize={0.48}
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
        <div key={i} className="border-4 border-black bg-white shadow-brutal overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3" style={{ backgroundColor: p.color }}>
            <img src={p.imageUrl} alt={p.title} className="h-10 w-10 object-contain bg-white border-2 border-black p-1 shrink-0" />
            <div>
              <p className="font-k2d font-extrabold text-base leading-tight text-white">{p.title}</p>
              <p className="font-jetbrains text-xs text-white opacity-80">{p.subtitle}</p>
            </div>
          </div>
          <div className="px-4 py-3 bg-gray-50 border-t-2 border-black flex items-center justify-between gap-3">
            <p className="font-jetbrains text-xs text-gray-500 leading-tight line-clamp-2 flex-1">
              {p.highlights[0]}
            </p>
            <button
              onClick={() => onSelect(p)}
              className="shrink-0 font-k2d font-bold text-xs border-2 border-black px-3 py-1.5 bg-black text-white"
            >
              Details →
            </button>
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
        <div className="h-2 w-full mb-4 border-b-4 border-black" style={{ backgroundColor: project.color }} />
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
            <span key={i} className="font-jetbrains text-xs border-2 border-black px-2 py-0.5 text-white" style={{ backgroundColor: project.color }}>{tag}</span>
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
          camera={{ position: [0, 0, 4.2], fov: 72 }}
          className="w-full h-full"
          gl={{ antialias: true }}
        >
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
