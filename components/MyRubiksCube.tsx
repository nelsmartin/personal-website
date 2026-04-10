'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import {
  type CubeState, type MoveKey, type FaceName,
  COLOR, MOVE_KEYS, SCRAMBLE_POOL, initCube, applyMove,
} from '@/lib/cube-engine';

// ── Constants ────────────────────────────────────────────────────────────────

const GAP = 0.08;
const SIZE = 1;
const STEP = SIZE + GAP;
const OFFSETS = [-1, 0, 1] as const;
const INTERNAL_COLOR = '#1a1a1a';
const ANIM_SPEED = 6;

const ASCII_W = 180;
const ASCII_H = 100;

const CHAR_MAP = ['W','Y','R','O','G','B'];
const COLOR_KEYS = Object.keys(COLOR) as (keyof typeof COLOR)[];

// ── Utility: nearest cube color ──────────────────────────────────────────────

function hexToRgb(hex: string) {
  const v = hex.replace('#', '');
  return [
    parseInt(v.substring(0, 2), 16),
    parseInt(v.substring(2, 4), 16),
    parseInt(v.substring(4, 6), 16),
  ];
}

const COLOR_RGB = Object.fromEntries(
  COLOR_KEYS.map(k => [k, hexToRgb(COLOR[k])])
);

const BG_KEY = 'K';
const ALL_COLORS: Record<string, string> = { ...COLOR, [BG_KEY]: '#000000' };
const ALL_COLOR_KEYS = [...COLOR_KEYS, BG_KEY] as const;
const ALL_COLOR_RGB: Record<string, number[]> = { ...COLOR_RGB, [BG_KEY]: [0, 0, 0] };

function closestColor(r: number, g: number, b: number) {
  let best = BG_KEY;
  let bestDist = Infinity;
  for (const k of ALL_COLOR_KEYS) {
    const [cr, cg, cb] = ALL_COLOR_RGB[k];
    const d = (r-cr)**2 + (g-cg)**2 + (b-cb)**2;
    if (d < bestDist) { bestDist = d; best = k; }
  }
  return best;
}

// ── Sticker mapping ─────────────────────────────────────────────────────────

function getCubieColors(state: CubeState, gx: number, gy: number, gz: number): string[] {
  const colors: string[] = new Array(6).fill(INTERNAL_COLOR);

  if (gx === 1) colors[0] = COLOR[state.R[(1 - gy) * 3 + (1 - gz)]];
  if (gx === -1) colors[1] = COLOR[state.L[(1 - gy) * 3 + (gz + 1)]];
  if (gy === 1) colors[2] = COLOR[state.U[(gz + 1) * 3 + (gx + 1)]];
  if (gy === -1) colors[3] = COLOR[state.D[(1 - gz) * 3 + (gx + 1)]];
  if (gz === 1) colors[4] = COLOR[state.F[(1 - gy) * 3 + (gx + 1)]];
  if (gz === -1) colors[5] = COLOR[state.B[(1 - gy) * 3 + (1 - gx)]];

  return colors;
}

// ── Move logic ──────────────────────────────────────────────────────────────

interface MoveInfo {
  axis: 'x' | 'y' | 'z';
  layerCoord: number;
  angle: number;
}

function getMoveInfo(move: MoveKey): MoveInfo {
  const base = move.replace("'", '') as FaceName;
  const ccw = move.includes("'");

  switch (base) {
    case 'U': return { axis: 'y', layerCoord: 1, angle: ccw ? Math.PI / 2 : -Math.PI / 2 };
    case 'D': return { axis: 'y', layerCoord: -1, angle: ccw ? -Math.PI / 2 : Math.PI / 2 };
    case 'R': return { axis: 'x', layerCoord: 1, angle: ccw ? Math.PI / 2 : -Math.PI / 2 };
    case 'L': return { axis: 'x', layerCoord: -1, angle: ccw ? -Math.PI / 2 : Math.PI / 2 };
    case 'F': return { axis: 'z', layerCoord: 1, angle: ccw ? Math.PI / 2 : -Math.PI / 2 };
    case 'B': return { axis: 'z', layerCoord: -1, angle: ccw ? -Math.PI / 2 : Math.PI / 2 };
  }
}

function isInLayer(gx: number, gy: number, gz: number, info: MoveInfo): boolean {
  if (info.axis === 'x') return gx === info.layerCoord;
  if (info.axis === 'y') return gy === info.layerCoord;
  return gz === info.layerCoord;
}

// ── Cubie ───────────────────────────────────────────────────────────────────

function Cubie({ gx, gy, gz, cubeState }: {
  gx: number; gy: number; gz: number; cubeState: CubeState;
}) {
  const colors = getCubieColors(cubeState, gx, gy, gz);
  return (
    <mesh position={[gx * STEP, gy * STEP, gz * STEP]}>
      <boxGeometry args={[SIZE, SIZE, SIZE]} />
      {colors.map((color, i) => (
        <meshStandardMaterial key={i} attach={`material-${i}`} color={color} />
      ))}
    </mesh>
  );
}

// ── Scene ───────────────────────────────────────────────────────────────────

function CubeScene({ cubeState, anim, progressRef, onMoveComplete }: any) {
  const layerGroupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!anim) return;

    const step = Math.sign(anim.info.angle) * ANIM_SPEED * delta;
    progressRef.current += step;

    const done = Math.abs(progressRef.current) >= Math.abs(anim.info.angle);
    const currentAngle = done ? anim.info.angle : progressRef.current;

    if (layerGroupRef.current) {
      layerGroupRef.current.rotation.set(0, 0, 0);
      if (anim.info.axis === 'x') layerGroupRef.current.rotation.x = currentAngle;
      else if (anim.info.axis === 'y') layerGroupRef.current.rotation.y = currentAngle;
      else layerGroupRef.current.rotation.z = currentAngle;
    }

    if (done) {
      if (layerGroupRef.current) layerGroupRef.current.rotation.set(0, 0, 0);
      onMoveComplete(anim.move);
    }
  });

  return (
    <>
      <group>
        {OFFSETS.map(gx => OFFSETS.map(gy => OFFSETS.map(gz => {
          if (anim && isInLayer(gx, gy, gz, anim.info)) return null;
          return <Cubie key={`${gx}-${gy}-${gz}`} gx={gx} gy={gy} gz={gz} cubeState={cubeState} />;
        })))}
      </group>

      <group ref={layerGroupRef}>
        {anim && OFFSETS.map(gx => OFFSETS.map(gy => OFFSETS.map(gz => {
          if (!isInLayer(gx, gy, gz, anim.info)) return null;
          return <Cubie key={`anim-${gx}-${gy}-${gz}`} gx={gx} gy={gy} gz={gz} cubeState={cubeState} />;
        })))}
      </group>
    </>
  );
}


function AsciiCapture({ onFrame, anim }: { onFrame: (canvas: HTMLCanvasElement) => void; anim: any }) {
  const { gl } = useThree();

  useEffect(() => {
    const loop = () => {
      if (!anim) onFrame(gl.domElement);
      requestAnimationFrame(loop);
    };
    const id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, [gl, onFrame, anim]);

  return null;
}


// ── Main ────────────────────────────────────────────────────────────────────

export default function RubiksCube() {
  const [cubeState, setCubeState] = useState<CubeState>(initCube);
  const [anim, setAnim] = useState<any>(null);
  const [ascii, setAscii] = useState(false);
  const progressRef = useRef(0);
  const queueRef = useRef<MoveKey[]>([]);
  const [asciiRows, setAsciiRows] = useState<{ char: string; color: string }[][]>([]);

  const handleFrame = useCallback((canvas: HTMLCanvasElement) => {
    const offscreen = document.createElement("canvas");
    offscreen.width = ASCII_W;
    offscreen.height = ASCII_H;
    const ctx = offscreen.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(canvas, 0, 0, ASCII_W, ASCII_H);
    const { data } = ctx.getImageData(0, 0, ASCII_W, ASCII_H);

    const rows: { char: string; color: string }[][] = [];
    for (let y = 0; y < ASCII_H; y++) {
      const row: { char: string; color: string }[] = [];
      for (let x = 0; x < ASCII_W; x++) {
        const i = (y * ASCII_W + x) * 4;
        const key = closestColor(data[i], data[i+1], data[i+2]);
          const char = key === BG_KEY ? ' ' : CHAR_MAP[COLOR_KEYS.indexOf(key as keyof typeof COLOR)];
          const color = ALL_COLORS[key];
          row.push({ char, color });
      }
      rows.push(row);
    }
    setAsciiRows(rows);
  }, []);

  const startNext = useCallback(() => {
    if (!queueRef.current.length) return setAnim(null);
    const move = queueRef.current.shift()!;
    progressRef.current = 0;
    setAnim({ move, info: getMoveInfo(move), progress: 0 });
  }, []);

  const onMoveComplete = useCallback((move: MoveKey) => {
    setCubeState(prev => applyMove(prev, move));
    setTimeout(startNext, 0);
  }, [startNext]);

  const handleMove = (m: MoveKey) => {
    queueRef.current.push(m);
    if (!anim) startNext();
  };

  return (
    <div className="flex flex-col items-center w-full h-full">
      <div className="flex flex-1 w-full">
      {/* Three.js canvas */}
      <div className="flex-1 h-full">
        <Canvas gl={{ preserveDrawingBuffer: true }} camera={{ position: [4,4,4] }}>
          <ambientLight intensity={0.8} />
          <directionalLight position={[4,4,4]} intensity={3} />
          <directionalLight position={[-4,-4,-4]} intensity={3} />
          <CubeScene cubeState={cubeState} anim={anim} progressRef={progressRef} onMoveComplete={onMoveComplete} />
          <OrbitControls enableZoom={false} />
          <AsciiCapture onFrame={handleFrame} anim={anim} />

        </Canvas>
      </div>

      {/* ASCII view */}
      <div className="flex-1 h-full bg-white overflow-hidden flex items-center justify-center">
        <pre style={{ fontFamily: "monospace", fontSize: "8px", lineHeight: "1", margin: 0 }}>
          {asciiRows.map((row, y) => (
            <span key={y} style={{ display: "block" }}>
              {row.map((cell, x) => (
                <span key={x} style={{ color: cell.color }}>{cell.char}</span>
              ))}
            </span>
          ))}
        </pre>
      </div>
    </div>

      <div className="flex gap-2 mt-2 text-2xl">
        <button onClick={() => setAscii(a => !a)}>ASCII {ascii ? "ON" : "OFF"}</button>
        {MOVE_KEYS.map(m => <button key={m} onClick={()=>handleMove(m)}>{m}</button>)}
      </div>
    </div>
  );
}
