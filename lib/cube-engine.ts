// ── Types ────────────────────────────────────────────────────────────────────

export type FaceName = 'U' | 'D' | 'F' | 'B' | 'L' | 'R';
export type ColorKey = 'W' | 'Y' | 'R' | 'O' | 'G' | 'B';
export type CubeState = Record<FaceName, ColorKey[]>;

export const MOVE_KEYS = ['U', "U'", 'D', "D'", 'L', "L'", 'R', "R'", 'F', "F'", 'B', "B'"] as const;
export type MoveKey = typeof MOVE_KEYS[number];

// ── Constants ────────────────────────────────────────────────────────────────

export const COLOR: Record<ColorKey, string> = {
  W: '#e8e8e8', Y: '#f5d020', R: '#e8302d',
  O: '#ff7300', G: '#2ecc40', B: '#3d8ef5',
};

export const SCRAMBLE_POOL: MoveKey[] = ['U', "U'", 'D', "D'", 'L', "L'", 'R', "R'", 'F', "F'", 'B', "B'"];

// ── Cube logic ───────────────────────────────────────────────────────────────

export function initCube(): CubeState {
  return {
    U: Array(9).fill('W') as ColorKey[],
    D: Array(9).fill('Y') as ColorKey[],
    F: Array(9).fill('R') as ColorKey[],
    B: Array(9).fill('O') as ColorKey[],
    L: Array(9).fill('G') as ColorKey[],
    R: Array(9).fill('B') as ColorKey[],
  };
}

export function rotateCW(f: ColorKey[]): ColorKey[] {
  return [f[6], f[3], f[0], f[7], f[4], f[1], f[8], f[5], f[2]];
}

export function applyMove(cube: CubeState, mv: MoveKey): CubeState {
  const c: CubeState = {
    U: [...cube.U], D: [...cube.D], F: [...cube.F],
    B: [...cube.B], L: [...cube.L], R: [...cube.R],
  };

  const base = mv.replace("'", '') as FaceName;
  const ccw = mv.includes("'");

  const doOnce = (s: CubeState) => {
    switch (base) {
      case 'U': {
        s.U = rotateCW(s.U);
        const t = [s.F[0], s.F[1], s.F[2]];
        [s.F[0], s.F[1], s.F[2]] = [s.R[0], s.R[1], s.R[2]];
        [s.R[0], s.R[1], s.R[2]] = [s.B[0], s.B[1], s.B[2]];
        [s.B[0], s.B[1], s.B[2]] = [s.L[0], s.L[1], s.L[2]];
        [s.L[0], s.L[1], s.L[2]] = t;
        break;
      }
      case 'D': {
        s.D = rotateCW(s.D);
        const t = [s.F[6], s.F[7], s.F[8]];
        [s.F[6], s.F[7], s.F[8]] = [s.L[6], s.L[7], s.L[8]];
        [s.L[6], s.L[7], s.L[8]] = [s.B[6], s.B[7], s.B[8]];
        [s.B[6], s.B[7], s.B[8]] = [s.R[6], s.R[7], s.R[8]];
        [s.R[6], s.R[7], s.R[8]] = t;
        break;
      }
      case 'L': {
        s.L = rotateCW(s.L);
        const t = [s.U[0], s.U[3], s.U[6]];
        [s.U[0], s.U[3], s.U[6]] = [s.B[8], s.B[5], s.B[2]];
        [s.B[8], s.B[5], s.B[2]] = [s.D[0], s.D[3], s.D[6]];
        [s.D[0], s.D[3], s.D[6]] = [s.F[0], s.F[3], s.F[6]];
        [s.F[0], s.F[3], s.F[6]] = t;
        break;
      }
      case 'R': {
        s.R = rotateCW(s.R);
        const t = [s.U[2], s.U[5], s.U[8]];
        [s.U[2], s.U[5], s.U[8]] = [s.F[2], s.F[5], s.F[8]];
        [s.F[2], s.F[5], s.F[8]] = [s.D[2], s.D[5], s.D[8]];
        [s.D[2], s.D[5], s.D[8]] = [s.B[6], s.B[3], s.B[0]];
        [s.B[6], s.B[3], s.B[0]] = t;
        break;
      }
      case 'F': {
        s.F = rotateCW(s.F);
        const t = [s.U[6], s.U[7], s.U[8]];
        [s.U[6], s.U[7], s.U[8]] = [s.L[8], s.L[5], s.L[2]];
        [s.L[8], s.L[5], s.L[2]] = [s.D[2], s.D[1], s.D[0]];
        [s.D[2], s.D[1], s.D[0]] = [s.R[0], s.R[3], s.R[6]];
        [s.R[0], s.R[3], s.R[6]] = t;
        break;
      }
      case 'B': {
        s.B = rotateCW(s.B);
        const t = [s.U[0], s.U[1], s.U[2]];
        [s.U[0], s.U[1], s.U[2]] = [s.R[2], s.R[5], s.R[8]];
        [s.R[2], s.R[5], s.R[8]] = [s.D[8], s.D[7], s.D[6]];
        [s.D[8], s.D[7], s.D[6]] = [s.L[6], s.L[3], s.L[0]];
        [s.L[6], s.L[3], s.L[0]] = t;
        break;
      }
    }
  };

  if (ccw) { doOnce(c); doOnce(c); doOnce(c); } else { doOnce(c); }
  return c;
}
