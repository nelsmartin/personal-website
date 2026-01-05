"use client";
// Idea: Start with stripes (continuous blocks), swap = invert as well
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Bold from "./Bold";
import Lines from "./Lines";
import Angles from "./Angles";
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Truchet Tiles',
  description: 'Interactive tile patterns',
  openGraph: {
    title: 'Truchet Tiles',
    description: 'Interactive tile patterns',
    url: 'https://nelsmartin.com/tiles',
    images: [
      {
        url: 'https://nelsmartin.com/tiles-preview.jpeg',
        width: 882,
        height: 882,
        alt: 'Tiles preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['https://yoursite.com/tiles-preview.jpg'],
  },
}
export default function Page() {
  return (
    <main className="min-h-screen w-full flex flex-col items-center space-y-10 bg-blue-100">
      <h1 className="font-bold text-6xl mt-10">Select your pattern:</h1>
      <div className="flex flex-row w-full, items-full">
        <Link href="/tiles/linesView">
          <button className="group px-5 cursor-pointer">
            <Lines />
          </button>
        </Link>
        <Link href="/tiles/boldView">
          <button className="group px-5 cursor-pointer">
            <Bold />
          </button>
        </Link>
        <Link href="/tiles/anglesView">
          <button className="group px-5 cursor-pointer">
            <Angles />
          </button>
        </Link>
      </div>
      <p className=" text-xl max-w-prose mx-5">
        These are Truchet Tiles: squares with patterns that are not rotationally
        symmetrical. They were first described by Sébastian Truchet in 1704. The
        patterns you see here are based on those invented by Cyril Stanley Smith
        in 1987. Click on one of the patterns to interact with the tiles!
      </p>
    </main>
  );
}
