"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const FACE_COUNT = 1479;

export default function Home() {
  const [matrix, setMatrix] = useState<boolean[]>(
    () => Array(FACE_COUNT).fill(false)
  );
  const [scroll, setScroll] = useState(0)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMatrix(prev => prev.map(() => false));
      }
    };

    

    window.addEventListener("keydown", down);

    return () => {
      window.removeEventListener("keydown", down);
    };
  }, []);

  useEffect(() => {
    const scroll = () => setScroll(window.scrollY)
    window.addEventListener("scroll", scroll)
  }, [])
 

  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center mb-200 ">
      <p>{scroll}</p>
    </div>
  );
}
