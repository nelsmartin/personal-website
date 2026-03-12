"use client";

import { useState, useEffect } from "react";
import Link from "next/link";


export default function Home() {
  




  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-amber-50">
      <p className="w-1/2 text-7xl font-medium text-left mt-20">
        Nels Martin
      </p>
      <p className="w-1/2 text-2xl font-medium text-left mt-4">
        [<a href="https://www.linkedin.com/in/nelsmartin/" target="_blank">LinkedIn</a>]
        [<a href="https://github.com/nelsmartin" target="_blank">GitHub</a>]
        [<a href="https://substack.com/@nels130" target="_blank">Blog</a>]
        [<a href="/resume" target="_blank">Resume</a>]
      </p>
      <p className="w-1/2 text-left text-xl font-medium mt-4">
        Hello! My name is Nels. I'm a senior at the University of Washington studying Electrical and 
        Computer Engineering. I'm interested in formal methods and machine learning, especially
        in the context of theorem proving.
      </p>
      <p className="w-1/2 text-left text-3xl font-medium mt-12">
        Projects
      </p>
      
      <p className="w-1/2 text-left text-2xl font-medium mt-4">
        [<a href="https://autogramgenerator.com/" target="_blank" className="font-bold">AutogramGenerator.com</a>] ( ← try it!)
      </p>
      <p className="w-1/2 text-left text-xl font-medium">
        The first website that finds autogramic pangrams: sentences that describe their own letter counts.
        Front end: React/TypeScript/Next.js/Vercel. Back end: Rosette/Docker/Google Cloud Run.
      </p>
       <p className="w-1/2 text-left text-2xl font-medium mt-8">
        [<a href="https://github.com/therapyKG/507-project/tree/main" target="_blank" className="font-bold">Correctness Checking and Memory Planning for ML Workloads</a>]
      </p>
      <p className="w-1/2 text-left text-xl font-medium">
        Final group project for the UW graduate course CSE 507. We designed a domain-specific language (DSL) to express 
        training pipelines and model architectures of ML workloads, and used Racket and Rosette to analyze their 
        parameterizations and implicit dependencies, producing a proof-of-concept model correctness checker 
        and memory planner.
      </p>
       <p className="w-1/2 text-left text-2xl font-medium mt-8">
        [<a href="/tiles" target="_blank" className="font-bold">Truchet Tiles</a>] ( ← try it!)
      </p>
      <p className="w-1/2 text-left text-xl font-medium mb-50">
        Enormously entertaining interactive patterns. Programmed in React/TypeScript.
      </p>
      

      {/* <Link href="/tiles">
        <p className="text-xl underline text-blue-600">
          Project: Truchet Tiles
        </p>
      </Link>
      <Link href="https://www.autogramgenerator.com/">
        <p className="text-xl underline text-blue-600">
          Project: Autogram Generator
        </p>

      </Link> */}
       
    </div>
  );
}
