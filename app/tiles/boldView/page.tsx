"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const CARD_COUNT_MOBILE = 49; // 7x7
const CARD_COUNT_DESKTOP = 169; // 13x13

export default function Page() {
  const [isMobile, setIsMobile] = useState(false);
  const cardCount = isMobile ? CARD_COUNT_MOBILE : CARD_COUNT_DESKTOP;
  
  const [matrix, setMatrix] = useState<boolean[]>(() =>
    Array(CARD_COUNT_DESKTOP).fill(false)
  );
  const [isPointerDown, setIsPointerDown] = useState(false);
  const toggledTilesRef = useRef<Set<number>>(new Set());
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    setMatrix(Array(cardCount).fill(false));
  }, [cardCount]);

  useEffect(() => {
    const handleGlobalPointerUp = () => {
      setIsPointerDown(false);
      toggledTilesRef.current.clear();
    };

    window.addEventListener("pointerup", handleGlobalPointerUp);
    window.addEventListener("pointercancel", handleGlobalPointerUp);

    return () => {
      window.removeEventListener("pointerup", handleGlobalPointerUp);
      window.removeEventListener("pointercancel", handleGlobalPointerUp);
    };
  }, []);

  const toggle = (index: number) => {
    setMatrix((prev) => {
      const next = [...prev];
      next[index] = !prev[index];
      return next;
    });
  };

  const handlePointerDown = (index: number, e: React.PointerEvent) => {
    e.preventDefault();
    setIsPointerDown(true);
    toggledTilesRef.current.clear();
    toggledTilesRef.current.add(index);
    toggle(index);
  };

  const handlePointerEnter = (index: number, e: React.PointerEvent) => {
    // Desktop: toggle on hover (mouse movement without button press)
    if (e.pointerType === "mouse") {
      toggle(index);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPointerDown) return;
    
    e.preventDefault();
    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    
    if (element) {
      const button = element.closest('button');
      if (button) {
        const index = parseInt(button.getAttribute('data-index') || '-1');
        if (index >= 0 && !toggledTilesRef.current.has(index)) {
          toggledTilesRef.current.add(index);
          toggle(index);
        }
      }
    }
  };

  const imageInit = (index : number, value: boolean) => {
      if (index % 2 == 0) {
        if (value) return "/tileLeftNormal.svg"
        return "/tileRightInverted.svg"
      }
      if (value) return "/tileLeftInverted.svg"
      return "/tileRightNormal.svg"
    } 

  return (
    <main className="min-h-screen w-full flex flex-col bg-blue-200">
      <div className="w-full">
        <Link href="/tiles">
          <p className="inline-block text-black text-xl sm:text-4xl py-4 px-4 hover:font-bold hover:underline">
            Back
          </p>
        </Link>
      </div>
      <p className="sm:text-xl px-4">
        Desktop: mouse over the tiles.
      </p>
      <p className="sm:text-xl px-4">
        Mobile: tap and drag over the tiles. 

      </p>
      <div className="flex justify-center">
        <div 
          ref={gridRef}
          className="grid grid-cols-7 sm:grid-cols-13 place-items-center w-2xl justify-center touch-none"
          onTouchMove={handleTouchMove}
        >
          {matrix.map((value, index) => (
            <button
              key={index}
              data-index={index}
              onPointerDown={(e) => handlePointerDown(index, e)}
              onPointerEnter={(e) => handlePointerEnter(index, e)}
            >
              <Image
                src={imageInit(index, value)}
                alt="Truchet tile"
                height={100}
                width={100}
                draggable={false}
              />
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
    
    
