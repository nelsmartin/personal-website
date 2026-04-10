import { type FaceName, type ColorKey, type CubeState, COLOR } from './cube-engine';

type Vec3 = [number, number, number];

// Use the color's initial letter as the ASCII character
const CHAR: Record<ColorKey, string> = {
  W: 'W', Y: 'Y', R: 'R', O: 'O', G: 'G', B: 'B',
};

export { CHAR };

export const ASCII_W = 72;
export const ASCII_H = 36;

export interface Cell { ch: string; color: string | null; }

export function renderCube(cube: CubeState, rotX: number, rotY: number): Cell[][] {
  const W = ASCII_W;
  const H = ASCII_H;
  const buf:  Cell[][]   = Array.from({ length: H }, () =>
    Array.from({ length: W }, () => ({ ch: ' ', color: null }))
  );
  const zbuf: number[][] = Array.from({ length: H }, () => Array(W).fill(Infinity));

  function project(x: number, y: number, z: number): Vec3 {
    const cx = Math.cos(rotX), sx = Math.sin(rotX);
    const cy = Math.cos(rotY), sy = Math.sin(rotY);
    const x1 = cy * x + sy * z;
    const y1 = y;
    const z1 = -sy * x + cy * z;
    const x2 = x1;
    const y2 = cx * y1 - sx * z1;
    const z2 = sx * y1 + cx * z1;
    const scale = 1 / (z2 * 0.18 + 1.8);
    return [x2 * scale * 44, y2 * scale * 22, z2];
  }

  function drawQuad(pts: Vec3[], color: ColorKey) {
    const px = pts.map(([x, y, z]) => project(x, y, z));
    const ax = px[1][0] - px[0][0], ay = px[1][1] - px[0][1];
    const bx = px[2][0] - px[0][0], by = px[2][1] - px[0][1];
    if (ax * by - ay * bx > 0) return;

    const avgZ = pts.reduce((s, [,, z]) => s + z, 0) / 4;
    const minSX = Math.max(0, Math.min(...px.map(p => Math.floor(p[0] + W / 2))));
    const maxSX = Math.min(W - 1, Math.max(...px.map(p => Math.ceil(p[0] + W / 2))));
    const minSY = Math.max(0, Math.min(...px.map(p => Math.floor(p[1] + H / 2))));
    const maxSY = Math.min(H - 1, Math.max(...px.map(p => Math.ceil(p[1] + H / 2))));
    const ch = CHAR[color];
    const col = COLOR[color];

    for (let sy = minSY; sy <= maxSY; sy++) {
      for (let sx = minSX; sx <= maxSX; sx++) {
        const px2 = sx - W / 2 + 0.5;
        const py2 = sy - H / 2 + 0.5;
        let inside = true;
        for (let i = 0; i < 4; i++) {
          const j = (i + 1) % 4;
          const ex = px[j][0] - px[i][0], ey = px[j][1] - px[i][1];
          const fx = px2 - px[i][0], fy = py2 - px[i][1];
          if (ex * fy - ey * fx > 0) { inside = false; break; }
        }
        if (inside && avgZ < zbuf[sy][sx]) {
          zbuf[sy][sx] = avgZ;
          buf[sy][sx] = { ch, color: col };
        }
      }
    }
  }

  // Draw black borders between stickers, then colored stickers on top
  function drawQuadBorder(pts: Vec3[]) {
    const px = pts.map(([x, y, z]) => project(x, y, z));
    const ax = px[1][0] - px[0][0], ay = px[1][1] - px[0][1];
    const bx = px[2][0] - px[0][0], by = px[2][1] - px[0][1];
    if (ax * by - ay * bx > 0) return;

    const avgZ = pts.reduce((s, [,, z]) => s + z, 0) / 4;
    const minSX = Math.max(0, Math.min(...px.map(p => Math.floor(p[0] + W / 2))));
    const maxSX = Math.min(W - 1, Math.max(...px.map(p => Math.ceil(p[0] + W / 2))));
    const minSY = Math.max(0, Math.min(...px.map(p => Math.floor(p[1] + H / 2))));
    const maxSY = Math.min(H - 1, Math.max(...px.map(p => Math.ceil(p[1] + H / 2))));

    for (let sy = minSY; sy <= maxSY; sy++) {
      for (let sx = minSX; sx <= maxSX; sx++) {
        const px2 = sx - W / 2 + 0.5;
        const py2 = sy - H / 2 + 0.5;
        let inside = true;
        for (let i = 0; i < 4; i++) {
          const j = (i + 1) % 4;
          const ex = px[j][0] - px[i][0], ey = px[j][1] - px[i][1];
          const fx = px2 - px[i][0], fy = py2 - px[i][1];
          if (ex * fy - ey * fx > 0) { inside = false; break; }
        }
        if (inside && avgZ < zbuf[sy][sx]) {
          zbuf[sy][sx] = avgZ;
          buf[sy][sx] = { ch: '#', color: '#222' };
        }
      }
    }
  }

  const s = 0.9;
  const inset = 0.06;

  function drawFace(face: FaceName, base: Vec3, right: Vec3, up: Vec3) {
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        const color = cube[face][r * 3 + c];
        const u0 = (c / 3) * 2 * s - s, u1 = ((c + 1) / 3) * 2 * s - s;
        const v0 = (r / 3) * 2 * s - s, v1 = ((r + 1) / 3) * 2 * s - s;
        const d = inset * 2 * s / 3;
        const ui0 = u0 + d, ui1 = u1 - d, vi0 = v0 + d, vi1 = v1 - d;

        function pt(u: number, v: number): Vec3 {
          return [
            base[0] + right[0] * u + up[0] * v,
            base[1] + right[1] * u + up[1] * v,
            base[2] + right[2] * u + up[2] * v,
          ];
        }

        // Draw border cell first, then colored sticker on top
        drawQuadBorder([pt(u0, v0), pt(u1, v0), pt(u1, v1), pt(u0, v1)]);
        drawQuad([pt(ui0, vi0), pt(ui1, vi0), pt(ui1, vi1), pt(ui0, vi1)], color);
      }
    }
  }

  const faceDefs: [FaceName, Vec3, Vec3, Vec3][] = [
    ['F', [0, 0, 1], [1, 0, 0], [0, -1, 0]],
    ['B', [0, 0, -1], [-1, 0, 0], [0, -1, 0]],
    ['U', [0, 1, 0], [1, 0, 0], [0, 0, 1]],
    ['D', [0, -1, 0], [1, 0, 0], [0, 0, -1]],
    ['L', [-1, 0, 0], [0, 0, 1], [0, -1, 0]],
    ['R', [1, 0, 0], [0, 0, -1], [0, -1, 0]],
  ];

  const sorted = faceDefs
    .map(([face, base, right, up]) => ({ face, base, right, up, z: project(...base)[2] }))
    .sort((a, b) => b.z - a.z);

  for (const { face, base, right, up } of sorted) {
    drawFace(face, base, right, up);
  }

  return buf;
}
