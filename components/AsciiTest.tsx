"use client";

import { useEffect, useRef, useState } from "react";

const CHAR_ASPECT = 1.8;

type ColoredChar = { char: string; color: string };

const COLORS: { name: string; char: string; rgb: [number, number, number]; css: string }[] = [
  { name: "red",    char: "R", rgb: [255, 0,   0  ], css: "red"    },
  { name: "green",  char: "G", rgb: [0,   255, 0  ], css: "lime"   },
  { name: "blue",   char: "B", rgb: [0,   0,   255], css: "blue"   },
  { name: "white",  char: "W", rgb: [255, 255, 255], css: "white"  },
  { name: "yellow", char: "Y", rgb: [255, 255, 0  ], css: "yellow" },
  { name: "orange", char: "O", rgb: [255, 165, 0  ], css: "orange" },
  { name: "black",  char: "K", rgb: [0,   0,   0  ], css: "#555"   },
];

function colorDistance(r: number, g: number, b: number, target: [number, number, number]): number {
  return Math.sqrt(
    (r - target[0]) ** 2 +
    (g - target[1]) ** 2 +
    (b - target[2]) ** 2
  );
}

function imageToColorChars(imageElement: HTMLImageElement, width: number = 160): ColoredChar[][] {
  const canvas = document.createElement("canvas");
  const aspect = imageElement.naturalHeight / imageElement.naturalWidth;
  const height = Math.floor((width * aspect) / CHAR_ASPECT);

  if (!width || !height || isNaN(height)) return [];

  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return [];

  ctx.drawImage(imageElement, 0, 0, width, height);
  const { data } = ctx.getImageData(0, 0, width, height);

  const rows: ColoredChar[][] = [];
  for (let y = 0; y < height; y++) {
    const row: ColoredChar[] = [];
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const r = data[i], g = data[i + 1], b = data[i + 2];

      let closest = COLORS[0];
      let minDist = Infinity;
      for (const color of COLORS) {
        const dist = colorDistance(r, g, b, color.rgb);
        if (dist < minDist) {
          minDist = dist;
          closest = color;
        }
      }

      row.push({ char: closest.char, color: closest.css });
    }
    rows.push(row);
  }
  return rows;
}

export default function AsciiArt() {
  const imgRef = useRef<HTMLImageElement>(null);
  const [rows, setRows] = useState<ColoredChar[][]>([]);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    const handleLoad = () => {
      setRows(imageToColorChars(img, 200));
    };

    if (img.complete) {
      handleLoad();
    } else {
      img.addEventListener("load", handleLoad);
      return () => img.removeEventListener("load", handleLoad);
    }
  }, []);

  return (
    <div>
      <img ref={imgRef} src="/rubiks2.png" alt="source" style={{ display: "none" }} />
      <pre style={{ fontFamily: "monospace", fontSize: "8px", lineHeight: "1"}}>
        {rows.map((row, y) => (
          <span key={y} style={{ display: "block" }}>
            {row.map((cell, x) => (
              <span key={x} style={{ color: cell.color }}>{cell.char}</span>
            ))}
          </span>
        ))}
      </pre>
    </div>
  );
}