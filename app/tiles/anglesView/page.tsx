"use client";
// Idea: Start with stripes (continuous blocks), swap = invert as well
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link"
const CARD_COUNT = 169
export default function Page() {
    
  const [matrix, setMatrix] = useState<boolean[]>(
                () => Array(CARD_COUNT).fill(false));

  const toggle = (index : number) => {
    setMatrix(prev => {
        const next = [...prev];
        next[index] = !prev[index];
        return next;
    });
    }
    const imageInit = (index : number, value: boolean) => {
      if (index % 2 == 0) {
        if (value) return "/tileRightNormal.svg"
        return "/tileRightInverted.svg"
      }
      if (value) return "/tileLeftInverted.svg"
      return "/tileLeftNormal.svg"
    } 

    return (
        <main className="min-h-screen w-full flex flex-col bg-blue-200">
          <div className="w-full">
            <Link href="/tiles">
              <p className=" inline-block text-black text-xl sm:text-3xl py-4 hover:font-bold hover:underline">Back</p>
            </Link>
          </div>
          <div className="flex justify-center">
            <div className="grid grid-cols-13 place-items-center w-2xl justify-center touch-pan-y">
                {matrix.map((value, index) => (
                  <button
                    key={index}
                    onMouseEnter={() => toggle(index)}
                    onTouchStart={() => toggle(index)}

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
        </main>)
}
    
    
/*
<main className="min-h-screen w-full flex flex-col bg-blue-200">

  <div className="w-full px-4">
    <Link href="/tiles">
      <p className="inline-block text-black text-xl sm:text-3xl py-4 hover:font-bold hover:underline">
        Back
      </p>
    </Link>
  </div>


  <div className="flex justify-center">
    <div className="grid grid-cols-13 place-items-center w-fit">
      {matrix.map((value, index) => (
        <button
          key={index}
          onPointerEnter={() => switchEnter(index)}
        >
          <Image
            src={imageInit(index, value)}
            alt="Truchet tile"
            height={100}
            width={100}
          />
        </button>
      ))}
    </div>
  </div>
</main>

*/