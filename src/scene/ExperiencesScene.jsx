import { useEffect, useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import experiencesData from '../data/experiences';

const baseUrl = import.meta.env.BASE_URL || '/';
const fontUrl = `${baseUrl}fonts/Impact.ttf`;

// Load Impact.ttf via FontFace so canvas text matches Three.js Text
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

// Remove near-white pixels from a JPEG logo so it sits cleanly on any background
function removeWhiteBg(img, size = 512) {
  const tmp = document.createElement('canvas');
  tmp.width = size;
  tmp.height = size;
  const c = tmp.getContext('2d');
  c.drawImage(img, 0, 0, size, size);
  const id = c.getImageData(0, 0, size, size);
  const d = id.data;
  for (let i = 0; i < d.length; i += 4) {
    if (d[i] > 235 && d[i + 1] > 235 && d[i + 2] > 235) d[i + 3] = 0;
  }
  c.putImageData(id, 0, 0);
  return tmp;
}

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

// Draws the cube face onto a 1024×1024 canvas — white card with colour accent
function buildCubeTexture(exp, logoSource) {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  // White base
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, 1024, 1024);

  // Coloured top accent strip
  ctx.fillStyle = exp.color;
  ctx.fillRect(0, 0, 1024, 170);

  // Logo — centred in the white area between strip and divider (y 185–450)
  if (logoSource) {
    const maxW = 660, maxH = 240;
    const srcW = logoSource.width || 512;
    const srcH = logoSource.height || 512;
    const ratio = srcW / srcH;
    const lw = ratio > maxW / maxH ? maxW : maxH * ratio;
    const lh = ratio > maxW / maxH ? maxW / ratio : maxH;
    const lx = (1024 - lw) / 2;
    const ly = 185 + (240 - lh) / 2;
    ctx.drawImage(logoSource, lx, ly, lw, lh);
  }

  // Horizontal divider
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 14;
  ctx.beginPath();
  ctx.moveTo(36, 472);
  ctx.lineTo(988, 472);
  ctx.stroke();

  // Company name — large black Impact
  ctx.fillStyle = '#000';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.font = `bold 96px ${FONT}`;
  const nameLines = wrapLines(ctx, exp.company.toUpperCase(), 930);
  nameLines.forEach((l, i) => ctx.fillText(l, 512, 492 + i * 110));

  // Role — coloured label strip
  const roleY = 492 + nameLines.length * 110 + 14;
  const roleH = 96;
  ctx.fillStyle = exp.color;
  ctx.fillRect(46, roleY, 932, roleH);
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 8;
  ctx.strokeRect(46, roleY, 932, roleH);
  ctx.fillStyle = '#000';
  ctx.textBaseline = 'middle';
  ctx.font = 'bold 52px Arial, Helvetica, sans-serif';
  ctx.fillText(exp.role, 512, roleY + roleH / 2);

  // Period
  const periodY = roleY + roleH + 24;
  ctx.fillStyle = '#111';
  ctx.textBaseline = 'top';
  ctx.font = 'bold 46px Arial, Helvetica, sans-serif';
  ctx.fillText(exp.period, 512, periodY);

  // Location
  ctx.fillStyle = '#333';
  ctx.font = '40px Arial, Helvetica, sans-serif';
  ctx.fillText(exp.location, 512, periodY + 66);

  // Heavy outer border
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 24;
  ctx.strokeRect(12, 12, 1000, 1000);

  return canvas;
}

function ExperienceCube({ position, exp, onClick }) {
  const meshRef = useRef();
  const [isHovered, setIsHovered] = useState(false);
  const initialY = useRef(position[1]);
  const baseColor = useMemo(() => new THREE.Color(exp.color), [exp.color]);
  const [texture, setTexture] = useState(null);
  const isJpeg = /\.(jfif|jpg|jpeg)$/i.test(exp.imageUrl);

  useEffect(() => {
    let mounted = true;

    Promise.all([
      ensureFont(),
      new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(isJpeg ? removeWhiteBg(img) : img);
        img.onerror = () => resolve(null);
        img.src = `${baseUrl}${exp.imageUrl}`;
      }),
    ]).then(([, logo]) => {
      if (!mounted) return;
      const faceCanvas = buildCubeTexture(exp, logo);
      const tex = new THREE.CanvasTexture(faceCanvas);
      tex.needsUpdate = true;
      setTexture(tex);
    });

    return () => { mounted = false; };
  }, [exp]);

  useFrame(() => {
    if (!meshRef.current) return;
    meshRef.current.position.y = THREE.MathUtils.lerp(
      meshRef.current.position.y,
      isHovered ? initialY.current + 0.4 : initialY.current,
      0.1
    );
    meshRef.current.rotation.x = 0;
    meshRef.current.rotation.y = 0;
  });

  const materials = useMemo(() => [
    new THREE.MeshStandardMaterial({ color: baseColor }),
    new THREE.MeshStandardMaterial({ color: baseColor }),
    new THREE.MeshStandardMaterial({ color: baseColor }),
    new THREE.MeshStandardMaterial({ color: baseColor }),
    // MeshBasicMaterial ignores lighting — the canvas texture always displays at full brightness
    new THREE.MeshBasicMaterial({ map: texture }),
    new THREE.MeshStandardMaterial({ color: baseColor }),
  ], [baseColor, texture]);

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        scale={isHovered ? [1.07, 1.07, 1.07] : [1, 1, 1]}
        material={materials}
        onPointerOver={() => setIsHovered(true)}
        onPointerOut={() => setIsHovered(false)}
        onClick={() => onClick(exp)}
      >
        <boxGeometry args={[3.8, 3.8, 3.8]} />
      </mesh>
    </group>
  );
}

function Scene({ onSelect }) {
  const { width } = useThree((s) => s.size);
  const spacing = width < 768 ? 3.8 : 4.8;
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
      <Text position={[0, 5.6, 0]} font={fontUrl} fontSize={1.1} color="#000" anchorX="center" anchorY="middle">
        Work Experience
      </Text>
      <Text position={[startX - 1.4, 0, 0]} font={fontUrl} fontSize={0.55} color="#111" anchorX="right" anchorY="middle">
        Earlier
      </Text>
      <Text position={[startX + (total - 1) * spacing + 1.4, 0, 0]} font={fontUrl} fontSize={0.55} color="#111" anchorX="left" anchorY="middle">
        Recent
      </Text>
    </group>
  );
}

/* ── Mobile accordion cards ─────────────────────────────────── */
function MobileCards() {
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
          style={{ borderLeftColor: exp.color, borderLeftWidth: 8 }}
        >
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between px-4 py-3 text-left"
          >
            <div className="flex items-center gap-3">
              <img
                src={`${baseUrl}${exp.imageUrl}`}
                alt={exp.company}
                className="h-9 w-16 object-contain border-2 border-black p-1 bg-white shrink-0"
              />
              <div>
                <p className="font-k2d font-extrabold text-base leading-tight">{exp.company}</p>
                <p className="font-jetbrains text-xs text-gray-600">{exp.role} · {exp.period}</p>
              </div>
            </div>
            <span className="font-jetbrains font-bold text-lg shrink-0">{open === i ? '−' : '+'}</span>
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
        <div
          className="h-2 w-full mb-4 border-b-4 border-black"
          style={{ backgroundColor: exp.color }}
        />
        <img
          src={`${baseUrl}${exp.imageUrl}`}
          alt={exp.company}
          className="h-14 object-contain mb-4 border-2 border-black p-2 bg-white"
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
          camera={{ position: [0, 1, 13], fov: 56 }}
          className="w-full h-full"
          gl={{ antialias: true, powerPreference: 'high-performance' }}
        >
          <ambientLight intensity={1.8} />
          <directionalLight position={[5, 8, 5]} intensity={3} />
          <directionalLight position={[-5, 3, 5]} intensity={1.5} />
          <Scene onSelect={setSelected} />
        </Canvas>
      </div>

      {/* Mobile HTML cards */}
      <div className="md:hidden h-full">
        <MobileCards />
      </div>

      {selected && <Modal exp={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}
