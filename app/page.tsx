"use client";

import { useState, useEffect } from "react";
import Image from "next/image"
import Link from "next/link"

const FACE_COUNT = 1479;

export default function Home() {
  const [matrix, setMatrix] = useState<boolean[]>(
    () => Array(FACE_COUNT).fill(false)
  );
  const [scroll, setScroll] = useState(0)


  useEffect(() => {
    const scroll = () => setScroll(window.scrollY)
    window.addEventListener("scroll", scroll)
  }, [])

  const getImage = (scrollValue : number) => {
    if (scrollValue < 50) return "/nels1.jpeg"
    if (scrollValue < 100) return "/nels2.jpeg"
    if (scrollValue < 150) return "/nels3.jpeg"
    return "/nels4.jpeg"

  }
 

  return (
    <div className="w-full min-h-screen flex flex-col items-center mb-200 space-y-10">
      <Image
      src={getImage(scroll)}
      width={200}
      height={100}
      alt="Image of Nels"
      className="mt-40"
      />
      <p className="max-w-prose">
        Hello! I'm Nels Martin, a senior at UW studying Electrical and Computer Engineering and an aspiring software engineer. 
        This is my work-in-progress personal website and portfolio. (Scroll down for a surprise!)
      </p>
      <Link href="/tiles">
      <p className="text-xl underline text-blue-600">
        Project: Truchet Tiles
      </p>
      </Link>
      <Link href="https://www.autogramgenerator.com/">
      <p className="text-xl underline text-blue-600">
        Project: Autogram Generator
      </p>
      </Link>
    </div>
  );
}
