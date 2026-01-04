"use client";
// Idea: Start with stripes (continuous blocks), swap = invert as well
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link"
import Bold from "./Bold"
import Lines from "./lines"
import Angles from "./Angles"

export default function Page() {
    

    return (
        <main className="min-h-screen w-full flex flex-row items-center bg-blue-100">
          <Link
          href="/tiles/linesView"
          >
          <button 
            className="group px-10 cursor-pointer"
          >
            <Lines/>
          </button>
          </Link>
          <Link
          href="/tiles/boldView"
          >
          <button
            className="group px-10 cursor-pointer"
          >
            <Bold/>
          </button>
          </Link>
          <Link
          href="/tiles/anglesView"
          >
          <button
            className="group px-10 cursor-pointer"
          >
            <Angles/>
          </button> 
          </Link>
        </main>
      )
}
    
    
