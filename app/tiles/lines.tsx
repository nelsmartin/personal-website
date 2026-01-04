"use client";
import Image from "next/image";

const CARD_COUNT = 169
export default function Lines() {
    
  const  matrix =
    [
        false, false, true, false, false,
        true, false, false, true, false, 
        false, false, false, true, false, 
        true, true, true, true, false, 
        true, false, true, true, false, 
    ]
  

    const imageInit = (value: boolean) => {
      if (value) return "./tileRight.svg"
      return "./tileLeft.svg"
    } 

    return (
            <div className="flex flex-col items-center space-y-5">
            <div className="grid grid-cols-5 place-items-center group-hover:shadow-2xl">
                {matrix.map((value, index) => (
                  
                    <Image
                    key={index}
                    src={imageInit(value)}
                    alt="Truchet tile"
                    height={100}
                    width={100}
                    />
                ))}
            </div>
            <p className="text-4xl group-hover:font-bold group-hover:underline text-black">Lines</p>
        </div>
        )
}
    
    
